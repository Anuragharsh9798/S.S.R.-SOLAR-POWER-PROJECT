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
  Cpu,
  Layers,
  Wrench,
  Clock,
  BarChart3,
  Building2,
  Home,
  Check,
  AlertCircle,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { MotionSection } from "@/components/motion";
import { openFreeQuoteModal } from "@/components/FreeQuoteModal";
import { company } from "@/data/site";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const SolarPanelsDetail = () => {
  return (
    <Layout>
      <Seo
        title="High-Efficiency Mono PERC Solar Panels Guide & Specs | SSR Solar Power"
        description="Learn how Monocrystalline PERC solar panels function, their efficiency characteristics, expected lifespan, and typical benefits for home and business installations."
        path="/products/solar-panels"
      />

      {/* BREADCRUMB & HERO BANNER */}
      <div className="relative overflow-hidden bg-surface pt-28 pb-12 border-b border-border/60">
        <div className="blob -left-20 top-10 h-72 w-72 bg-primary/15" aria-hidden />
        <div className="blob -right-20 bottom-0 h-72 w-72 bg-amber-500/10" aria-hidden />

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
                  Solar Panels
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
              <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-3 shadow-2xl product-card-gradient-border">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80"
                    alt="Monocrystalline Solar Panel Array"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                </div>

                {/* Single Floating Badge */}
                <div className="absolute top-6 left-6 z-20">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-emerald-400/70 px-3.5 py-1 text-xs font-bold text-emerald-300 shadow-xl">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Residential &amp; Commercial Use
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
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <Sun className="h-3.5 w-3.5" /> High-Efficiency Solar PV Technology
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight leading-tight text-foreground">
                Monocrystalline <span className="text-gradient">PERC Solar Panels</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Monocrystalline PERC (Passivated Emitter and Rear Cell) panels utilize high-purity silicon wafers designed to absorb sunlight efficiently. SSR Solar Power supplies, installs, and integrates certified solar panels tailored to your power requirements.
              </p>

              {/* Spec Highlights Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { label: "Typical Module Rating", val: "545 Wp (Model Dependent)" },
                  { label: "Cell Technology", val: "Mono PERC Half-Cut" },
                  { label: "Module Efficiency", val: "Up to ~21.3%" },
                  { label: "Junction Protection", val: "IP68 Rated (Typical)" },
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
                  href={`https://wa.me/${company.whatsapp}?text=Hi%20SSR%20Solar%20Power,%20I%20want%20details%20and%20pricing%20for%20Solar%20Panels.`}
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
          
          {/* Section 1: What are Solar Panels */}
          <MotionSection animation="fadeUp" className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Cpu className="h-4 w-4" /> Technical Overview
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              What Are Solar Panels & How Do They Convert Sunlight?
            </h2>
            <div className="prose prose-invert max-w-none text-muted-foreground text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                Solar panels (photovoltaic modules) are engineered assemblies composed of individual silicon cells. They absorb solar radiation and convert photons into direct current (DC) electricity via the photovoltaic effect.
              </p>
              <p>
                Modern residential and commercial arrays commonly utilize monocrystalline silicon for its uniform crystal structure, providing consistent energy capture across diverse daylight conditions.
              </p>
            </div>
          </MotionSection>

          {/* Section 2: Step-by-step Process */}
          <MotionSection animation="fadeUp" className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Layers className="h-4 w-4" /> Electricity Generation Flow
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              How Electricity Is Generated & Used
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {[
                {
                  step: "01",
                  title: "Sunlight Capture",
                  desc: "Tempered anti-reflective glass lets sunlight pass into the silicon cell layer.",
                },
                {
                  step: "02",
                  title: "Photon Energy Transfer",
                  desc: "Solar photons energize electrons within the silicon crystal structure.",
                },
                {
                  step: "03",
                  title: "DC Power Channeling",
                  desc: "Conductive metallic busbars collect and direct DC current into junction wiring.",
                },
                {
                  step: "04",
                  title: "AC Household Supply",
                  desc: "A connected inverter converts DC power to standard AC electricity for appliances.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/80 bg-card p-5 space-y-2 relative overflow-hidden group hover:border-emerald-500/40 transition-colors"
                >
                  <span className="text-3xl font-extrabold font-mono text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors">
                    {item.step}
                  </span>
                  <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </MotionSection>

          {/* Section 3: PERC & Half-Cut Cell Architecture */}
          <MotionSection animation="fadeUp" className="rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-10 space-y-6 backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Award className="h-4 w-4" /> Cell Engineering
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Understanding Mono PERC & Half-Cut Technologies
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> PERC Backing Layer
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Passivated Emitter and Rear Cell (PERC) incorporates a reflective rear surface layer, giving unabsorbed light a secondary opportunity to create current within the cell.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Half-Cut Cell Layout
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  By halving traditional solar cells, internal resistive power loss is reduced, helping the module maintain efficient output under partial roof shading or high temperatures.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Multi-Busbar (MBB)
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Multiple thin ribbon busbars shorten the electrical path for collected electrons, reducing micro-crack vulnerability and improving overall module efficiency.
                </p>
              </div>
            </div>
          </MotionSection>

          {/* Section 4: Use Cases */}
          <MotionSection animation="fadeUp" className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <BarChart3 className="h-4 w-4" /> Practical Benefits
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Benefits for Homeowners & Commercial Users
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Residential Card */}
              <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-6 sm:p-8 space-y-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                    <Home className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">Residential Homes</h3>
                    <p className="text-xs text-emerald-400 font-semibold">PM Surya Ghar Scheme Compatible</p>
                  </div>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Helps lower monthly grid power dependency during high consumption months.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Compatible with government subsidy support under PM Surya Ghar Muft Bijli Yojana (for eligible domestic connections).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Adds long-term energy self-reliance to residential properties.</span>
                  </li>
                </ul>
              </div>

              {/* Commercial Card */}
              <div className="rounded-3xl border border-amber-500/30 bg-amber-950/20 p-6 sm:p-8 space-y-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">Commercial Establishments</h3>
                    <p className="text-xs text-amber-400 font-semibold">Daytime Operational Load Offset</p>
                  </div>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Supplies clean daytime electricity during peak business operating hours.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Eligible for accelerated depreciation benefits under applicable tax regulations.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Provides predictable solar power generation for commercial facilities over the long term.</span>
                  </li>
                </ul>
              </div>
            </div>
          </MotionSection>

          {/* Section 5: Lifespan & Maintenance */}
          <MotionSection animation="fadeUp" className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Clock className="h-4 w-4" /> Durability & Maintenance
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Expected Lifespan & Routine Care
            </h2>
            <div className="prose prose-invert max-w-none text-muted-foreground text-sm sm:text-base leading-relaxed space-y-3">
              <p>
                Solar panels are solid-state equipment with no moving parts, resulting in minimal routine maintenance. Typical maintenance involves periodic surface cleaning with clean water every 2 to 4 weeks to remove accumulated dust or leaves, along with periodic electrical checks.
              </p>
              <p>
                Tier-1 solar modules typically carry a 10 to 12-year product warranty against manufacturing defects and a 25-year linear performance warranty provided directly by the module manufacturer.
              </p>
            </div>
          </MotionSection>

          {/* Section 6: Technical Specifications Table */}
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
                    <td className="p-4 font-semibold text-foreground w-1/3">Rated Power Output (Pmax)</td>
                    <td className="p-4 text-muted-foreground font-mono font-medium">540 Wp – 550 Wp (Typical)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-foreground">Module Efficiency Range</td>
                    <td className="p-4 text-emerald-400 font-mono font-bold">Up to ~21.3%</td>
                  </tr>
                  <tr className="bg-muted/40">
                    <td className="p-4 font-semibold text-foreground">Cell Type & Configuration</td>
                    <td className="p-4 text-muted-foreground font-medium">Monocrystalline PERC (Half-Cut)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-foreground">Enclosure / Junction Box</td>
                    <td className="p-4 text-muted-foreground font-medium">IP68 Rated Junction Box (Typical)</td>
                  </tr>
                  <tr className="bg-muted/40">
                    <td className="p-4 font-semibold text-foreground">Frame Structure</td>
                    <td className="p-4 text-muted-foreground font-medium">Anodized Aluminium Alloy</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-foreground">Max System Voltage</td>
                    <td className="p-4 text-muted-foreground font-mono font-medium">Up to 1500 V DC</td>
                  </tr>
                  <tr className="bg-muted/40">
                    <td className="p-4 font-semibold text-foreground">Warranty Terms</td>
                    <td className="p-4 text-amber-400 font-semibold">10-12 Yr Product + 25-Yr Linear Power (As per manufacturer)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* MANDATORY LEGAL DISCLAIMER */}
            <div className="rounded-2xl border border-border/80 bg-muted/40 p-4 text-xs text-muted-foreground leading-relaxed flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                <strong>Disclaimer:</strong> Specifications, performance figures, and warranty terms may vary by manufacturer and selected module model. SSR Solar Power acts as an installer and system integrator. Please refer to the official manufacturer product datasheet provided during quotation for exact technical specifications.
              </span>
            </div>
          </MotionSection>

          {/* Section 7: Why SSR Solar Recommends */}
          <MotionSection animation="fadeUp" className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-card to-emerald-950/40 p-8 sm:p-10 border border-emerald-500/30 text-center space-y-5 shadow-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1 text-xs font-bold text-emerald-400">
              <Award className="h-4 w-4" /> Professional System Integration
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Why Work With SSR Solar Power?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              SSR Solar Power provides end-to-end solar engineering, site survey, module selection, structure mounting, DISCOM net-metering paperwork, and long-term local service support across Uttar Pradesh.
            </p>
            <div className="pt-2">
              <Button
                onClick={openFreeQuoteModal}
                className="btn-premium rounded-full bg-gradient-brand px-8 h-13 text-sm font-bold text-primary-foreground shadow-glow"
              >
                Request Custom Solar Panel Quote <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </MotionSection>

        </div>
      </section>
    </Layout>
  );
};

export default SolarPanelsDetail;
