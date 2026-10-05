import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2, CheckCircle2, MapPin, AlertCircle, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { fetchReverseGeocode } from "@/lib/reverseGeocode";
import { api } from "@/lib/api";

export const openFreeQuoteModal = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-free-quote-modal"));
  }
};

type LocationStatus = "idle" | "detecting" | "fetching_address" | "success" | "denied" | "error";

interface GpsLocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  googleMapsUrl: string;
}

export const FreeQuoteModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [locationMessage, setLocationMessage] = useState("");
  const [gpsLocation, setGpsLocation] = useState<GpsLocationData | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-free-quote-modal", handleOpen);
    return () => window.removeEventListener("open-free-quote-modal", handleOpen);
  }, []);

  // Lock background page scroll when quote modal is open and restore when closed
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const onClose = () => setIsOpen(false);
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
    monthlyBill: "",
    unitsConsumption: "",
    electricityRate: "",
    solarType: "On-Grid",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      toast.error("Please fill in all required fields marked with * (Full Name, Mobile, Address)");
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
      monthlyBillAmount: parseFloat(formData.monthlyBill) || undefined,
      electricityRate: parseFloat(formData.electricityRate) || 8.0,
      solarType: formData.solarType || "On-Grid",
      contactTime: "Any Time",
      message: formData.message?.trim() || undefined,
    };

    try {
      const res = await api.post<any>("/api/v1/quotations", payload);
      setQuoteResponse(res);
      setSubmitted(true);
      toast.success("Quote request received successfully!", {
        description: `Reference Code: ${res?.quoteNumber || "SSR-2026"}`,
      });
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
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
          monthlyBill: "",
          unitsConsumption: "",
          electricityRate: "",
          solarType: "On-Grid",
          message: "",
        });
        setLocationStatus("idle");
        setGpsLocation(null);
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error("Quotation API error:", err);
      const errMsg = err.message || "Failed to submit quote request. Please try again.";
      setApiError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          onWheel={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 overflow-hidden [overscroll-behavior:contain]"
        >
          {/* Dark Transparent Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[99998]"
            aria-hidden
          />

          {/* Centered Modal Card Container - Flex Column Layout with Pinned Footer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-[99999] w-full max-w-[560px] overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 text-white p-5 sm:p-6 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_25px_rgba(34,197,94,0.25)] max-h-[88vh] flex flex-col text-left select-none [overscroll-behavior:contain]"
          >
            {/* Header Area (Fixed Top) */}
            <div className="flex-shrink-0 flex items-start justify-between border-b border-slate-800 pb-3 pr-8">
              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  <Sparkles className="h-3 w-3" /> Custom Estimate
                </span>
                <h3 className="text-xl font-extrabold tracking-tight text-white leading-snug">
                  Request a Custom Solar Estimate
                </h3>
                <p className="text-xs text-slate-300 leading-tight">
                  Tell us a few details and our solar expert will prepare a personalized estimate for you.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition-all hover:bg-slate-700 hover:text-white border border-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body / Scrollable Form + Pinned Footer */}
            {submitted ? (
              <div className="py-10 text-center space-y-3 flex-1 flex flex-col justify-center items-center px-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Quote Request Received!</h4>
                {quoteResponse?.quoteNumber && (
                  <div className="inline-block rounded-lg border border-amber-500/40 bg-amber-500/10 px-3.5 py-1.5 text-xs font-mono font-bold text-amber-400">
                    Quote Reference: {quoteResponse.quoteNumber}
                  </div>
                )}
                {quoteResponse?.calculation && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300 space-y-1">
                    <p className="font-semibold text-emerald-400">
                      Recommended System: {quoteResponse.calculation.recommendedPlantSizeKw} kW
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {quoteResponse.calculation.panelSpecs?.requiredPanels} Panels × 530W · {quoteResponse.calculation.panelSpecs?.requiredRoofAreaSqFt} sq. ft. Roof
                    </p>
                  </div>
                )}
                <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                  Thank you! Your quote request has been saved. Our solar engineers will review your requirement and call you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 pt-3">
                {/* Scrollable Form Body */}
                <div
                  onWheel={(e) => e.stopPropagation()}
                  className="flex-1 overflow-y-auto px-1 space-y-3 scrollbar-thin [overscroll-behavior:contain]"
                >
                  {/* Full Name & Mobile */}
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="modalFullName" className="text-[11px] font-bold text-slate-200">
                        Full Name *
                      </Label>
                      <Input
                        id="modalFullName"
                        required
                        placeholder="e.g. A*** K****"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="h-8.5 text-xs rounded-lg bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <Label htmlFor="modalMobile" className="text-[11px] font-bold text-slate-200">
                        Mobile Number *
                      </Label>
                      <Input
                        id="modalMobile"
                        type="tel"
                        required
                        placeholder="e.g. +91 XXXXX XXXXX"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        className="h-8.5 text-xs rounded-lg bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-0.5">
                    <Label htmlFor="modalEmail" className="text-[11px] font-bold text-slate-200">
                      Email Address
                    </Label>
                    <Input
                      id="modalEmail"
                      type="email"
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-8.5 text-xs rounded-lg bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>

                  {/* Installation Location Section */}
                  <div className="space-y-2 pt-1 border-t border-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <Label className="text-[11px] font-bold text-slate-200">
                        Installation Address *
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleDetectLocation}
                        disabled={locationStatus === "detecting" || locationStatus === "fetching_address"}
                        className="rounded-full border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[10px] h-7.5 px-3 shadow-sm w-full sm:w-auto flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        {locationStatus === "detecting" || locationStatus === "fetching_address" ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin text-emerald-400" />
                            {locationStatus === "fetching_address" ? "Fetching Address..." : "Detecting Location..."}
                          </>
                        ) : (
                          <>📍 Use My Current Location</>
                        )}
                      </Button>
                    </div>

                    {/* Status Area */}
                    <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-2.5 text-[11px] text-slate-300">
                      {locationStatus === "idle" && (
                        <p className="font-medium text-[10px] text-slate-400 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <span>Ready to detect your current location.</span>
                        </p>
                      )}

                      {locationStatus === "detecting" && (
                        <p className="font-medium text-[10px] text-emerald-400 flex items-center gap-1.5">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400 shrink-0" />
                          <span>📍 Detecting your current location...</span>
                        </p>
                      )}

                      {locationStatus === "fetching_address" && (
                        <p className="font-medium text-[10px] text-amber-400 flex items-center gap-1.5">
                          <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-400 shrink-0" />
                          <span>🔄 Fetching your address...</span>
                        </p>
                      )}

                      {locationStatus === "success" && gpsLocation && (
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <span className="font-bold text-[10px] text-emerald-400 flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                              ✓ Location Detected
                            </span>
                            <span className="text-[9px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                              Accuracy: {gpsLocation.accuracy} meters
                            </span>
                          </div>

                          <p className="text-[9px] text-slate-400 font-mono">
                            GPS: {gpsLocation.latitude.toFixed(6)}, {gpsLocation.longitude.toFixed(6)} ({gpsLocation.timestamp})
                          </p>

                          <div className="pt-1 border-t border-slate-800">
                            <a
                              href={gpsLocation.googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:underline cursor-pointer"
                            >
                              📍 View Installation Location on Google Maps <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      )}

                      {(locationStatus === "error" || locationStatus === "denied") && (
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <p className="font-medium text-[10px] text-rose-400 flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                            <span>{locationMessage}</span>
                          </p>
                          <button
                            type="button"
                            onClick={handleDetectLocation}
                            className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[9px] font-bold border border-rose-500/20 transition-all cursor-pointer"
                          >
                            Try Again
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Address Fields */}
                    <div className="space-y-1.5">
                      <div className="space-y-0.5">
                        <Label htmlFor="modalAddress" className="text-[10px] font-bold text-slate-300">
                          Complete Address *
                        </Label>
                        <Input
                          id="modalAddress"
                          required
                          placeholder="e.g. House No. XX, Locality, City, State, PIN"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="h-8 text-xs rounded-lg bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-0.5">
                          <Label htmlFor="modalHouseNumber" className="text-[10px] font-bold text-slate-300">
                            House / Plot No.
                          </Label>
                          <Input
                            id="modalHouseNumber"
                            placeholder="e.g. XX, Block A"
                            value={formData.houseNumber}
                            onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                            className="h-7.5 text-[11px] rounded-lg bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 px-2"
                          />
                        </div>

                        <div className="space-y-0.5">
                          <Label htmlFor="modalArea" className="text-[10px] font-bold text-slate-300">
                            Area / Block / Village
                          </Label>
                          <Input
                            id="modalArea"
                            placeholder="e.g. Area Name, Sector XX"
                            value={formData.area}
                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                            className="h-7.5 text-[11px] rounded-lg bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 px-2"
                          />
                        </div>

                        <div className="space-y-0.5">
                          <Label htmlFor="modalCity" className="text-[10px] font-bold text-slate-300">
                            City
                          </Label>
                          <Input
                            id="modalCity"
                            placeholder="e.g. Greater Noida"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="h-7.5 text-[11px] rounded-lg bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 px-2"
                          />
                        </div>

                        <div className="space-y-0.5">
                          <Label htmlFor="modalDistrict" className="text-[10px] font-bold text-slate-300">
                            District
                          </Label>
                          <Input
                            id="modalDistrict"
                            placeholder="e.g. Gautam Buddha Nagar"
                            value={formData.district}
                            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                            className="h-7.5 text-[11px] rounded-lg bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 px-2"
                          />
                        </div>

                        <div className="space-y-0.5">
                          <Label htmlFor="modalState" className="text-[10px] font-bold text-slate-300">
                            State
                          </Label>
                          <Input
                            id="modalState"
                            placeholder="e.g. Uttar Pradesh"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className="h-7.5 text-[11px] rounded-lg bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 px-2"
                          />
                        </div>

                        <div className="space-y-0.5">
                          <Label htmlFor="modalPin" className="text-[10px] font-bold text-slate-300">
                            PIN Code
                          </Label>
                          <Input
                            id="modalPin"
                            placeholder="e.g. XXXXXX"
                            value={formData.pin}
                            onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                            className="h-7.5 text-[11px] rounded-lg bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 px-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Bill & Units & Tariff Rate */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="space-y-0.5">
                      <Label htmlFor="modalMonthlyBill" className="text-[10px] font-bold text-slate-200">
                        Monthly Bill (₹)
                      </Label>
                      <Input
                        id="modalMonthlyBill"
                        type="number"
                        min="0"
                        placeholder="6000"
                        value={formData.monthlyBill}
                        onChange={(e) => setFormData({ ...formData, monthlyBill: e.target.value })}
                        className="h-8 text-xs rounded-lg bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 px-2"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <Label htmlFor="modalUnits" className="text-[10px] font-bold text-slate-200">
                        Monthly Units (kWh)
                      </Label>
                      <Input
                        id="modalUnits"
                        type="number"
                        min="0"
                        placeholder="500"
                        value={formData.unitsConsumption}
                        onChange={(e) => setFormData({ ...formData, unitsConsumption: e.target.value })}
                        className="h-8 text-xs rounded-lg bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 px-2"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <Label htmlFor="modalRate" className="text-[10px] font-bold text-slate-200">
                        Monthly Rate (₹/unit)
                      </Label>
                      <Input
                        id="modalRate"
                        type="number"
                        step="0.1"
                        placeholder="8.5"
                        value={formData.electricityRate}
                        onChange={(e) => setFormData({ ...formData, electricityRate: e.target.value })}
                        className="h-8 text-xs rounded-lg bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 px-2"
                      />
                    </div>
                  </div>

                  {/* Message / Requirement */}
                  <div className="space-y-0.5">
                    <Label htmlFor="modalMessage" className="text-[11px] font-bold text-slate-200">
                      Message / Requirement
                    </Label>
                    <Textarea
                      id="modalMessage"
                      rows={2.5}
                      placeholder="Tell us about your rooftop area or system requirement..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="rounded-lg text-xs bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 resize-none py-1.5"
                    />
                  </div>
                </div>

                {/* Pinned Modal Footer with Primary Submit Button */}
                <div className="flex-shrink-0 pt-3 mt-2 border-t border-slate-800/80 bg-slate-900">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-gold-shine w-full h-11 rounded-xl text-xs uppercase tracking-wider font-extrabold disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-slate-950" /> Requesting Quote...
                      </span>
                    ) : (
                      "Request Free Quote"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
