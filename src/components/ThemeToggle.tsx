import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const { isNight, toggle } = useTheme();

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      aria-label={isNight ? "Switch to Day Mode" : "Switch to Night Mode"}
      className={`relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-card/70 text-foreground transition-colors hover:border-primary/50 hover:text-primary ${className}`}
      style={{ transitionDuration: "500ms" }}
    >
      <motion.span
        animate={{
          rotate: isNight ? 180 : 0,
          scale: isNight ? 0 : 1,
          opacity: isNight ? 0 : 1,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute flex items-center justify-center"
      >
        <Sun className="h-[18px] w-[18px] text-amber-500" />
      </motion.span>

      <motion.span
        animate={{
          rotate: isNight ? 0 : -180,
          scale: isNight ? 1 : 0,
          opacity: isNight ? 1 : 0,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute flex items-center justify-center"
      >
        <Moon className="h-[18px] w-[18px] text-sky-400" />
      </motion.span>
    </motion.button>
  );
};
