import { ReactNode } from "react";
import { motion, type HTMLMotionProps, type Variants } from "framer-motion";

export const pageTransition = {
  initial: { opacity: 0, scale: 0.96, filter: "blur(14px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 1.02, filter: "blur(14px)" },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: 44, filter: "blur(6px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)" },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: -44, filter: "blur(6px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)" },
};

export const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.92, filter: "blur(6px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
};

export const cardEntranceVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.95,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: [28, -3, 3, -1.5, 0],
    scale: [0.95, 0.98, 1.01, 1],
    filter: "blur(0px)",
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const revealViewport = {
  once: true,
  margin: "-60px",
} as const;

export type AnimationType = "fadeUp" | "fadeLeft" | "fadeRight" | "zoomIn";

const variantMap: Record<AnimationType, Variants> = {
  fadeUp,
  fadeLeft,
  fadeRight,
  zoomIn,
};

export const MotionSection = ({
  children,
  className = "",
  variant,
  animation = "fadeUp",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  variant?: Variants;
  animation?: AnimationType;
} & HTMLMotionProps<"section">) => {
  const chosenVariant = variant || variantMap[animation] || fadeUp;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={chosenVariant}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.section>
  );
};

