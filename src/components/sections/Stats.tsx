import { partners, stats } from "@/data/site";
import { Counter } from "@/components/Counter";
import { motion } from "framer-motion";
import { MotionSection } from "@/components/motion";

export const TrustedBy = () => (
  <MotionSection animation="fadeUp" className="border-y bg-surface py-10">
    <div className="container-wide">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Trusted by India&apos;s leading solar brands
      </p>
      <div className="marquee mt-7 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-14">
          {[...partners, ...partners].map((p, i) => (
            <span
              key={`${p}-${i}`}
              className="whitespace-nowrap font-display text-xl font-semibold text-muted-foreground/50 grayscale transition-all duration-300 hover:text-primary hover:grayscale-0"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  </MotionSection>
);

export const StatsSection = () => (
  <MotionSection animation="zoomIn" className="section bg-gradient-soft py-16">
    <div className="container-wide grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ icon: Icon, value, suffix, prefix, label }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -8, scale: 1.03 }}
          className="group stat-card-glow relative transition-all duration-500"
        >
          <div className="relative h-full w-full overflow-hidden text-center p-6 rounded-3xl transition-all duration-500 stat-card-gradient-border">
            {/* Top Subtle Border Ring Glow on Hover */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-transparent transition-colors duration-500 group-hover:border-primary/30" />

            {/* Icon Disc with Glow */}
            <motion.span
              whileHover={{ rotate: 12, scale: 1.1 }}
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-slate-950 shadow-glow transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(22,163,74,0.7)]"
            >
              <Icon className="h-6 w-6 text-slate-950" />
            </motion.span>

            {/* Animated Scroll Count-Up Value */}
            <p className="mt-5 font-display text-3xl font-bold text-gradient sm:text-4xl">
              <Counter value={value} suffix={suffix} prefix={prefix} duration={1800} />
            </p>

            {/* Label */}
            <p className="mt-2 text-sm font-semibold text-foreground/90 group-hover:text-primary transition-colors">
              {label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </MotionSection>
);
