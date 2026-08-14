import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BadgeIndianRupee,
  Clock,
  FileText,
  Gauge,
  Landmark,
  Leaf,
  MessageCircle,
  PiggyBank,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionHeading } from "@/components/SectionHeading";
import { MotionSection } from "@/components/motion";
import { toast } from "sonner";

const states = ["Uttar Pradesh"];

const cities = [
  "Agra",
  "Aligarh",
  "Ambedkar Nagar",
  "Amethi",
  "Amroha",
  "Auraiya",
  "Ayodhya",
  "Azamgarh",
  "Baghpat",
  "Bahraich",
  "Ballia",
  "Balrampur",
  "Banda",
  "Barabanki",
  "Bareilly",
  "Basti",
  "Bhadohi (Sant Ravidas Nagar)",
  "Bijnor",
  "Budaun",
  "Bulandshahr",
  "Chandauli",
  "Chitrakoot",
  "Deoria",
  "Etah",
  "Etawah",
  "Farrukhabad",
  "Fatehpur",
  "Firozabad",
  "Gautam Buddha Nagar (Noida)",
  "Ghaziabad",
  "Ghazipur",
  "Gonda",
  "Gorakhpur",
  "Hamirpur",
  "Hapur",
  "Hardoi",
  "Hathras",
  "Jalaun",
  "Jaunpur",
  "Jhansi",
  "Kannauj",
  "Kanpur Dehat",
  "Kanpur Nagar",
  "Kasganj",
  "Kaushambi",
  "Kushinagar",
  "Lakhimpur Kheri",
  "Lalitpur",
  "Lucknow",
  "Maharajganj",
  "Mahoba",
  "Mainpuri",
  "Mathura",
  "Mau",
  "Meerut",
  "Mirzapur",
  "Moradabad",
  "Muzaffarnagar",
  "Pilibhit",
  "Pratapgarh",
  "Prayagraj",
  "Raebareli",
  "Rampur",
  "Saharanpur",
  "Sambhal",
  "Sant Kabir Nagar",
  "Shahjahanpur",
  "Shamli",
  "Shrawasti",
  "Siddharthnagar",
  "Sitapur",
  "Sonbhadra",
  "Sultanpur",
  "Unnao",
  "Varanasi",
];

const roofTypes = ["RCC Flat Roof", "Metal Sheet", "Tiled Roof", "Ground Mount"];
const connectionTypes = ["Domestic (LT)", "Commercial (LT)"];

// Animated Count-Up Component for Smooth Numeric Updates
const CountUpValue = ({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) => {
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      setDisplay(latest);
    });
  }, [spring]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString("en-IN");

  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

// Animated SVG Circular Progress Component
const CircularProgress = ({
  percentage = 88,
  label = "Solar Offset Target",
}: {
  percentage?: number;
  label?: string;
}) => {
  const radius = 32;
  const stroke = 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-primary/20 bg-primary/5 p-3.5">
      <div className="relative flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
          <circle
            stroke="hsl(var(--muted))"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <motion.circle
            stroke="hsl(var(--primary))"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + " " + circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <span className="absolute font-display text-xs font-bold text-primary">{percentage}%</span>
      </div>
      <div>
        <p className="text-xs font-semibold text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">Electricity Bill Reduction Target</p>
      </div>
    </div>
  );
};

