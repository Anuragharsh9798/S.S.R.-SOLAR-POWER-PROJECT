import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Zap,
  Sun,
  Award,
  CheckCircle2,
  Phone,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Home,
  Cpu,
  Layers,
  Wrench,
  Clock,
  BatteryCharging,
  Wifi,
  Smartphone,
  Check,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { MotionSection } from "@/components/motion";
import { openFreeQuoteModal } from "@/components/FreeQuoteModal";
import { company } from "@/data/site";
import hybridInverterProduct from "@/assets/product-hybrid-inverter.png";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const HybridInverterDetail = () => {
  return (
    <Layout>
      <Seo
        title="Smart Hybrid Solar Inverter Guide & Specs | SSR Solar Power"
        description="Learn how hybrid solar inverters manage solar PV generation, battery energy storage, and DISCOM grid synchronization to supply backup power during outages."
        path="/products/hybrid-inverter"
      />

      {/* BREADCRUMB & HERO BANNER */}
      <div className="relative overflow-hidden bg-surface pt-28 pb-12 border-b border-border/60">
        <div className="blob -left-20 top-10 h-72 w-72 bg-emerald-500/15" aria-hidden />
        <div className="blob -right-20 bottom-0 h-72 w-72 bg-sky-500/10" aria-hidden />

        <div className="container-wide relative z-10">
          {/* Breadcrumb Navigation */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList className="text-xs sm:text-sm font-medium">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                    <Home className="h-3.5 w-3.5" /> Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/products" className="hover:text-primary transition-colors">
                    Products
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-emerald-400">
                  Hybrid Solar Inverter
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid gap-10 lg:grid-cols-12 items-center">
            {/* Left: Product Image Showcase */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-4 shadow-2xl product-card-gradient-border">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted/30 flex items-center justify-center p-4">
                  <img
                    src={hybridInverterProduct}
                    alt="Smart Hybrid Solar Inverter Unit"
                    className="h-full w-auto object-contain transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Single Floating Badge */}
                <div className="absolute top-6 left-6 z-20">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1 text-xs font-semibold text-secondary-foreground shadow-soft border border-amber-400/40">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-500" /> 5-Year Warranty
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right: Overview & CTA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-6 space-y-5"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/15 px-3.5 py-1 text-xs font-bold text-sky-700 dark:text-sky-400">
                <Zap className="h-3.5 w-3.5" /> Integrated Solar & Battery Inverter
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight leading-tight text-foreground">
                Smart Hybrid <span className="text-gradient">Solar Inverters</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Hybrid solar inverters combine solar array power conversion, battery energy storage management, and grid synchronization within a unified intelligent control system. SSR Solar Power integrates certified hybrid inverters tailored to your load backup needs.
              </p>

              {/* Spec Highlights Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { label: "Typical System Rating", val: "5 kW (Varies by Model)" },
                  { label: "MPPT Efficiency", val: "Up to ~98.2%" },
                  { label: "Grid Switching Time", val: "< 10 ms (UPS Class)" },
                  { label: "Enclosure Protection", val: "IP65 Weatherproof" },
                ].map((spec, i) => (
                  <div key={i} className="rounded-2xl border border-border/70 bg-card/60 p-3 backdrop-blur">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{spec.label}</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{spec.val}</p>
                  </div>
                ))}
              </div>

              {/* CTA Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Button
                  onClick={openFreeQuoteModal}
                  className="btn-premium rounded-full bg-gradient-brand px-7 h-12 text-sm font-bold text-primary-foreground shadow-glow flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" /> Get Free Quote
                </Button>

                <a
                  href={`tel:${company.phone}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-5 h-12 text-xs sm:text-sm font-semibold text-foreground hover:border-primary/50 hover:text-primary transition-all"
                >
                  <Phone className="h-4 w-4 text-emerald-400" /> Call {company.phone}
                </a>

                <a
                  href={`https://wa.me/${company.whatsapp}?text=Hi%20SSR%20Solar%20Power,%20I%20want%20details%20and%20pricing%20for%20Hybrid%20Solar%20Inverters.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 h-12 text-xs sm:text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all"
                >
                  <MessageSquare className="h-4 w-4" /> WhatsApp Us
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE ARTICLE SECTIONS */}
      <section className="section py-16">
        <div className="container-wide max-w-5xl space-y-16">
          
          {/* Section 1: What is a Hybrid Inverter */}
          <MotionSection animation="fadeUp" className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Cpu className="h-4 w-4" /> System Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              What Is a Hybrid Solar Inverter?
            </h2>
            <div className="prose prose-invert max-w-none text-muted-foreground text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                A hybrid solar inverter is a multi-function power management unit designed to manage three distinct power sources: solar photovoltaic (PV) modules, battery storage banks, and the DISCOM electricity grid.
              </p>
              <p>
                Equipped with MPPT charge controllers and internal microprocessors, a hybrid inverter intelligently prioritizes solar energy consumption, charges connected batteries, and syncs surplus solar energy with the utility grid where net metering is enabled.
              </p>
            </div>
          </MotionSection>

          {/* Section 2: How Power Flow Works */}
          <MotionSection animation="fadeUp" className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <RotateCcw className="h-4 w-4" /> Power Flow Modes
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              How Solar, Battery & Grid Interact
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Sunlight Hours</span>
                  <Sun className="h-5 w-5 text-amber-400" />
                </div>
                <h3 className="font-bold text-base text-foreground">1. Solar Power Priority</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Solar generation directly powers active connected household loads. Excess solar power charges the battery bank and exports surplus units to the grid.
                </p>
              </div>

              <div className="rounded-2xl border border-sky-500/30 bg-sky-950/20 p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Grid Outage</span>
                  <Zap className="h-5 w-5 text-sky-400" />
                </div>
                <h3 className="font-bold text-base text-foreground">2. Fast Backup Switchover</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If grid electricity fails, the inverter automatically transitions to battery/solar power in under 10 milliseconds to maintain continuous appliance operation.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Evening Operation</span>
                  <BatteryCharging className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-base text-foreground">3. Stored Energy Consumption</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  During peak evening hours after sunset, the inverter uses stored battery energy to power designated circuit loads.
                </p>
              </div>
            </div>
          </MotionSection>

          {/* Section 3: Monitoring & App Features */}
          <MotionSection animation="fadeUp" className="rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-10 space-y-6 backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Smartphone className="h-4 w-4" /> System Telemetry
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Mobile App & Remote Monitoring Capabilities
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Real-Time Analytics
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Most modern hybrid inverters include Wi-Fi or Bluetooth modules allowing users to monitor live solar generation in kW and daily kWh totals.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Battery Telemetry
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Displays battery State of Charge (SOC %), charging rates, and operational health metrics on supported battery chemistries.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Performance History
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Logs generation trends, grid import/export data, and system alerts to assist with regular maintenance reviews.
                </p>
              </div>
            </div>
          </MotionSection>

          {/* Section 4: Benefits for Indian Households */}
          <MotionSection animation="fadeUp" className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <ShieldCheck className="h-4 w-4" /> Application Benefits
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Advantages for Regional Power Reliability
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Continuous Power During Outages",
                  desc: "Keeps essential residential loads (lighting, fans, internet routers, refrigerators) active during grid blackouts.",
                },
                {
                  title: "Reduced Fuel Generator Reliance",
                  desc: "Provides clean energy storage backup without fuel costs, exhaust fumes, or engine noise.",
                },
                {
                  title: "Voltage Range Tolerance",
                  desc: "Designed with automatic voltage regulation parameters to operate within typical regional voltage fluctuations.",
                },
                {
                  title: "Battery Chemistry Support",
                  desc: "Compatible with conventional Tubular Lead-Acid batteries as well as modern Lithium Iron Phosphate (LiFePO4) energy storage systems.",
                },
              ].map((b, i) => (
                <div key={i} className="rounded-2xl border border-border/80 bg-card p-5 space-y-2">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" /> {b.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-6">{b.desc}</p>
                </div>
              ))}
            </div>
          </MotionSection>

          {/* Section 5: Technical Specifications Table */}
          <MotionSection animation="fadeUp" className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Wrench className="h-4 w-4" /> Technical Specifications
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Typical Parameter Matrix (Varies by Model)
            </h2>

            <div className="overflow-x-auto rounded-3xl border border-border bg-card">
              <table className="w-full text-left text-xs sm:text-sm">
                <tbody className="divide-y divide-border">
                  <tr className="bg-muted/40">
                    <td className="p-4 font-semibold text-foreground w-1/3">Nominal AC Power Output</td>
                    <td className="p-4 text-muted-foreground font-mono font-medium">3 kW – 5 kW Typical (Model Dependent)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-foreground">Max MPPT Efficiency</td>
                    <td className="p-4 text-emerald-400 font-mono font-bold">Up to ~98.2%</td>
                  </tr>
                  <tr className="bg-muted/40">
                    <td className="p-4 font-semibold text-foreground">MPPT Channels / Strings</td>
                    <td className="p-4 text-muted-foreground font-medium">1 or 2 Independent MPPT Trackers</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-foreground">Battery Bus Voltage</td>
                    <td className="p-4 text-muted-foreground font-mono font-medium">48V / 51.2V Nominal System</td>
                  </tr>
                  <tr className="bg-muted/40">
                    <td className="p-4 font-semibold text-foreground">Switching Transfer Time</td>
                    <td className="p-4 text-sky-400 font-mono font-bold">&lt; 10 ms (UPS Grade)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-foreground">Enclosure Protection</td>
                    <td className="p-4 text-muted-foreground font-medium">IP65 Weatherproof (Typical Outdoor/Indoor)</td>
                  </tr>
                  <tr className="bg-muted/40">
                    <td className="p-4 font-semibold text-foreground">Warranty Coverage</td>
                    <td className="p-4 text-amber-400 font-semibold">5-Year Standard Manufacturer Warranty (As per OEM)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* MANDATORY LEGAL DISCLAIMER */}
            <div className="rounded-2xl border border-border/80 bg-muted/40 p-4 text-xs text-muted-foreground leading-relaxed flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                <strong>Disclaimer:</strong> Specifications, performance figures, and warranty terms may vary by manufacturer and selected inverter model. SSR Solar Power acts as an installer and system integrator. Please refer to the official manufacturer product datasheet provided during quotation for exact technical specifications.
              </span>
            </div>
          </MotionSection>

          {/* Section 6: Why SSR Solar Recommends */}
          <MotionSection animation="fadeUp" className="rounded-3xl bg-gradient-to-r from-sky-950/40 via-card to-emerald-950/40 p-8 sm:p-10 border border-sky-500/30 text-center space-y-5 shadow-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-4 py-1 text-xs font-bold text-sky-400">
              <Award className="h-4 w-4" /> Professional System Integration
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              SSR Solar Power Installation & Integration
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We assist customers in selecting, sizing, configuring, and commissioning hybrid inverter setups suited to your local DISCOM rules, battery choice, and continuous backup needs across Uttar Pradesh.
            </p>
            <div className="pt-2">
              <Button
                onClick={openFreeQuoteModal}
                className="btn-premium rounded-full bg-gradient-brand px-8 h-13 text-sm font-bold text-primary-foreground shadow-glow"
              >
                Request Hybrid Inverter Quote <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </MotionSection>

        </div>
      </section>
    </Layout>
  );
};

export default HybridInverterDetail;
