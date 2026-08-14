import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Battery,
  CheckCircle2,
  Gauge,
  Home,
  Leaf,
  PiggyBank,
  ShieldCheck,
  Smartphone,
  Sun,
  TrendingUp,
  Wifi,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MotionSection } from "@/components/motion";

export const RealTimeMonitoring = () => {
  // Live dynamic telemetry simulation state (matching reference video values & behavior)
  const [timeStr, setTimeStr] = useState("12:37:24");
  const [solarKw, setSolarKw] = useState(4.85);
  const [gridKw, setGridKw] = useState(-4.22);
  const [homeKw, setHomeKw] = useState(0.63);
  const [batteryVolts, setBatteryVolts] = useState(8.4);
  const [todayGenerated, setTodayGenerated] = useState(18.42);
  const [monthlyKwh, setMonthlyKwh] = useState(428.6);
  const [monthlySavings, setMonthlySavings] = useState(3427);

  useEffect(() => {
    const interval = setInterval(() => {
      // Live digital clock update
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, "0");
      const mins = String(now.getMinutes()).padStart(2, "0");
      const secs = String(now.getSeconds()).padStart(2, "0");
      setTimeStr(`${hrs}:${mins}:${secs}`);

      // Realistic solar & grid net metering power flow update (matching video live data)
      const newSolar = +(4.5 + Math.random() * 0.48).toFixed(2);
      const newHome = +(0.4 + Math.random() * 0.36).toFixed(2);
      const newGrid = +(-(newSolar - newHome)).toFixed(2);

      setSolarKw(newSolar);
      setHomeKw(newHome);
      setGridKw(newGrid);
      setTodayGenerated((prev) => +(prev + 0.01).toFixed(2));
      setMonthlyKwh((prev) => +(prev + 0.02).toFixed(1));
      setMonthlySavings((prev) => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  // Helper calculation for SVG Circular Arc Gauges
  const getArcDash = (value: number, max: number) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius; // ~150.8
    const pct = Math.min(Math.max(Math.abs(value) / max, 0), 1);
    const strokeDash = pct * (circumference * 0.75); // 270 degree arc
    return `${strokeDash} ${circumference}`;
  };

  return (
    <MotionSection animation="fadeUp" className="section bg-gradient-soft overflow-hidden relative py-20 md:py-28">
      {/* Background Radial Glow Blobs */}
      <div className="blob -left-20 top-20 h-80 w-80 bg-primary/15" aria-hidden />
      <div className="blob -right-20 bottom-10 h-80 w-80 bg-emerald-500/15" aria-hidden />

      <div className="container-wide relative">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* ================= LEFT SIDE: TEXT CONTENT (UNTOUCHED) ================= */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <span className="eyebrow inline-flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-primary" /> Smart IoT Monitoring
            </span>

            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Real-Time <span className="text-gradient">Solar Monitoring</span>
            </h2>

            <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg mx-auto lg:mx-0">
              Track your solar system's performance, generation and savings anytime, anywhere.
            </p>

            {/* Feature points */}
            <div className="space-y-4 pt-2 text-left max-w-lg mx-auto lg:mx-0">
              <div className="calc-card-glow group relative transition-all duration-300">
                <div className="calc-card-gradient-border relative flex items-center gap-4 rounded-2xl bg-card p-4 shadow-soft">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold shadow-sm">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Live Solar Generation</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Real-time power output &amp; continuous inverter telemetry.
                    </p>
                  </div>
                </div>
              </div>

              <div className="calc-card-glow group relative transition-all duration-300">
                <div className="calc-card-gradient-border relative flex items-center gap-4 rounded-2xl bg-card p-4 shadow-soft">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 font-bold shadow-sm">
                    <PiggyBank className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Energy &amp; Savings Tracking</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Daily units generated, grid net metering &amp; financial returns.
                    </p>
                  </div>
                </div>
              </div>

              <div className="calc-card-glow group relative transition-all duration-300">
                <div className="calc-card-gradient-border relative flex items-center gap-4 rounded-2xl bg-card p-4 shadow-soft">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 font-bold shadow-sm">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">System Performance Monitoring</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Automated fault alerts &amp; 24/7 plant health diagnostics.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
              <Button asChild className="btn-premium rounded-full bg-gradient-brand px-7 h-12 font-semibold text-primary-foreground shadow-glow">
                <Link to="/calculator">
                  Calculate Your Savings <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Available on iOS &amp; Android
              </span>
            </div>
          </div>

          {/* ================= RIGHT SIDE: REAL-TIME ANIMATED SMARTPHONE DASHBOARD ================= */}
          <div className="lg:col-span-6 relative flex justify-center items-center py-8">
            {/* Phone Ambient Radial Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-[520px] w-[340px] rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
              <div className="h-[360px] w-[260px] rounded-full bg-amber-500/15 blur-2xl" />
            </div>

            {/* FLOATING CARD 1: LIVE GENERATION (Top-Left) */}
            <motion.div
              animate={{ y: [0, -8, 0], opacity: [0.92, 1, 0.92] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 }}
              className="absolute -top-2 -left-2 sm:left-0 z-30 hidden sm:block"
            >
              <div className="calc-card-glow group relative">
                <div className="calc-card-gradient-border relative flex items-center gap-3 rounded-2xl bg-slate-900/95 px-4 py-3 shadow-2xl border border-emerald-500/35 backdrop-blur-xl">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 font-bold">
                    <Zap className="h-5 w-5 animate-pulse text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Generation</p>
                    <p className="text-xs font-extrabold text-white flex items-center gap-1">
                      <span className="text-amber-400 font-black">{solarKw} kW</span>
                      <span className="text-[9px] text-emerald-400 font-semibold">● Live Output</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* FLOATING CARD 2: TRACK YOUR SAVINGS (Top-Right) */}
            <motion.div
              animate={{ y: [0, -10, 0], opacity: [0.95, 1, 0.95] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="absolute top-16 -right-2 sm:right-0 z-30 hidden sm:block"
            >
              <div className="calc-card-glow group relative">
                <div className="calc-card-gradient-border relative flex items-center gap-3 rounded-2xl bg-slate-900/95 px-4 py-3 shadow-2xl border border-emerald-500/35 backdrop-blur-xl">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Track Your Savings</p>
                    <p className="text-xs font-extrabold text-emerald-400">₹1,40,930 Saved</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* FLOATING CARD 3: SYSTEM ONLINE (Bottom-Left) */}
            <motion.div
              animate={{ y: [0, -7, 0], opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-16 -left-4 sm:-left-2 z-30 hidden sm:block"
            >
              <div className="calc-card-glow group relative">
                <div className="calc-card-gradient-border relative flex items-center gap-3 rounded-2xl bg-slate-900/95 px-4 py-3 shadow-2xl border border-emerald-500/35 backdrop-blur-xl">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">System Online</p>
                    <p className="text-xs font-extrabold text-white">Grid Active ({gridKw} kW)</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* FLOATING CARD 4: 24×7 ACTIVE TELEMETRY (Bottom-Right) */}
            <motion.div
              animate={{ y: [0, -9, 0], opacity: [0.92, 1, 0.92] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
              className="absolute -bottom-4 -right-2 sm:right-2 z-30 hidden sm:block"
            >
              <div className="calc-card-glow group relative">
                <div className="calc-card-gradient-border relative flex items-center gap-3 rounded-2xl bg-slate-900/95 px-4 py-3 shadow-2xl border border-amber-500/35 backdrop-blur-xl">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 font-bold">
                    <Wifi className="h-5 w-5 animate-pulse text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">24×7 Active Telemetry</p>
                    <p className="text-xs font-extrabold text-amber-300">PM Surya Ghar Sync</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ================= REALISTIC STATIONARY 9:19 SMARTPHONE CHASSIS ================= */}
            <div className="relative z-20">
              {/* Outer Phone Shell with Metallic Bezel and 3D Depth Shadow */}
              <div className="relative w-[295px] sm:w-[325px] aspect-[9/19] rounded-[3.2rem] border-[9px] border-slate-800 bg-slate-950 shadow-[0_35px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(34,197,94,0.3)] ring-1 ring-white/20 select-none">
                
                {/* Physical Side Buttons */}
                <div className="absolute -left-[13px] top-24 h-7 w-[4px] rounded-l-md bg-slate-700 shadow-md" />
                <div className="absolute -left-[13px] top-34 h-7 w-[4px] rounded-l-md bg-slate-700 shadow-md" />
                <div className="absolute -right-[13px] top-28 h-12 w-[4px] rounded-r-md bg-slate-700 shadow-md" />

                {/* Inner Screen Container */}
                <div className="relative h-full w-full overflow-hidden rounded-[2.6rem] bg-slate-950 text-white flex flex-col justify-between border border-slate-800/80">
                  
                  {/* Top Header / Dynamic Island Area (Fixed Header) */}
                  <div className="relative z-30 bg-slate-950/95 backdrop-blur-md pt-2 px-3 pb-2 border-b border-slate-800/80 space-y-1.5">
                    {/* Dynamic Island Notch */}
                    <div className="mx-auto flex h-4 w-28 items-center justify-center rounded-full bg-slate-900 border border-slate-800/80 shadow-inner">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-8 rounded-full bg-slate-800" />
                        <div className="h-2.5 w-2.5 rounded-full bg-slate-950 ring-1 ring-slate-800 flex items-center justify-center">
                          <div className="h-1 w-1 rounded-full bg-blue-900/60" />
                        </div>
                      </div>
                    </div>

                    {/* Mobile App Header (Directly matching video reference top bar!) */}
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-brand text-slate-950 font-black shadow-glow">
                          <Sun className="h-3 w-3" />
                        </div>
                        <span className="font-extrabold text-white tracking-tight">SSR SOLAR POWER</span>
                      </div>
                      <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                        <span>08/13/2026</span>
                        <span className="text-emerald-400 font-bold">{timeStr}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Sun className="h-3 w-3 text-amber-400" />
                        <span className="text-[8px] font-bold">Sun</span>
                      </div>
                    </div>
                  </div>

                  {/* CONTINUOUS AUTO-SCROLLING APP SCREEN CONTENT */}
                  <div className="relative flex-1 overflow-hidden select-none">
                    <motion.div
                      animate={{ y: ["0%", "-42%", "0%"] }}
                      transition={{
                        duration: 18,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                      }}
                      className="space-y-3 p-3 pt-1.5 text-left"
                    >
                      {/* ================= SECTION 1: REAL-TIME 4-WAY HYBRID POWER TOPOLOGY (EXACT MATCH TO VIDEO) ================= */}
                      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-3 border border-emerald-500/30 shadow-xl relative overflow-hidden space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                          <span className="text-[9.5px] font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1">
                            <Zap className="h-3 w-3 text-amber-400" /> Hybrid Power Topology
                          </span>
                          <span className="text-[8.5px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" /> Live Sync
                          </span>
                        </div>

                        {/* 4-DIAL TOPOLOGY GRID & ANIMATED ENERGY FLOW PATHS */}
                        <div className="relative grid grid-cols-2 gap-x-6 gap-y-4 pt-1">
                          
                          {/* Animated Energy Flow Lines SVG Backdrop */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 200 160">
                            {/* Path 1: Solar Top-Left -> Center Hub */}
                            <path d="M 50 40 L 100 80" stroke="#22c55e" strokeWidth="1.8" strokeDasharray="4 3" opacity="0.6" />
                            {/* Path 2: Battery Bottom-Left -> Center Hub */}
                            <path d="M 50 120 L 100 80" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="4 3" opacity="0.6" />
                            {/* Path 3: Center Hub -> Grid Top-Right */}
                            <path d="M 100 80 L 150 40" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="4 3" opacity="0.6" />
                            {/* Path 4: Center Hub -> Home Bottom-Right */}
                            <path d="M 100 80 L 150 120" stroke="#22c55e" strokeWidth="1.8" strokeDasharray="4 3" opacity="0.6" />

                            {/* Moving Energy Pulses Along Paths */}
                            <motion.circle
                              animate={{ cx: [45, 95], cy: [35, 75] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              r="2.5"
                              fill="#22c55e"
                            />
                            <motion.circle
                              animate={{ cx: [105, 155], cy: [75, 35] }}
                              transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                              r="2.5"
                              fill="#f59e0b"
                            />
                            <motion.circle
                              animate={{ cx: [105, 155], cy: [85, 125] }}
                              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                              r="2.5"
                              fill="#22c55e"
                            />
                          </svg>

                          {/* CENTER INVERTER STATUS BADGE (ON / LIVE) */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border-2 border-emerald-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                              <span className="text-[11px] font-black text-emerald-400 animate-pulse">ON</span>
                            </div>
                          </div>

                          {/* DIAL 1: SOLAR PANELS (Top-Left) */}
                          <div className="relative z-10 flex flex-col items-center text-center space-y-0.5">
                            <div className="relative flex h-20 w-20 items-center justify-center">
                              <svg className="h-full w-full -rotate-90" viewBox="0 0 60 60">
                                <circle cx="30" cy="30" r="24" stroke="#1e293b" strokeWidth="4" fill="none" />
                                <circle
                                  cx="30"
                                  cy="30"
                                  r="24"
                                  stroke="#22c55e"
                                  strokeWidth="4"
                                  fill="none"
                                  strokeDasharray={getArcDash(solarKw, 7)}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <Sun className="h-4 w-4 text-amber-400" />
                                <span className="text-[10px] font-black text-white leading-none pt-0.5">{solarKw}</span>
                                <span className="text-[7.5px] font-bold text-emerald-400">kW</span>
                              </div>
                            </div>
                            <span className="text-[8px] font-bold text-slate-300">SOLAR ARRAY</span>
                          </div>

                          {/* DIAL 2: GRID EXPORT / NET METER (Top-Right) */}
                          <div className="relative z-10 flex flex-col items-center text-center space-y-0.5">
                            <div className="relative flex h-20 w-20 items-center justify-center">
                              <svg className="h-full w-full -rotate-90" viewBox="0 0 60 60">
                                <circle cx="30" cy="30" r="24" stroke="#1e293b" strokeWidth="4" fill="none" />
                                <circle
                                  cx="30"
                                  cy="30"
                                  r="24"
                                  stroke="#f59e0b"
                                  strokeWidth="4"
                                  fill="none"
                                  strokeDasharray={getArcDash(Math.abs(gridKw), 5)}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <Zap className="h-4 w-4 text-amber-400" />
                                <span className="text-[10px] font-black text-amber-400 leading-none pt-0.5">{gridKw}</span>
                                <span className="text-[7.5px] font-bold text-amber-300">kW Export</span>
                              </div>
                            </div>
                            <span className="text-[8px] font-bold text-slate-300">UTILITY GRID</span>
                          </div>

                          {/* DIAL 3: BATTERY STATUS (Bottom-Left) */}
                          <div className="relative z-10 flex flex-col items-center text-center space-y-0.5">
                            <div className="relative flex h-20 w-20 items-center justify-center">
                              <svg className="h-full w-full -rotate-90" viewBox="0 0 60 60">
                                <circle cx="30" cy="30" r="24" stroke="#1e293b" strokeWidth="4" fill="none" />
                                <circle
                                  cx="30"
                                  cy="30"
                                  r="24"
                                  stroke="#38bdf8"
                                  strokeWidth="4"
                                  fill="none"
                                  strokeDasharray={getArcDash(batteryVolts, 12)}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <Battery className="h-4 w-4 text-sky-400" />
                                <span className="text-[10px] font-black text-white leading-none pt-0.5">{batteryVolts}V</span>
                                <span className="text-[7.5px] font-bold text-sky-400">0.00 kW</span>
                              </div>
                            </div>
                            <span className="text-[8px] font-bold text-slate-300">STORAGE</span>
                          </div>

                          {/* DIAL 4: HOME CONSUMPTION (Bottom-Right) */}
                          <div className="relative z-10 flex flex-col items-center text-center space-y-0.5">
                            <div className="relative flex h-20 w-20 items-center justify-center">
                              <svg className="h-full w-full -rotate-90" viewBox="0 0 60 60">
                                <circle cx="30" cy="30" r="24" stroke="#1e293b" strokeWidth="4" fill="none" />
                                <circle
                                  cx="30"
                                  cy="30"
                                  r="24"
                                  stroke="#22c55e"
                                  strokeWidth="4"
                                  fill="none"
                                  strokeDasharray={getArcDash(homeKw, 5)}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <Home className="h-4 w-4 text-emerald-400" />
                                <span className="text-[10px] font-black text-white leading-none pt-0.5">{homeKw}</span>
                                <span className="text-[7.5px] font-bold text-emerald-400">kW Load</span>
                              </div>
                            </div>
                            <span className="text-[8px] font-bold text-slate-300">HOUSEHOLD</span>
                          </div>

                        </div>
                      </div>

                      {/* ================= SECTION 2: TODAY'S GENERATION & SCANNING PEAK CURVE ================= */}
                      <div className="rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 p-3 border border-emerald-500/35 shadow-lg space-y-2 relative overflow-hidden">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                          <span className="flex items-center gap-1 text-slate-300">
                            <Sun className="h-3 w-3 text-amber-400" /> Daily Solar Generation
                          </span>
                          <span className="text-amber-400 font-extrabold flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            <Zap className="h-3 w-3 fill-amber-400 animate-pulse" /> {solarKw} kW Peak
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between pt-0.5">
                          <div>
                            <span className="text-3xl font-black text-emerald-400 tracking-tight">{todayGenerated}</span>
                            <span className="ml-1 text-xs font-bold text-slate-300">kWh</span>
                            <p className="text-[9px] text-slate-400 font-medium">Generated Today</p>
                          </div>
                          <div className="text-right bg-slate-950/60 px-2.5 py-1.5 rounded-xl border border-slate-800">
                            <p className="text-[9px] text-slate-400">Net Export</p>
                            <p className="text-xs font-extrabold text-amber-400 flex items-center justify-end gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                              {gridKw} kW
                            </p>
                          </div>
                        </div>

                        {/* LIVE ANIMATED SOLAR GENERATION GRAPH */}
                        <div className="pt-1 space-y-1">
                          <div className="flex justify-between text-[8px] text-slate-400 font-semibold">
                            <span>06:00 AM</span>
                            <span className="text-amber-400 font-bold">12:30 PM (Peak)</span>
                            <span>06:00 PM</span>
                          </div>

                          <div className="relative h-13 w-full rounded-xl bg-slate-950/80 p-1 border border-slate-800 overflow-hidden">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 35">
                              <defs>
                                <linearGradient id="solarGraphGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.5" />
                                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.2" />
                                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                                </linearGradient>
                              </defs>

                              <path
                                d="M 0 32 Q 25 30, 40 14 T 70 8 T 90 26 L 100 32 L 100 35 L 0 35 Z"
                                fill="url(#solarGraphGradient)"
                              />
                              <path
                                d="M 0 32 Q 25 30, 40 14 T 70 8 T 90 26 L 100 32"
                                fill="none"
                                stroke="#22c55e"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                              />

                              {/* Continuous Scanning Laser Dot along Curve */}
                              <motion.circle
                                animate={{
                                  cx: [5, 25, 45, 65, 85, 98],
                                  cy: [31, 24, 12, 9, 20, 31],
                                }}
                                transition={{
                                  duration: 5,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                                r="3"
                                fill="#f59e0b"
                              />
                              <motion.circle
                                animate={{
                                  cx: [5, 25, 45, 65, 85, 98],
                                  cy: [31, 24, 12, 9, 20, 31],
                                }}
                                transition={{
                                  duration: 5,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                                r="6"
                                fill="#f59e0b"
                                opacity="0.4"
                                className="animate-ping"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* ================= SECTION 3: PM SURYA GHAR YOJANA SUBSIDY TRACKER ================= */}
                      <div className="rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-slate-900 p-3 border border-amber-500/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="h-4 w-4 text-amber-400" />
                            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">PM Surya Ghar Subsidy</span>
                          </div>
                          <span className="text-xs font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">₹78,000 CFA</span>
                        </div>

                        <p className="text-[9px] text-slate-300 leading-tight">
                          Central Government Subsidy scheme tracker for residential solar systems.
                        </p>

                        {/* Subsidy Slabs Grid */}
                        <div className="grid grid-cols-3 gap-1 pt-0.5 text-center">
                          <div className="rounded-lg bg-slate-950/80 p-1 border border-slate-800">
                            <p className="text-[8px] text-slate-400">1 kW</p>
                            <p className="text-[9px] font-bold text-white">₹30,000</p>
                          </div>
                          <div className="rounded-lg bg-slate-950/80 p-1 border border-slate-800">
                            <p className="text-[8px] text-slate-400">2 kW</p>
                            <p className="text-[9px] font-bold text-white">₹60,000</p>
                          </div>
                          <div className="rounded-lg bg-slate-950/80 p-1 border border-emerald-500/50 bg-emerald-950/30">
                            <p className="text-[8px] text-emerald-400 font-bold">3 kW+</p>
                            <p className="text-[9px] font-extrabold text-emerald-400">₹78,000</p>
                          </div>
                        </div>

                        {/* Application Step Tracker */}
                        <div className="rounded-xl bg-slate-950/90 p-2 border border-slate-800 space-y-1">
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Application &amp; DBT Status</p>
                          <div className="space-y-1 text-[8.5px]">
                            <div className="flex items-center justify-between text-emerald-400 font-semibold">
                              <span>✓ Installation &amp; Metering</span>
                              <span className="text-[7.5px] bg-emerald-500/10 px-1 rounded">Approved</span>
                            </div>
                            <div className="flex items-center justify-between text-emerald-400 font-semibold">
                              <span>✓ DISCOM Net Meter Sync</span>
                              <span className="text-[7.5px] bg-emerald-500/10 px-1 rounded">Active</span>
                            </div>
                            <div className="flex items-center justify-between text-amber-400 font-bold">
                              <span className="flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                                ● Direct Bank Transfer (DBT)
                              </span>
                              <span className="text-[7.5px] bg-amber-500/20 px-1 rounded">Processing</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ================= SECTION 4: MONTHLY RETURNS & CARBON IMPACT ================= */}
                      <div className="rounded-2xl bg-slate-900/90 p-3 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
                            <BarChart3 className="h-3.5 w-3.5 text-emerald-400" /> Monthly Returns &amp; Offset
                          </span>
                          <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            Aug 2026
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-0.5">
                          <div className="rounded-xl bg-slate-950/80 p-2 border border-slate-800/80">
                            <p className="text-[9px] text-slate-400 font-semibold">Monthly Generation</p>
                            <p className="text-sm font-black text-white">{monthlyKwh} <span className="text-[9px] font-normal text-slate-400">kWh</span></p>
                          </div>

                          <div className="rounded-xl bg-slate-950/80 p-2 border border-emerald-500/30">
                            <p className="text-[9px] text-slate-400 font-semibold">Estimated Savings</p>
                            <p className="text-sm font-black text-amber-400">₹{monthlySavings.toLocaleString("en-IN")}</p>
                          </div>
                        </div>

                        <div className="rounded-xl bg-slate-950/80 p-2 border border-slate-800 flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                              <Leaf className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-[8.5px] font-bold text-slate-400">Carbon Offset</p>
                              <p className="text-xs font-extrabold text-white">1,240 kg CO₂</p>
                            </div>
                          </div>
                          <span className="text-[8.5px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                            56 Trees 🌳
                          </span>
                        </div>
                      </div>

                      <p className="text-[8px] text-center text-slate-500 pt-0.5 pb-2">
                        * Real-Time SSR Solar Telemetry App • Inspired by Hybrid Solar Inverter Telemetry
                      </p>
                    </motion.div>
                  </div>

                  {/* Phone Bottom Bar Indicator (Fixed Footer) */}
                  <div className="relative z-30 bg-slate-950/90 backdrop-blur-sm py-1.5 border-t border-slate-800/80">
                    <div className="mx-auto h-1 w-24 rounded-full bg-slate-700/80" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
};

