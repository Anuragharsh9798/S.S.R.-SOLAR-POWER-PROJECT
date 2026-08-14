import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { MotionSection } from "@/components/motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  Cpu,
  Home,
  Layers,
  ShieldCheck,
  Sun,
  Wrench,
  XCircle,
  Zap,
} from "lucide-react";

import offGridSolarSystem from "@/assets/off-grid-solar-system.png";
import { SolarQuoteForm } from "@/components/sections/SolarQuoteForm";

export const OffGridSolar = () => (
  <Layout>
    <Seo
      title="Off-Grid Solar Systems | Battery Storage & 24x7 Power Backup | SSR Solar Power"
      description="Discover Off-Grid Solar Power Systems from SSR Solar Power. Independent solar energy solutions with battery storage for 24x7 uninterrupted power in outage-prone and remote areas."
      path="/solar-solutions/off-grid"
    />

    <PageHero
      eyebrow="Solar Solutions"
      title="Off-Grid Solar Power Systems"
      description="Achieve 100% power independence with autonomous rooftop solar generation and heavy-duty battery storage. Enjoy continuous 24x7 electricity backup during power cuts and transformer outages without grid dependency."
      image={offGridSolarSystem}
      rightContent={<SolarQuoteForm defaultSystemType="Off-Grid" standalone={false} />}
    >
      <div className="flex flex-wrap gap-4">
        <Button asChild className="btn-premium rounded-full bg-gradient-brand px-7 font-semibold text-primary-foreground shadow-glow">
          <Link to="/calculator">Calculate Your Savings <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    </PageHero>

    {/* 1. What is Off-Grid Solar? */}
    <MotionSection animation="fadeUp" className="section">
      <div className="container-wide grid items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="eyebrow">Autonomous Energy</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            What is an <span className="text-gradient">Off-Grid Solar System</span>?
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            An Off-Grid Solar System operates completely independently of the utility grid. It combines solar panels, an MPPT charge controller, a solar inverter, and a deep-cycle battery bank to generate, store, and manage your electricity locally.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            During daylight hours, solar power runs your connected home or business appliances while simultaneously charging the solar battery bank. During power cuts, rain, or night hours, the energy stored in the batteries provides continuous power backup automatically.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border bg-card p-4 shadow-soft">
              <p className="text-2xl font-bold text-primary">100%</p>
              <p className="text-xs text-muted-foreground">Power Independence</p>
            </div>
            <div className="rounded-2xl border bg-card p-4 shadow-soft">
              <p className="text-2xl font-bold text-emerald-600">24×7</p>
              <p className="text-xs text-muted-foreground">Continuous Power Backup</p>
            </div>
          </div>
        </div>
        <div className="relative rounded-3xl overflow-hidden border shadow-card aspect-[4/3]">
          <img
            src={offGridSolarSystem}
            alt="Off-Grid Solar System Installation by SSR Solar Power"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </MotionSection>

    {/* 2. How Off-Grid Solar Works */}
    <MotionSection animation="fadeUp" className="section bg-gradient-soft">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Operating Principle"
          title={<>How <span className="text-gradient">Off-Grid Solar</span> Works</>}
          description="A self-contained energy system storing sunlight in batteries for 24-hour availability."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "01",
              title: "Solar Panel Capture",
              icon: Sun,
              text: "Solar panels harvest solar energy and supply DC power directly to the MPPT charge controller.",
            },
            {
              step: "02",
              title: "Battery Storage Charging",
              icon: BatteryCharging,
              text: "The MPPT controller regulates voltage and efficiently stores surplus energy into high-capacity solar batteries.",
            },
            {
              step: "03",
              title: "Inverter Conversion",
              icon: Cpu,
              text: "The off-grid/hybrid solar inverter converts stored DC battery power into clean 230V AC electricity.",
            },
            {
              step: "04",
              title: "24x7 Power Backup",
              icon: Zap,
              text: "Supplies uninterrupted electricity to your connected electrical loads day and night regardless of grid outages.",
            },
          ].map((item) => (
            <div key={item.step} className="calc-card-glow group relative transition-all duration-500">
              <div className="calc-card-gradient-border relative flex flex-col justify-between h-full rounded-3xl bg-card p-6 shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-2xl font-bold text-muted-foreground/40">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MotionSection>

    {/* 3. Main System Components */}
    <MotionSection animation="fadeUp" className="section">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Hardware Excellence"
          title={<>Main System <span className="text-gradient">Components</span></>}
          description="Engineered with heavy-duty solar batteries and MPPT hybrid inverters for long service life."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "High-Efficiency Solar Modules",
              desc: "Tier-1 Mono PERC modules engineered for maximum generation even during low sun conditions.",
              icon: Layers,
            },
            {
              title: "Solar Battery Bank",
              desc: "Lithium Ferro Phosphate (LFP) or Deep-Cycle C10 Tubular batteries engineered for 2500+ charge cycles.",
              icon: BatteryCharging,
            },
            {
              title: "MPPT Hybrid / Off-Grid Inverter",
              desc: "Pure sine wave inverter with built-in MPPT controller, battery management system (BMS), and overload protection.",
              icon: Cpu,
            },
            {
              title: "DC & AC Disconnect Switches",
              desc: "Heavy-duty isolators, battery fuses, and circuit breakers for safe manual isolation and short-circuit protection.",
              icon: ShieldCheck,
            },
            {
              title: "High-Wind Rooftop Structures",
              desc: "Corrosion-resistant galvanised steel structures custom-fitted to flat RCC roofs, tiled roofs, or ground mounts.",
              icon: Wrench,
            },
            {
              title: "Surge Protection & Earthing",
              desc: "Copper-bonded chemical earthing pits and lightning arresters safeguarding sensitive appliances from voltage spikes.",
              icon: Zap,
            },
          ].map((comp) => (
            <div key={comp.title} className="rounded-3xl border bg-card p-6 shadow-soft space-y-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <comp.icon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold">{comp.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{comp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </MotionSection>

    {/* 4. Benefits vs Limitations */}
    <MotionSection animation="fadeUp" className="section bg-gradient-soft">
      <div className="container-wide">
        <SectionHeading
          eyebrow="System Evaluation"
          title={<>Benefits & <span className="text-gradient">Limitations</span></>}
          description="Evaluate the operational benefits and investment considerations of Off-Grid Solar."
        />

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {/* Benefits */}
          <div className="rounded-3xl border border-emerald-500/20 bg-card p-7 shadow-soft space-y-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              <h3 className="text-xl font-bold text-foreground">Key Advantages</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span><strong className="text-foreground">100% Power Independence:</strong> Complete freedom from utility grid power cuts, voltage fluctuations, and discom outages.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span><strong className="text-foreground">24x7 Uninterrupted Supply:</strong> Stores energy locally to power lights, fans, refrigerators, and TVs throughout night and blackout periods.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span><strong className="text-foreground">Ideal for Remote Locations:</strong> Perfect for un-electrified regions, farms, and locations where discom line extension is unfeasible.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span><strong className="text-foreground">Zero Monthly Electricity Bills:</strong> Operates entirely on free solar energy stored in your local battery bank.</span>
              </li>
            </ul>
          </div>

          {/* Limitations */}
          <div className="rounded-3xl border border-amber-500/20 bg-card p-7 shadow-soft space-y-5">
            <div className="flex items-center gap-3">
              <XCircle className="h-6 w-6 text-amber-600" />
              <h3 className="text-xl font-bold text-foreground">System Limitations</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <span><strong className="text-foreground">Higher Capital Cost:</strong> Initial investment is higher due to the cost of the solar battery storage bank.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <span><strong className="text-foreground">Battery Replacement Cycle:</strong> Batteries require replacement after their rated lifespan (5-7 years for Lead-Acid, 10-12 years for Lithium-ion).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <span><strong className="text-foreground">No Net-Metering Subsidies:</strong> Standard grid-connected government subsidy schemes (PM Surya Ghar) generally apply to grid-tied systems.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </MotionSection>

    {/* 5. Who Should Choose & Use Cases */}
    <MotionSection animation="fadeUp" className="section">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Recommended Users"
          title={<>Who Should Choose <span className="text-gradient">Off-Grid Solar</span>?</>}
          description="Best application scenarios where energy independence is paramount."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border bg-card p-6 shadow-soft space-y-3">
            <Home className="h-8 w-8 text-primary" />
            <h3 className="text-lg font-bold">Outage-Prone Homes</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Residential properties experiencing 3+ hours of daily power cuts or frequent night load shedding.
            </p>
          </div>
          <div className="rounded-3xl border bg-card p-6 shadow-soft space-y-3">
            <Wrench className="h-8 w-8 text-emerald-600" />
            <h3 className="text-lg font-bold">Remote Farmhouses</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Rural estates, agricultural pump houses, and resorts where grid lines are unreliable or non-existent.
            </p>
          </div>
          <div className="rounded-3xl border bg-card p-6 shadow-soft space-y-3">
            <Zap className="h-8 w-8 text-sky-600" />
            <h3 className="text-lg font-bold">Critical Commercial Load</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Petrol pumps, cold storage units, and rural health clinics requiring 100% uptime for critical electronics.
            </p>
          </div>
        </div>
      </div>
    </MotionSection>

    {/* 6. FAQs */}
    <MotionSection animation="fadeUp" className="section bg-gradient-soft">
      <div className="container-wide max-w-4xl">
        <SectionHeading
          eyebrow="Common Questions"
          title={<>Off-Grid Solar <span className="text-gradient">FAQs</span></>}
        />

        <div className="mt-10">
          <Accordion type="single" collapsible className="w-full space-y-3">
            <AccordionItem value="item-1" className="rounded-2xl border bg-card px-5">
              <AccordionTrigger className="text-base font-semibold">How long do solar batteries last?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                Tubular C10 solar batteries typically last 4 to 6 years under normal usage. Modern Lithium Ferro Phosphate (LFP) solar batteries last 10 to 12 years with 2500+ cycle life.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="rounded-2xl border bg-card px-5">
              <AccordionTrigger className="text-base font-semibold">Can an off-grid solar system run air conditioners?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                Yes, properly sized 5 kW+ off-grid systems equipped with MPPT hybrid inverters and high-capacity battery storage can power 1.5-ton inverter air conditioners smoothly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="rounded-2xl border bg-card px-5">
              <AccordionTrigger className="text-base font-semibold">What is the difference between On-Grid and Off-Grid solar?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                On-grid solar connects to the utility grid with net metering for maximum financial savings but requires grid presence. Off-grid solar uses batteries to operate independently, providing 24x7 backup during power cuts.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </MotionSection>
  </Layout>
);

export default OffGridSolar;
