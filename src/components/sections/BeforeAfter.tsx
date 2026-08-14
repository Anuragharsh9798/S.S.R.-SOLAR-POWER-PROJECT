import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { MotionSection } from "@/components/motion";
import indianRuralBefore from "@/assets/indian-rural-house-before.png";
import indianRuralAfter from "@/assets/indian-rural-house-after.png";

// Real Photographic Images of Matching Indian Rural House (Before: Empty Rooftop, After: Solar Panels Installed)
const BEFORE_IMAGE = indianRuralBefore;
const AFTER_IMAGE = indianRuralAfter;

export const BeforeAfter = () => {
  const [showAfter, setShowAfter] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Automatic Infinite Loop: Smoothly toggle BEFORE (3.5s) <-> AFTER (3.5s)
  useEffect(() => {
    const timer = setInterval(() => {
      setShowAfter((prev) => !prev);
    }, 3500);

    return () => clearInterval(timer);
  }, [resetKey]);

  const handleToggle = (isAfter: boolean) => {
    setShowAfter(isAfter);
    setResetKey((prev) => prev + 1); // Reset timer restart key
  };

  return (
    <MotionSection animation="zoomIn" className="section bg-gradient-soft overflow-hidden py-20 md:py-28">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Before vs After Comparison"
          title={<>See the transformation <span className="text-gradient">when Solar is Installed</span></>}
          description="Real rural Indian residential rooftop comparison. Watch how installing SSR Solar Power transforms an empty rooftop into a clean energy powerhouse."
        />

        {/* Real Photo Comparison Frame with Infinite Smooth Auto Transition */}
        <div className="relative mt-12 aspect-[16/9] sm:aspect-[21/9] min-h-[380px] md:min-h-[460px] w-full select-none overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl group">
          {/* 1. BEFORE IMAGE LAYER */}
          <motion.img
            src={BEFORE_IMAGE}
            alt="Before: Rural Indian house rooftop without solar"
            initial={false}
            animate={{ opacity: showAfter ? 0 : 1 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full object-cover brightness-95"
          />

          {/* 2. AFTER IMAGE LAYER */}
          <motion.img
            src={AFTER_IMAGE}
            alt="After: Rural Indian rooftop with solar panel installation"
            initial={false}
            animate={{ opacity: showAfter ? 1 : 0 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Dark Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" aria-hidden />

          {/* ================= BEFORE BADGE & METRICS OVERLAY ================= */}
          <AnimatePresence mode="wait">
            {!showAfter && (
              <motion.div
                key="before-overlay"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between pointer-events-none z-20"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-600/95 px-4 py-1.5 text-xs font-extrabold text-white shadow-lg backdrop-blur-md border border-red-400/40">
                    <AlertTriangle className="h-4 w-4" /> BEFORE: Empty Rooftop &amp; High Bills
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-semibold text-slate-300 backdrop-blur-md border border-slate-700">
                    Real Photo (Indian Residence)
                  </span>
                </div>

                {/* Bottom Info Card */}
                <div className="max-w-md rounded-2xl border border-red-500/30 bg-slate-950/85 p-4 text-left backdrop-blur-md space-y-1.5 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-red-400 flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4" /> Heavy DISCOM Bill Reliance
                    </span>
                    <span className="text-xs font-extrabold text-slate-200">₹2,000 / month</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Empty rooftop exposed to heat (~250 units monthly consumption). Paying ₹2,000 monthly (₹24,000/yr) to DISCOM grid with zero return.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ================= AFTER BADGE & METRICS OVERLAY ================= */}
          <AnimatePresence mode="wait">
            {showAfter && (
              <motion.div
                key="after-overlay"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between pointer-events-none z-20"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600/95 px-4 py-1.5 text-xs font-extrabold text-white shadow-glow backdrop-blur-md border border-emerald-400/40">
                    <CheckCircle2 className="h-4 w-4" /> AFTER: 2 kW / 3 kW Solar Panel Installation
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-950/90 px-3 py-1 text-[11px] font-bold text-emerald-400 backdrop-blur-md border border-emerald-500/40">
                    <Sparkles className="h-3 w-3" /> PM Surya Ghar Scheme
                  </span>
                </div>

                {/* Bottom Info Card */}
                <div className="max-w-md rounded-2xl border border-emerald-500/40 bg-slate-950/85 p-4 text-left backdrop-blur-md space-y-1.5 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-emerald-400 flex items-center gap-1.5">
                      <TrendingDown className="h-4 w-4" /> 100% Bill Eliminated
                    </span>
                    <span className="text-xs font-extrabold text-amber-400">Save ₹24,000/yr</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Solar panels generate 250+ kWh clean electricity monthly. Completely eliminates the ₹2,000 monthly bill under DISCOM net metering + up to ₹78,000 subsidy.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Manual Toggle Bar with Auto Transition Progress Bar */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-1.5 border border-slate-700/80 shadow-2xl backdrop-blur-md">
            <button
              type="button"
              onClick={() => handleToggle(false)}
              className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
                !showAfter
                  ? "bg-red-600 text-white shadow-md scale-105"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              BEFORE
            </button>

            {/* Auto-Transition Visual Progress Bar */}
            <div className="relative w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden mx-1">
              <motion.div
                key={`${showAfter}-${resetKey}`}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.5, ease: "linear" }}
                className={`h-full ${showAfter ? "bg-emerald-400" : "bg-red-400"}`}
              />
            </div>

            <button
              type="button"
              onClick={() => handleToggle(true)}
              className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
                showAfter
                  ? "bg-emerald-600 text-white shadow-md scale-105"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              AFTER
            </button>
          </div>
        </div>
      </div>
    </MotionSection>
  );
};
