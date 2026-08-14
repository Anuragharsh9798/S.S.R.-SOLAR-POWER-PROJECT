import { useState } from "react";
import { motion } from "framer-motion";

interface BrandWordmarkProps {
  onDark?: boolean;
  className?: string;
}

const ssrLetters = ["S", "S", "R"];

export const BrandWordmark = ({ onDark = false, className = "" }: BrandWordmarkProps) => {
  const [playKey, setPlayKey] = useState(0);

  const replayAnimation = () => setPlayKey((value) => value + 1);

  return (
    <span
      className={`inline-flex flex-col font-display font-bold leading-tight tracking-tight ${className}`}
      onMouseEnter={replayAnimation}
      onFocus={replayAnimation}
    >
      <span key={`brand-${playKey}`} className="inline-flex flex-col">
        <span className={`inline-flex items-center gap-[0.02em] ${onDark ? "text-white" : "text-foreground"}`}>
          {ssrLetters.map((letter, index) => (
            <motion.span
              key={`${playKey}-${letter}-${index}`}
              initial={{ y: -18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.38, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </span>
        <span className="inline-flex items-center gap-1 whitespace-nowrap">
          <motion.span
            key={`solar-${playKey}`}
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.48, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
            className={onDark ? "text-[hsl(48_96%_60%)]" : "text-gradient"}
          >
            Solar
          </motion.span>
          <motion.span
            key={`power-${playKey}`}
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.48, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
            className={onDark ? "text-white" : "text-foreground"}
          >
            Power
          </motion.span>
        </span>
      </span>
    </span>
  );
};
