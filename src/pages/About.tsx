import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { StatsSection } from "@/components/sections/Stats";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { SectionHeading } from "@/components/SectionHeading";
import { MotionSection } from "@/components/motion";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Heart,
  Target,
  Users,
  BarChart3,
  Compass,
  Cpu,
  FileText,
  Wrench,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  LifeBuoy,
  Home,
  Building2,
  Layers,
  Maximize2,
  Zap,
  ArrowRight,
  Ruler,
  FileCheck,
  Sparkles,
  PhoneCall,
} from "lucide-react";
import { company } from "@/data/site";

const pillars = [
  { icon: Target, title: "Our Mission", text: "Make clean, affordable solar energy the default choice for every Indian home and business." },
  { icon: Eye, title: "Our Vision", text: "Power one gigawatt of rooftops by 2032 without compromising on engineering quality." },
  { icon: Heart, title: "Our Values", text: "Transparent pricing, honest sizing, no hidden costs and service that outlives the warranty." },
];

// 1. Our Approach Data
const approachSteps = [
  {
    step: "01",
    icon: Users,
    title: "Customer-Focused Solar Planning",
    description: "Every property and homeowner is unique. We begin by understanding your exact energy requirements, future appliance additions, and budget before proposing a system.",
  },
  {
    step: "02",
    icon: BarChart3,
    title: "Understanding Actual Electricity Usage",
    description: "We review your past 6–12 months of electricity bills to analyse seasonal peak units, daytime vs night-time consumption, and sanctioned load parameters.",
  },
  {
    step: "03",
    icon: Compass,
    title: "Rooftop & Site Assessment",
    description: "Our engineers inspect roof orientation, structural strength, tilt angles, and adjacent shading factors to ensure optimal sun exposure throughout the year.",
  },
  {
    step: "04",
    icon: Cpu,
    title: "Proper System Sizing",
    description: "We calculate precise system capacity to balance maximum bill savings and high self-consumption, preventing costly oversizing or underpowered plants.",
  },
  {
    step: "05",
    icon: FileText,
    title: "Clear Project Guidance",
    description: "From component specifications and warranties to expected generation and subsidy eligibility, we explain every detail in clear, jargon-free language.",
  },
];

// 2. What We Focus On Data
const focusAreas = [
  {
    icon: Home,
    tag: "Homes & Villas",
    title: "Residential Solar",
    description: "Tailored rooftop solar power installations for independent houses and villas, designed to drastically reduce monthly electricity bills while protecting roof integrity.",
  },
  {
    icon: Building2,
    tag: "Businesses & Institutions",
    title: "Commercial Solar",
    description: "High-yield solar plants for shops, schools, hospitals, and commercial buildings that offset expensive commercial tariff slabs during peak daytime hours.",
  },
  {
    icon: Layers,
    tag: "Grid-Tied & Storage Backup",
    title: "On-Grid & Hybrid Solutions",
    description: "Net-metered on-grid setups for maximum financial savings, alongside hybrid battery configurations for areas requiring uninterrupted power backup.",
  },
  {
    icon: Maximize2,
    tag: "Space & Access Planning",
    title: "Efficient Rooftop Utilization",
    description: "Smart layout designs that maximize sunlight capture while preserving safe rooftop walkway space, water tank access, and ease of routine panel cleaning.",
  },
  {
    icon: ShieldCheck,
    tag: "Reliability & Safety",
    title: "Long-Term System Performance",
    description: "Heavy-duty corrosion-resistant mounting structures, weather-proof DC cabling, certified surge protection, and tier-1 inverters engineered for 25+ years.",
  },
];

// 3. Why Choose SSR Solar Power Data
const whyChooseItems = [
  {
    icon: Wrench,
    title: "Quality Installation",
    description: "Precision mounting, dual-grounding earthing pits, weather-sealed conduits, and strict adherence to electrical safety codes ensure your plant operates safely.",
  },
  {
    icon: Ruler,
    title: "Practical Solar System Design",
    description: "System engineering based on actual local irradiance data and roof dynamics, guaranteeing realistic generation figures rather than inflated sales claims.",
  },
  {
    icon: MessageSquare,
    title: "Transparent Communication",
    description: "Itemized quotes, zero hidden charges, honest component datasheets, and clear timelines for approval, delivery, and commissioning.",
  },
  {
    icon: CheckCircle2,
    title: "Installation Support",
    description: "Dedicated project engineers manage material handling, on-site installation, safety checks, and liaison for DISCOM net metering coordination.",
  },
  {
    icon: LifeBuoy,
    title: "Post-Installation Assistance",
    description: "Continuous customer support, mobile app monitoring assistance, proactive maintenance guidance, and responsive assistance whenever you have questions.",
  },
];

