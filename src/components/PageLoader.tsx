import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Sparkles } from "lucide-react";
import { BrandWordmark } from "./BrandWordmark";

export const PageLoader = () => {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Duration: ~1.65 seconds (1650ms), within the required 1.5–2.0 second window
    const duration = 1650;
    let startTime: number | null = null;
    let animId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));

      setProgress(pct);

      if (elapsed < duration) {
        animId = requestAnimationFrame(step);
      } else {
        setProgress(100);
        // Short pause at 100% before triggering exit fade
        const timer = setTimeout(() => setDone(true), 120);
        return () => clearTimeout(timer);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(12px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-background select-none"
          aria-label="Loading SSR Solar Power"
        >
          {/* Ambient Sunlight Glow Layers */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Primary warm sunlight radial glow */}
            <motion.div
              className="h-80 w-80 rounded-full bg-gradient-to-tr from-amber-500/25 via-primary/20 to-secondary/30 blur-3xl"
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.4, 0.75, 0.4],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Secondary high-intensity sun flare core */}
            <motion.div
              className="absolute h-48 w-48 rounded-full bg-amber-400/20 blur-2xl"
              animate={{
                scale: [0.9, 1.15, 0.9],
                opacity: [0.5, 0.9, 0.5],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Soft background ambient blobs */}
            <div className="blob left-1/4 top-1/3 h-64 w-64 bg-primary/15" />
            <div className="blob bottom-1/4 right-1/4 h-64 w-64 bg-secondary/20" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Solar Icon with Rotating Sun & Sunlight Aura */}
            <div className="relative flex items-center justify-center">
              {/* Pulsing outer aura ring */}
              <motion.div
                className="absolute h-24 w-24 rounded-full bg-gradient-to-r from-amber-400/30 via-emerald-500/20 to-amber-500/30 blur-md"
                animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Counter-rotating accent dash ring */}
              <motion.svg
                className="absolute h-24 w-24 text-amber-400/40"
                viewBox="0 0 100 100"
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="6 8"
                />
              </motion.svg>

              {/* Rotating Solar Icon Container */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: -30 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow border border-white/20"
              >
                {/* Continuous rotating solar icon */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="flex items-center justify-center"
                >
                  <Sun className="h-8 w-8 text-amber-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                </motion.div>
              </motion.div>
            </div>

            {/* SSR Solar Power Logo */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 flex flex-col items-center text-center"
            >
              <BrandWordmark className="text-xl sm:text-2xl" />
            </motion.div>

            {/* Progress Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-7 flex flex-col items-center gap-2.5 w-60 sm:w-64"
            >
              {/* Glowing progress bar track */}
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/80 p-0.5 border border-primary/10 shadow-inner">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 shadow-[0_0_10px_rgba(250,204,21,0.6)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              {/* Progress status & percentage */}
              <div className="flex items-center justify-between w-full text-xs text-muted-foreground font-medium px-0.5">
                <span className="inline-flex items-center gap-1 text-[11px] tracking-wider uppercase">
                  <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
                  Solar Powering...
                </span>
                <span className="font-mono text-xs font-semibold text-foreground">
                  {progress}%
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

