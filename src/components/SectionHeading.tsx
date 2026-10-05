import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} ${className}`}
  >
    {eyebrow && <span className="eyebrow">{eyebrow}</span>}
    <h2 className="mt-3.5 text-3xl leading-tight text-balance sm:text-4xl md:text-[2.75rem]">{title}</h2>
    {description && <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>}
  </motion.div>
);