// 4. Our Solar Installation Process Data
const processSteps = [
  {
    step: "01",
    icon: Compass,
    title: "Site Assessment",
    subtitle: "Rooftop & Load Evaluation",
    description: "We physically survey your rooftop, analyze shading profiles, verify roof load-bearing strength, and inspect the electrical distribution panel.",
  },
  {
    step: "02",
    icon: Ruler,
    title: "System Design",
    subtitle: "Custom Array & String Layout",
    description: "Our technical team designs a customized solar layout with optimal tilt angle, string sizing, and inverter capacity matched to your energy needs.",
  },
  {
    step: "03",
    icon: Wrench,
    title: "Installation",
    subtitle: "Precision Mechanical & Electrical Setup",
    description: "Technicians securely mount the galvanized structure, install tier-1 solar modules, route UV-resistant DC cabling, and mount the solar inverter.",
  },
  {
    step: "04",
    icon: FileCheck,
    title: "Electrical & Grid Coordination",
    subtitle: "DISCOM & Net Metering Liaison",
    description: "We assist with the paperwork and technical compliance needed for DISCOM inspection, bidirectional meter setup, and subsidy portal synchronization.",
  },
  {
    step: "05",
    icon: Zap,
    title: "System Commissioning",
    subtitle: "Safety Checks & Plant Activation",
    description: "We carry out comprehensive voltage, polarity, earthing, and insulation tests to ensure the system is fully safe before powering it on.",
  },
  {
    step: "06",
    icon: LifeBuoy,
    title: "After-Installation Support",
    subtitle: "Monitoring Setup & Ongoing Care",
    description: "We configure your smartphone generation tracking app, provide routine maintenance tips, and remain available for any long-term service assistance.",
  },
];

