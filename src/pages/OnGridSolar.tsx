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
  CheckCircle2,
  Cpu,
  FileText,
  Gauge,
  Grid,
  Landmark,
  Layers,
  PiggyBank,
  ShieldCheck,
  Sun,
  Wrench,
  XCircle,
  Zap,
} from "lucide-react";

import onGridSolarSystem from "@/assets/on-grid-solar-system.png";
import onGridSolarInfographic from "@/assets/on-grid-solar-infographic.png";

import { SolarQuoteForm } from "@/components/sections/SolarQuoteForm";

export const OnGridSolar = () => (
  <Layout>
    <Seo
      title="On-Grid Solar Systems | Net Metering & Government Subsidy | SSR Solar Power"
      description="Learn about On-Grid Rooftop Solar Power Systems from SSR Solar Power. Complete guide to grid-tied solar, net metering, PM Surya Ghar subsidy up to ₹1,08,000, components, and ROI."
      path="/solar-solutions/on-grid"
    />

    <PageHero
      eyebrow="Solar Solutions"
      title="On-Grid Solar Power Systems"
      description="Maximise electricity bill savings with grid-tied rooftop solar technology. Feed excess generation back into the utility grid via bidirectional net metering and claim government subsidies up to ₹1,08,000."
      image={onGridSolarSystem}
      rightContent={<SolarQuoteForm defaultSystemType="On-Grid" standalone={false} />}
    >
      <div className="flex flex-wrap gap-4">
        <Button asChild className="btn-premium rounded-full bg-gradient-brand px-7 font-semibold text-primary-foreground shadow-glow">
          <Link to="/calculator">Calculate Your Savings <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    </PageHero>

    {/* 1. What is On-Grid Solar? */}
    <MotionSection animation="fadeUp" className="section">
      <div className="container-wide grid items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="eyebrow">System Architecture</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            What is an <span className="text-gradient">On-Grid Solar System</span>?
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            An On-Grid (or Grid-Tied) Solar System is directly synchronized with your local state electricity discom grid. It converts sunlight into 230V/415V AC power to meet your active building load during daylight hours.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            When your solar array produces more electricity than your premises requires, the surplus energy is automatically exported to the utility grid. Your bidirectional net meter records exported units against imported units, drastically reducing your monthly power bill by up to 90%.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border bg-card p-4 shadow-soft">
              <p className="text-2xl font-bold text-primary">Up to 90%</p>
              <p className="text-xs text-muted-foreground">Monthly Bill Reduction</p>
            </div>
            <div className="rounded-2xl border bg-card p-4 shadow-soft">
              <p className="text-2xl font-bold text-emerald-600">₹1,08,000</p>
              <p className="text-xs text-muted-foreground">Max Combined Subsidy</p>
            </div>
          </div>
        </div>
        <div className="relative rounded-3xl overflow-hidden border shadow-card bg-card p-1.5">
          <img
            src={onGridSolarInfographic}
            alt="On-Grid Solar Power Systems Infographic by SSR Solar Power"
            className="w-full h-auto object-cover rounded-2xl"
          />
        </div>
      </div>
    </MotionSection>

    {/* 2. How it Works */}
    <MotionSection animation="fadeUp" className="section bg-gradient-soft">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Operating Principle"
          title={<>How <span className="text-gradient">On-Grid Solar</span> Works</>}
          description="A seamless, fully automated 4-step energy cycle synchronised with the utility grid."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "01",
              title: "Sunlight Harvesting",
              icon: Sun,
              text: "Tier-1 Mono PERC / TOPCon solar panels capture solar irradiance and generate Direct Current (DC) electricity.",
            },
            {
              step: "02",
              title: "Grid Inversion",
              icon: Cpu,
              text: "High-efficiency grid-tied inverter transforms DC power into grid-synchronised Alternating Current (AC).",
            },
            {
              step: "03",
              title: "Load Consumption",
              icon: Zap,
              text: "Solar AC electricity powers your active home or commercial appliances first, cutting grid usage in real-time.",
            },
            {
              step: "04",
              title: "Net Meter Export",
              icon: Grid,
              text: "Unused surplus solar units flow back into the DISCOM grid, generating billing credits on your monthly power statement.",
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

    {/* 3. Main Components */}
    <MotionSection animation="fadeUp" className="section">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Engineering Integrity"
          title={<>Main System <span className="text-gradient">Components</span></>}
          description="SSR Solar Power uses Tier-1 IEC & BIS certified components engineered for 25+ years of reliable outdoor operation."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Tier-1 Solar PV Modules",
              desc: "Mono PERC & TOPCon half-cut solar panels with 21.5%+ cell efficiency and 25-year performance warranty.",
              icon: Layers,
            },
            {
              title: "Grid-Tied String Inverter",
              desc: "98.5%+ MPPT efficiency inverters with integrated Wi-Fi / RS485 monitoring and anti-islanding safety features.",
              icon: Cpu,
            },
            {
              title: "Bi-Directional Net Meter",
              desc: "DISCOM-approved smart energy meter that tracks imported units, exported units, and net energy balance.",
              icon: Gauge,
            },
            {
              title: "Protection Enclosures (ACDB/DCDB)",
              desc: "IP65 weatherproof distribution boxes equipped with Type-II Surge Protection Devices (SPD) and MCBs.",
              icon: ShieldCheck,
            },
            {
              title: "Galvanised Mounting Structures",
              desc: "Hot-dip galvanised iron / aluminum structures designed to withstand wind speeds up to 150 km/h.",
              icon: Wrench,
            },
            {
              title: "Chemical Earthing & LA",
              desc: "Dedicated copper-bonded chemical earthing pits and lightning arresters for complete electrical surge protection.",
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
          eyebrow="Evaluation Matrix"
          title={<>Benefits & <span className="text-gradient">Limitations</span></>}
          description="Understand the financial and operational trade-offs of On-Grid Solar Systems."
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
                <span><strong className="text-foreground">Highest ROI & Lowest Cost:</strong> No expensive battery storage bank required, making it the most cost-effective solar system.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span><strong className="text-foreground">Government Subsidies Eligible:</strong> Full eligibility under PM Surya Ghar Muft Bijli Yojana & UP State Subsidy (up to ₹1,08,000 combined).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span><strong className="text-foreground">Up to 90% Bill Reduction:</strong> Net metering allows banking excess power during day to offset nighttime electricity consumption.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span><strong className="text-foreground">Zero Battery Maintenance:</strong> Low maintenance overhead as there are no chemical batteries to monitor or replace.</span>
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
                <span><strong className="text-foreground">Grid Dependency:</strong> Must be connected to a functional utility grid to operate.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <span><strong className="text-foreground">Anti-Islanding Safety Shutdown:</strong> Automatically powers off during grid power cuts to protect utility linemen working on power lines.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <span><strong className="text-foreground">No Direct Night Power:</strong> Does not store power locally; relies on grid power at night via net-metered energy credits.</span>
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
          eyebrow="Target Applications"
          title={<>Who Should Choose <span className="text-gradient">On-Grid Solar</span>?</>}
          description="Ideal candidates and typical installation profiles for maximum financial savings."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border bg-card p-6 shadow-soft space-y-3">
            <PiggyBank className="h-8 w-8 text-primary" />
            <h3 className="text-lg font-bold">Urban Homeowners</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Residential homes with steady grid power wanting to eliminate 80-90% of electricity bills while leveraging PM Surya Ghar subsidies.
            </p>
          </div>
          <div className="rounded-3xl border bg-card p-6 shadow-soft space-y-3">
            <Landmark className="h-8 w-8 text-emerald-600" />
            <h3 className="text-lg font-bold">Commercial Complexes</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Offices, schools, hospitals, and hotels operating predominantly during daylight hours to offset high commercial tariffs.
            </p>
          </div>
          <div className="rounded-3xl border bg-card p-6 shadow-soft space-y-3">
            <Wrench className="h-8 w-8 text-sky-600" />
            <h3 className="text-lg font-bold">Institutions &amp; Showrooms</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Educational institutions, retail showrooms, and commercial facilities using high daytime electricity loads to maximize ROI.
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
          title={<>On-Grid Solar <span className="text-gradient">FAQs</span></>}
        />

        <div className="mt-10">
          <Accordion type="single" collapsible className="w-full space-y-3">
            <AccordionItem value="item-1" className="rounded-2xl border bg-card px-5">
              <AccordionTrigger className="text-base font-semibold">How does net metering work in Uttar Pradesh?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                A bidirectional net meter is installed by UPVCNL/DISCOM. It records both the units of electricity you consume from the grid and the excess solar units exported. At the end of the billing cycle, you are only billed for the net difference (Imported Units minus Exported Units).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="rounded-2xl border bg-card px-5">
              <AccordionTrigger className="text-base font-semibold">What is the government subsidy for On-Grid solar?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                For residential consumers in UP: Central Government (PM Surya Ghar) provides ₹30,000 for 1 kW, ₹60,000 for 2 kW, and ₹78,000 for 3 kW+. UP State Government provides ₹15,000 per kW up to ₹30,000 max. Combined maximum subsidy is ₹1,08,000.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="rounded-2xl border bg-card px-5">
              <AccordionTrigger className="text-base font-semibold">What is the payback period for an On-Grid system?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                With government subsidies factored in, typical residential on-grid solar systems achieve full capital payback in 3.0 to 4.0 years. After payback, energy generated is virtually free for the remaining 20+ years of panel life.
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>
      </div>
    </MotionSection>
  </Layout>
);

export default OnGridSolar;
