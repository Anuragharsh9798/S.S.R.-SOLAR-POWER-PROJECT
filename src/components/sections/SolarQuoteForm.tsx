import { useState } from "react";
import { Loader2, Send, MapPin, CheckCircle2, AlertCircle, RefreshCw, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MotionSection } from "@/components/motion";
import { fetchReverseGeocode } from "@/lib/reverseGeocode";
import { api } from "@/lib/api";

interface SolarQuoteFormProps {
  defaultSystemType?: "On-Grid" | "Hybrid";
  lockSystemType?: boolean;
  standalone?: boolean;
}

type LocationStatus = "idle" | "detecting" | "fetching_address" | "success" | "denied" | "error";

interface GpsLocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  googleMapsUrl: string;
}

export const SolarQuoteForm = ({
  defaultSystemType,
  lockSystemType,
  standalone = true,
}: SolarQuoteFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quoteResponse, setQuoteResponse] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [locationMessage, setLocationMessage] = useState("");
  const [gpsLocation, setGpsLocation] = useState<GpsLocationData | null>(null);

  const initialSystemType = defaultSystemType || "On-Grid";

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    address: "",
    houseNumber: "",
    area: "",
    city: "",
    district: "",
    state: "",
    pin: "",
    bill: "",
    units: "",
    rate: "",
    systemType: initialSystemType,
    contactTime: "Any Time",
    message: "",
  });

  const handleDetectLocation = () => {
    if (locationStatus === "detecting" || locationStatus === "fetching_address") return;

    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationMessage("Geolocation is not supported by your browser.");
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setLocationStatus("detecting");
    setLocationMessage("📍 Detecting your current location...");
    setGpsLocation(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const roundAccuracy = Math.round(accuracy);
        const timestamp = new Date().toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        });

        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        if (accuracy > 300) {
          setLocationStatus("error");
          setLocationMessage("Your current location accuracy is low. Please enable Precise Location and try again.");
          toast.error("Low GPS accuracy. Please enable Precise Location.");
          return;
        }

        const locData: GpsLocationData = {
          latitude,
          longitude,
          accuracy: roundAccuracy,
          timestamp,
          googleMapsUrl: mapsUrl,
        };

        setGpsLocation(locData);

        setLocationStatus("fetching_address");
        setLocationMessage("🔄 Fetching your address...");

        try {
          const geocodeResult = await fetchReverseGeocode(latitude, longitude);

          if (geocodeResult) {
            setFormData((prev) => ({
              ...prev,
              address: geocodeResult.fullAddress || prev.address,
              houseNumber: geocodeResult.houseNumber || prev.houseNumber,
              area: geocodeResult.area || prev.area,
              city: geocodeResult.city || prev.city,
              district: geocodeResult.district || prev.district,
              state: geocodeResult.state || prev.state,
              pin: geocodeResult.pin || prev.pin,
            }));

            setLocationStatus("success");
            setLocationMessage(`Location detected — accuracy ${roundAccuracy} meters`);
            toast.success(`✓ Address detected (${geocodeResult.source === "google" ? "Google Maps" : "OSM"})!`);
          } else {
            setLocationStatus("success");
            setLocationMessage(`Location detected — accuracy ${roundAccuracy} meters`);
            toast.success(`Location detected — accuracy ${roundAccuracy} meters`);
          }
        } catch (err) {
          console.error("Reverse Geocode Error:", err);
          setLocationStatus("success");
          setLocationMessage(`Location detected — accuracy ${roundAccuracy} meters`);
          toast.success(`Location detected — accuracy ${roundAccuracy} meters`);
        }
      },
      (error) => {
        setGpsLocation(null);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus("denied");
          setLocationMessage("Location access denied. Please allow location permission in browser settings.");
          toast.error("Location permission denied by user.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationStatus("error");
          setLocationMessage("Location information unavailable. Please check device GPS and try again.");
          toast.error("Location information unavailable.");
        } else if (error.code === error.TIMEOUT) {
          setLocationStatus("error");
          setLocationMessage("Location request timed out. Please click 'Try Again'.");
          toast.error("Location request timed out.");
        } else {
          setLocationStatus("error");
          setLocationMessage("Could not detect location. Please click 'Try Again'.");
          toast.error("Could not detect location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.mobile.trim() || !formData.address.trim()) {
      toast.error("Please fill in all required fields marked with * (Full Name, Mobile Number, and Address).");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setApiError(null);

    const payload = {
      fullName: formData.fullName.trim(),
      phone: formData.mobile.trim(),
      email: formData.email?.trim() || undefined,
      address: formData.address.trim(),
      houseNumber: formData.houseNumber?.trim() || undefined,
      area: formData.area?.trim() || undefined,
      city: formData.city?.trim() || "Mau",
      district: formData.district?.trim() || undefined,
      state: formData.state?.trim() || "Uttar Pradesh",
      pincode: formData.pin?.trim() || undefined,
      latitude: gpsLocation?.latitude,
      longitude: gpsLocation?.longitude,
      accuracy: gpsLocation?.accuracy ? `${gpsLocation.accuracy} meters` : undefined,
      googleMapsUrl: gpsLocation?.googleMapsUrl,
      monthlyBillAmount: parseFloat(formData.bill) || undefined,
      electricityRate: parseFloat(formData.rate) || 8.0,
      solarType: formData.systemType || "On-Grid",
      contactTime: formData.contactTime || "Any Time",
      message: formData.message?.trim() || undefined,
    };

    try {
      const res = await api.post<any>("/api/v1/quotations", payload);
      setQuoteResponse(res);
      setSubmitted(true);
      toast.success("Quote request received successfully!", {
        description: `Reference Code: ${res?.quoteNumber || "SSR-2026"}`,
      });
    } catch (err: any) {
      console.error("Quotation Form API error:", err);
      const errMsg = err.message || "Failed to submit quote request. Please try again.";
      setApiError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formCardContent = (
    <div className="group contact-card-glow relative transition-all duration-500 w-full">
      <div className="relative h-full w-full overflow-hidden rounded-3xl p-5 md:p-8 transition-all duration-500 contact-card-gradient-border bg-card shadow-card">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            Request a Custom <span className="text-gradient">Solar Estimate</span>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Fill in your details below and our solar engineers will prepare a transparent proposal.
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <Send className="h-7 w-7" />
            </div>
            <h4 className="text-xl font-bold text-foreground">Quote Request Received!</h4>
            {quoteResponse?.quoteNumber && (
              <div className="inline-block rounded-lg border border-amber-500/40 bg-amber-500/10 px-3.5 py-1.5 text-xs font-mono font-bold text-amber-500">
                Quote Reference Code: {quoteResponse.quoteNumber}
              </div>
            )}
            {quoteResponse?.calculation && (
              <div className="max-w-md mx-auto rounded-2xl border border-border/80 bg-muted/30 p-4 text-xs text-foreground space-y-1">
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Recommended System: {quoteResponse.calculation.recommendedPlantSizeKw} kW
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {quoteResponse.calculation.panelSpecs?.requiredPanels} Panels × 530W · {quoteResponse.calculation.panelSpecs?.requiredRoofAreaSqFt} sq. ft. Roof Area
                </p>
              </div>
            )}
            <p className="max-w-md mx-auto text-xs text-muted-foreground leading-relaxed">
              Thank you! Your quote request has been saved. Our solar expert will contact you shortly.
            </p>
            <div className="pt-2">
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setQuoteResponse(null);
                  setLocationStatus("idle");
                  setGpsLocation(null);
                }}
                variant="outline"
                className="rounded-full px-5 text-xs font-semibold"
              >
                Submit Another Request
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Full Name * */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-medium text-foreground">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  required
                  placeholder="e.g. A*** K****"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              {/* Mobile Number * */}
              <div className="space-y-1.5">
                <Label htmlFor="mobile" className="text-xs font-medium text-foreground">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  required
                  placeholder="e.g. +91 XXXXX XXXXX"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="email" className="text-xs font-medium text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              {/* Installation Location & Address Section */}
              <div className="space-y-2.5 sm:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <Label className="text-xs font-bold text-foreground">
                    Installation Address <span className="text-destructive">*</span>
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDetectLocation}
                    disabled={locationStatus === "detecting" || locationStatus === "fetching_address"}
                    className="btn-premium rounded-full border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs h-9 px-4 shadow-sm w-full sm:w-auto flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {locationStatus === "detecting" || locationStatus === "fetching_address" ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                        {locationStatus === "fetching_address" ? "Fetching Address..." : "Detecting Location..."}
                      </>
                    ) : (
                      <>📍 Use My Current Location</>
                    )}
                  </Button>
                </div>

                {/* Status Area */}
                <div className="rounded-xl border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
                  {locationStatus === "idle" && (
                    <p className="font-medium text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Ready to detect your current location.</span>
                    </p>
                  )}

                  {locationStatus === "detecting" && (
                    <p className="font-medium text-[11px] text-primary flex items-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-primary shrink-0" />
                      <span>📍 Detecting your current location...</span>
                    </p>
                  )}

                  {locationStatus === "fetching_address" && (
                    <p className="font-medium text-[11px] text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-500 shrink-0" />
                      <span>🔄 Fetching your address...</span>
                    </p>
                  )}

                  {locationStatus === "success" && gpsLocation && (
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="font-bold text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          ✓ Location Detected
                        </span>
                        <span className="text-[10px] font-semibold text-muted-foreground bg-background/60 px-2 py-0.5 rounded-full border">
                          Accuracy: {gpsLocation.accuracy} meters
                        </span>
                      </div>

                      <p className="text-[10px] text-muted-foreground font-mono">
                        GPS: {gpsLocation.latitude.toFixed(6)}, {gpsLocation.longitude.toFixed(6)} ({gpsLocation.timestamp})
                      </p>

                      <div className="pt-1.5 border-t border-emerald-500/20">
                        <a
                          href={gpsLocation.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline cursor-pointer"
                        >
                          📍 View Installation Location on Google Maps <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {(locationStatus === "error" || locationStatus === "denied") && (
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium text-[11px] text-rose-500 flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                        <span>{locationMessage}</span>
                      </p>
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        className="px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-[10px] font-bold border border-rose-500/20 transition-all cursor-pointer"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>

                {/* Address Fields */}
                <div className="grid gap-2.5 sm:grid-cols-2 pt-1">
                  <div className="space-y-1 sm:col-span-2">
                    <Label htmlFor="address" className="text-[11px] font-medium text-foreground">
                      Complete Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="address"
                      required
                      placeholder="e.g. House No. XX, Locality, City, State, PIN"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="h-9.5 text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="houseNumber" className="text-[11px] font-medium text-foreground">
                      House / Plot No.
                    </Label>
                    <Input
                      id="houseNumber"
                      placeholder="e.g. XX, Block A"
                      value={formData.houseNumber}
                      onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                      className="h-9 text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="area" className="text-[11px] font-medium text-foreground">
                      Area / Block / Village
                    </Label>
                    <Input
                      id="area"
                      placeholder="e.g. Area Name, Sector XX"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="h-9 text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="city" className="text-[11px] font-medium text-foreground">
                      City
                    </Label>
                    <Input
                      id="city"
                      placeholder="e.g. Greater Noida"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="h-9 text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="district" className="text-[11px] font-medium text-foreground">
                      District
                    </Label>
                    <Input
                      id="district"
                      placeholder="e.g. Gautam Buddha Nagar"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="h-9 text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="state" className="text-[11px] font-medium text-foreground">
                      State
                    </Label>
                    <Input
                      id="state"
                      placeholder="e.g. Uttar Pradesh"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="h-9 text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="pin" className="text-[11px] font-medium text-foreground">
                      PIN Code
                    </Label>
                    <Input
                      id="pin"
                      placeholder="e.g. XXXXXX"
                      value={formData.pin}
                      onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                      className="h-9 text-xs rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Monthly Electricity Bill (₹) */}
              <div className="space-y-1.5">
                <Label htmlFor="bill" className="text-xs font-medium text-foreground">
                  Monthly Bill (₹)
                </Label>
                <Input
                  id="bill"
                  type="number"
                  min={0}
                  placeholder="e.g. 5000"
                  value={formData.bill}
                  onChange={(e) => setFormData({ ...formData, bill: e.target.value })}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              {/* Monthly Electricity Consumption (Units) */}
              <div className="space-y-1.5">
                <Label htmlFor="units" className="text-xs font-medium text-foreground">
                  Monthly Units (kWh)
                </Label>
                <Input
                  id="units"
                  type="number"
                  min={0}
                  placeholder="e.g. 600"
                  value={formData.units}
                  onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              {/* Electricity Rate (₹/unit) */}
              <div className="space-y-1.5">
                <Label htmlFor="rate" className="text-xs font-medium text-foreground">
                  Monthly Rate (₹/unit)
                </Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.1"
                  min={0}
                  placeholder="e.g. 7.50"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              {/* Preferred Contact Time */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="contactTime" className="text-xs font-medium text-foreground">
                  Preferred Contact Time
                </Label>
                <Select
                  value={formData.contactTime}
                  onValueChange={(val) => setFormData({ ...formData, contactTime: val })}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl">
                    <SelectValue placeholder="Select Contact Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any Time">Any Time (9:00 AM – 7:00 PM)</SelectItem>
                    <SelectItem value="Morning">Morning (9:00 AM – 12:00 PM)</SelectItem>
                    <SelectItem value="Afternoon">Afternoon (12:00 PM – 4:00 PM)</SelectItem>
                    <SelectItem value="Evening">Evening (4:00 PM – 7:00 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Message / Requirement */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="message" className="text-xs font-medium text-foreground">
                  Message / Requirement
                </Label>
                <Textarea
                  id="message"
                  rows={3}
                  placeholder="Tell us about your roof area or requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-premium w-full h-11 rounded-full bg-gradient-brand font-bold text-primary-foreground shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-2">
                  REQUEST FREE QUOTE <Send className="h-4 w-4" />
                </span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  if (!standalone) {
    return formCardContent;
  }

  return (
    <MotionSection animation="fadeUp" className="section" id="quote-form">
      <div className="container-wide max-w-3xl">
        <SectionHeading
          eyebrow="Get In Touch"
          title={<>Request a Custom <span className="text-gradient">Solar Estimate</span></>}
          description="Fill in your details and our solar engineers will design a tailored rooftop proposal for your home or business."
        />
        <div className="mt-10">{formCardContent}</div>
      </div>
    </MotionSection>
  );
};
