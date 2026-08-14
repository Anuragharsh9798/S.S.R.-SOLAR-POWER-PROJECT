import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2, CheckCircle2, MapPin, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const openFreeQuoteModal = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-free-quote-modal"));
  }
};

type LocationStatus = "idle" | "detecting" | "success" | "denied" | "error";

export const FreeQuoteModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [locationVerified, setLocationVerified] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");

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
    monthlyBill: "",
    unitsConsumption: "",
    electricityRate: "",
    solarType: "On-Grid",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
          setLocationMessage("Location information is unavailable. Please click '📍 Use Current Location' again.");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!locationVerified || !formData.address.trim()) {
      toast.error("Please click '📍 Use Current Location' to allow location access and verify your location to continue.");
      return;
    }

    if (!formData.fullName || !formData.mobile) {
      toast.error("Please fill in all required fields marked with * (Full Name, Mobile, Address)");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Thank you! Your quote request has been received.", {
        description: "Our solar expert will contact you shortly.",
      });

      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          fullName: "",
          mobile: "",
          email: "",
          address: "",
          monthlyBill: "",
          unitsConsumption: "",
          electricityRate: "",
          solarType: "On-Grid",
          message: "",
        });
        setLocationStatus("idle");
        setLocationVerified(false);
        onClose();
      }, 2000);
    }, 800);
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
            className="relative z-[99999] w-full max-w-[540px] overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 text-white p-5 sm:p-6 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_25px_rgba(34,197,94,0.25)] max-h-[88vh] flex flex-col text-left select-none [overscroll-behavior:contain]"
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
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition-all hover:bg-slate-700 hover:text-white border border-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body / Scrollable Form + Pinned Footer */}
            {submitted ? (
              <div className="py-12 text-center space-y-3 flex-1 flex flex-col justify-center items-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Quote Request Received!</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                  Thank you! Your quote request has been received. Our solar expert will contact you shortly.
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
                        placeholder="e.g. Rahul Sharma"
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
                        placeholder="+91 98765 43210"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        className="h-8.5 text-xs rounded-lg bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-0.5">
                    <Label htmlFor="modalEmail" className="text-[11px] font-bold text-slate-200">
                      Email
                    </Label>
                    <Input
                      id="modalEmail"
                      type="email"
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-8.5 text-xs rounded-lg bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>

                  {/* Address * with Mandated Location Verification */}
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <Label htmlFor="modalAddress" className="text-[11px] font-bold text-slate-200">
                        Address *
                      </Label>
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={locationStatus === "detecting"}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          locationVerified
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                            : locationStatus === "denied"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                        }`}
                      >
                        {locationStatus === "detecting" ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin text-emerald-400" />
                            Detecting your location...
                          </>
                        ) : locationVerified ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                            ✓ Location Added
                          </>
                        ) : (
                          <>
                            <MapPin className="h-3 w-3 text-emerald-400" />
                            📍 Use Current Location
                          </>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="modalAddress"
                        required
                        placeholder={
                          locationVerified
                            ? "House No, Locality, City, State, PIN"
                            : "Click '📍 Use Current Location' above to detect address"
                        }
                        value={formData.address}
                        onChange={(e) => {
                          setFormData({ ...formData, address: e.target.value });
                        }}
                        className="h-8.5 text-xs rounded-lg bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 pr-7"
                      />
                      <MapPin className="absolute right-2 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                    </div>

                    {/* Status & Error Messages */}
                    {locationStatus === "denied" && (
                      <p className="text-[10px] font-bold text-rose-400 flex items-center gap-1 mt-0.5">
                        ⚠️ Please allow location access to continue.
                      </p>
                    )}

                    {locationStatus === "error" && locationMessage && (
                      <p className="text-[10px] font-semibold text-rose-400 flex items-center gap-1 mt-0.5">
                        ⚠️ {locationMessage}
                      </p>
                    )}

                    {!locationVerified && locationStatus !== "denied" && locationStatus !== "error" && (
                      <p className="text-[10px] font-medium text-amber-400 flex items-center gap-1 mt-0.5">
                        <Lock className="h-3 w-3" /> Please allow location access using '📍 Use Current Location' to unlock form submission.
                      </p>
                    )}
                  </div>

                  {/* Monthly Bill & Units & Tariff Rate */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="modalMonthlyBill" className="text-[10px] font-bold text-slate-200">
                        Bill (₹)
                      </Label>
                      <Input
                        id="modalMonthlyBill"
                        type="number"
                        min="0"
                        disabled={!locationVerified}
                        placeholder="6000"
                        value={formData.monthlyBill}
                        onChange={(e) => setFormData({ ...formData, monthlyBill: e.target.value })}
                        className="h-8.5 text-xs rounded-lg bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 px-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <Label htmlFor="modalUnits" className="text-[10px] font-bold text-slate-200">
                        Units (kWh)
                      </Label>
                      <Input
                        id="modalUnits"
                        type="number"
                        min="0"
                        disabled={!locationVerified}
                        placeholder="500"
                        value={formData.unitsConsumption}
                        onChange={(e) => setFormData({ ...formData, unitsConsumption: e.target.value })}
                        className="h-8.5 text-xs rounded-lg bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 px-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <Label htmlFor="modalRate" className="text-[10px] font-bold text-slate-200">
                        Rate (₹/unit)
                      </Label>
                      <Input
                        id="modalRate"
                        type="number"
                        step="0.1"
                        disabled={!locationVerified}
                        placeholder="8.5"
                        value={formData.electricityRate}
                        onChange={(e) => setFormData({ ...formData, electricityRate: e.target.value })}
                        className="h-8.5 text-xs rounded-lg bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 px-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      disabled={!locationVerified}
                      placeholder="Tell us about your rooftop area or system requirement..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="rounded-lg text-xs bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 resize-none py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Pinned Modal Footer with Primary Submit Button */}
                <div className="flex-shrink-0 pt-3 mt-2 border-t border-slate-800/80 bg-slate-900">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !locationVerified}
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
