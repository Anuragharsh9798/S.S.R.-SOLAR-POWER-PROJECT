import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Calculator, PlayCircle, Sun, Moon, Sparkles, BatteryCharging } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroCards } from "@/data/site";
import { useTheme } from "@/components/ThemeProvider";
import heroSolarRooftopWorker from "@/assets/hero-solar-rooftop-worker.png";

const headingWords = ["Power", "Your", "Future", "with"];

export const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const { isNight } = useTheme();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.2]);

  // Subtle Mouse Parallax Follow
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const mouseX = useSpring(rawMouseX, { stiffness: 45, damping: 25 });
  const mouseY = useSpring(rawMouseY, { stiffness: 45, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 16;
    const y = (clientY / innerHeight - 0.5) * 12;
    rawMouseX.set(x);
    rawMouseY.set(y);
  };

  return (
    <section ref={ref} onMouseMove={handleMouseMove} className="relative flex min-h-[100svh] items-center overflow-hidden pt-24">
      {/* Parallax & Floating Hero Looping Solar Video Background */}
      <motion.div
        style={{ y: bgY, translateY: mouseY, x: mouseX, scale: bgScale }}
        className="absolute inset-0 h-full w-full will-change-transform overflow-hidden pointer-events-none"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={heroSolarRooftopWorker}
          style={{ transitionDuration: "2500ms" }}
          className={`h-full w-full object-cover transition-all ease-in-out ${
            isNight ? "brightness-[0.45] contrast-[1.18] hue-rotate-[-10deg]" : "brightness-[0.95] contrast-[1.05]"
          }`}
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-solar-panels-in-a-field-42795-large.mp4"
            type="video/mp4"
          />
          <img
            src={heroSolarRooftopWorker}
            alt="Solar rooftop installation"
            className="h-full w-full object-cover"
          />
        </video>
      </motion.div>

      {/* 45% Dark Readability Overlay */}
      <div className="absolute inset-0 bg-black/45 z-[1]" aria-hidden />

      {/* Base Hero Gradient Overlay */}
      <div className="absolute inset-0 z-[2]" style={{ background: "var(--gradient-hero)" }} aria-hidden />

      {/* 2–3s Sky Color Transition Overlay (Blue -> Sunset Orange -> Deep Dark Night Blue) */}
      <motion.div
        aria-hidden
        style={{ transitionDuration: "2500ms" }}
        className="pointer-events-none absolute inset-0 transition-all ease-in-out"
        animate={{
          background: isNight
            ? "linear-gradient(180deg, rgba(2, 6, 23, 0.88) 0%, rgba(15, 23, 42, 0.85) 50%, rgba(30, 41, 59, 0.92) 100%)"
            : "linear-gradient(180deg, rgba(14, 165, 233, 0.15) 0%, rgba(22, 163, 74, 0.1) 50%, rgba(0, 0, 0, 0.4) 100%)",
        }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />

      {/* Sunset Transition Flare Layer */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-orange-600/30 via-amber-500/20 to-transparent"
        animate={{ opacity: isNight ? [0, 0.6, 0] : 0 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />

      {/* DAY MODE: Soft Drifting Clouds */}
      {!isNight && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden>
          <motion.div
            initial={{ x: "-10%", opacity: 0 }}
            animate={{ x: "110%", opacity: [0, 0.65, 0.65, 0] }}
            transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
            className="absolute top-[14%] left-0 h-16 w-52 rounded-full bg-white/20 blur-md"
          />
          <motion.div
            initial={{ x: "-20%", opacity: 0 }}
            animate={{ x: "110%", opacity: [0, 0.45, 0.45, 0] }}
            transition={{ duration: 44, repeat: Infinity, delay: 12, ease: "linear" }}
            className="absolute top-[22%] left-0 h-20 w-64 rounded-full bg-white/15 blur-lg"
          />
        </div>
      )}

      {/* DAY MODE: Sun & Soft Sunlight Glow with Volumetric Sun Rays (Positioned on the LEFT side) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[18%] top-[10%] z-10"
        animate={{
          y: isNight ? 140 : 0,
          x: isNight ? -60 : 0,
          opacity: isNight ? 0 : 1,
          scale: isNight ? 0.5 : 1,
        }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative flex items-center justify-center">
          <div className="h-40 w-40 rounded-full bg-amber-400/35 blur-2xl animate-pulse" />
          <div className="absolute h-20 w-20 rounded-full bg-amber-300 shadow-[0_0_60px_rgba(251,191,36,0.8)]" />
          {/* Subtle Volumetric Sun Rays Beam Flare */}
          <motion.div
            className="absolute flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            <div className="h-1 w-[26rem] bg-gradient-to-r from-transparent via-amber-200/40 to-transparent blur-[1px]" />
            <div className="absolute h-[26rem] w-1 bg-gradient-to-b from-transparent via-amber-200/40 to-transparent blur-[1px]" />
            <div className="absolute h-1 w-[24rem] rotate-45 bg-gradient-to-r from-transparent via-amber-200/30 to-transparent blur-[1px]" />
            <div className="absolute h-1 w-[24rem] -rotate-45 bg-gradient-to-r from-transparent via-amber-200/30 to-transparent blur-[1px]" />
          </motion.div>
        </div>
      </motion.div>

      {/* NIGHT MODE: Crescent Moon & Soft Moon Glow Aura */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[16%] top-[10%] z-10"
        animate={{
          y: isNight ? 0 : -140,
          x: isNight ? 0 : 60,
          opacity: isNight ? 1 : 0,
          scale: isNight ? 1 : 0.5,
        }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative flex items-center justify-center">
          <div className="h-52 w-52 rounded-full bg-sky-300/25 blur-3xl animate-pulse" />
          <div className="absolute h-20 w-20 rounded-full bg-slate-100 shadow-[0_0_55px_rgba(224,242,254,0.95)]" />
          <div className="absolute h-20 w-20 rounded-full bg-slate-950/80 -translate-x-3 -translate-y-2" />
        </div>
      </motion.div>

      {/* NIGHT MODE: Twinkling Stars Grid */}
      {isNight && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden>
          {Array.from({ length: 28 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
              style={{
                width: `${(i % 3) * 1.5 + 2}px`,
                height: `${(i % 3) * 1.5 + 2}px`,
                left: `${(i * 7.3 + 4) % 94}%`,
                top: `${(i * 9.7 + 6) % 78}%`,
              }}
              animate={{
                opacity: [0.15, 0.95, 0.15],
                scale: [0.8, 1.4, 0.8],
              }}
              transition={{
                duration: 2.5 + (i % 4) * 1.2,
                repeat: Infinity,
                delay: (i % 5) * 0.4,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Floating Day Particles vs Night Sparkles */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden>
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.span
            key={i}
            className={`absolute rounded-full blur-[0.5px] ${isNight ? "bg-emerald-400/60" : "bg-amber-300/50"}`}
            style={{
              width: `${(i % 3) * 2 + 3}px`,
              height: `${(i % 3) * 2 + 3}px`,
              left: `${(i * 8.2 + 6) % 90}%`,
              top: `${(i * 12.1 + 8) % 80}%`,
            }}
            animate={{
              y: [0, -35 - (i % 5) * 12, 0],
              x: [0, i % 2 === 0 ? 16 : -16, 0],
              opacity: isNight ? [0.2, 0.8, 0.2] : [0.15, 0.65, 0.15],
              scale: [1, 1.35, 1],
            }}
            transition={{
              duration: 5.5 + (i % 4) * 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Shimmer Grid Blobs */}
      <motion.div
        aria-hidden
        className={`blob left-[8%] top-[18%] h-72 w-72 transition-colors ${
          isNight ? "bg-sky-600/30" : "bg-primary/40"
        }`}
        animate={{ y: [0, -28, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className={`blob bottom-[12%] right-[10%] h-80 w-80 transition-colors ${
          isNight ? "bg-emerald-500/30" : "bg-secondary/40"
        }`}
        animate={{ y: [0, 26, 0], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content Container */}
      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container-wide relative z-20 py-20 text-white">
        {/* Top Header Badge */}
        <div>
          <Link to="/subsidy" className="inline-block group cursor-pointer">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur transition-all duration-300 hover:border-white/50 hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              PM Surya Ghar Yojana <span className="mx-1 font-bold text-amber-400">●</span> Subsidy Assistance
            </motion.span>
          </Link>
        </div>

        {/* Word-by-word heading reveal */}
        <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.05] text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
          {headingWords.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="mr-[0.28em] inline-block"
            >
              {word}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.15 + headingWords.length * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className={`inline-block bg-gradient-to-r ${
              isNight
                ? "from-emerald-300 via-teal-200 to-amber-300"
                : "from-[hsl(48_96%_60%)] to-[hsl(142_66%_55%)]"
            } bg-clip-text text-transparent animate-gradient-shift transition-all`}
            style={{ transitionDuration: "2500ms" }}
          >
            SSR Solar Power
          </motion.span>
        </h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85, ease: "easeOut" }}
          style={{ transitionDuration: "2500ms" }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg transition-all"
        >
          {isNight
            ? "Your battery energy storage system works continuously through the night — keeping your home powered with clean solar energy 24/7."
            : "Reduce your electricity bills by up to 90% with reliable residential and commercial solar solutions — engineered, installed and maintained by certified experts."}
        </motion.p>

        {/* Buttons */}
        <div className="mt-9 flex flex-wrap items-center gap-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
              {i === 0 && (
                <motion.div
                  animate={{ scale: [1, 1.04, 1, 1.04, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 4.8, ease: "easeInOut" }}
                >
                  <Button asChild size="lg" className="btn-premium group h-12 rounded-full bg-gradient-brand px-7 text-base font-semibold text-primary-foreground shadow-glow">
                    <Link to="/calculator">
                      Get Free Quote
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                    </Link>
                  </Button>
                </motion.div>
              )}
              {i === 1 && (
                <motion.div
                  animate={{ scale: [1, 1.03, 1, 1.03, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 4.8, delay: 0.2, ease: "easeInOut" }}
                >
                  <Button asChild size="lg" variant="outline" className="btn-premium h-12 rounded-full border-white/40 bg-white/10 px-7 text-base font-semibold text-white backdrop-blur hover:bg-white/20 hover:text-white">
                    <Link to="/calculator">
                      <Calculator className="mr-2 h-4 w-4 icon-anim" />
                      Calculate Savings
                    </Link>
                  </Button>
                </motion.div>
              )}
              {i === 2 && (
                <a href="#promo-video" className="group ml-1 inline-flex items-center gap-2 text-sm font-medium text-white/85 hover:text-white">
                  <PlayCircle className="h-5 w-5 icon-anim" /> Watch how it works
                </a>
              )}
            </motion.div>
          ))}
        </div>

        {/* Feature Cards with Night Battery Glow */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {heroCards.map(({ icon: Icon, title, subtitle }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + i * 0.09 }}
              whileHover={{ y: -8, scale: 1.02 }}
              style={{ transitionDuration: "2500ms" }}
              className={`group relative rounded-3xl border transition-all p-5 backdrop-blur-xl ${
                isNight
                  ? "border-emerald-500/40 bg-slate-900/60 shadow-[0_0_24px_rgba(16,185,129,0.25)]"
                  : "border-white/20 bg-white/10 hover:shadow-glow"
              }`}
            >
              <span
                style={{ transitionDuration: "2500ms" }}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-colors ${
                  isNight ? "bg-emerald-500/20 text-emerald-400" : "bg-white/15"
                }`}
              >
                {isNight && i === 2 ? (
                  <BatteryCharging className="h-5 w-5 text-emerald-400 animate-pulse" />
                ) : (
                  <Icon className={`h-5 w-5 icon-anim icon-bounce ${isNight ? "text-emerald-400" : "text-[hsl(48_96%_60%)]"}`} />
                )}
              </span>
              <p className="mt-4 font-display text-xl font-semibold flex items-center justify-between">
                {title}
                {isNight && (
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)] animate-ping" />
                )}
              </p>
              <p
                style={{ transitionDuration: "2500ms" }}
                className={`text-sm transition-colors ${isNight ? "text-slate-300" : "text-white/70"}`}
              >
                {subtitle}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

