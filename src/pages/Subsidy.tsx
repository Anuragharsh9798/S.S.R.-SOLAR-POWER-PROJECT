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
  Loader2,
  AlertCircle,
  ExternalLink,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { api } from "@/lib/api";

export const Subsidy = () => {
  // Live Countdown Timer logic for scheme urgency card (Target: March 31, 2027)
  const [timeLeft, setTimeLeft] = useState({ days: 232, hours: 22, mins: 43, secs: 15 });

  // Government Statistics API State
  const [govtStats, setGovtStats] = useState<any[] | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const fetchGovtStats = async () => {
    setLoadingStats(true);
    setStatsError(null);
    try {
      const data = await api.get<any[]>("/api/v1/government-statistics");
      if (Array.isArray(data) && data.length > 0) {
        setGovtStats(data);
      } else {
        setGovtStats(null);
        setStatsError("No verified government statistics returned from backend.");
      }
    } catch (err: any) {
      console.error("Failed to fetch government statistics:", err);
      setGovtStats(null);
      setStatsError(err.message || "Failed to load government statistics from server.");
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchGovtStats();
  }, []);

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
      <section className="relative overflow-hidden pb-10 pt-32 md:pb-14 md:pt-36">
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/92 to-background"
          aria-hidden
        />
        <div className="blob -left-20 top-10 h-72 w-72 bg-primary/25" aria-hidden />
        <div className="blob -right-10 top-24 h-64 w-64 bg-secondary/25" aria-hidden />

        <div className="container-wide relative">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
            {/* Left Column: Hero Copy */}
            <div className="lg:col-span-7 space-y-4 md:space-y-5">
              <span className="eyebrow">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Government Flagship Solar Scheme
              </span>

              <h1 className="mt-3.5 text-4xl leading-[1.08] font-bold text-balance md:text-5xl lg:text-6xl">
                PM Surya Ghar Muft Bijli Yojana: <br />
                <span className="text-gradient">Get Up to ₹78,000 Subsidy</span>
              </h1>

              <p className="mt-3.5 md:mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                PM Surya Ghar: Muft Bijli Yojana is the Government of India's flagship rooftop solar initiative designed to make clean, sustainable solar electricity accessible and affordable for residential households. The scheme provides direct financial subsidies to homeowners installing grid-connected rooftop solar systems, substantially lowering initial capital expenditure while reducing monthly electricity bills by up to 90%. Eligible residential consumers can claim central and state government financial assistance credited directly to their bank accounts via Direct Benefit Transfer (DBT). SSR Solar Power assists you through every stage—from verifying property eligibility and rooftop sizing to complete National Portal registration, DISCOM net metering approvals, and smooth subsidy disbursement.
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
      <MotionSection animation="fadeUp" className="section py-10 md:py-14 bg-gradient-soft">
        <div className="container-wide">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <span className="eyebrow">Official Solar Scheme</span>
              <h2 className="mt-3.5 text-3xl font-bold tracking-tight md:text-4xl">
                What is <span className="text-gradient">PM Surya Ghar Muft Bijli Yojana</span>?
              </h2>
              <p className="mt-3.5 text-base leading-relaxed text-muted-foreground">
                Government of India's flagship rooftop solar scheme launched in February 2024 to make clean solar energy affordable for homeowners. Under this scheme, eligible residential households receive up to ₹78,000 as a direct central subsidy for installing rooftop solar systems.
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                The subsidy amount is credited directly into your bank account through <strong className="text-foreground">Direct Benefit Transfer (DBT)</strong> after successful installation, DISCOM net-metering inspection, and commissioning.
              </p>

              {/* Feature Highlights Badges */}
              <div className="mt-5 grid grid-cols-3 gap-3">
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
      <MotionSection animation="fadeUp" className="section py-10 md:py-14">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Key Benefits"
            title={<>Why Go Solar Under <span className="text-gradient">PM Surya Ghar Scheme</span>?</>}
            description="Transform your roof into an independent power plant with government-backed financial subsidies."
          />

          <div className="mt-8 md:mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* 4. PM SURYA GHAR SCHEME ACHIEVEMENTS (VERIFIED GOVERNMENT STATS) */}
      <MotionSection animation="fadeUp" className="section py-10 md:py-14 bg-gradient-soft">
        <div className="container-wide space-y-7 md:space-y-8">
          <SectionHeading
            eyebrow="National Impact"
            title={<>PM Surya Ghar Scheme <span className="text-gradient">Achievements</span></>}
            description="Verified milestone statistics provided by MNRE & UPNEDA solar portals."
          />

          {loadingStats ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-48 rounded-3xl border border-border bg-card/60 p-6 animate-pulse space-y-3">
                  <div className="h-4 w-1/2 rounded bg-muted" />
                  <div className="h-8 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-2/3 rounded bg-muted" />
                  <div className="h-3 w-1/3 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : statsError && (!govtStats || govtStats.length === 0) ? (
            /* API Failure Unavailable / Error State */
            <div className="mx-auto max-w-xl rounded-3xl border border-destructive/30 bg-destructive/10 p-8 text-center space-y-4 shadow-soft">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20 text-destructive">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-foreground">Government Statistics Unavailable</h4>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
                Unable to load verified government statistics from the backend server ({statsError}).
              </p>
              <div className="pt-2">
                <Button
                  onClick={fetchGovtStats}
                  variant="outline"
                  className="rounded-full px-5 text-xs font-semibold flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Retry Connection
                </Button>
              </div>
            </div>
          ) : (
            /* Verified Government Statistics Grid */
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(
                govtStats && govtStats.filter(
                  (s: any) =>
                    s.id !== "stat-max-central-subsidy" &&
                    s.id !== "stat-up-state-subsidy" &&
                    s.id !== "stat-pm-surya-ghar-300"
                ).length >= 5
                  ? govtStats.filter(
                      (s: any) =>
                        s.id !== "stat-max-central-subsidy" &&
                        s.id !== "stat-up-state-subsidy" &&
                        s.id !== "stat-pm-surya-ghar-300"
                    )
                  : [
                      {
                        id: "stat-pm-surya-ghar-achievements",
                        metric: "Households Benefiting",
                        value: "51.58 Lakh",
                        unit: "PM Surya Ghar Achievements",
                        source: "Ministry of New and Renewable Energy (MNRE)",
                        sourceUrl: "https://pmsuryaghar.gov.in",
                        effectiveDate: "2026-08-17",
                        lastVerifiedAt: "2026-08-17",
                      },
                      {
                        id: "stat-subsidy-released-transferred",
                        metric: "Subsidy Transferred",
                        value: "₹28,024 Cr",
                        unit: "Subsidy Released / Transferred",
                        source: "Ministry of New and Renewable Energy (MNRE)",
                        sourceUrl: "https://pmsuryaghar.gov.in",
                        effectiveDate: "2026-08-17",
                        lastVerifiedAt: "2026-08-17",
                      },
                      {
                        id: "stat-installation-capacity",
                        metric: "Commissioned Capacity",
                        value: "14.8 GW",
                        unit: "Installation Capacity",
                        source: "Ministry of New and Renewable Energy (MNRE)",
                        sourceUrl: "https://pmsuryaghar.gov.in",
                        effectiveDate: "2026-08-17",
                        lastVerifiedAt: "2026-08-17",
                      },
                      {
                        id: "stat-installations-completed",
                        metric: "Households / Installations",
                        value: "50+ Lakh",
                        unit: "Installations Completed",
                        source: "Ministry of New and Renewable Energy (MNRE)",
                        sourceUrl: "https://pmsuryaghar.gov.in",
                        effectiveDate: "2026-08-17",
                        lastVerifiedAt: "2026-08-17",
                      },
                      {
                        id: "stat-households-covered",
                        metric: "Households Covered",
                        value: "51.58 Lakh",
                        unit: "Households Covered",
                        source: "Ministry of New and Renewable Energy (MNRE)",
                        sourceUrl: "https://pmsuryaghar.gov.in",
                        effectiveDate: "2026-08-17",
                        lastVerifiedAt: "2026-08-17",
                      },
                    ]
              ).map((stat: any, i: number) => {
                const formattedDate = stat.lastVerifiedAt
                  ? new Date(stat.lastVerifiedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : stat.effectiveDate || "Verified";

                return (
                  <div
                    key={stat.id || i}
                    className="calc-card-glow group relative transition-all duration-500"
                  >
                    <div className="stat-card-gradient-border relative flex flex-col justify-between h-full rounded-3xl bg-card p-6 shadow-soft space-y-4">
                      <div className="space-y-1">
                        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">
                          {stat.unit}
                        </span>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          {stat.metric}
                        </h4>
                        <p className="text-3xl font-extrabold text-foreground pt-1">
                          {stat.value}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border/60 text-xs text-muted-foreground space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-foreground text-[11px]">Verified Source:</span>
                          {stat.sourceUrl ? (
                            <a
                              href={stat.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline font-medium inline-flex items-center gap-1 text-[11px]"
                            >
                              {stat.source} <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-[11px]">{stat.source}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2 text-[10px]">
                          <span className="flex items-center gap-1 text-muted-foreground/80">
                            <Calendar className="h-3 w-3 text-amber-500" /> Last Verified:
                          </span>
                          <span className="font-bold text-foreground">{formattedDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Subtext Callout Banner */}
          <div className="mt-6 md:mt-7 calc-card-glow group relative transition-all duration-500">
            <div className="calc-card-gradient-border relative rounded-2xl bg-card/90 p-6 flex flex-wrap items-center justify-between gap-4 shadow-soft">
              <div className="max-w-2xl">
                <p className="text-base font-bold text-foreground leading-snug">
                  PM Surya Ghar continues to expand rooftop solar adoption across households, with substantial subsidy support and increasing commissioned capacity.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Join 1,000+ families who chose SSR Solar Power to claim their rooftop subsidy hassle-free.
                </p>
              </div>
              <Button asChild className="btn-premium rounded-full bg-gradient-brand font-semibold text-primary-foreground">
                <Link to="/calculator">Get Free Consultation</Link>
              </Button>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="mt-4 text-center text-[11px] text-muted-foreground/80 italic">
            Figures are based on the latest data provided for this website and may change as official government data is updated.
          </p>
        </div>
      </MotionSection>

      {/* 5. GOVERNMENT SUBSIDY STRUCTURE TABLE */}
      <MotionSection animation="fadeUp" className="section py-10 md:py-14">
        <div className="container-wide max-w-4xl">
          <SectionHeading
            eyebrow="Financial Subsidy Rates"
            title={<>Government Subsidy <span className="text-gradient">Structure</span></>}
            description="Clear breakdown of Central Government (PM Surya Ghar) + UP State Government subsidies for residential rooftop solar."
          />

          <div className="mt-7 md:mt-8 calc-card-glow group relative transition-all duration-500">
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
      <MotionSection animation="fadeUp" className="section py-10 md:py-14 bg-gradient-soft">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Compliance Checklist"
            title={<>Eligibility & <span className="text-gradient">Documents</span></>}
            description="Simple prerequisites required to claim your government rooftop subsidy."
          />

          <div className="mt-8 md:mt-10 grid gap-6 lg:grid-cols-12 items-start">
            {/* Eligibility List */}
            <div className="lg:col-span-6 calc-card-glow group relative transition-all duration-500">
              <div className="calc-card-gradient-border relative rounded-3xl bg-card p-6 md:p-7 shadow-soft space-y-4">
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
      <MotionSection animation="fadeUp" className="section py-10 md:py-14">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Application Process"
            title={<>How to Apply for <span className="text-gradient">PM Surya Ghar Subsidy</span>?</>}
            description="SSR Solar Power guides you through all 3 stages on the National Portal."
          />

          <div className="mt-8 md:mt-10 grid gap-5 sm:grid-cols-3">
            <div className="calc-card-glow group relative transition-all duration-500">
              <div className="calc-card-gradient-border relative flex flex-col justify-between h-full rounded-3xl bg-card p-6 md:p-7 shadow-soft space-y-4">
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
              <div className="calc-card-gradient-border relative flex flex-col justify-between h-full rounded-3xl bg-card p-6 md:p-7 shadow-soft space-y-4">
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
              <div className="calc-card-gradient-border relative flex flex-col justify-between h-full rounded-3xl bg-card p-6 md:p-7 shadow-soft space-y-4">
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

      {/* 8. SUBSIDY FREQUENTLY ASKED QUESTIONS */}
      <MotionSection animation="fadeUp" className="section py-10 md:py-14 bg-gradient-soft">
        <div className="container-wide max-w-4xl">
          <SectionHeading
            eyebrow="Got Questions?"
            title={<>PM Surya Ghar <span className="text-gradient">Subsidy FAQs</span></>}
          />

          <div className="mt-7 md:mt-8">
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

      {/* 9. CTA BANNER */}
      <section className="section py-10 md:py-14">
        <div className="container-wide">
          <div className="calc-card-glow relative overflow-hidden rounded-3xl bg-gradient-brand p-8 text-center text-white shadow-glow md:p-12">
            <h2 className="text-3xl font-bold md:text-4xl">Claim Your Government Solar Subsidy Today!</h2>
            <p className="mt-3 text-base text-white/90 max-w-xl mx-auto">
              Let SSR Solar Power handle your feasibility approval, national portal registration, net metering, and DBT subsidy claim.
            </p>
            <div className="mt-7 md:mt-8 flex flex-wrap items-center justify-center gap-4">
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
