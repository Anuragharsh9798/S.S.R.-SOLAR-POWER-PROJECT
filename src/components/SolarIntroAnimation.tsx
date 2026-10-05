import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Zap, Cpu, Lightbulb, ArrowRight, Sparkles, Compass } from "lucide-react";
import { BrandWordmark } from "./BrandWordmark";
import { pauseLenis, resumeLenis } from "./SmoothScroll";

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
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const handleFinish = useCallback(() => {
    // Clear all pending progression timers immediately
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];

    try {
      sessionStorage.setItem("ssr_solar_intro_viewed", "true");
    } catch {
      // Ignore storage restrictions
    }

    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
    resumeLenis();
    setIsVisible(false);
  }, []);

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
        if (typeof document !== "undefined") {
          document.body.style.overflow = "hidden";
        }
        pauseLenis();
      }
    } catch (e) {
      console.warn("Storage check exception:", e);
    }

    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
      resumeLenis();
    };
  }, []);

  // Synchronized continuous energy progression (~5.5 seconds total runtime)
  useEffect(() => {
    if (!isVisible) return;

    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];

    timersRef.current.push(setTimeout(() => setProgressStage(1), 900));   // Sunlight Captured
    timersRef.current.push(setTimeout(() => setProgressStage(2), 1800));  // Energy Generated
    timersRef.current.push(setTimeout(() => setProgressStage(3), 2700));  // Electricity Flow
    timersRef.current.push(setTimeout(() => setProgressStage(4), 3600));  // Smart Conversion
    timersRef.current.push(setTimeout(() => setProgressStage(5), 4500));  // Home Powered (Visual Climax)
    timersRef.current.push(setTimeout(() => handleFinish(), 5500));       // Smooth dissolve into homepage

    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };
  }, [isVisible, handleFinish]);

  if (!mounted || !isVisible) return null;

  const currentStageInfo = STAGES[progressStage];

  const content = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="continuous-solar-intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="fixed inset-0 z-[9999999] h-[100dvh] max-h-[100dvh] w-screen max-w-full overflow-hidden bg-slate-950 text-white select-none pointer-events-auto flex flex-col justify-between"
          style={{ width: "100vw", maxWidth: "100vw", height: "100dvh" }}
        >
          {/* UNIFIED CONTINUOUS SYSTEM CANVAS */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none max-w-full max-h-full">
            <motion.div
              initial={{ scale: 1.03, y: 0 }}
              animate={{ scale: 1.0, y: -4 }}
              transition={{ duration: 5.5, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full will-change-transform"
            >
              <img
                src={homeFlowCanvas}
                alt="SSR Solar Power Continuous Solar Energy Journey"
                className="h-full w-full object-cover object-[66%_center] md:object-center brightness-[0.93] contrast-[1.05]"
              />

              {/* Natural Atmospheric Daybreak Lighting Transition */}
              <motion.div
                className="absolute inset-0 transition-opacity duration-1000"
                animate={{
                  background:
                    progressStage === 0
                      ? "linear-gradient(180deg, rgba(2,6,23,0.72) 0%, rgba(15,23,42,0.18) 50%, rgba(2,6,23,0.85) 100%)"
                      : progressStage <= 2
                      ? "linear-gradient(180deg, rgba(2,6,23,0.52) 0%, rgba(245,158,11,0.1) 40%, rgba(2,6,23,0.78) 100%)"
                      : "linear-gradient(180deg, rgba(2,6,23,0.48) 0%, rgba(16,185,129,0.08) 50%, rgba(2,6,23,0.85) 100%)",
                }}
                transition={{ duration: 1.2 }}
              />

              {/* Readability Vignette */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/75"
                aria-hidden
              />
            </motion.div>

            {/* ========================================================================= */}
            {/* DESKTOP SVG VISUAL LAYER (1000 x 800 COORDINATE SYSTEM)                   */}
            {/* ========================================================================= */}
            <div className="hidden md:block absolute inset-0 pointer-events-none z-10 overflow-hidden">
              <svg
                viewBox="0 0 1000 800"
                preserveAspectRatio="xMidYMid slice"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full"
                style={{ mixBlendMode: "screen" }}
              >
                <defs>
                  <linearGradient id="deskSoftRay" x1="5%" y1="5%" x2="65%" y2="40%">
                    <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.65" />
                    <stop offset="40%" stopColor="#FDE047" stopOpacity="0.35" />
                    <stop offset="75%" stopColor="#F59E0B" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id="deskPhoton" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                    <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="75%" stopColor="#FDE047" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id="deskCellPulse" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FEF08A" stopOpacity="0" />
                    <stop offset="50%" stopColor="#FDE047" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id="deskPlasma" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFBEB" />
                    <stop offset="30%" stopColor="#FDE047" />
                    <stop offset="70%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>

                  <linearGradient id="deskPacket" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                    <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.85" />
                    <stop offset="70%" stopColor="#FDE047" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id="deskAcWave" x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                    <stop offset="40%" stopColor="#34D399" stopOpacity="0.85" />
                    <stop offset="70%" stopColor="#FEF08A" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </linearGradient>

                  <radialGradient id="deskBulb" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="35%" stopColor="#FEF08A" />
                    <stop offset="70%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Stage 1 & 2: Desktop Sunlight Rays */}
                <motion.polygon
                  points="50,30 90,40 600,280 520,300"
                  fill="url(#deskSoftRay)"
                  animate={{ opacity: progressStage <= 2 ? [0.35, 0.65, 0.45] : 0.2 }}
                  transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
                />

                {[
                  { x1: 60, y1: 35, x2: 560, y2: 260, dur: 1.2, del: 0 },
                  { x1: 80, y1: 30, x2: 660, y2: 270, dur: 1.4, del: 0.2 },
                  { x1: 100, y1: 40, x2: 740, y2: 280, dur: 1.3, del: 0.4 },
                  { x1: 70, y1: 55, x2: 620, y2: 310, dur: 1.5, del: 0.3 },
                ].map((ray, i) => (
                  <motion.line
                    key={`desk-ray-${i}`}
                    x1={ray.x1}
                    y1={ray.y1}
                    x2={ray.x2}
                    y2={ray.y2}
                    stroke="url(#deskPhoton)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="50 400"
                    animate={{
                      strokeDashoffset: [450, 0],
                      opacity: progressStage <= 2 ? [0.35, 0.85, 0.45] : 0.2,
                    }}
                    transition={{
                      strokeDashoffset: { duration: ray.dur, delay: ray.del, repeat: Infinity, ease: "linear" },
                      opacity: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
                    }}
                  />
                ))}

                {/* Stage 3: Desktop Panel Busbars */}
                {progressStage >= 1 && (
                  <>
                    {[
                      { x1: 530, y1: 250, x2: 750, y2: 220 },
                      { x1: 535, y1: 275, x2: 760, y2: 245 },
                      { x1: 540, y1: 300, x2: 770, y2: 270 },
                    ].map((line, lineIdx) => (
                      <motion.line
                        key={`desk-busbar-${lineIdx}`}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="url(#deskCellPulse)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="40 180"
                        animate={{ strokeDashoffset: [220, 0], opacity: [0.3, 0.9, 0.45] }}
                        transition={{
                          strokeDashoffset: { duration: 1.1 + lineIdx * 0.15, repeat: Infinity, ease: "linear" },
                          opacity: { duration: 0.9, repeat: Infinity },
                        }}
                      />
                    ))}
                  </>
                )}

                {/* Stage 4: Desktop DC Conduit Flow */}
                {progressStage >= 2 && (
                  <>
                    <path
                      d="M 720 215 L 685 265 L 665 310 L 665 570 L 690 610 L 720 610 L 720 575"
                      stroke="url(#deskPlasma)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeOpacity="0.7"
                    />
                    {[0, 0.33, 0.66].map((delayFraction, pktIdx) => (
                      <motion.path
                        key={`desk-packet-${pktIdx}`}
                        d="M 720 215 L 685 265 L 665 310 L 665 570 L 690 610 L 720 610 L 720 575"
                        stroke="url(#deskPacket)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray="80 500"
                        animate={{ strokeDashoffset: [580, 0] }}
                        transition={{ duration: 1.15, delay: delayFraction * 1.15, repeat: Infinity, ease: "linear" }}
                      />
                    ))}
                  </>
                )}

                {/* Stage 5: Desktop AC Output */}
                {progressStage >= 3 && (
                  <>
                    <path
                      d="M 720 635 L 560 635 L 450 635 L 420 590"
                      stroke="url(#deskPlasma)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeOpacity="0.7"
                    />
                    {[0, 0.5].map((delayFraction, acIdx) => (
                      <motion.path
                        key={`desk-ac-${acIdx}`}
                        d="M 720 635 L 560 635 L 450 635 L 420 590"
                        stroke="url(#deskAcWave)"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                        strokeDasharray="70 380"
                        animate={{ strokeDashoffset: [450, 0] }}
                        transition={{ duration: 1.05, delay: delayFraction * 1.05, repeat: Infinity, ease: "linear" }}
                      />
                    ))}
                  </>
                )}

                {/* Stage 6: Desktop Bulb & Fixture */}
                <line
                  x1="380"
                  y1="400"
                  x2="380"
                  y2="475"
                  stroke={progressStage >= 4 ? "#FDE047" : "#475569"}
                  strokeWidth="2"
                  strokeOpacity={progressStage >= 4 ? 0.8 : 0.3}
                />
                <circle
                  cx="380"
                  cy="505"
                  r="18"
                  fill={progressStage >= 5 ? "url(#deskBulb)" : progressStage === 4 ? "#78350F" : "#0F172A"}
                  stroke={progressStage >= 4 ? "#FDE047" : "#475569"}
                  strokeWidth="1.5"
                />
                {progressStage >= 4 && (
                  <motion.circle
                    cx="380"
                    cy="505"
                    r="90"
                    fill="url(#deskBulb)"
                    animate={{
                      scale: progressStage >= 5 ? [1.05, 1.45, 1.2] : [0.4, 0.7, 0.5],
                      opacity: progressStage >= 5 ? [0.55, 0.85, 0.7] : [0.2, 0.4, 0.25],
                    }}
                    transition={{ duration: 1.3, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
                  />
                )}
              </svg>
            </div>

            {/* ========================================================================= */}
            {/* MOBILE PORTRAIT SVG VISUAL LAYER (390 x 800 ZERO-OVERFLOW COORDINATES)    */}
            {/* ========================================================================= */}
            <div className="block md:hidden absolute inset-0 pointer-events-none z-10 overflow-hidden">
              <svg
                viewBox="0 0 390 800"
                preserveAspectRatio="xMidYMid slice"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full max-w-full max-h-full"
                style={{ mixBlendMode: "screen" }}
              >
                <defs>
                  <linearGradient id="mobSoftRay" x1="5%" y1="5%" x2="65%" y2="40%">
                    <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.65" />
                    <stop offset="40%" stopColor="#FDE047" stopOpacity="0.35" />
                    <stop offset="75%" stopColor="#F59E0B" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id="mobPhoton" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                    <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="75%" stopColor="#FDE047" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id="mobCellPulse" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FEF08A" stopOpacity="0" />
                    <stop offset="50%" stopColor="#FDE047" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id="mobPlasma" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFBEB" />
                    <stop offset="30%" stopColor="#FDE047" />
                    <stop offset="70%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>

                  <linearGradient id="mobPacket" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                    <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.85" />
                    <stop offset="70%" stopColor="#FDE047" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
                  </linearGradient>

                  <radialGradient id="mobBulb" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="35%" stopColor="#FEF08A" />
                    <stop offset="70%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Stage 1 & 2: Mobile Sunlight Rays */}
                <motion.polygon
                  points="25,45 55,50 290,240 230,255"
                  fill="url(#mobSoftRay)"
                  animate={{ opacity: progressStage <= 2 ? [0.35, 0.65, 0.45] : 0.2 }}
                  transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
                />

                {[
                  { x1: 30, y1: 50, x2: 240, y2: 235, dur: 1.2, del: 0 },
                  { x1: 45, y1: 45, x2: 280, y2: 245, dur: 1.4, del: 0.2 },
                  { x1: 35, y1: 65, x2: 320, y2: 255, dur: 1.3, del: 0.4 },
                ].map((ray, i) => (
                  <motion.line
                    key={`mob-ray-${i}`}
                    x1={ray.x1}
                    y1={ray.y1}
                    x2={ray.x2}
                    y2={ray.y2}
                    stroke="url(#mobPhoton)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="40 300"
                    animate={{
                      strokeDashoffset: [340, 0],
                      opacity: progressStage <= 2 ? [0.35, 0.85, 0.45] : 0.2,
                    }}
                    transition={{
                      strokeDashoffset: { duration: ray.dur, delay: ray.del, repeat: Infinity, ease: "linear" },
                      opacity: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
                    }}
                  />
                ))}

                {/* Stage 3: Mobile Panel Busbars (Anchored on Rooftop) */}
                {progressStage >= 1 && (
                  <>
                    {[
                      { x1: 220, y1: 230, x2: 340, y2: 220 },
                      { x1: 225, y1: 245, x2: 345, y2: 235 },
                      { x1: 230, y1: 260, x2: 350, y2: 250 },
                    ].map((line, lineIdx) => (
                      <motion.line
                        key={`mob-busbar-${lineIdx}`}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="url(#mobCellPulse)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="30 140"
                        animate={{ strokeDashoffset: [170, 0], opacity: [0.3, 0.9, 0.45] }}
                        transition={{
                          strokeDashoffset: { duration: 1.1 + lineIdx * 0.15, repeat: Infinity, ease: "linear" },
                          opacity: { duration: 0.9, repeat: Infinity },
                        }}
                      />
                    ))}
                  </>
                )}

                {/* Stage 4: Mobile DC Conduit (Panels -> Inverter) */}
                {progressStage >= 2 && (
                  <>
                    <path
                      d="M 335 240 L 315 280 L 300 320 L 300 460 L 315 480 L 330 480 L 330 460"
                      stroke="url(#mobPlasma)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeOpacity="0.75"
                    />
                    {[0, 0.5].map((delayFraction, pktIdx) => (
                      <motion.path
                        key={`mob-packet-${pktIdx}`}
                        d="M 335 240 L 315 280 L 300 320 L 300 460 L 315 480 L 330 480 L 330 460"
                        stroke="url(#mobPacket)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="60 380"
                        animate={{ strokeDashoffset: [440, 0] }}
                        transition={{ duration: 1.1, delay: delayFraction * 1.1, repeat: Infinity, ease: "linear" }}
                      />
                    ))}
                  </>
                )}

                {/* Stage 5: Mobile Smart AC Conversion Conduit */}
                {progressStage >= 3 && (
                  <path
                    d="M 330 495 L 240 495 L 180 495 L 160 460"
                    stroke="url(#mobPlasma)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="0.75"
                  />
                )}

                {/* Stage 6: Mobile Living Room Fixture & Bulb Glow */}
                <line
                  x1="140"
                  y1="370"
                  x2="140"
                  y2="430"
                  stroke={progressStage >= 4 ? "#FDE047" : "#475569"}
                  strokeWidth="2"
                  strokeOpacity={progressStage >= 4 ? 0.8 : 0.3}
                />
                <circle
                  cx="140"
                  cy="450"
                  r="14"
                  fill={progressStage >= 5 ? "url(#mobBulb)" : progressStage === 4 ? "#78350F" : "#0F172A"}
                  stroke={progressStage >= 4 ? "#FDE047" : "#475569"}
                  strokeWidth="1.5"
                />
                {progressStage >= 4 && (
                  <motion.circle
                    cx="140"
                    cy="450"
                    r="65"
                    fill="url(#mobBulb)"
                    animate={{
                      scale: progressStage >= 5 ? [1.05, 1.45, 1.2] : [0.4, 0.7, 0.5],
                      opacity: progressStage >= 5 ? [0.55, 0.85, 0.7] : [0.2, 0.4, 0.25],
                    }}
                    transition={{ duration: 1.3, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
                  />
                )}
              </svg>
            </div>
          </div>

          {/* TOP HEADER: OFFICIAL SSR SOLAR POWER LOGO & SKIP OPTION */}
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

            {/* Skip Intro Action */}
            <motion.button
              type="button"
              onClick={handleFinish}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              aria-label="Skip solar introduction"
              className="group flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/30 bg-black/60 px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-black/80 hover:border-amber-400/60 active:scale-95 cursor-pointer shadow-soft shrink-0 ml-2"
            >
              <span>Skip Intro</span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>

          {/* CENTER STAGE NARRATIVE BANNER */}
          <div className="relative z-30 px-3.5 sm:px-6 max-w-2xl mx-auto text-center my-auto flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStageInfo.id}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.32 }}
                className="space-y-1 sm:space-y-2"
              >
                <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-black/65 border border-white/20 px-3 py-1 text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-white shadow-soft">
                  <currentStageInfo.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400 shrink-0" />
                  <span>
                    {currentStageInfo.number}. {currentStageInfo.label}
                  </span>
                </div>
                <h2 className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-lg text-balance leading-snug sm:leading-tight px-1 max-w-xl mx-auto">
                  {currentStageInfo.tagline}
                </h2>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* BOTTOM STEP PROGRESS TRACKER */}
          <div className="relative z-30 px-3.5 py-2.5 sm:px-6 sm:py-4 md:px-8 md:py-6 w-full max-w-4xl mx-auto flex flex-col items-center gap-2 sm:gap-3 shrink-0">
            {/* 6 Stage Continuous Progress Bars */}
            <div className="grid grid-cols-6 gap-1 sm:gap-2.5 md:gap-3 w-full max-w-3xl">
              {STAGES.map((s, idx) => (
                <div key={s.id} className="w-full flex flex-col items-center gap-1">
                  <div className="w-full h-1 sm:h-1.5 md:h-2 rounded-full bg-white/25 overflow-hidden backdrop-blur-sm">
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
            <div className="sm:hidden flex items-center justify-center gap-1.5 text-[11px] font-semibold text-amber-300/90 text-center tracking-wide">
              <span className="text-white/70">Stage {currentStageInfo.number}/06:</span>
              <span className="text-white font-bold">{currentStageInfo.label}</span>
            </div>

            <p className="text-[9.5px] sm:text-[11px] text-white/70 text-center flex items-center justify-center gap-1 drop-shadow-sm px-2 truncate max-w-full">
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
