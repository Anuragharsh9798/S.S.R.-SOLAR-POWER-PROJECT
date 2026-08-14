import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { SectionHeading } from "@/components/SectionHeading";
import { MotionSection } from "@/components/motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Home,
  Landmark,
  Leaf,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";

export const Subsidy = () => {
  // Live Countdown Timer logic for scheme urgency card (Target: March 31, 2027)
  const [timeLeft, setTimeLeft] = useState({ days: 232, hours: 22, mins: 43, secs: 15 });

  useEffect(() => {
    const targetDate = new Date("2027-03-31T23:59:59").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, mins, secs });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <Seo
        title="PM Surya Ghar Muft Bijli Yojana: Get Up to ₹1,08,000 Subsidy | SSR Solar Power"
        description="Complete guide to PM Surya Ghar Muft Bijli Yojana. Receive up to ₹78,000 Central + ₹30,000 UP State subsidy. Eligibility, document checklist, National Portal application, and instant consultation."
        path="/subsidy"
      />

      {/* 1. HERO SECTION WITH COUNTDOWN WIDGET */}
      <section className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/92 to-background"
          aria-hidden
        />
        <div className="blob -left-20 top-10 h-72 w-72 bg-primary/25" aria-hidden />
        <div className="blob -right-10 top-24 h-64 w-64 bg-secondary/25" aria-hidden />

        <div className="container-wide relative">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
            {/* Left Column: Hero Copy */}
            <div className="lg:col-span-7 space-y-6">
              <span className="eyebrow">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Government Flagship Solar Scheme
              </span>

              <h1 className="text-4xl leading-[1.08] font-bold text-balance md:text-5xl lg:text-6xl">
                PM Surya Ghar Muft Bijli Yojana: <br />
                <span className="text-gradient">Get Up to ₹78,000 Subsidy</span>
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Reduce your electricity bills by up to 90%. Eligible UP residential households get up to ₹78,000 Central Subsidy + ₹30,000 UP State Subsidy directly transferred to your bank account via DBT.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild className="btn-premium rounded-full bg-gradient-brand px-7 font-semibold text-primary-foreground shadow-glow">
                  <Link to="/calculator">
                    Unlock Your Solar Subsidy Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full px-7 font-semibold">
                  <Link to="/calculator">Calculate Your Subsidy</Link>
                </Button>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/80 px-3.5 py-1.5 shadow-soft">
                  <Home className="h-3.5 w-3.5 text-primary" /> 50,000+ Homes Solarized
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/80 px-3.5 py-1.5 shadow-soft">
                  <Award className="h-3.5 w-3.5 text-emerald-500" /> 10+ Years of Experience
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/80 px-3.5 py-1.5 shadow-soft">
                  <Landmark className="h-3.5 w-3.5 text-amber-500" /> ₹100 Cr.+ Savings Across India
                </span>
              </div>
            </div>

            {/* Right Column: Live Urgency Countdown Widget Card */}
            <div className="lg:col-span-5">
              <div className="group calc-card-glow relative transition-all duration-500">
                <div className="relative overflow-hidden rounded-3xl border bg-card p-7 shadow-card text-center space-y-5 contact-card-gradient-border">
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <Clock className="h-3.5 w-3.5 animate-pulse" /> Limited Period Government Benefit
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Hurry Up! Scheme Active</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Last day to avail maximum subsidy offer: <strong className="text-foreground">March 31, 2027</strong>
                    </p>
                  </div>

                  {/* Live Countdown Counters */}
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    <div className="rounded-2xl border bg-muted/40 p-3">
                      <span className="block text-2xl font-extrabold text-primary">{timeLeft.days}</span>
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">Days</span>
                    </div>
                    <div className="rounded-2xl border bg-muted/40 p-3">
                      <span className="block text-2xl font-extrabold text-primary">{timeLeft.hours}</span>
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">Hours</span>
                    </div>
                    <div className="rounded-2xl border bg-muted/40 p-3">
                      <span className="block text-2xl font-extrabold text-primary">{timeLeft.mins}</span>
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">Mins</span>
                    </div>
                    <div className="rounded-2xl border bg-muted/40 p-3">
                      <span className="block text-2xl font-extrabold text-emerald-500">{timeLeft.secs}</span>
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">Secs</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Empanelled with DISCOM & National Portal for 100% Direct Benefit Transfer (DBT).
                  </p>

                  <Button asChild className="btn-premium w-full h-11 rounded-full bg-gradient-brand font-semibold text-primary-foreground">
                    <Link to="/calculator">Claim Your Subsidy Now</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT IS PM SURYA GHAR MUFT BIJLI YOJANA */}
      <MotionSection animation="fadeUp" className="section bg-gradient-soft">
        <div className="container-wide">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="eyebrow">Official Solar Scheme</span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                What is <span className="text-gradient">PM Surya Ghar Muft Bijli Yojana</span>?
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Government of India's flagship rooftop solar scheme launched in February 2024 to make clean solar energy affordable for homeowners. Under this scheme, eligible residential households receive up to ₹78,000 as a direct central subsidy for installing rooftop solar systems.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                The subsidy amount is credited directly into your bank account through <strong className="text-foreground">Direct Benefit Transfer (DBT)</strong> after successful installation, DISCOM net-metering inspection, and commissioning.
              </p>

              {/* Feature Highlights Badges */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="calc-card-glow group relative transition-all duration-300">
                  <div className="calc-card-gradient-border relative rounded-2xl bg-card p-3.5 text-center shadow-soft">
                    <span className="text-xl">🚫</span>
                    <p className="mt-1 text-xs font-semibold text-foreground">No Agents</p>
                  </div>
                </div>

                <div className="calc-card-glow group relative transition-all duration-300">
                  <div className="calc-card-gradient-border relative rounded-2xl bg-card p-3.5 text-center shadow-soft">
                    <span className="text-xl">₹</span>
                    <p className="mt-1 text-xs font-semibold text-foreground">No Commissions</p>
                  </div>
                </div>

                <div className="calc-card-glow group relative transition-all duration-300">
                  <div className="calc-card-gradient-border relative rounded-2xl bg-card p-3.5 text-center shadow-soft">
                    <span className="text-xl">➖</span>
                    <p className="mt-1 text-xs font-semibold text-foreground">No Hidden Deductions</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="calc-card-glow group relative transition-all duration-500">
              <div className="calc-card-gradient-border relative rounded-3xl overflow-hidden shadow-card aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80"
                  alt="PM Surya Ghar Rooftop Solar Scheme"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* 3. WHY GO SOLAR UNDER PM SURYA GHAR SCHEME */}
      <MotionSection animation="fadeUp" className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Key Benefits"
            title={<>Why Go Solar Under <span className="text-gradient">PM Surya Ghar Scheme</span>?</>}
            description="Transform your roof into an independent power plant with government-backed financial subsidies."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: PiggyBank,
                title: "Receive Up to ₹78,000 Subsidy",
                desc: "Direct financial assistance credited directly to your bank account via DBT portal within 30 days of net-meter commissioning.",
              },
              {
                icon: Zap,
                title: "Save 90% on Electricity Bills",
                desc: "Offset daytime power grid usage and export excess units back to DISCOM for monthly bill credits.",
              },
              {
                icon: Sun,
                title: "25+ Years Free Solar Power",
                desc: "Tier-1 mono PERC and TOPCon modules backed by 25-year linear performance warranties.",
              },
              {
                icon: Home,
                title: "Increase Property Value",
                desc: "Long-term sustainable asset upgrade that enhances residential property evaluation.",
              },
              {
                icon: Leaf,
                title: "100% Energy Independence",
                desc: "Contribute to a clean, green India while securing immunity against rising DISCOM utility tariffs.",
              },
            ].map((benefit, i) => (
              <div key={i} className="calc-card-glow group relative transition-all duration-500">
                <div className="feature-card-gradient-border relative flex flex-col justify-between h-full rounded-3xl bg-card p-6 shadow-soft space-y-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <benefit.icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-bold">{benefit.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* 4. PM SURYA GHAR SCHEME ACHIEVEMENTS (NATIONAL STATS) */}
      <MotionSection animation="fadeUp" className="section bg-gradient-soft">
        <div className="container-wide">
          <SectionHeading
            eyebrow="National Impact"
            title={<>PM Surya Ghar Scheme <span className="text-gradient">Achievements</span></>}
            description="Official milestone statistics of India's largest residential solar transition."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { emoji: "🏆", value: "73.7 Lakh", label: "PM Surya Ghar Achievements", color: "text-primary" },
              { emoji: "₹", value: "₹26,000 Cr", label: "Subsidy Released", color: "text-emerald-600" },
              { emoji: "⚡", value: "13.35 GW", label: "Installation Capacity", color: "text-amber-500" },
              { emoji: "☀️", value: "37.3 Lakh", label: "Installations Completed", color: "text-sky-500" },
            ].map((stat, i) => (
              <div key={i} className="calc-card-glow group relative transition-all duration-500">
                <div className="stat-card-gradient-border relative flex flex-col justify-center items-center h-full rounded-3xl bg-card p-6 shadow-soft space-y-2 text-center">
                  <span className="text-3xl">{stat.emoji}</span>
                  <p className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}

            <div className="calc-card-glow group relative transition-all duration-500 sm:col-span-2 lg:col-span-2">
              <div className="stat-card-gradient-border relative flex flex-col justify-center items-center h-full rounded-3xl bg-card p-6 shadow-soft space-y-2 text-center">
                <span className="text-3xl">🏠</span>
                <p className="text-3xl font-extrabold text-primary">45.1 Lakh</p>
                <p className="text-xs font-medium text-muted-foreground">Households Covered</p>
              </div>
            </div>
          </div>

          {/* Subtext Callout Banner */}
          <div className="mt-8 calc-card-glow group relative transition-all duration-500">
            <div className="calc-card-gradient-border relative rounded-2xl bg-card/90 p-6 flex flex-wrap items-center justify-between gap-4 shadow-soft">
              <div>
                <p className="text-base font-bold text-foreground">
                  The Government has already released ₹26,000 Crore in subsidies.
                </p>
                <p className="text-xs text-muted-foreground">
                  Join 1,000+ families who chose SSR Solar Power to claim their rooftop subsidy hassle-free.
                </p>
              </div>
              <Button asChild className="btn-premium rounded-full bg-gradient-brand font-semibold text-primary-foreground">
                <Link to="/calculator">Get Free Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* 5. GOVERNMENT SUBSIDY STRUCTURE TABLE */}
      <MotionSection animation="fadeUp" className="section">
        <div className="container-wide max-w-4xl">
          <SectionHeading
            eyebrow="Financial Subsidy Rates"
            title={<>Government Subsidy <span className="text-gradient">Structure</span></>}
            description="Clear breakdown of Central Government (PM Surya Ghar) + UP State Government subsidies for residential rooftop solar."
          />

          <div className="mt-10 calc-card-glow group relative transition-all duration-500">
            <div className="calc-card-gradient-border relative overflow-hidden rounded-3xl bg-card shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4">Solar System Size</th>
                      <th className="px-6 py-4">Central Subsidy (PM Surya Ghar)</th>
                      <th className="px-6 py-4">UP State Subsidy</th>
                      <th className="px-6 py-4">Total Combined Subsidy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-foreground">1 kW</td>
                      <td className="px-6 py-4 font-semibold text-primary">₹30,000</td>
                      <td className="px-6 py-4 text-emerald-600 font-semibold">₹15,000</td>
                      <td className="px-6 py-4 font-bold text-emerald-500">₹45,000</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-foreground">2 kW</td>
                      <td className="px-6 py-4 font-semibold text-primary">₹60,000</td>
                      <td className="px-6 py-4 text-emerald-600 font-semibold">₹30,000</td>
                      <td className="px-6 py-4 font-bold text-emerald-500">₹90,000</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors bg-primary/5">
                      <td className="px-6 py-4 font-bold text-foreground">3 kW</td>
                      <td className="px-6 py-4 font-bold text-primary">₹78,000 (Max)</td>
                      <td className="px-6 py-4 text-emerald-600 font-bold">₹30,000 (Max)</td>
                      <td className="px-6 py-4 font-extrabold text-emerald-500">₹1,08,000 (Maximum)</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-foreground">4 kW – 10 kW</td>
                      <td className="px-6 py-4 font-semibold text-primary">₹78,000 (Fixed Cap)</td>
                      <td className="px-6 py-4 text-emerald-600 font-semibold">₹30,000 (Fixed Cap)</td>
                      <td className="px-6 py-4 font-bold text-emerald-500">₹1,08,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-muted/30 px-6 py-3 text-xs text-muted-foreground border-t">
                * Note: Residential subsidy applies to domestic grid-connected rooftop solar connections. DISCOM net-metering mandatory.
              </div>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* 6. ELIGIBILITY & REQUIRED DOCUMENTS */}
      <MotionSection animation="fadeUp" className="section bg-gradient-soft">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Compliance Checklist"
            title={<>Eligibility & <span className="text-gradient">Documents</span></>}
            description="Simple prerequisites required to claim your government rooftop subsidy."
          />

          <div className="mt-14 grid gap-8 lg:grid-cols-12 items-start">
            {/* Eligibility List */}
            <div className="lg:col-span-6 calc-card-glow group relative transition-all duration-500">
              <div className="calc-card-gradient-border relative rounded-3xl bg-card p-7 shadow-soft space-y-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Eligibility Criteria
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Applicant must be an <strong className="text-foreground">Indian Resident</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Property must be <strong className="text-foreground">Residential</strong> (commercial properties excluded from PM Surya Ghar).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Must hold property ownership or clear rooftop usage rights.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Must have an active domestic <strong className="text-foreground">DISCOM electricity meter connection</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Minimum <strong className="text-foreground">80–100 sq. ft. shadow-free rooftop space</strong> per 1 kW system.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Document Cards Grid */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-xl font-bold text-foreground">Required Documents</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { name: "Aadhaar Card", icon: "🪪" },
                  { name: "Latest Electricity Bill", icon: "⚡" },
                  { name: "Bank Passbook / Cheque", icon: "🏦" },
                  { name: "Roof Ownership Proof", icon: "📜" },
                  { name: "Passport Photo", icon: "🖼️" },
                ].map((doc, idx) => (
                  <div key={idx} className="calc-card-glow group relative transition-all duration-300">
                    <div className="calc-card-gradient-border relative rounded-2xl bg-card p-4 text-center shadow-soft space-y-1">
                      <span className="text-2xl">{doc.icon}</span>
                      <p className="text-xs font-bold text-foreground">{doc.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* 7. HOW TO APPLY FOR PM SURYA GHAR SUBSIDY (STEP BY STEP) */}
      <MotionSection animation="fadeUp" className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Application Process"
            title={<>How to Apply for <span className="text-gradient">PM Surya Ghar Subsidy</span>?</>}
            description="SSR Solar Power guides you through all 3 stages on the National Portal."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            <div className="calc-card-glow group relative transition-all duration-500">
              <div className="calc-card-gradient-border relative flex flex-col justify-between h-full rounded-3xl bg-card p-7 shadow-soft space-y-4">
                <span className="text-3xl font-bold text-primary">01</span>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Register on National Portal</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Register on <code className="text-primary font-mono">pmsuryaghar.gov.in</code> selecting your State & Electricity DISCOM using Consumer Number and Aadhaar OTP.
                  </p>
                </div>
              </div>
            </div>

            <div className="calc-card-glow group relative transition-all duration-500">
              <div className="calc-card-gradient-border relative flex flex-col justify-between h-full rounded-3xl bg-card p-7 shadow-soft space-y-4">
                <span className="text-3xl font-bold text-primary">02</span>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Apply for Rooftop Solar</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Submit your rooftop area details and system capacity requirement for DISCOM technical feasibility approval.
                  </p>
                </div>
              </div>
            </div>

            <div className="calc-card-glow group relative transition-all duration-500">
              <div className="calc-card-gradient-border relative flex flex-col justify-between h-full rounded-3xl bg-card p-7 shadow-soft space-y-4">
                <span className="text-3xl font-bold text-primary">03</span>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Choose SSR Solar Power</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Select <strong className="text-foreground">SSR Solar Power</strong> as your empanelled vendor. We complete installation, net-metering, and DBT claim verification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* 8. WHY GO SOLAR WITH SSR SOLAR POWER */}
      <MotionSection animation="fadeUp" className="section bg-gradient-soft">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Why Choose SSR Solar Power"
            title={<>Trusted Government Empanelled <span className="text-gradient">Solar Partner</span></>}
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Home, value: "1,000+", label: "Homes Solarized in UP", color: "text-primary" },
              { icon: Sun, value: "200+ MWp", label: "Solar Capacity Installed", color: "text-amber-500" },
              { icon: Landmark, value: "₹10+ Cr", label: "Subsidy Delivered to Clients", color: "text-emerald-600" },
              { icon: ShieldCheck, value: "#1 Empanelled", label: "Vendor on National Portal", color: "text-sky-500" },
            ].map((item, i) => (
              <div key={i} className="calc-card-glow group relative transition-all duration-500">
                <div className="stat-card-gradient-border relative flex flex-col items-center justify-center h-full rounded-3xl bg-card p-6 shadow-soft space-y-2 text-center">
                  <item.icon className={`mx-auto h-8 w-8 ${item.color}`} />
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* 9. SUBSIDY FREQUENTLY ASKED QUESTIONS */}
      <MotionSection animation="fadeUp" className="section">
        <div className="container-wide max-w-4xl">
          <SectionHeading
            eyebrow="Got Questions?"
            title={<>PM Surya Ghar <span className="text-gradient">Subsidy FAQs</span></>}
          />

          <div className="mt-10">
            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="item-1" className="calc-card-gradient-border relative rounded-2xl bg-card px-5 border-none shadow-soft overflow-hidden">
                <AccordionTrigger className="text-base font-semibold py-4">What is PM Surya Ghar Muft Bijli Yojana?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  PM Surya Ghar Muft Bijli Yojana is a flagship central government scheme offering up to ₹78,000 direct subsidy for 3 kW+ residential rooftop solar installations, making green electricity affordable.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="calc-card-gradient-border relative rounded-2xl bg-card px-5 border-none shadow-soft overflow-hidden">
                <AccordionTrigger className="text-base font-semibold py-4">How long does it take to receive the subsidy in bank account?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  After plant installation and DISCOM net-meter commissioning, the subsidy is credited via Direct Benefit Transfer (DBT) into the customer's Aadhaar-linked bank account within 30 working days.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="calc-card-gradient-border relative rounded-2xl bg-card px-5 border-none shadow-soft overflow-hidden">
                <AccordionTrigger className="text-base font-semibold py-4">Can I get UP State subsidy along with Central subsidy?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  Yes! Residential consumers in Uttar Pradesh receive ₹15,000 per kW (max ₹30,000) from UP state government in addition to Central subsidy, resulting in a maximum combined benefit of ₹1,08,000.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="calc-card-gradient-border relative rounded-2xl bg-card px-5 border-none shadow-soft overflow-hidden">
                <AccordionTrigger className="text-base font-semibold py-4">What solar panels qualify under PM Surya Ghar?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  Only ALMM-listed Domestic Content Requirement (DCR) solar modules made in India qualify for the PM Surya Ghar government subsidy.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="calc-card-gradient-border relative rounded-2xl bg-card px-5 border-none shadow-soft overflow-hidden">
                <AccordionTrigger className="text-base font-semibold py-4">Can I take a solar loan along with the subsidy?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  Yes! PSU Banks offer concessional green loans at ~7% interest rate with zero collateral for up to 3 kW rooftop solar plants under PM Surya Ghar.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </MotionSection>

      {/* 10. CTA BANNER */}
      <section className="section py-16">
        <div className="container-wide">
          <div className="calc-card-glow relative overflow-hidden rounded-3xl bg-gradient-brand p-8 text-center text-white shadow-glow md:p-12">
            <h2 className="text-3xl font-bold md:text-4xl">Claim Your Government Solar Subsidy Today!</h2>
            <p className="mt-3 text-base text-white/90 max-w-xl mx-auto">
              Let SSR Solar Power handle your feasibility approval, national portal registration, net metering, and DBT subsidy claim.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild className="rounded-full bg-white px-8 font-bold text-slate-900 shadow-md hover:bg-slate-100">
                <Link to="/calculator">Get Free Consultation</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/40 bg-white/10 px-8 font-semibold text-white hover:bg-white/20">
                <Link to="/calculator">Open Solar Calculator</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Subsidy;
