import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

/**
 * Premium Subtle Atmospheric Background System:
 * - Moving clouds (soft, realistic drifting cloud trails)
 * - Volumetric Sun Rays (warm golden light beam flares)
 * - Twinkling Stars (delicate glowing star grid in night view)
 * - Moon Glow (soft lunar halo radial aura)
 * - Ambient Lighting (soft background light blooms)
 * - Floating Particles (gentle upward floating solar particles)
 */
export const AmbientBackground = () => {
  const { isNight } = useTheme();

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden select-none" aria-hidden>

      {/* 2. Soft Moving Clouds */}
      <div className="absolute inset-x-0 top-0 h-[50vh] overflow-hidden">
        <motion.div
          initial={{ x: "-20%" }}
          animate={{ x: "120%" }}
          transition={{ duration: 52, repeat: Infinity, ease: "linear" }}
          className={`absolute top-[6%] h-24 w-80 rounded-full blur-2xl transition-colors ${
            isNight ? "bg-slate-700/10" : "bg-white/25"
          }`}
        />
        <motion.div
          initial={{ x: "-30%" }}
          animate={{ x: "120%" }}
          transition={{ duration: 68, repeat: Infinity, delay: 20, ease: "linear" }}
          className={`absolute top-[18%] h-28 w-96 rounded-full blur-3xl transition-colors ${
            isNight ? "bg-slate-800/10" : "bg-amber-100/20"
          }`}
        />
      </div>

      {/* 3. Night Stars vs Day Sun Beam Accents */}
      {isNight ? (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 32 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-slate-100 shadow-[0_0_6px_rgba(255,255,255,0.8)]"
              style={{
                width: `${(i % 3) * 1.2 + 1.5}px`,
                height: `${(i % 3) * 1.2 + 1.5}px`,
                left: `${(i * 6.7 + 3) % 96}%`,
                top: `${(i * 8.9 + 4) % 85}%`,
              }}
              animate={{
                opacity: [0.1, 0.75, 0.1],
                scale: [0.8, 1.3, 0.8],
              }}
              transition={{
                duration: 3 + (i % 4) * 1.2,
                repeat: Infinity,
                delay: (i % 6) * 0.4,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      ) : (
        /* Volumetric Sun Rays Beam Flare */
        <motion.div
          className="absolute left-[15%] top-0 h-[30rem] w-[30rem] opacity-30"
          animate={{ rotate: [0, 12, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-300/30 via-transparent to-transparent blur-xl" />
        </motion.div>
      )}

      {/* 4. Soft Upward Floating Dust/Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.span
            key={i}
            className={`absolute rounded-full blur-[0.5px] ${
              isNight ? "bg-sky-300/40" : "bg-amber-300/40"
            }`}
            style={{
              width: `${(i % 3) * 1.5 + 2}px`,
              height: `${(i % 3) * 1.5 + 2}px`,
              left: `${(i * 7.9 + 5) % 92}%`,
              top: `${(i * 11.3 + 12) % 85}%`,
            }}
            animate={{
              y: [0, -50 - (i % 4) * 15, 0],
              x: [0, i % 2 === 0 ? 12 : -12, 0],
              opacity: [0.08, 0.45, 0.08],
            }}
            transition={{
              duration: 7 + (i % 4) * 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};
