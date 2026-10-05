import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Cpu, Home, BatteryCharging, Radio, Gauge, ArrowRight, ArrowDown } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { MotionSection } from "@/components/motion";

const hybridNodes = [
  {
    id: "solar-panel",
    title: "Solar Panel",
    subtitle: "Clean DC Power Generation",
    icon: Sun,
    badge: "Step 1",
    color: "from-amber-400 to-amber-500",
  },
  {
    id: "hybrid-inverter",
    title: "Hybrid Inverter",
    subtitle: "Smart DC/AC Conversion",
    icon: Cpu,
    badge: "Step 2",
    color: "from-emerald-400 to-emerald-500",
  },
  {
    id: "home",
    title: "Home",
    subtitle: "Powers Essential Loads First",
    icon: Home,
    badge: "Step 3",
    color: "from-sky-400 to-sky-500",
  },
  {
    id: "battery",
    title: "Battery",
    subtitle: "Stores Excess Night Energy",
    icon: BatteryCharging,
    badge: "Step 4",
    color: "from-teal-400 to-emerald-500",
  },
  {
    id: "grid",
    title: "Grid",
    subtitle: "Net Metering Export & Backup",
    icon: Radio,
    badge: "Step 5",
    color: "from-indigo-400 to-sky-500",
  },
];

const onGridNodes = [
  {
    id: "solar-panel",
    title: "Solar Panel",
    subtitle: "Converts sunlight into DC electricity",
    icon: Sun,
    badge: "Step 1",
    color: "from-amber-400 to-amber-500",
  },
  {
    id: "ongrid-inverter",
    title: "On-Grid Inverter",
    subtitle: "Converts DC power into AC electricity",
    icon: Cpu,
    badge: "Step 2",
    color: "from-emerald-400 to-emerald-500",
  },
  {
    id: "home",
    title: "Home",
    subtitle: "Solar power runs your appliances",
    icon: Home,
    badge: "Step 3",
    color: "from-sky-400 to-sky-500",
  },
  {
    id: "net-meter",
    title: "Net Meter",
    subtitle: "Tracks imported and exported electricity",
    icon: Gauge,
    badge: "Step 4",
    color: "from-teal-400 to-emerald-500",
  },
  {
    id: "grid",
    title: "Grid",
    subtitle: "Excess solar power is exported to the grid",
    icon: Radio,
    badge: "Step 5",
    color: "from-indigo-400 to-sky-500",
  },
];

