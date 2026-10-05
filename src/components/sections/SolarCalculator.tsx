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
  FileText,
  Gauge,
  Leaf,
  Maximize2,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Loader2,
  AlertCircle,
  ShieldCheck,
  PiggyBank,
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

import { api } from "@/lib/api";

export const SolarCalculator = ({ heading = true, className = "" }: { heading?: boolean; className?: string }) => {
  const [billStr, setBillStr] = useState("6000");
  const [unitsStr, setUnitsStr] = useState("750");
  const [rateStr, setRateStr] = useState("8.0");
  const [state, setState] = useState("Uttar Pradesh");
  const [city, setCity] = useState("Lucknow");
  const [roof, setRoof] = useState(roofTypes[0]);
  const [connection, setConnection] = useState(connectionTypes[0]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendData, setBackendData] = useState<any>(null);

  // Parse inputs safely
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

  // Fetch calculation from backend API
  const calculateWithBackend = async (
    bVal: number = bill,
    uVal: number = units,
    rVal: number = rate
  ) => {
    if (loading) return; // Prevent duplicate concurrent requests
    setLoading(true);
    setError(null);

    try {
      const payload = {
        monthlyBillAmount: bVal > 0 ? bVal : undefined,
        monthlyUnits: uVal > 0 ? uVal : undefined,
        electricityRate: rVal > 0 ? rVal : 8.0,
        state,
        city,
      };

      const res = await api.post<any>("/api/v1/calculator/calculate", payload);

      if (res && res.data) {
        setBackendData(res.data);
      }
    } catch (err: any) {
      console.error("Backend solar calculator API error:", err);
      setError(err.message || "Unable to calculate solar savings from backend API.");
    } finally {
      setLoading(false);
    }
  };

  // Initial backend calculation on component mount
  useEffect(() => {
    calculateWithBackend();
  }, []);

  // Derive results strictly from authoritative backend response
  const result = useMemo(() => {
    if (backendData) {
      return {
        kw: backendData.recommendedPlantSizeKw,
        requiredPanels: backendData.panelSpecs.requiredPanels,
        requiredRoofArea: backendData.panelSpecs.requiredRoofAreaSqFt,
        monthlyGen: backendData.generation.monthlyKwh,
        monthlySavings: backendData.financials.monthlySavingsRs,
        annualSavings: backendData.financials.annualSavingsRs,
        co2Tonnes: backendData.environmental.co2ReductionTonnesPerYear,
        totalSubsidy: backendData.financials.totalSubsidyRs,
        centralSubsidy: backendData.financials.centralSubsidyRs,
        stateSubsidy: backendData.financials.stateSubsidyRs,
        netCost: backendData.financials.netCostRs,
        paybackPeriod: backendData.financials.paybackPeriodYears,
        grossCost: backendData.financials.grossCostRs,
        rate: rate > 0 ? rate : 8.0,
      };
    }

    // Default fallback while initial fetch completes
    return {
      kw: 6.0,
      requiredPanels: 12,
      requiredRoofArea: 333.96,
      monthlyGen: 810,
      monthlySavings: 6480,
      annualSavings: 77760,
      co2Tonnes: 7.97,
      totalSubsidy: 108000,
      centralSubsidy: 78000,
      stateSubsidy: 30000,
      netCost: 222000,
      paybackPeriod: 2.9,
      grossCost: 330000,
      rate: 8.0,
    };
  }, [backendData, rate]);

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
    <>
      {/* Printable PDF Template (Visible ONLY during print/PDF export) */}
      <div className="hidden print:block p-8 bg-white text-black font-sans space-y-6">
        <div className="border-b-2 border-emerald-600 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-emerald-700">SSR SOLAR POWER</h1>
            <p className="text-xs text-gray-500">Official Solar Savings Calculation Summary</p>
          </div>
          <div className="text-right text-xs text-gray-600">
            <p className="font-semibold">{city}, {state}</p>
            <p>Tariff: ₹{rate}/unit · {roof}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">Key Results Summary</h2>
          <div className="grid grid-cols-2 gap-4 border rounded-xl p-5 bg-gray-50 text-sm">
            <div className="border-r pr-4">
              <p className="text-xs font-semibold text-gray-500 uppercase">Recommended Plant Size</p>
              <p className="text-xl font-bold text-emerald-700 mt-1">{result.kw.toFixed(2)} kW</p>
            </div>
            <div className="pl-2">
              <p className="text-xs font-semibold text-gray-500 uppercase">Required Roof Area</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{result.requiredRoofArea.toFixed(2)} sq. ft.</p>
              <p className="text-xs text-emerald-700 font-semibold mt-0.5">{result.requiredPanels} Panels × 530W</p>
            </div>
            <div className="border-r pr-4 border-t pt-3">
              <p className="text-xs font-semibold text-gray-500 uppercase">Monthly Savings</p>
              <p className="text-xl font-bold text-gray-900 mt-1">₹ {result.monthlySavings.toLocaleString("en-IN")}</p>
            </div>
            <div className="pl-2 border-t pt-3">
              <p className="text-xs font-semibold text-gray-500 uppercase">Annual Savings</p>
              <p className="text-xl font-bold text-emerald-600 mt-1">₹ {result.annualSavings.toLocaleString("en-IN")}</p>
            </div>
            <div className="col-span-2 border-t pt-3">
              <p className="text-xs font-semibold text-gray-500 uppercase">CO₂ Reduction</p>
              <p className="text-xl font-bold text-emerald-700 mt-1">{result.co2Tonnes.toFixed(2)} Tonnes / year</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-[10px] leading-relaxed text-gray-600">
            <p>
              <strong>Disclaimer:</strong> All calculations shown are indicative estimates based on the information provided by the user, standard assumptions and current reference values. Actual solar generation, savings, system size, roof-area requirements, CO₂ reduction, electricity tariffs and final project costs may vary depending on site conditions, roof orientation, shading, system design, equipment specifications, local DISCOM regulations, weather and other factors. This calculator does not constitute a final quotation, engineering assessment or guaranteed savings. Please contact SSR Solar Power for a site survey and final proposal.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t text-xs text-gray-500 text-center space-y-1">
          <p className="font-semibold text-gray-700">SSR Solar Power · Mau, Uttar Pradesh</p>
          <p>Contact: +91 8317061340 · Website: ssrsolarpower.com</p>
        </div>
      </div>

      {/* Main Interactive Calculator Section */}
      <MotionSection animation="fadeLeft" className={`section bg-gradient-soft print:hidden py-10 md:py-14 ${className}`}>
        <div className="container-wide space-y-7 md:space-y-8">
          {heading && (
            <SectionHeading
              eyebrow="Solar Savings Calculator"
              title={<>Know your numbers <span className="text-gradient">before you sign</span></>}
              description="Calculate recommended rooftop plant size, required roof area, monthly savings, annual savings and carbon reduction from your actual electricity usage."
            />
          )}

          {/* Section 1: Calculator Input + Results Section */}
          <div className="grid items-start gap-6 md:gap-7 xl:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
            {/* Calculator Input Form */}
            <motion.form
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmitted(true);
                await calculateWithBackend();
                toast.success(`Solar savings calculated for ${city}, ${state}!`);
              }}
              className="group calc-card-glow relative transition-all duration-500"
            >
              <div className="relative h-full w-full overflow-hidden rounded-3xl p-6 md:p-8 space-y-4 transition-all duration-500 calc-card-gradient-border">
                {error && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

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
                  disabled={loading}
                  className="btn-premium h-12 w-full rounded-full bg-gradient-brand text-base font-semibold text-primary-foreground shadow-glow mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Calculating Backend Savings...
                    </>
                  ) : (
                    "Calculate Savings"
                  )}
                </Button>

                {submitted && (
                  <p className="text-center text-xs text-muted-foreground pt-1">
                    Results updated for {city}, {state} · @ ₹{rate}/unit
                  </p>
                )}
              </div>
            </motion.form>

            {/* Dynamic Result Display Container */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${result.kw}-${result.requiredRoofArea}-${result.monthlySavings}-${result.annualSavings}-${result.rate}`}
                initial={{ opacity: 0, scale: 0.97, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.97, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                {/* Personalized Summary Banner */}
                <div className="calc-card-glow group relative transition-all duration-500">
                  <div className="calc-card-gradient-border relative flex flex-col justify-between rounded-3xl bg-card p-6 shadow-soft space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="eyebrow text-xs uppercase tracking-wider text-primary">Calculation Summary</span>
                        <h3 className="text-2xl font-bold font-display text-foreground mt-1">Your Solar Estimate</h3>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-3 py-1 rounded-full text-xs font-semibold">
                        {city}, {state}
                      </Badge>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground font-medium pt-2 border-t border-border/60">
                      Based on your energy consumption, a <span className="font-bold text-primary">{result.kw.toFixed(2)} kW</span> solar system ({result.requiredPanels} Panels × 530W) is recommended.
                    </p>
                  </div>
                </div>

                {/* 1. TOP ROW: SIDE-BY-SIDE CARDS (Recommended Plant Size & Required Roof Area) */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  {/* Card 1: Recommended Plant Size */}
                  <motion.div whileHover={{ y: -4 }} className="group calc-card-glow relative transition-all duration-500">
                    <div className="relative flex h-full min-h-[140px] flex-col justify-between rounded-2xl border bg-card p-5 shadow-soft transition-all group-hover:border-primary/40">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Gauge className="h-5 w-5 text-primary" />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground font-semibold">Recommended Plant Size</p>
                        <p className="mt-1.5 font-display text-2xl font-bold text-foreground">
                          <CountUpValue value={result.kw} suffix=" kW" decimals={2} />
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Card 2: Required Roof Area */}
                  <motion.div whileHover={{ y: -4 }} className="group calc-card-glow relative transition-all duration-500">
                    <div className="relative flex h-full min-h-[140px] flex-col justify-between rounded-2xl border bg-card p-5 shadow-soft transition-all group-hover:border-primary/40">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                        <Maximize2 className="h-5 w-5 text-amber-600" />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground font-semibold">Required Roof Area</p>
                        <p className="mt-1.5 font-display text-2xl font-bold text-foreground">
                          <CountUpValue value={result.requiredRoofArea} suffix=" sq. ft." decimals={2} />
                        </p>
                        <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          {result.requiredPanels} Panels × 530W
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* 2. BOTTOM ROW: CARDS BELOW TOP ROW (Monthly Savings, Annual Savings, CO2 Reduction) */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                  {/* Card 3: Monthly Savings */}
                  <motion.div whileHover={{ y: -4 }} className="group calc-card-glow relative transition-all duration-500">
                    <div className="relative flex h-full min-h-[140px] flex-col justify-between rounded-2xl border bg-card p-5 shadow-soft transition-all group-hover:border-primary/40">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground font-semibold">Monthly Savings</p>
                        <p className="mt-1.5 font-display text-xl font-bold text-emerald-600">
                          <CountUpValue value={result.monthlySavings} prefix="₹ " />
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Card 4: Annual Savings */}
                  <motion.div whileHover={{ y: -4 }} className="group calc-card-glow relative transition-all duration-500">
                    <div className="relative flex h-full min-h-[140px] flex-col justify-between rounded-2xl border bg-card p-5 shadow-soft transition-all group-hover:border-primary/40">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground font-semibold">Annual Savings</p>
                        <p className="mt-1.5 font-display text-xl font-bold text-primary">
                          <CountUpValue value={result.annualSavings} prefix="₹ " />
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Card 5: CO2 Reduction */}
                  <motion.div whileHover={{ y: -4 }} className="group calc-card-glow relative transition-all duration-500">
                    <div className="relative flex h-full min-h-[140px] flex-col justify-between rounded-2xl border bg-card p-5 shadow-soft transition-all group-hover:border-primary/40">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                        <Leaf className="h-5 w-5 text-emerald-600" />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground font-semibold">CO₂ Reduction</p>
                        <p className="mt-1.5 font-display text-xl font-bold text-emerald-600">
                          <CountUpValue value={result.co2Tonnes} suffix=" Tonnes / yr" decimals={2} />
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* 3. SUBSIDY & PAYBACK BREAKDOWN CARD (Backend Authoritative Values) */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <motion.div whileHover={{ y: -4 }} className="group calc-card-glow relative transition-all duration-500">
                    <div className="relative flex h-full min-h-[140px] flex-col justify-between rounded-2xl border bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 p-5 shadow-soft">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
                        <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground font-semibold">Government Subsidy</p>
                        <p className="mt-1.5 font-display text-xl font-bold text-emerald-600 dark:text-emerald-400">
                          <CountUpValue value={result.totalSubsidy} prefix="₹ " />
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Central: ₹{result.centralSubsidy.toLocaleString('en-IN')} · State: ₹{result.stateSubsidy.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ y: -4 }} className="group calc-card-glow relative transition-all duration-500">
                    <div className="relative flex h-full min-h-[140px] flex-col justify-between rounded-2xl border bg-primary/5 dark:bg-primary/10 border-primary/20 p-5 shadow-soft">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground font-semibold">Estimated Net Investment</p>
                        <p className="mt-1.5 font-display text-xl font-bold text-primary">
                          <CountUpValue value={result.netCost} prefix="₹ " />
                        </p>
                        <p className="mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          Payback Period: ~{result.paybackPeriod} Years
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Professional Disclaimer Container */}
                <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 text-[11px] leading-relaxed text-muted-foreground shadow-soft">
                  <p>
                    <strong className="font-semibold text-foreground">Disclaimer:</strong> All calculations shown are indicative estimates based on the information provided by the user, standard assumptions and current reference values. Actual solar generation, savings, system size, roof-area requirements, CO₂ reduction, electricity tariffs and final project costs may vary depending on site conditions, roof orientation, shading, system design, equipment specifications, local DISCOM regulations, weather and other factors. This calculator does not constitute a final quotation, engineering assessment or guaranteed savings. Please contact SSR Solar Power for a site survey and final proposal.
                  </p>
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
                        `Hi SSR Solar Power, I calculated a solar system for my property in ${city}, ${state}.\n- Recommended Plant Size: ${result.kw.toFixed(2)} kW\n- Required Roof Area: ${result.requiredRoofArea.toFixed(2)} sq. ft. (${result.requiredPanels} Panels × 530W)\n- Monthly Savings: ₹${result.monthlySavings.toLocaleString("en-IN")}\n- Annual Savings: ₹${result.annualSavings.toLocaleString("en-IN")}\n- CO2 Reduction: ${result.co2Tonnes.toFixed(2)} Tonnes/year.\n\nPlease share a detailed quotation.`,
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
                {/* Chart 1: 10-Year Cumulative Savings */}
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

                {/* Chart 2: Estimated Monthly Solar Generation */}
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
    </>
  );
};