export const SolarCalculator = ({ heading = true }: { heading?: boolean }) => {
  const [billStr, setBillStr] = useState("6000");
  const [unitsStr, setUnitsStr] = useState("750");
  const [rateStr, setRateStr] = useState("8.0");
  const [state, setState] = useState("Uttar Pradesh");
  const [city, setCity] = useState("Lucknow");
  const [roof, setRoof] = useState(roofTypes[0]);
  const [connection, setConnection] = useState(connectionTypes[0]);
  const [submitted, setSubmitted] = useState(false);

  // Parse inputs safely for calculations
  const bill = parseFloat(billStr) || 0;
  const units = parseFloat(unitsStr) || 0;
  const rate = parseFloat(rateStr) || 0;

  // Sync inputs dynamically using the user's custom electricity rate
  const handleBillChange = (valStr: string) => {
    setBillStr(valStr);
    if (valStr.trim() === "") {
      setUnitsStr("");
      return;
    }
    const val = parseFloat(valStr);
    const r = parseFloat(rateStr);
    if (!isNaN(val) && val > 0 && !isNaN(r) && r > 0) {
      setUnitsStr(String(Math.round(val / r)));
    }
  };

  const handleUnitsChange = (valStr: string) => {
    setUnitsStr(valStr);
    if (valStr.trim() === "") {
      setBillStr("");
      return;
    }
    const val = parseFloat(valStr);
    const r = parseFloat(rateStr);
    if (!isNaN(val) && val > 0 && !isNaN(r) && r > 0) {
      setBillStr(String(Math.round(val * r)));
    }
  };

  const handleRateChange = (valStr: string) => {
    setRateStr(valStr);
    if (valStr.trim() === "") {
      return;
    }
    const r = parseFloat(valStr);
    const u = parseFloat(unitsStr);
    if (!isNaN(r) && r > 0 && !isNaN(u) && u > 0) {
      setBillStr(String(Math.round(u * r)));
    }
  };

  // Fully dynamic result calculation using user-entered electricity rate
  const result = useMemo(() => {
    const safeUnits = Math.max(50, units || (rate > 0 ? Math.round(bill / rate) : 0));

    // 1. Recommended Solar Plant Size (kW) based on monthly units
    const kw = Math.max(1, Math.round(safeUnits / 120));

    // 2. Estimated System Cost (Tier-1 EPC benchmark in India)
    const isDomestic = connection.startsWith("Domestic");
    const isCommercial = connection.startsWith("Commercial");

    let cost = 0;
    if (isDomestic) {
      if (kw === 1) cost = 65000;
      else if (kw === 2) cost = 125000;
      else if (kw === 3) cost = 180000;
      else cost = 180000 + (kw - 3) * 55000;
    } else if (isCommercial) {
      cost = kw * 55000;
    } else {
      cost = kw * 48000;
    }

    // 3. Subsidies (Residential Connections)
    let centralSubsidy = 0;
    let stateSubsidy = 0;

    if (isDomestic) {
      if (kw === 1) centralSubsidy = 30000;
      else if (kw === 2) centralSubsidy = 60000;
      else if (kw >= 3) centralSubsidy = 78000;

      if (state === "Uttar Pradesh") {
        stateSubsidy = Math.min(30000, kw * 15000);
      }
    }

    const totalSubsidy = centralSubsidy + stateSubsidy;
    const netCost = Math.max(0, cost - totalSubsidy);

    // 4. Generation & Savings Calculations using user's electricity rate
    const monthlyGen = kw * 120;
    const activeRate = rate > 0 ? rate : 8.0;
    const monthlySavings = Math.round(monthlyGen * activeRate);
    const annualSavings = monthlySavings * 12;

    // 5. Payback & Environmental Metrics
    const paybackYears = annualSavings > 0 ? Number((netCost / annualSavings).toFixed(1)) : 0;
    const co2Tonnes = Number(((monthlyGen * 12 * 0.85) / 1000).toFixed(1));

    return {
      kw,
      cost,
      centralSubsidy,
      stateSubsidy,
      totalSubsidy,
      netCost,
      monthlyGen,
      monthlySavings,
      annualSavings,
      paybackYears,
      co2Tonnes,
      rate: activeRate,
    };
  }, [units, bill, rate, connection, state]);

  // Chart 1: 10-Year Cumulative Savings Data
  const cumulativeSavingsData = useMemo(() => {
    let accumulatedSavings = 0;
    const data = [];
    for (let yr = 1; yr <= 10; yr++) {
      const yearSavings = result.annualSavings * Math.pow(1.04, yr - 1);
      accumulatedSavings += yearSavings;
      data.push({
        year: `Yr ${yr}`,
        savings: Math.round(accumulatedSavings),
      });
    }
    return data;
  }, [result.annualSavings]);

  // Chart 2: Estimated Monthly Solar Generation
  const monthlyGenerationData = useMemo(() => {
    const monthlyFactors = [115, 125, 145, 150, 140, 110, 95, 100, 115, 125, 120, 110];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((month, index) => ({
      month,
      units: Math.round(result.kw * monthlyFactors[index]),
    }));
  }, [result.kw]);

  return (
    <MotionSection animation="fadeLeft" className="section bg-gradient-soft">
      <div className="container-wide space-y-10">
        {heading && (
          <SectionHeading
            eyebrow="Solar Savings Calculator"
            title={<>Know your numbers <span className="text-gradient">before you sign</span></>}
            description="Dynamic plant sizing, system cost, state & central subsidies and ROI analysis calculated from your actual consumption and local electricity rate."
          />
        )}

        {/* Section 1: Calculator Input + Results Section */}
        <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
          {/* Calculator Input Form */}
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
              toast.success(`Solar savings calculated for ${city}, ${state}!`);
            }}
            className="group calc-card-glow relative transition-all duration-500"
          >
            <div className="relative h-full w-full overflow-hidden rounded-3xl p-6 md:p-8 space-y-5 transition-all duration-500 calc-card-gradient-border">
              <div className="space-y-2">
                <Label htmlFor="bill">Monthly Electricity Bill (₹)</Label>
                <Input
                  id="bill"
                  type="number"
                  placeholder="e.g. 6000"
                  value={billStr}
                  onChange={(e) => handleBillChange(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="units">Monthly Electricity Consumption (units)</Label>
                <Input
                  id="units"
                  type="number"
                  placeholder="e.g. 750"
                  value={unitsStr}
                  onChange={(e) => handleUnitsChange(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate">Electricity Rate (₹/unit)</Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.10"
                  placeholder="e.g. 8.0"
                  value={rateStr}
                  onChange={(e) => handleRateChange(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stateDisplay">State</Label>
                <div
                  id="stateDisplay"
                  className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-muted/40 px-3.5 py-2 text-sm font-semibold text-foreground select-none"
                >
                  <span>Uttar Pradesh</span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Active Region
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 custom-scrollbar">
                    {cities.map((c) => (
                      <SelectItem key={c} value={c} className="cursor-pointer">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Roof Type</Label>
                <Select value={roof} onValueChange={setRoof}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roofTypes.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Electricity Connection Type</Label>
                <Select value={connection} onValueChange={setConnection}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {connectionTypes.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="btn-premium h-12 w-full rounded-full bg-gradient-brand text-base font-semibold text-primary-foreground shadow-glow"
              >
                Calculate Savings
              </Button>

              {/* Circular Progress Meter */}
              <div className="pt-2">
                <CircularProgress
                  percentage={Math.min(100, Math.round((result.monthlyGen / Math.max(1, units)) * 100))}
                />
              </div>

              {submitted && (
                <p className="text-center text-xs text-muted-foreground">
                  Results updated for {city}, {state} · @ ₹{rate}/unit · {roof}
                </p>
              )}
            </div>
          </motion.form>

          {/* Dynamic Result Display Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${result.kw}-${result.cost}-${result.totalSubsidy}-${result.netCost}-${result.rate}`}
              initial={{ opacity: 0, scale: 0.97, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.97, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-7"
            >
              {/* Header & Personalized Summary Banner */}
              <div className="calc-card-glow group relative transition-all duration-500">
                <div className="calc-card-gradient-border relative flex flex-col justify-between rounded-3xl bg-card p-6 shadow-soft space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="eyebrow text-xs uppercase tracking-wider text-primary">Calculation Summary</span>
                      <h3 className="text-2xl font-bold font-display text-foreground mt-1">Your Solar Estimate</h3>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-3 py-1 rounded-full text-xs font-semibold">
                      {city}, {state} · ₹{rate}/unit
                    </Badge>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground font-medium pt-2 border-t border-border/60">
                    Based on your monthly usage, a <span className="font-bold text-primary">{result.kw} kW</span> solar system is recommended.
                  </p>
                </div>
              </div>

              {/* 10 Dynamic Metric Cards */}
              <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                <motion.div whileHover={{ y: -4 }} className="group calc-card-glow relative transition-all duration-500">
                  <div className="relative flex h-full min-h-[135px] flex-col justify-between rounded-2xl border bg-card p-4 shadow-soft transition-all group-hover:border-primary/40">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                      <Gauge className="h-4 w-4 text-primary" />
                    </span>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Recommended Plant Size</p>
                      <p className="mt-1 font-display text-lg font-bold text-foreground">
                        <CountUpValue value={result.kw} suffix=" kW" />
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div whileHover={{ y: -4 }} className="group calc-card-glow relative transition-all duration-500">
                  <div className="relative flex h-full min-h-[135px] flex-col justify-between rounded-2xl border bg-card p-4 shadow-soft transition-all group-hover:border-primary/40">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                      <BadgeIndianRupee className="h-4 w-4 text-primary" />
                    </span>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Estimated System Cost</p>
                      <p className="mt-1 font-display text-lg font-bold text-foreground">
                        <CountUpValue value={result.cost} prefix="₹ " />
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div whileHover={{ y: -4 }} className="group calc-card-glow relative transition-all duration-500">
                  <div className="relative flex h-full min-h-[135px] flex-col justify-between rounded-2xl border bg-card p-4 shadow-soft transition-all group-hover:border-primary/40">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
                      <PiggyBank className="h-4 w-4 text-emerald-600" />
                    </span>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Central Subsidy</p>
                      <p className="mt-1 font-display text-lg font-bold text-emerald-600">
                        <CountUpValue value={result.centralSubsidy} prefix="₹ " />
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div whileHover={{ y: -4 }} className="group calc-card-glow relative transition-all duration-500">
                  <div className="relative flex h-full min-h-[135px] flex-col justify-between rounded-2xl border bg-card p-4 shadow-soft transition-all group-hover:border-primary/40">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
                      <Landmark className="h-4 w-4 text-amber-600" />
                    </span>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">UP State Subsidy</p>
                      <p className="mt-1 font-display text-lg font-bold text-amber-600">
                        <CountUpValue value={result.stateSubsidy} prefix="₹ " />
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div whileHover={{ y: -4 }} className="group calc-card-glow relative transition-all duration-500">
                  <div className="relative flex h-full min-h-[135px] flex-col justify-between rounded-2xl border bg-card p-4 shadow-soft transition-all group-hover:border-primary/40">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </span>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Total Subsidy</p>
                      <p className="mt-1 font-display text-lg font-bold text-primary">
                        <CountUpValue value={result.totalSubsidy} prefix="₹ " />
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div whileHover={{ y: -4 }} className="group calc-card-glow relative transition-all duration-500">
                  <div className="relative flex h-full min-h-[135px] flex-col justify-between rounded-2xl border bg-card p-4 shadow-soft transition-all group-hover:border-primary/40">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
                      <BadgeIndianRupee className="h-4 w-4 text-emerald-600" />
                    </span>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Your Net Cost</p>
                      <p className="mt-1 font-display text-lg font-bold text-foreground">
                        <CountUpValue value={result.netCost} prefix="₹ " />
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div whileHover={{ y: -4 }} className="group calc-card-glow relative transition-all duration-500">
                  <div className="relative flex h-full min-h-[135px] flex-col justify-between rounded-2xl border bg-card p-4 shadow-soft transition-all group-hover:border-primary/40">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </span>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Monthly Savings</p>
                      <p className="mt-1 font-display text-lg font-bold text-emerald-600">
                        <CountUpValue value={result.monthlySavings} prefix="₹ " />
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div whileHover={{ y: -4 }} className="group calc-card-glow relative transition-all duration-500">
                  <div className="relative flex h-full min-h-[135px] flex-col justify-between rounded-2xl border bg-card p-4 shadow-soft transition-all group-hover:border-primary/40">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </span>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Annual Savings</p>
                      <p className="mt-1 font-display text-lg font-bold text-primary">
                        <CountUpValue value={result.annualSavings} prefix="₹ " />
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div whileHover={{ y: -4 }} className="group calc-card-glow relative transition-all duration-500">
                  <div className="relative flex h-full min-h-[135px] flex-col justify-between rounded-2xl border bg-card p-4 shadow-soft transition-all group-hover:border-primary/40">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10">
                      <Clock className="h-4 w-4 text-sky-600" />
                    </span>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Payback Period</p>
                      <p className="mt-1 font-display text-lg font-bold text-foreground">
                        <CountUpValue value={result.paybackYears} suffix=" Years" decimals={1} />
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div whileHover={{ y: -4 }} className="group calc-card-glow relative sm:col-span-2 lg:col-span-3 transition-all duration-500">
                  <div className="relative flex h-full min-h-[135px] flex-col justify-between rounded-2xl border bg-card p-4 shadow-soft transition-all group-hover:border-primary/40">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
                      <Leaf className="h-4 w-4 text-emerald-600" />
                    </span>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">CO₂ Reduction</p>
                      <p className="mt-1 font-display text-lg font-bold text-emerald-600">
                        <CountUpValue value={result.co2Tonnes} suffix=" Tonnes / year" decimals={1} />
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons: Download PDF & WhatsApp Quote */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  className="h-11 flex-1 rounded-full px-5 text-sm font-semibold transition-all hover:border-primary/60"
                  onClick={() => {
                    toast.success("Downloading PDF quotation summary...");
                    window.print();
                  }}
                >
                  <FileText className="mr-2 h-4 w-4 text-primary" /> Download PDF
                </Button>
                <Button
                  asChild
                  className="btn-premium h-11 flex-1 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white shadow-glow hover:bg-emerald-700"
                >
                  <a
                    href={`https://wa.me/918317061340?text=${encodeURIComponent(
                      `Hi SSR Solar Power, I calculated a ${result.kw} kW Solar System for my property in ${city}, ${state}. Monthly bill: ₹${bill.toLocaleString("en-IN")}, Monthly Consumption: ${units} units @ ₹${rate}/unit. System Cost: ₹${result.cost.toLocaleString("en-IN")}, Central Subsidy: ₹${result.centralSubsidy.toLocaleString("en-IN")}, State Subsidy: ₹${result.stateSubsidy.toLocaleString("en-IN")}, Net Cost: ₹${result.netCost.toLocaleString("en-IN")}. Please share a detailed quotation.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp Quote
                  </a>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Section 2: Charts Section Below Calculator/Results */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`charts-${result.kw}-${result.annualSavings}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.45 }}
            className="w-full pt-4"
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 w-full">
              {/* Chart 1: 10-Year Cumulative Savings (Completely static container without rotation or hover tilt) */}
              <div className="relative flex h-full min-h-[380px] w-full flex-col rounded-3xl border bg-card p-6 shadow-soft transform-none hover:transform-none [&_svg]:!transform-none [&_svg]:!rotate-0">
                <h3 className="text-base font-semibold flex items-center gap-2 text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" /> 10-Year Cumulative Savings
                </h3>
                <div className="mt-4 flex-1 min-h-[280px] transform-none hover:transform-none">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cumulativeSavingsData}>
                      <defs>
                        <linearGradient id="financialFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.55} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis
                        dataKey="year"
                        tickLine={false}
                        axisLine={false}
                        fontSize={11}
                        stroke="hsl(var(--muted-foreground))"
                        interval={0}
                        height={28}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                        stroke="hsl(var(--muted-foreground))"
                        width={54}
                        tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: 12,
                          fontSize: 12,
                        }}
                        formatter={(value: number) => [`₹ ${value.toLocaleString("en-IN")}`, "Cumulative Savings"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="savings"
                        name="Cumulative Savings (₹)"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2.5}
                        fill="url(#financialFill)"
                        isAnimationActive={true}
                        animationDuration={1400}
                        animationEasing="ease-in-out"
                      />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Estimated Monthly Solar Generation (Completely static container without rotation or hover tilt) */}
              <div className="relative flex h-full min-h-[380px] w-full flex-col rounded-3xl border bg-card p-6 shadow-soft transform-none hover:transform-none [&_svg]:!transform-none [&_svg]:!rotate-0">
                <h3 className="text-base font-semibold text-foreground">Estimated Monthly Solar Generation</h3>
                <div className="mt-4 flex-1 min-h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyGenerationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="hsl(var(--muted-foreground))" width={44} />
                      <Tooltip
                        cursor={{ fill: "hsl(var(--muted))" }}
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: 12,
                          fontSize: 12,
                        }}
                        formatter={(value: number) => [`${value.toLocaleString("en-IN")} units`, "Generation"]}
                      />
                      <Bar
                        dataKey="units"
                        name="Generation (units)"
                        fill="hsl(var(--secondary))"
                        radius={[6, 6, 0, 0]}
                        isAnimationActive={true}
                        animationDuration={1400}
                        animationEasing="ease-in-out"
                      />
                      <Legend />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </MotionSection>
  );
};