const About = () => (
  <Layout>
    <Seo
      title="About SSR Solar Power | Certified Solar EPC Since 2016"
      description="Meet SSR Solar Power — MNRE-empanelled engineers who have delivered 1000+ solar installations and 100 KW+ of clean capacity across India."
      path="/about"
    />
    <PageHero
      eyebrow="About Us"
      title="A decade of building solar people can rely on"
      className="pb-10 md:pb-14"
      description={
        <>
          <p>
            SSR Solar Power delivers dependable rooftop solar energy solutions for residential homes and commercial establishments across Uttar Pradesh. We prioritize customer-focused planning, beginning with a detailed rooftop and site assessment to evaluate actual electricity usage, structural conditions, and long-term energy goals.
          </p>
          <p>
            By focusing on proper solar system sizing, quality installation practices, and clear guidance throughout the process, we ensure every setup operates safely and efficiently. From initial project planning to responsive post-installation support, our team is committed to making your transition to clean solar power seamless and dependable.
          </p>
        </>
      }
    />

    {/* Existing Our Story Section */}
    <section className="section pt-0 pb-10 md:pb-14">
      <div className="container-wide grid gap-10 lg:grid-cols-2 lg:items-center">
        <motion.img
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=1200&q=80"
          alt="SSR Solar Power engineers installing rooftop solar modules"
          loading="lazy"
          className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-card"
        />
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow">Our Story</span>
          <h2 className="mt-4 text-3xl leading-tight md:text-4xl">Built around every rooftop, not just every panel</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            SSR Solar Power was built with a simple approach: every solar installation should be planned around the customer’s actual energy needs, rooftop conditions and local requirements. From residential rooftops to larger commercial systems across Uttar Pradesh, we focus on practical system design, careful installation and dependable support throughout the project.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            We believe a good solar experience is not only about choosing the right panels—it is about proper sizing, quality installation, clear guidance and support after the system goes live.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {pillars.map(({ icon: Icon, title, text }) => (
              <div key={title} className="group about-card-glow relative transition-all duration-500">
                <div className="relative h-full w-full overflow-hidden rounded-2xl p-5 transition-all duration-500 about-card-gradient-border">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-3 text-sm font-semibold">{title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* Key Stats Counter */}
    <StatsSection className="py-8 md:py-12" />

    {/* 1. Our Approach */}
    <MotionSection animation="fadeUp" className="section py-10 md:py-14 bg-surface/50">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Our Approach"
          title={<>Engineering Designed Around Your <span className="text-gradient">Actual Energy Needs</span></>}
          description="A dependable solar installation begins with accurate planning, not assumptions. Here is how we ensure every solar plant delivers consistent, real-world generation."
        />

        <div className="mt-8 md:mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {approachSteps.map(({ step, icon: Icon, title, description }, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group feature-card-glow relative transition-all duration-500 ${
                i === 4 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-6 md:p-7 transition-all duration-500 feature-card-gradient-border">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-brand opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20" aria-hidden />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow transition-transform duration-500 group-hover:scale-105">
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </span>
                    <span className="font-display text-2xl font-bold text-primary/40 group-hover:text-primary transition-colors">
                      {step}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </MotionSection>

    {/* 2. What We Focus On */}
    <MotionSection animation="fadeUp" className="section py-10 md:py-14">
      <div className="container-wide">
        <SectionHeading
          eyebrow="What We Focus On"
          title={<>Specialized Solutions for <span className="text-gradient">Every Rooftop & Energy Goal</span></>}
          description="Whether for a private residence or a commercial facility, we engineer durable solar systems that deliver reliable, measurable value."
        />

        <div className="mt-8 md:mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {focusAreas.map(({ icon: Icon, tag, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group about-card-glow relative transition-all duration-500 ${
                i === 4 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-6 md:p-7 transition-all duration-500 about-card-gradient-border">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-gradient-brand group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-foreground/80 dark:text-secondary">
                      {tag}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </MotionSection>

    {/* 3. Why Choose SSR Solar Power */}
    <MotionSection animation="fadeUp" className="section py-10 md:py-14 bg-gradient-soft">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Why Choose SSR Solar Power"
          title={<>Built on <span className="text-gradient">Quality, Transparency & Practical Engineering</span></>}
          description="We prioritize safety, durability, and honest communication at every phase of your solar installation."
        />

        <div className="mt-8 md:mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {whyChooseItems.map(({ icon: Icon, title, description }, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group feature-card-glow relative transition-all duration-500 ${
                i === 4 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-6 md:p-7 transition-all duration-500 feature-card-gradient-border">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-brand opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-25" aria-hidden />
                <div>
                  <span className="btn-premium flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow transition-transform duration-500 group-hover:scale-110">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </MotionSection>

    {/* 4. Our Solar Installation Process */}
    <MotionSection animation="fadeUp" className="section py-10 md:py-14">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Our Installation Process"
          title={<>A Transparent, <span className="text-gradient">6-Step Pathway</span> to Solar</>}
          description="From our initial rooftop survey to system activation and ongoing support, every stage is executed with clarity, care, and precision."
        />

        <div className="mt-8 md:mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {processSteps.map(({ step, icon: Icon, title, subtitle, description }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group timeline-card-glow relative transition-all duration-500"
            >
              <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-6 md:p-7 transition-all duration-500 timeline-card-gradient-border">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow text-primary-foreground transition-transform duration-500 group-hover:scale-105">
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </span>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                      Step {step}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {subtitle}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </MotionSection>

    {/* 5. Customer Commitment */}
    <MotionSection animation="fadeUp" className="section py-10 md:py-14 bg-surface/50">
      <div className="container-wide">
        <div className="relative overflow-hidden rounded-[2.5rem] border bg-card p-6 sm:p-8 md:p-10 lg:p-12 shadow-card">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" aria-hidden />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" aria-hidden />

          <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span className="eyebrow">Customer Commitment</span>
              <h2 className="mt-3.5 text-3xl font-bold leading-tight text-foreground md:text-4xl">
                Your Dependable Partner at Every Step of the <span className="text-gradient">Solar Journey</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                At SSR Solar Power, we view solar as a 25-year relationship. We understand that investing in rooftop solar is an important decision for your home or business. That is why our commitment is simple: no confusing technical jargon, no exaggerated generation claims, and no shortcuts on electrical safety.
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                From the moment we assess your roof to years after your plant is operational, we remain accessible, transparent, and dedicated to delivering solar energy you can truly rely on.
              </p>

              <div className="mt-6 flex flex-wrap gap-3.5">
                <Button asChild className="btn-premium rounded-full bg-gradient-brand px-7 font-semibold text-primary-foreground shadow-glow">
                  <Link to="/calculator">
                    Calculate Solar Sizing <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full px-7 font-semibold">
                  <Link to="/contact">Speak with Our Team</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-3.5 lg:col-span-5">
              {[
                {
                  title: "Clear & Honest Guidance",
                  text: "We recommend only the capacity you genuinely need, with straightforward advice on expected savings and system choices.",
                },
                {
                  title: "Quality Workmanship",
                  text: "Certified electrical connections, robust mounting structures, and tidy cable routing that protect your premises.",
                },
                {
                  title: "Dependable Support",
                  text: "Accessible assistance for system queries, generation tracking, and post-installation maintenance advice.",
                },
              ].map((item, idx) => (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl border bg-background/60 p-4 sm:p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-soft"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MotionSection>

    {/* Call To Action Banner */}
    <CtaBanner />
  </Layout>
);

export default About;