export const EnergyFlowSection = () => {
  const [activeTab, setActiveTab] = useState<"hybrid" | "on-grid">("hybrid");

  const currentNodes = activeTab === "hybrid" ? hybridNodes : onGridNodes;

  return (
    <section className="section relative overflow-hidden bg-background py-10 md:py-14">
      {/* Background Ambient Glow */}
      <div aria-hidden className="blob -left-20 top-1/3 h-80 w-80 bg-primary/15" />
      <div aria-hidden className="blob -right-20 bottom-10 h-80 w-80 bg-secondary/15" />

      <div className="container-wide relative z-10">
        <SectionHeading
          eyebrow="Interactive Energy Flow"
          title={<>Continuous <span className="text-gradient">Solar Energy Flow</span></>}
          description="Select your system architecture below to explore how solar energy flows from panels to your home and the grid."
        />

        {/* Flow Mode Selector Toggle */}
        <div className="mt-6 md:mt-7 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("hybrid")}
            className={`rounded-full border px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
              activeTab === "hybrid"
                ? "border-transparent bg-gradient-brand text-primary-foreground shadow-glow"
                : "border-border/70 bg-card text-foreground hover:border-primary/40 hover:bg-card"
            }`}
          >
            Hybrid Solar
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("on-grid")}
            className={`rounded-full border px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
              activeTab === "on-grid"
                ? "border-transparent bg-gradient-brand text-primary-foreground shadow-glow"
                : "border-border/70 bg-card text-foreground hover:border-primary/40 hover:bg-card"
            }`}
          >
            On-Grid Solar
          </button>
        </div>

        {/* Animated Flow Content Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {/* Flow Mode Heading */}
            <div className="mt-5 md:mt-6 text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-bold text-primary uppercase tracking-[0.18em]">
                {activeTab === "hybrid" ? "HYBRID SOLAR ENERGY FLOW" : "ON-GRID SOLAR ENERGY FLOW"}
              </span>
            </div>

            {/* Desktop & Tablet Horizontal Energy Flow Diagram */}
            <div className="mt-7 md:mt-8 hidden xl:flex items-center justify-between gap-2 max-w-6xl mx-auto">
              {currentNodes.map((node, i) => {
                const Icon = node.icon;
                const isLast = i === currentNodes.length - 1;

                return (
                  <div key={node.id} className="flex items-center gap-2 flex-1">
                    {/* Node Card */}
                    <MotionSection
                      animation="zoomIn"
                      delay={i * 0.08}
                      className="group flow-card-glow relative flex-1 transition-all duration-500"
                    >
                      <div className="relative h-full w-full overflow-hidden p-5 rounded-3xl text-center transition-all duration-500 flow-card-gradient-border group-hover:-translate-y-1.5">
                        {/* Step Badge */}
                        <span className="inline-block rounded-full bg-primary/10 px-3 py-0.5 text-[11px] font-semibold text-primary uppercase tracking-wider">
                          {node.badge}
                        </span>

                        {/* Icon Container with Pulse Glow */}
                        <div className="mt-3 relative flex justify-center">
                          <motion.div
                            animate={{ scale: [1, 1.08, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${node.color} text-slate-950 shadow-glow transition-transform duration-500 group-hover:scale-110`}
                          >
                            <Icon className="h-7 w-7 text-slate-950" />
                          </motion.div>
                        </div>

                        {/* Title & Subtitle */}
                        <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                          {node.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          {node.subtitle}
                        </p>
                      </div>
                    </MotionSection>

                    {/* Animated Energy Conduit Path between Nodes */}
                    {!isLast && (
                      <div className="relative flex items-center justify-center w-12 h-10 shrink-0 overflow-hidden">
                        {/* Conduit Line */}
                        <div className="h-[2px] w-full bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" />
                        
                        {/* Glowing Moving Energy Particles */}
                        <div className="absolute inset-0 flex items-center">
                          {[0, 1, 2].map((particleIdx) => (
                            <motion.span
                              key={particleIdx}
                              className="absolute h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(34,197,94,0.9)]"
                              animate={{
                                x: ["0%", "100%"],
                                opacity: [0, 1, 1, 0],
                                scale: [0.8, 1.2, 0.8],
                              }}
                              transition={{
                                duration: 1.8,
                                repeat: Infinity,
                                delay: particleIdx * 0.6,
                                ease: "linear",
                              }}
                            />
                          ))}
                        </div>

                        <ArrowRight className="absolute right-0 h-4 w-4 text-primary/70 shrink-0" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile & Tablet Vertical Flow Diagram */}
            <div className="mt-7 md:mt-8 flex xl:hidden flex-col items-center gap-3 max-w-sm mx-auto">
              {currentNodes.map((node, i) => {
                const Icon = node.icon;
                const isLast = i === currentNodes.length - 1;

                return (
                  <div key={node.id} className="flex flex-col items-center gap-3 w-full">
                    {/* Node Card */}
                    <MotionSection
                      animation="fadeUp"
                      delay={i * 0.08}
                      className="group flow-card-glow relative w-full transition-all duration-500"
                    >
                      <div className="relative h-full w-full overflow-hidden p-4 rounded-3xl flex items-center gap-4 transition-all duration-500 flow-card-gradient-border">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${node.color} text-slate-950 shadow-glow`}>
                          <Icon className="h-6 w-6 text-slate-950" />
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                            {node.badge}
                          </span>
                          <h3 className="font-display text-base font-semibold text-foreground">
                            {node.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">{node.subtitle}</p>
                        </div>
                      </div>
                    </MotionSection>

                    {/* Vertical Conduit for Mobile */}
                    {!isLast && (
                      <div className="relative flex flex-col items-center h-10 w-6 overflow-hidden">
                        <div className="w-[2px] h-full bg-gradient-to-b from-primary/20 via-primary/60 to-primary/20" />
                        <div className="absolute inset-0 flex flex-col items-center">
                          {[0, 1].map((particleIdx) => (
                            <motion.span
                              key={particleIdx}
                              className="absolute h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(34,197,94,0.9)]"
                              animate={{
                                y: ["0%", "100%"],
                                opacity: [0, 1, 1, 0],
                              }}
                              transition={{
                                duration: 1.6,
                                repeat: Infinity,
                                delay: particleIdx * 0.8,
                                ease: "linear",
                              }}
                            />
                          ))}
                        </div>
                        <ArrowDown className="absolute bottom-0 h-4 w-4 text-primary/70" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
