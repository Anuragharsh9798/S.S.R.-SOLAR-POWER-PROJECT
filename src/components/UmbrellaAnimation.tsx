import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export const UmbrellaAnimation = () => {
  const { weather, isNight } = useTheme();
  const isRaining = weather === "rain" && !isNight;

  return (
    <AnimatePresence>
      {isRaining && (
        <motion.div
          key="hero-umbrella"
          initial={{ opacity: 0, scale: 0.2, rotate: -45, y: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.1, rotate: 45, y: 20 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-28 right-6 sm:right-12 z-30 pointer-events-none select-none hidden md:block"
        >
          {/* Floating Canopy Bobbing Container */}
          <motion.div
            animate={{
              y: [-6, 6, -6],
              rotate: [-2, 2, -2],
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* Umbrella Canopy Graphic (SVG) */}
            <div className="relative h-28 w-28 drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)]">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                {/* Umbrella Canopy Fabric */}
                <path
                  d="M 50 15 C 20 15 5 45 5 50 C 20 44 35 48 50 45 C 65 48 80 44 95 50 C 95 45 80 15 50 15 Z"
                  className="fill-gradient-to-r from-emerald-500 via-primary to-teal-400 fill-primary"
                />
                {/* Canopy Rib Highlights */}
                <path d="M 50 15 Q 35 32 35 48" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
                <path d="M 50 15 Q 65 32 65 48" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
                <path d="M 50 15 L 50 45" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />

                {/* Handle Pole & Curved Hook */}
                <path
                  d="M 50 45 L 50 82 Q 50 90 42 90 Q 36 90 38 84"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="text-slate-800 dark:text-slate-200"
                />

                {/* Top Ferrule Cap */}
                <circle cx="50" cy="14" r="3" className="fill-amber-400" />
              </svg>

              {/* Water Drops Falling Off Umbrella Edges */}
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.span
                  key={`drip-${i}`}
                  initial={{ y: 0, opacity: 1, scaleY: 1 }}
                  animate={{
                    y: [0, 32],
                    opacity: [1, 0],
                    scaleY: [1, 1.8],
                  }}
                  transition={{
                    duration: 0.8 + (i % 2) * 0.3,
                    repeat: Infinity,
                    delay: i * 0.22,
                    ease: "easeIn",
                  }}
                  style={{ left: `${15 + i * 24}%`, top: "45%" }}
                  className="absolute h-3 w-1 rounded-full bg-gradient-to-b from-sky-300 to-sky-100 shadow-[0_0_6px_rgba(56,189,248,0.8)]"
                />
              ))}
            </div>

            {/* Shield Protection Glow Aura */}
            <div className="absolute -inset-4 rounded-full bg-primary/10 blur-xl z-[-1]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
