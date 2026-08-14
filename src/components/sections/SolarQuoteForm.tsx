import { useState } from "react";
import { Loader2, Send, MapPin, CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MotionSection } from "@/components/motion";

interface SolarQuoteFormProps {
  defaultSystemType?: "On-Grid" | "Hybrid";
  lockSystemType?: boolean;
  standalone?: boolean;
}

type LocationStatus = "idle" | "detecting" | "success" | "denied" | "error";

export const SolarQuoteForm = ({
  defaultSystemType,
  lockSystemType,
  standalone = true,
}: SolarQuoteFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [locationVerified, setLocationVerified] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const initialSystemType = defaultSystemType || "On-Grid";
  const shouldLock = lockSystemType !== undefined ? lockSystemType : defaultSystemType !== undefined;

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    address: "",
    bill: "",
    units: "",
    rate: "",
    systemType: initialSystemType,
    contactTime: "Any Time",
    message: "",
  });

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationVerified(false);
      setLocationMessage("Geolocation is not supported by your browser. Location access is required.");
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setLocationStatus("detecting");
    setLocationVerified(false);
    setLocationMessage("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          if (response.ok) {
            const data = await response.json();
            if (data && data.display_name) {
              setFormData((prev) => ({ ...prev, address: data.display_name }));
              setLocationStatus("success");
              setLocationVerified(true);
              setLocationMessage("");
              toast.success("Location detected & address populated!");
            } else {
              const fallback = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
              setFormData((prev) => ({ ...prev, address: fallback }));
              setLocationStatus("success");
              setLocationVerified(true);
              setLocationMessage("");
              toast.success("Location coordinates detected!");
            }
          } else {
            const fallback = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
            setFormData((prev) => ({ ...prev, address: fallback }));
            setLocationStatus("success");
            setLocationVerified(true);
            setLocationMessage("");
            toast.success("Location detected!");
          }
        } catch (err) {
          const fallback = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          setFormData((prev) => ({ ...prev, address: fallback }));
          setLocationStatus("success");
          setLocationVerified(true);
          setLocationMessage("");
          toast.success("Location coordinates detected!");
        }
      },
      (error) => {
        setLocationVerified(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus("denied");
          setLocationMessage("Please allow location access to continue.");
          toast.error("Please allow location access to continue.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationStatus("error");
          setLocationMessage("Location information is unavailable. Please click 'Use Current Location' again.");
          toast.error("Location information is unavailable.");
        } else if (error.code === error.TIMEOUT) {
          setLocationStatus("error");
          setLocationMessage("Location request timed out. Please try again.");
          toast.error("Location request timed out.");
        } else {
          setLocationStatus("error");
          setLocationMessage("Could not fetch location. Please try again.");
          toast.error("Could not fetch location.");
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!locationVerified || !formData.address.trim()) {
      toast.error("Please click 'Use Current Location' to allow location access and verify your location to continue.");
      return;
    }

    if (!formData.fullName.trim() || !formData.mobile.trim()) {
      toast.error("Please fill in all required fields (Full Name, Mobile Number, and Address).");
      return;
    }

    setIsSubmitting(true);

    try {
      // BACKEND API ENDPOINT HOOK:
      // await axios.post('/api/quote-request', formData);
      await new Promise((resolve) => setTimeout(resolve, 900));

      toast.success("Thank you! Your free quote request has been received. Our solar expert will contact you shortly.");
      setSubmitted(true);
    } catch (err) {
      toast.error("Failed to submit request. Please try again.");
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
            Fill in your details below and our engineers will prepare a transparent proposal.
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <Send className="h-7 w-7" />
            </div>
            <h4 className="text-xl font-bold text-foreground">Quote Request Received!</h4>
            <p className="max-w-md mx-auto text-xs text-muted-foreground leading-relaxed">
              Thank you! Your free quote request has been received. Our solar expert will contact you shortly.
            </p>
            <div className="pt-2">
              <Button
                onClick={() => setSubmitted(false)}
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
                  placeholder="e.g. Rahul Sharma"
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
                  placeholder="+91 98765 43210"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="email" className="text-xs font-medium text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="rahul@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              {/* Address * with Mandated Location Verification */}
              <div className="space-y-1.5 sm:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Label htmlFor="address" className="text-xs font-medium text-foreground">
                    Address <span className="text-destructive">*</span>
                  </Label>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={locationStatus === "detecting"}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      locationVerified
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                        : locationStatus === "denied"
                        ? "bg-rose-500/15 text-rose-500 border border-rose-500/30 hover:bg-rose-500/25"
                        : "bg-primary/10 text-primary border border-primary/25 hover:bg-primary/20"
                    }`}
                  >
                    {locationStatus === "detecting" ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                        Detecting your location...
                      </>
                    ) : locationVerified ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        ✓ Location Added
                      </>
                    ) : (
                      <>
                        <MapPin className="h-3.5 w-3.5" />
                        📍 Use Current Location
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="address"
                    required
                    placeholder={
                      locationVerified
                        ? "e.g. House No, Locality, City, State, PIN"
                        : "Click '📍 Use Current Location' above to detect address"
                    }
                    value={formData.address}
                    onChange={(e) => {
                      // Note: Typing or editing address does NOT set locationVerified to true!
                      setFormData({ ...formData, address: e.target.value });
                    }}
                    className="h-10 text-xs rounded-xl pr-10"
                  />
                  <div className="absolute right-3 top-2.5 text-muted-foreground pointer-events-none">
                    <MapPin className="h-4 w-4 text-muted-foreground/60" />
                  </div>
                </div>

                {/* Status & Error Messages */}
                {locationStatus === "denied" && (
                  <p className="text-xs font-bold text-rose-500 flex items-center gap-1 mt-1">
                    ⚠️ Please allow location access to continue.
                  </p>
                )}

                {locationStatus === "error" && locationMessage && (
                  <p className="text-xs font-semibold text-rose-400 flex items-center gap-1 mt-1">
                    ⚠️ {locationMessage}
                  </p>
                )}

                {!locationVerified && locationStatus !== "denied" && locationStatus !== "error" && (
                  <p className="text-[11px] font-medium text-amber-500 dark:text-amber-400 flex items-center gap-1 mt-1">
                    <Lock className="h-3 w-3" /> Please allow location access using '📍 Use Current Location' to unlock form submission.
                  </p>
                )}
              </div>

              {/* Monthly Electricity Bill (₹) - Locked until Location Verified */}
              <div className="space-y-1.5">
                <Label htmlFor="bill" className="text-xs font-medium text-foreground">
                  Monthly Bill (₹)
                </Label>
                <Input
                  id="bill"
                  type="number"
                  min={0}
                  disabled={!locationVerified}
                  placeholder="e.g. 5000"
                  value={formData.bill}
                  onChange={(e) => setFormData({ ...formData, bill: e.target.value })}
                  className="h-10 text-xs rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Monthly Electricity Consumption (Units) - Locked until Location Verified */}
              <div className="space-y-1.5">
                <Label htmlFor="units" className="text-xs font-medium text-foreground">
                  Consumption (Units)
                </Label>
                <Input
                  id="units"
                  type="number"
                  min={0}
                  disabled={!locationVerified}
                  placeholder="e.g. 600"
                  value={formData.units}
                  onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                  className="h-10 text-xs rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Electricity Rate (₹/unit) - Locked until Location Verified */}
              <div className="space-y-1.5">
                <Label htmlFor="rate" className="text-xs font-medium text-foreground">
                  Rate (₹/unit)
                </Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.1"
                  min={0}
                  disabled={!locationVerified}
                  placeholder="e.g. 7.50"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  className="h-10 text-xs rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Preferred Contact Time - Locked until Location Verified */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="contactTime" className="text-xs font-medium text-foreground">
                  Preferred Contact Time
                </Label>
                <Select
                  value={formData.contactTime}
                  disabled={!locationVerified}
                  onValueChange={(val) => setFormData({ ...formData, contactTime: val })}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
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

              {/* Message / Requirement - Locked until Location Verified */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="message" className="text-xs font-medium text-foreground">
                  Message / Requirement
                </Label>
                <Textarea
                  id="message"
                  rows={3}
                  disabled={!locationVerified}
                  placeholder="Tell us about your roof area or requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="text-xs rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || !locationVerified}
                className="btn-premium w-full h-11 rounded-full bg-gradient-brand font-bold text-primary-foreground shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting Request...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    REQUEST FREE QUOTE <Send className="h-4 w-4" />
                  </span>
                )}
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
