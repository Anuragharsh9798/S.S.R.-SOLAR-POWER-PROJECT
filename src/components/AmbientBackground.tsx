import { memo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

/**
 * Premium Subtle Atmospheric Background System:
 * - Optimized for 60fps/120fps mobile & desktop performance
 * - Uses hardware-accelerated transform & opacity
 * - Reduced DOM count and GPU footprint on small screens
 */
export const AmbientBackground = memo(() => {
  const { isNight } = useTheme();

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden select-none" aria-hidden>
      {/* 1. Soft Moving Clouds (Low CPU footprint) */}
      <div className="absolute inset-x-0 top-0 h-[45vh] overflow-hidden opacity-60 md:opacity-100">
        <motion.div
          initial={{ x: "-20%" }}
          animate={{ x: "120%" }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className={`absolute top-[6%] h-20 md:h-24 w-64 md:w-80 rounded-full blur-2xl will-change-transform ${
            isNight ? "bg-slate-700/10" : "bg-white/20"
          }`}
        />
        <motion.div
          initial={{ x: "-30%" }}
          animate={{ x: "120%" }}
          transition={{ duration: 65, repeat: Infinity, delay: 15, ease: "linear" }}
          className={`hidden sm:block absolute top-[18%] h-24 md:h-28 w-80 md:w-96 rounded-full blur-3xl will-change-transform ${
            isNight ? "bg-slate-800/10" : "bg-amber-100/15"
          }`}
        />
      </div>

      {/* 2. Night Stars vs Day Sun Beam Accents */}
      {isNight ? (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.span
              key={`star-${i}`}
              className="absolute rounded-full bg-slate-100 shadow-[0_0_4px_rgba(255,255,255,0.6)] will-change-transform"
              style={{
                width: `${(i % 3) * 1.0 + 1.5}px`,
                height: `${(i % 3) * 1.0 + 1.5}px`,
                left: `${(i * 14.3 + 4) % 94}%`,
                top: `${(i * 18.7 + 6) % 80}%`,
              }}
              animate={{
                opacity: [0.15, 0.75, 0.15],
                scale: [0.85, 1.2, 0.85],
              }}
              transition={{
                duration: 3.5 + (i % 3) * 1.0,
                repeat: Infinity,
                delay: (i % 4) * 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      ) : (
        /* Volumetric Sun Rays Flare */
        <motion.div
          className="absolute left-[10%] top-0 h-[24rem] md:h-[30rem] w-[24rem] md:w-[30rem] opacity-25 will-change-transform"
          animate={{ rotate: [0, 8, 0], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-300/25 via-transparent to-transparent blur-xl" />
        </motion.div>
      )}

      {/* 3. Soft Upward Floating Solar Particles (Optimized) */}
      <div className="hidden sm:block absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.span
            key={`particle-${i}`}
            className={`absolute rounded-full will-change-transform ${
              isNight ? "bg-sky-300/30" : "bg-amber-300/30"
            }`}
            style={{
              width: `${(i % 3) * 1.2 + 2}px`,
              height: `${(i % 3) * 1.2 + 2}px`,
              left: `${(i * 12.5 + 8) % 90}%`,
              top: `${(i * 22.3 + 15) % 80}%`,
            }}
            animate={{
              y: [0, -40 - (i % 3) * 15, 0],
              opacity: [0.08, 0.35, 0.08],
            }}
            transition={{
              duration: 8 + (i % 3) * 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
});

AmbientBackground.displayName = "AmbientBackground";
