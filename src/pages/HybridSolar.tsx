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
  Landmark,
  Sparkles,
} from "lucide-react";

import hybridSolarSystem from "@/assets/off-grid-solar-system.png";
import hybridSolarInfographic from "@/assets/hybrid-solar-infographic.png";
import { SolarQuoteForm } from "@/components/sections/SolarQuoteForm";

export const HybridSolar = () => (
  <Layout>
    <Seo
      title="Hybrid Solar Systems | PM Surya Ghar Subsidy + Battery Backup + Net Metering | SSR Solar Power"
      description="Discover Hybrid Solar Power Systems from SSR Solar Power. Enjoy up to 90% electricity bill savings with DISCOM Net Metering under PM Surya Ghar Yojana + 24x7 battery backup during power cuts."
      path="/solar-solutions/hybrid"
    />

    <PageHero
      eyebrow="PM Surya Ghar Approved Solution"
      title="Hybrid Solar Power Systems"
      description="The ultimate solar solution combining DISCOM net-metering grid connection for up to 90% electricity bill savings + intelligent battery storage for 24x7 uninterrupted power backup during grid outages."
      image={hybridSolarSystem}
      rightContent={<SolarQuoteForm defaultSystemType="Hybrid" standalone={false} />}
    >
      <div className="flex flex-wrap gap-4">
        <Button asChild className="btn-premium rounded-full bg-gradient-brand px-7 font-semibold text-primary-foreground shadow-glow">
          <Link to="/calculator">Calculate Hybrid Savings <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 px-6 font-semibold">
          <Link to="/subsidy">
            <Landmark className="mr-2 h-4 w-4 text-amber-500" /> Check PM Surya Ghar Subsidy
          </Link>
        </Button>
      </div>
    </PageHero>

    {/* 1. What is a Hybrid Solar System? */}
    <MotionSection animation="fadeUp" className="section">
      <div className="container-wide grid items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="eyebrow">Best of Both Worlds</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            What is a <span className="text-gradient">Hybrid Solar System</span>?
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            A <strong>Hybrid Solar System</strong> merges the net-metering bill savings of On-Grid solar with the 24x7 battery backup security of Off-Grid solar. It connects directly to your local DISCOM utility grid while seamlessly managing a dedicated solar battery bank.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Under the Government's <strong>PM Surya Ghar: Muft Bijli Yojana</strong>, hybrid solar installations qualify for direct benefit transfer (DBT) subsidies of up to <strong>₹78,000</strong>. During normal hours, solar energy powers your home, charges your batteries, and exports surplus electricity to the DISCOM grid for net metering credits. When grid power fails, the hybrid inverter instantly switches to battery power in less than 10 milliseconds.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border bg-card p-3.5 text-center shadow-soft">
              <p className="text-xl font-extrabold text-amber-500">₹78,000</p>
              <p className="text-[11px] text-muted-foreground font-medium">PM Surya Ghar Subsidy</p>
            </div>
            <div className="rounded-2xl border bg-card p-3.5 text-center shadow-soft">
              <p className="text-xl font-extrabold text-primary">24×7</p>
              <p className="text-[11px] text-muted-foreground font-medium">Zero-Flicker Backup</p>
            </div>
            <div className="rounded-2xl border bg-card p-3.5 text-center shadow-soft">
              <p className="text-xl font-extrabold text-emerald-600">Up to 90%</p>
              <p className="text-[11px] text-muted-foreground font-medium">Bill Savings</p>
            </div>
          </div>
        </div>
        <div className="relative rounded-3xl overflow-hidden border shadow-card bg-card p-1.5">
          <img
            src={hybridSolarInfographic}
            alt="Hybrid Solar Power Systems Infographic by SSR Solar Power"
            className="w-full h-auto object-cover rounded-2xl"
          />
        </div>
      </div>
    </MotionSection>

    {/* 2. PM Surya Ghar Subsidy Highlights Banner */}
    <MotionSection animation="fadeUp" className="section py-10 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-primary/10 border-y border-amber-500/20">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-500">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-500">
                <Sparkles className="h-3.5 w-3.5" /> PM Surya Ghar: Muft Bijli Yojana Approved
              </span>
              <h3 className="text-xl font-bold text-foreground mt-0.5">
                Avail Direct Benefit Transfer (DBT) Subsidy up to ₹78,000
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                SSR Solar Power is an empanelled DISCOM vendor. Get 100% assistance with portal registration, net metering approval, and subsidy disbursement.
              </p>
            </div>
          </div>
          <Button asChild className="btn-premium shrink-0 rounded-full bg-gradient-brand px-6 font-bold text-primary-foreground">
            <Link to="/subsidy">Learn PM Surya Ghar Subsidy Process <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </MotionSection>

    {/* 3. How Hybrid Solar Works */}
    <MotionSection animation="fadeUp" className="section bg-gradient-soft">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Smart Power Routing"
          title={<>How <span className="text-gradient">Hybrid Solar</span> Works</>}
          description="Intelligent 4-stage energy management prioritizing home loads, battery storage, net metering, and instant emergency backup."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "01",
              title: "Solar Generation",
              icon: Sun,
              text: "High-efficiency Tier-1 solar panels convert sunlight into DC power throughout the day.",
            },
            {
              step: "02",
              title: "Smart Hybrid Inverter",
              icon: Cpu,
              text: "Bi-directional hybrid inverter converts DC to AC, powering your home loads first.",
            },
            {
              step: "03",
              title: "Battery Storage & Net Metering",
              icon: BatteryCharging,
              text: "Excess energy charges solar batteries while surplus generation exports to the DISCOM grid for net meter credits.",
            },
            {
              step: "04",
              title: "Seamless Power Backup",
              icon: Home,
              text: "During grid outages, the hybrid system powers your appliances automatically without flickering.",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="calc-card-glow group relative transition-all duration-500"
            >
              <div className="calc-card-gradient-border relative flex flex-col h-full rounded-3xl bg-card p-6 shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-primary">{s.step}</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MotionSection>

    {/* 4. PM Surya Ghar Subsidy Structure */}
    <MotionSection animation="fadeUp" className="section">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Government Financial Support"
          title={<>PM Surya Ghar <span className="text-gradient">Subsidy Breakdown</span></>}
          description="Fixed central government subsidy credited directly to your bank account via Direct Benefit Transfer (DBT)."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="calc-card-glow group relative">
            <div className="calc-card-gradient-border relative rounded-3xl bg-card p-6 text-center space-y-3">
              <span className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">
                1 kW System Capacity
              </span>
              <p className="text-4xl font-extrabold text-foreground">₹30,000</p>
              <p className="text-xs text-muted-foreground">Fixed Central Government Subsidy</p>
              <p className="text-xs text-emerald-600 font-semibold pt-2 border-t">Ideal for small 1–2 BHK homes</p>
            </div>
          </div>

          <div className="calc-card-glow group relative">
            <div className="calc-card-gradient-border relative rounded-3xl bg-card p-6 text-center space-y-3 border-amber-500/40 shadow-glow">
              <span className="inline-block rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-500 uppercase tracking-wider">
                2 kW System Capacity
              </span>
              <p className="text-4xl font-extrabold text-amber-500">₹60,000</p>
              <p className="text-xs text-muted-foreground">Fixed Central Government Subsidy</p>
              <p className="text-xs text-amber-500 font-semibold pt-2 border-t">Most Popular for 2–3 BHK Independent Homes</p>
            </div>
          </div>

          <div className="calc-card-glow group relative">
            <div className="calc-card-gradient-border relative rounded-3xl bg-card p-6 text-center space-y-3">
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                3 kW+ System Capacity
              </span>
              <p className="text-4xl font-extrabold text-primary">₹78,000</p>
              <p className="text-xs text-muted-foreground">Maximum Eligible Central Subsidy</p>
              <p className="text-xs text-primary font-semibold pt-2 border-t">For 3+ BHK Villas, Heavy Loads & Air Conditioning</p>
            </div>
          </div>
        </div>
      </div>
    </MotionSection>

    {/* 5. Key System Components */}
    <MotionSection animation="fadeUp" className="section bg-gradient-soft">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Tier-1 Equipment"
          title={<>Hybrid System <span className="text-gradient">Key Components</span></>}
          description="Built with high-efficiency mono PERC panels, smart hybrid inverters, and long-life lithium/tubular solar batteries."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Sun,
              title: "Mono PERC / TopCon Panels",
              desc: "550W+ Half-Cut N-Type solar modules with 25-year performance warranty.",
            },
            {
              icon: Cpu,
              title: "Smart Bi-Directional Inverter",
              desc: "MPPT hybrid inverter managing DISCOM grid feed, home loads & battery charging simultaneously.",
            },
            {
              icon: BatteryCharging,
              title: "Lithium / Tubular Battery Bank",
              desc: "Deep-cycle solar batteries providing 5000+ cycles for long backup life.",
            },
            {
              icon: Zap,
              title: "DISCOM Net Meter & AC/DC Box",
              desc: "Bi-directional smart meter, SPD surge protection, and IP65 safety enclosures.",
            },
          ].map((c) => (
            <div key={c.title} className="calc-card-glow group relative">
              <div className="calc-card-gradient-border relative flex flex-col h-full rounded-3xl bg-card p-6 shadow-soft space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">{c.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MotionSection>

    {/* 6. System Comparison: Hybrid vs On-Grid */}
    <MotionSection animation="fadeUp" className="section">
      <div className="container-wide max-w-4xl">
        <SectionHeading
          eyebrow="Feature Comparison"
          title={<>Hybrid Solar vs <span className="text-gradient">On-Grid Solar</span></>}
          description="See why Hybrid Solar is the ultimate choice for uninterrupted power and maximum savings."
        />

        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-card/50">
                <th className="p-4 font-bold text-foreground">Feature</th>
                <th className="p-4 font-bold text-amber-500 bg-amber-500/10 rounded-t-xl">Hybrid Solar</th>
                <th className="p-4 font-bold text-primary">On-Grid Solar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="p-4 font-medium text-foreground">PM Surya Ghar Subsidy</td>
                <td className="p-4 font-bold text-amber-500 bg-amber-500/5">Eligible (Up to ₹78,000)</td>
                <td className="p-4 text-emerald-600 font-semibold">Eligible (Up to ₹78,000)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">Power Cut Backup</td>
                <td className="p-4 font-bold text-amber-500 bg-amber-500/5">24x7 Zero-Flicker Backup</td>
                <td className="p-4 text-rose-500 font-medium">Shuts down during grid cut</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">DISCOM Net Metering</td>
                <td className="p-4 font-bold text-amber-500 bg-amber-500/5">Yes (Export Surplus Power)</td>
                <td className="p-4 text-emerald-600 font-medium">Yes (Export Surplus Power)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">Electricity Bill Reduction</td>
                <td className="p-4 font-bold text-amber-500 bg-amber-500/5">Up to 90% Reduction</td>
                <td className="p-4 text-emerald-600 font-medium">Up to 90% Reduction</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </MotionSection>

    {/* 7. FAQs */}
    <MotionSection animation="fadeUp" className="section bg-gradient-soft">
      <div className="container-wide max-w-4xl">
        <SectionHeading
          eyebrow="Got Questions?"
          title={<>Hybrid Solar <span className="text-gradient">FAQs</span></>}
        />

        <div className="mt-10">
          <Accordion type="single" collapsible className="w-full space-y-3">
            <AccordionItem value="item-1" className="calc-card-gradient-border relative rounded-2xl bg-card px-5 border-none shadow-soft overflow-hidden">
              <AccordionTrigger className="text-base font-semibold">
                Is a Hybrid Solar system eligible for PM Surya Ghar Yojana subsidy?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                Yes! Hybrid solar systems connected to the DISCOM grid via bi-directional net metering are eligible for PM Surya Ghar: Muft Bijli Yojana Central Government Direct Benefit Transfer (DBT) subsidy of up to ₹78,000 for residential systems up to 3 kW+.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="calc-card-gradient-border relative rounded-2xl bg-card px-5 border-none shadow-soft overflow-hidden">
              <AccordionTrigger className="text-base font-semibold">
                What happens during a power cut with a Hybrid Solar system?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                When a grid power outage occurs, the hybrid inverter automatically isolates from the grid and switches to battery backup power in under 10 milliseconds. Your lights, fans, refrigerator, and connected appliances continue running without flickering.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="calc-card-gradient-border relative rounded-2xl bg-card px-5 border-none shadow-soft overflow-hidden">
              <AccordionTrigger className="text-base font-semibold">
                Can a Hybrid Solar system run air conditioners?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                Yes! Properly sized 3 kW to 5 kW+ hybrid solar systems equipped with lithium-ion solar batteries and smart hybrid inverters can run 1.5-ton inverter air conditioners smoothly during daytime and power cuts.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="calc-card-gradient-border relative rounded-2xl bg-card px-5 border-none shadow-soft overflow-hidden">
              <AccordionTrigger className="text-base font-semibold">
                How does net metering work with a Hybrid Solar system?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                During sunny hours, solar energy first powers your active home appliances. Once fully powering your home, excess energy charges your solar battery bank. Any additional surplus generation after battery charging is automatically exported to the DISCOM grid, earning net metering units on your monthly bill.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </MotionSection>
  </Layout>
);

export default HybridSolar;
