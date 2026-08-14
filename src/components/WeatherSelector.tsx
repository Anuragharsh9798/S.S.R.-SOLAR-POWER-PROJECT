import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, CloudSun, CloudRain, ChevronDown, Check } from "lucide-react";
import { useTheme, WeatherType } from "./ThemeProvider";

export interface WeatherOption {
  id: WeatherType;
  label: string;
  icon: typeof Sun;
  color: string;
}

export const weatherOptions: WeatherOption[] = [
  {
    id: "sunny",
    label: "Sunny",
    icon: Sun,
    color: "text-amber-400",
  },
  {
    id: "cloudy",
    label: "Cloudy",
    icon: CloudSun,
    color: "text-sky-400",
  },
  {
    id: "rain",
    label: "Rain",
    icon: CloudRain,
    color: "text-blue-400",
  },
];

export const WeatherSelector = ({ onDark, className = "" }: { onDark?: boolean; className?: string }) => {
  const { weather, setWeather } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeOption = weatherOptions.find((w) => w.id === weather) || weatherOptions[0];
  const ActiveIcon = activeOption.icon;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Weather Selector Trigger Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-label={`Select weather condition. Current: ${activeOption.label}`}
        aria-expanded={isOpen}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.93 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`relative inline-flex h-10 items-center gap-2 rounded-full border px-3.5 text-xs font-semibold backdrop-blur-xl transition-all shadow-soft hover:shadow-[0_0_20px_rgba(34,197,94,0.45)] ${
          onDark
            ? "border-white/30 bg-white/10 text-white hover:border-emerald-400/60"
            : "border-border/70 bg-card/80 text-foreground hover:border-primary/60 hover:text-primary"
        }`}
      >
        {/* Animated Icon Disc */}
        <span className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-gradient-brand text-slate-950 shadow-sm">
          <motion.div
            key={activeOption.id}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <ActiveIcon className="h-4 w-4 text-slate-950" />
          </motion.div>
        </span>

        {/* Selected Weather Label */}
        <span className="hidden sm:inline-block font-semibold">
          {activeOption.label}
        </span>

        {/* Dropdown Chevron */}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 opacity-70 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </motion.button>

      {/* Premium Glassmorphism Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.92, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, scale: 0.92, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-12 z-50 w-44 rounded-2xl border border-white/30 dark:border-white/15 bg-card/90 dark:bg-card/85 p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.25)] backdrop-blur-2xl"
          >
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/40 mb-1">
              Select Weather
            </div>

            <div className="space-y-1">
              {weatherOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = weather === option.id;

                return (
                  <motion.button
                    key={option.id}
                    type="button"
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setWeather(option.id);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                      isSelected
                        ? "bg-primary/15 text-primary font-bold"
                        : "text-foreground hover:bg-muted/60 hover:text-primary"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-lg bg-muted/50 ${option.color}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>{option.label}</span>
                    </span>

                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
