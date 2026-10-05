import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { subsidySteps } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ClipboardCheck,
  Compass,
  FileCheck,
  FileText,
  Landmark,
  Layers,
  Ruler,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { MotionSection } from "@/components/motion";

const subsidyIcons = [ClipboardCheck, FileText, Landmark, Sparkles];

// 6 Required Installation Steps
const timelineSteps = [
  {
    step: "01",
    title: "Survey",
    subtitle: "3D Drone & Shading Analysis",
    description: "Certified engineers inspect your roof structure, shadow profile, electrical load distribution, and cable routing.",
    icon: Compass,
    color: "from-amber-400 to-amber-500",
  },
  {
    step: "02",
    title: "Design",
    subtitle: "Custom 3D CAD Engineering",
    description: "Our design team builds custom 3D solar array models optimizing tilt angles, stringing, and generation yield.",
    icon: Ruler,
    color: "from-emerald-400 to-emerald-500",
  },
  {
    step: "03",
    title: "Approval",
    subtitle: "DISCOM & Subsidy Filing",
    description: "Complete paperwork clearance for DISCOM net metering sanction and PM Surya Ghar national portal subsidy registration.",
    icon: FileCheck,
    color: "from-sky-400 to-sky-500",
  },
  {
    step: "04",
    title: "Installation",
    subtitle: "Precision Rooftop Mounting",
    description: "Certified technicians install aluminum rails, Tier-1 solar panels, DC cabling, and hybrid solar inverter.",
    icon: Wrench,
    color: "from-teal-400 to-emerald-500",
  },
  {
    step: "05",
    title: "Net Metering",
    subtitle: "Bi-directional Meter Setup",
    description: "DISCOM inspection, bi-directional smart meter installation, and grid synchronization testing.",
    icon: Layers,
    color: "from-indigo-400 to-sky-500",
  },
  {
    step: "06",
    title: "Solar Activated",
    subtitle: "System Live & App Monitoring",
    description: "Your system turns live! Enjoy 24/7 real-time solar generation analytics on your smartphone app.",
    icon: Zap,
    color: "from-emerald-400 to-primary",
  },
];

export const InstallationProcess = ({ className = "" }: { className?: string } = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 75%"],
  });

  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <MotionSection animation="fadeRight" className={`section relative overflow-hidden py-10 md:py-14 ${className}`}>
      <div className="container-wide">
        <SectionHeading
          eyebrow="Installation Timeline"
          title={<>Animated <span className="text-gradient">Step-by-Step Installation</span> Journey</>}
          description="From initial roof survey to your system turning live — transparent execution at every step."
        />

        <div ref={containerRef} className="relative mt-8 md:mt-10 max-w-5xl mx-auto">
          {/* Scroll-Driven Animated Vertical Progress Bar */}
          <div className="absolute left-6 top-4 bottom-4 w-1 bg-border/60 md:left-1/2 md:-ml-0.5 rounded-full overflow-hidden" aria-hidden>
            <motion.div
              style={{ scaleY, transformOrigin: "top" }}
              className="h-full w-full bg-gradient-brand shadow-[0_0_15px_rgba(34,197,94,0.9)]"
            />
          </div>

          <div className="space-y-8 md:space-y-10">
            {timelineSteps.map((s, i) => {
              const Icon = s.icon;
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 35, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-6 md:gap-12`}
                >
                  {/* Step Content Card */}
                  <div className="pl-16 md:pl-0 md:w-1/2">
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="group timeline-card-glow relative transition-all duration-500"
                    >
                      <div className="relative h-full w-full overflow-hidden p-6 md:p-7 rounded-3xl transition-all duration-500 timeline-card-gradient-border">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-display text-2xl font-black text-primary">
                            {s.step}
                          </span>
                          <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary uppercase tracking-wider">
                            Step {i + 1} of 6
                          </span>
                        </div>

                        <h3 className="mt-3 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {s.title}
                        </h3>
                        <p className="text-xs font-medium text-emerald-500 dark:text-emerald-400 mt-0.5">
                          {s.subtitle}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {s.description}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Central Node Circle with Scroll Glow */}
                  <div className="absolute left-6 md:left-1/2 top-4 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 z-20 flex items-center justify-center">
                    <motion.div
                      whileInView={{ scale: [0.7, 1.15, 1] }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-slate-950 shadow-glow border-2 border-white dark:border-slate-900 transition-transform duration-300`}
                    >
                      <Icon className="h-6 w-6 text-slate-950" />
                    </motion.div>
                  </div>

                  {/* Empty Spacer Column for Desktop Alternating Grid */}
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </MotionSection>
  );
};

export const SubsidyTimeline = () => (
  <MotionSection animation="fadeLeft" className="section py-10 md:py-14 bg-gradient-soft">
    <div className="container-wide">
      <SectionHeading
        eyebrow="Government Subsidy"
        title={<>Claim up to <span className="text-gradient-sun">₹1,08,000</span> in rooftop subsidy</>}
        description="We manage the entire national portal journey so your claim is approved without back-and-forth."
      />

      <ol className="mt-8 md:mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {subsidySteps.map((s, i) => {
          const Icon = subsidyIcons[i];
          return (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group timeline-card-glow relative transition-all duration-500"
            >
              <div className="relative h-full w-full overflow-hidden p-6 md:p-7 rounded-3xl transition-all duration-500 timeline-card-gradient-border">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/20">
                  <Icon className="h-5 w-5 text-secondary-foreground dark:text-secondary" />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Step {i + 1}</p>
                <h3 className="mt-1.5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>

      <div className="mt-7 md:mt-8 text-center">
        <Button asChild size="lg" className="btn-premium h-12 rounded-full bg-gradient-brand px-8 font-semibold text-primary-foreground shadow-glow">
          <Link to="/calculator">Apply Now</Link>
        </Button>
      </div>
    </div>
  </MotionSection>
);

