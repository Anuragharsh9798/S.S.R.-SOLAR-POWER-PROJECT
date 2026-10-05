import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Zap, Cpu, Lightbulb, ArrowRight, Sparkles, Compass } from "lucide-react";
import { BrandWordmark } from "./BrandWordmark";

// Photorealistic Residential Solar Canvas
import homeFlowCanvas from "@/assets/intro-4-energy-flow.jpg";

const STAGES = [
  {
    id: 0,
    number: "01",
    label: "Sunrise",
    tagline: "Natural morning sunlight illuminates your rooftop",
    icon: Sun,
  },
  {
    id: 1,
    number: "02",
    label: "Sunlight Captured",
    tagline: "High-efficiency solar cells absorb clean photon energy",
    icon: Compass,
  },
  {
    id: 2,
    number: "03",
    label: "Energy Generated",
    tagline: "Monocrystalline panels generate clean DC electricity",
    icon: Zap,
  },
  {
    id: 3,
    number: "04",
    label: "Electricity Flow",
    tagline: "Power flows smoothly through shielded conduits to the inverter",
    icon: Zap,
  },
  {
    id: 4,
    number: "05",
    label: "Smart Conversion",
    tagline: "Hybrid inverter seamlessly converts DC power into stable AC",
    icon: Cpu,
  },
  {
    id: 5,
    number: "06",
    label: "Home Powered",
    tagline: "100% clean solar energy illuminates your household",
    icon: Lightbulb,
  },
];

export const SolarIntroAnimation = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [progressStage, setProgressStage] = useState<number>(0);

  useEffect(() => {
    setMounted(true);

    try {
      // 1. Check prefers-reduced-motion
      if (typeof window !== "undefined" && window.matchMedia) {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) return;
      }

      // 2. Check session storage for once-per-session playback
      const alreadySeen = sessionStorage.getItem("ssr_solar_intro_viewed");
      if (!alreadySeen) {
        setIsVisible(true);
        document.body.style.overflow = "hidden";
      }
    } catch (e) {
      console.warn("Storage check exception:", e);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Synchronized continuous energy progression (~5.5 seconds total runtime)
  useEffect(() => {
    if (!isVisible) return;

    const t1 = setTimeout(() => setProgressStage(1), 900);   // Sunlight Captured
    const t2 = setTimeout(() => setProgressStage(2), 1800);  // Energy Generated
    const t3 = setTimeout(() => setProgressStage(3), 2700);  // Electricity Flow
    const t4 = setTimeout(() => setProgressStage(4), 3600);  // Smart Conversion
    const t5 = setTimeout(() => setProgressStage(5), 4500);  // Home Powered (Visual Climax)
    const t6 = setTimeout(() => {
      handleFinish();
    }, 5500); // Smooth dissolve into homepage

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [isVisible]);

  const handleFinish = () => {
    try {
      sessionStorage.setItem("ssr_solar_intro_viewed", "true");
    } catch (e) {
      // Ignore storage restrictions
    }
    document.body.style.overflow = "";
    setIsVisible(false);
  };

  if (!mounted || !isVisible) return null;

  const currentStageInfo = STAGES[progressStage];

  const content = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="continuous-solar-intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="fixed inset-0 z-[9999999] h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] flex flex-col justify-between overflow-hidden bg-slate-950 text-white select-none pointer-events-auto"
        >
          {/* UNIFIED CONTINUOUS SYSTEM CANVAS (SLOW CINEMATIC CAMERA DRIFT) */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <motion.div
              initial={{ scale: 1.04, y: 0 }}
              animate={{ scale: 1.0, y: -6 }}
              transition={{ duration: 5.5, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full"
            >
              <img
                src={homeFlowCanvas}
                alt="SSR Solar Power Continuous Solar Energy Journey"
                className="h-full w-full object-cover object-center brightness-[0.94] contrast-[1.05]"
              />

              {/* Natural Atmospheric Daybreak Lighting Transition */}
              <motion.div
                className="absolute inset-0 transition-opacity duration-1000"
                animate={{
                  background:
                    progressStage === 0
                      ? "linear-gradient(180deg, rgba(2,6,23,0.7) 0%, rgba(15,23,42,0.2) 50%, rgba(2,6,23,0.8) 100%)"
                      : progressStage <= 2
                      ? "linear-gradient(180deg, rgba(2,6,23,0.5) 0%, rgba(245,158,11,0.1) 40%, rgba(2,6,23,0.75) 100%)"
                      : "linear-gradient(180deg, rgba(2,6,23,0.45) 0%, rgba(16,185,129,0.08) 50%, rgba(2,6,23,0.85) 100%)",
                }}
                transition={{ duration: 1.2 }}
              />

              {/* Readability Vignette */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/70"
                aria-hidden
              />
            </motion.div>

            {/* STAGE 1 & 2: NATURAL SUNLIGHT & DIRECTIONAL VOLUMETRIC RAYS */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
              {/* Natural Sun Corona in Sky */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: progressStage <= 2 ? [0.45, 0.75, 0.55] : 0.35,
                  scale: progressStage <= 2 ? [1.0, 1.15, 1.05] : 1.05,
                }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -left-10 h-[320px] w-[320px] sm:h-[480px] sm:w-[480px] rounded-full bg-amber-400/25 blur-[70px] sm:blur-[110px]"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{
                  opacity: progressStage <= 2 ? [0.6, 0.85, 0.7] : 0.4,
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 left-4 sm:top-6 sm:left-6 h-28 w-28 sm:h-40 sm:w-40 rounded-full bg-yellow-100/35 blur-[35px] sm:blur-[45px]"
              />

              {/* Directional Volumetric Light Shafts */}
              <svg
                viewBox="0 0 1000 800"
                preserveAspectRatio="xMidYMid slice"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full"
                style={{ mixBlendMode: "screen" }}
              >
                <defs>
                  <linearGradient id="softRay1" x1="5%" y1="5%" x2="65%" y2="40%">
                    <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.65" />
                    <stop offset="40%" stopColor="#FDE047" stopOpacity="0.35" />
                    <stop offset="75%" stopColor="#F59E0B" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id="softRay2" x1="8%" y1="5%" x2="80%" y2="45%">
                    <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.7" />
                    <stop offset="45%" stopColor="#FBBF24" stopOpacity="0.4" />
                    <stop offset="80%" stopColor="#F59E0B" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id="softPhoton" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                    <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="75%" stopColor="#FDE047" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Volumetric Ray Shaft 1 */}
                <motion.polygon
                  points="50,30 90,40 600,280 520,300"
                  fill="url(#softRay1)"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: progressStage <= 2 ? [0.35, 0.65, 0.45] : 0.2,
                  }}
                  transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Volumetric Ray Shaft 2 */}
                <motion.polygon
                  points="70,25 110,35 780,290 690,320"
                  fill="url(#softRay2)"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: progressStage <= 2 ? [0.4, 0.75, 0.5] : 0.25,
                  }}
                  transition={{ duration: 2.4, delay: 0.3, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Moving Photon Streams Traveling to Solar Panels */}
                {[
                  { x1: 60, y1: 35, x2: 560, y2: 260, dur: 1.2, del: 0 },
                  { x1: 80, y1: 30, x2: 660, y2: 270, dur: 1.4, del: 0.2 },
                  { x1: 100, y1: 40, x2: 740, y2: 280, dur: 1.3, del: 0.4 },
                  { x1: 70, y1: 55, x2: 620, y2: 310, dur: 1.5, del: 0.3 },
                  { x1: 90, y1: 45, x2: 710, y2: 300, dur: 1.35, del: 0.5 },
                ].map((ray, i) => (
                  <g key={`photon-ray-${i}`}>
                    <line
                      x1={ray.x1}
                      y1={ray.y1}
                      x2={ray.x2}
                      y2={ray.y2}
                      stroke="#FDE047"
                      strokeWidth="1.5"
                      strokeOpacity="0.2"
                      strokeDasharray="6 4"
                    />
                    <motion.line
                      x1={ray.x1}
                      y1={ray.y1}
                      x2={ray.x2}
                      y2={ray.y2}
                      stroke="url(#softPhoton)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeDasharray="50 400"
                      animate={{
                        strokeDashoffset: [450, 0],
                        opacity: progressStage <= 2 ? [0.35, 0.85, 0.45] : 0.2,
                      }}
                      transition={{
                        strokeDashoffset: {
                          duration: ray.dur,
                          delay: ray.del,
                          repeat: Infinity,
                          ease: "linear",
                        },
                        opacity: {
                          duration: 1.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }}
                    />
                  </g>
                ))}

                {/* Soft Specular Highlights at Panels */}
                {progressStage >= 1 && (
                  <>
                    <motion.circle
                      cx="600"
                      cy="270"
                      r="12"
                      fill="#FEF08A"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0.8, 1.3, 0.9], opacity: [0.3, 0.7, 0.4] }}
                      transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                      className="blur-[2px]"
                    />
                    <motion.circle
                      cx="700"
                      cy="285"
                      r="15"
                      fill="#FFFFFF"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0.9, 1.4, 1.0], opacity: [0.4, 0.8, 0.5] }}
                      transition={{ duration: 1.5, delay: 0.3, repeat: Infinity, ease: "easeInOut" }}
                      className="blur-[2px]"
                    />
                  </>
                )}
              </svg>
            </div>

            {/* STAGE 3: SMOOTH SOLAR PANEL ILLUMINATION & BUSBAR PULSES (UNIFIED SVG COORDINATES) */}
            {progressStage >= 1 && (
              <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                <svg
                  viewBox="0 0 1000 800"
                  preserveAspectRatio="xMidYMid slice"
                  fill="none"
                  className="absolute inset-0 w-full h-full"
                  style={{ mixBlendMode: "screen" }}
                >
                  <defs>
                    <linearGradient id="cellPulseSoft" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FEF08A" stopOpacity="0" />
                      <stop offset="50%" stopColor="#FDE047" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>

                    <linearGradient id="panelSheen" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.1" />
                      <stop offset="50%" stopColor="#FDE047" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>

                  {/* Panel Area Excitation Glow */}
                  <motion.polygon
                    points="520,240 760,210 790,310 550,340"
                    fill="url(#panelSheen)"
                    animate={{
                      opacity: progressStage >= 2 ? [0.4, 0.75, 0.5] : [0.2, 0.5, 0.3],
                    }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="blur-md"
                  />

                  {/* Silicon Cell Busbar Energy Waves */}
                  {[
                    { x1: 530, y1: 250, x2: 750, y2: 220 },
                    { x1: 535, y1: 275, x2: 760, y2: 245 },
                    { x1: 540, y1: 300, x2: 770, y2: 270 },
                    { x1: 545, y1: 325, x2: 780, y2: 295 },
                  ].map((line, lineIdx) => (
                    <g key={`busbar-line-${lineIdx}`}>
                      <line
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="#FDE047"
                        strokeWidth="1"
                        strokeOpacity="0.2"
                      />
                      <motion.line
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="url(#cellPulseSoft)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="40 180"
                        animate={{
                          strokeDashoffset: [220, 0],
                          opacity: [0.3, 0.9, 0.45],
                        }}
                        transition={{
                          strokeDashoffset: {
                            duration: 1.1 + lineIdx * 0.15,
                            repeat: Infinity,
                            ease: "linear",
                          },
                          opacity: {
                            duration: 0.9,
                            repeat: Infinity,
                          },
                        }}
                      />
                    </g>
                  ))}
                </svg>
              </div>
            )}

            {/* STAGE 4: SMOOTH ELECTRICITY FLOW (PANELS -> INVERTER) */}
            {progressStage >= 2 && (
              <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                <svg
                  viewBox="0 0 1000 800"
                  preserveAspectRatio="xMidYMid slice"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0 w-full h-full"
                  style={{ mixBlendMode: "screen" }}
                >
                  <defs>
                    <linearGradient id="plasmaSoft" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFFBEB" />
                      <stop offset="30%" stopColor="#FDE047" />
                      <stop offset="70%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>

                    <linearGradient id="packetSoft" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                      <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.85" />
                      <stop offset="70%" stopColor="#FDE047" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Conduit Sheath Glow */}
                  <path
                    d="M 720 215 L 685 265 L 665 310 L 665 570 L 690 610 L 720 610 L 720 575"
                    stroke="#F59E0B"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="0.3"
                    className="blur-[2px]"
                  />

                  {/* Continuous Active Conduit Line */}
                  <path
                    d="M 720 215 L 685 265 L 665 310 L 665 570 L 690 610 L 720 610 L 720 575"
                    stroke="url(#plasmaSoft)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="0.7"
                  />

                  {/* Traveling Energy Packets */}
                  {[0, 0.25, 0.5, 0.75].map((delayFraction, pktIdx) => (
                    <motion.path
                      key={`energy-packet-${pktIdx}`}
                      d="M 720 215 L 685 265 L 665 310 L 665 570 L 690 610 L 720 610 L 720 575"
                      stroke="url(#packetSoft)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray="80 500"
                      animate={{
                        strokeDashoffset: [580, 0],
                      }}
                      transition={{
                        duration: 1.15,
                        delay: delayFraction * 1.15,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ))}

                  {/* Panel Output Origin Flare */}
                  <motion.circle
                    cx="720"
                    cy="215"
                    r="10"
                    fill="#FEF08A"
                    animate={{
                      scale: [0.9, 1.4, 1.0],
                      opacity: [0.5, 0.85, 0.6],
                    }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="blur-[1px]"
                  />
                  <circle cx="720" cy="215" r="4" fill="#FFFFFF" />

                  {/* Inverter Intake Node */}
                  <motion.circle
                    cx="720"
                    cy="575"
                    r="14"
                    fill="#10B981"
                    animate={{
                      scale: [0.85, 1.5, 0.95],
                      opacity: [0.4, 0.85, 0.5],
                    }}
                    transition={{
                      duration: 0.8,
                      delay: 0.35,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="blur-[2px]"
                  />
                  <circle cx="720" cy="575" r="5" fill="#34D399" />
                </svg>
              </div>
            )}

            {/* STAGE 5: SMOOTH INVERTER ACTIVATION & POWER CONVERSION */}
            {progressStage >= 3 && (
              <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                <svg
                  viewBox="0 0 1000 800"
                  preserveAspectRatio="xMidYMid slice"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0 w-full h-full"
                  style={{ mixBlendMode: "screen" }}
                >
                  <defs>
                    <linearGradient id="acPowerSoft" x1="100%" y1="0%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="50%" stopColor="#FDE047" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>

                    <linearGradient id="acWaveSoft" x1="100%" y1="0%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                      <stop offset="40%" stopColor="#34D399" stopOpacity="0.85" />
                      <stop offset="70%" stopColor="#FEF08A" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Inverter Status Indicator */}
                  <motion.circle
                    cx="720"
                    cy="555"
                    r="6"
                    fill="#34D399"
                    animate={{
                      scale: [0.9, 1.4, 1.0],
                      opacity: [0.5, 0.9, 0.6],
                    }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
                    className="blur-[1px]"
                  />
                  <circle cx="720" cy="555" r="2.5" fill="#FFFFFF" />

                  {/* Outbound AC Conduit Path */}
                  <path
                    d="M 720 635 L 560 635 L 450 635 L 420 590"
                    stroke="#10B981"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="0.25"
                    className="blur-[2px]"
                  />

                  <path
                    d="M 720 635 L 560 635 L 450 635 L 420 590"
                    stroke="url(#acPowerSoft)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="0.7"
                  />

                  {/* AC Energy Packets */}
                  {[0, 0.33, 0.66].map((delayFraction, acIdx) => (
                    <motion.path
                      key={`ac-energy-packet-${acIdx}`}
                      d="M 720 635 L 560 635 L 450 635 L 420 590"
                      stroke="url(#acWaveSoft)"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                      strokeDasharray="70 380"
                      animate={{
                        strokeDashoffset: [450, 0],
                      }}
                      transition={{
                        duration: 1.05,
                        delay: delayFraction * 1.05,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ))}

                  {/* Home Electrical Entry Flare */}
                  <motion.circle
                    cx="420"
                    cy="590"
                    r="12"
                    fill="#FEF08A"
                    animate={{
                      scale: [0.85, 1.4, 0.95],
                      opacity: [0.4, 0.8, 0.5],
                    }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                    className="blur-[2px]"
                  />
                  <circle cx="420" cy="590" r="4" fill="#FFFFFF" />
                </svg>
              </div>
            )}

            {/* STAGE 6: PROGRESSIVE BULB GLOW & LIVING ROOM RADIANCE (CLIMAX) */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
              <svg
                viewBox="0 0 1000 800"
                preserveAspectRatio="xMidYMid slice"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full"
                style={{ mixBlendMode: "screen" }}
              >
                <defs>
                  <radialGradient id="bulbFilamentSoft" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="35%" stopColor="#FEF08A" />
                    <stop offset="70%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Pendant Cord */}
                <line
                  x1="380"
                  y1="400"
                  x2="380"
                  y2="475"
                  stroke={progressStage >= 4 ? "#FDE047" : "#475569"}
                  strokeWidth="2"
                  strokeOpacity={progressStage >= 4 ? 0.8 : 0.3}
                />

                {/* Fixture Brass Cap */}
                <rect
                  x="373"
                  y="475"
                  width="14"
                  height="10"
                  rx="2"
                  fill={progressStage >= 4 ? "#F59E0B" : "#334155"}
                  stroke="#1E293B"
                  strokeWidth="1"
                />

                {/* Glass Bulb Dome */}
                <circle
                  cx="380"
                  cy="505"
                  r="18"
                  fill={progressStage >= 5 ? "url(#bulbFilamentSoft)" : progressStage === 4 ? "#78350F" : "#0F172A"}
                  stroke={progressStage >= 4 ? "#FDE047" : "#475569"}
                  strokeWidth="1.5"
                  fillOpacity={progressStage >= 5 ? 0.9 : progressStage === 4 ? 0.35 : 0.15}
                />

                {/* Progressive Filament Wire (Dim -> Warm Amber -> Incandescent Brilliance) */}
                <motion.path
                  d="M 375 496 Q 380 514 385 496"
                  fill="none"
                  stroke={progressStage >= 5 ? "#FFFFFF" : progressStage === 4 ? "#FDE047" : "#64748B"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  animate={{
                    opacity: progressStage >= 5 ? [0.75, 0.95, 0.85] : progressStage === 4 ? 0.45 : 0.15,
                    scale: progressStage >= 5 ? [1, 1.1, 1] : 1,
                  }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                />

                {/* Soft Volumetric Warm Halo Around Bulb */}
                {progressStage >= 4 && (
                  <>
                    <motion.circle
                      cx="380"
                      cy="505"
                      r="100"
                      fill="url(#bulbFilamentSoft)"
                      initial={{ scale: 0.2, opacity: 0 }}
                      animate={{
                        scale: progressStage >= 5 ? [1.05, 1.45, 1.2] : [0.4, 0.7, 0.5],
                        opacity: progressStage >= 5 ? [0.55, 0.85, 0.7] : [0.2, 0.4, 0.25],
                      }}
                      transition={{
                        duration: 1.3,
                        ease: "easeOut",
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className="blur-[8px]"
                    />

                    {progressStage >= 5 && (
                      <motion.circle
                        cx="380"
                        cy="505"
                        r="6"
                        fill="#FFFFFF"
                        animate={{ scale: [1, 1.5, 1.1] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                        className="blur-[1px]"
                      />
                    )}
                  </>
                )}
              </svg>
            </div>
          </div>

          {/* TOP HEADER: OFFICIAL SSR SOLAR POWER LOGO & SKIP OPTION (RESPONSIVE VIEWPORT BOUNDS) */}
          <div className="relative z-30 flex items-center justify-between px-3.5 py-3 sm:px-6 sm:py-5 md:px-8 md:py-6 w-full max-w-7xl mx-auto shrink-0">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-1.5 sm:gap-2.5 min-w-0"
            >
              <motion.img
                src="/logo-icon.png"
                alt="SSR Solar Power Official Logo"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.3 }}
                className="h-7 w-7 sm:h-9 sm:w-9 lg:h-10 lg:w-10 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] shrink-0"
              />
              <BrandWordmark onDark={true} className="text-xs sm:text-base lg:text-lg truncate" />
            </motion.div>

            {/* Skip Intro Action (Always Accessible & Sized for Touch) */}
            <motion.button
              type="button"
              onClick={handleFinish}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              aria-label="Skip solar introduction"
              className="group flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/25 bg-black/50 px-3 sm:px-5 py-1.5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-black/70 hover:border-amber-400/60 cursor-pointer shadow-soft shrink-0 ml-2"
            >
              <span>Skip Intro</span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>

          {/* CENTER STAGE NARRATIVE BANNER (RESPONSIVE TYPOGRAPHY & SAFE MARGINS) */}
          <div className="relative z-30 px-3.5 sm:px-6 max-w-3xl mx-auto text-center my-auto flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStageInfo.id}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.32 }}
                className="space-y-1.5 sm:space-y-2.5"
              >
                <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-black/60 border border-white/20 px-3 py-1 sm:px-4 sm:py-1.5 backdrop-blur-md shadow-soft">
                  <currentStageInfo.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400 shrink-0" />
                  <span className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-white">
                    {currentStageInfo.number}. {currentStageInfo.label}
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-lg text-balance leading-snug sm:leading-tight px-1 max-w-2xl mx-auto">
                  {currentStageInfo.tagline}
                </h2>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* BOTTOM STEP PROGRESS TRACKER (NO OVERFLOW ON 320px TO 430px) */}
          <div className="relative z-30 px-3.5 py-2.5 sm:px-6 sm:py-4 md:px-8 md:py-6 w-full max-w-5xl mx-auto flex flex-col items-center gap-2 sm:gap-3 shrink-0">
            {/* 6 Stage Continuous Progress Bars */}
            <div className="grid grid-cols-6 gap-1.5 sm:gap-2.5 md:gap-3 w-full max-w-3xl">
              {STAGES.map((s, idx) => (
                <div key={s.id} className="w-full flex flex-col items-center gap-1">
                  <div className="w-full h-1.5 sm:h-2 rounded-full bg-white/20 overflow-hidden backdrop-blur-sm">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-400"
                      initial={{ width: "0%" }}
                      animate={{
                        width: idx < progressStage ? "100%" : idx === progressStage ? "100%" : "0%",
                      }}
                      transition={{ duration: idx === progressStage ? 0.9 : 0.2, ease: "linear" }}
                    />
                  </div>
                  <span
                    className={`hidden sm:block text-[9px] md:text-[10px] uppercase font-bold tracking-wider transition-colors duration-300 ${
                      idx === progressStage
                        ? "text-amber-300 font-extrabold"
                        : idx < progressStage
                        ? "text-white/80 font-semibold"
                        : "text-white/40"
                    }`}
                  >
                    {s.number} {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Mobile Active Stage Indicator Text */}
            <div className="sm:hidden flex items-center justify-center gap-1 text-[11px] font-semibold text-amber-300/90 text-center tracking-wide">
              <span>Stage {currentStageInfo.number}/06:</span>
              <span className="text-white font-bold">{currentStageInfo.label}</span>
            </div>

            <p className="text-[10px] sm:text-[11px] text-white/70 text-center flex items-center justify-center gap-1 drop-shadow-sm px-2 truncate max-w-full">
              <Sparkles className="h-3 w-3 text-amber-400 shrink-0" />
              <span className="truncate">SSR Solar Power • Continuous Clean Energy Flow from Sun to Home</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};
