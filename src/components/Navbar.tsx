import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Cloud, Menu, Moon, Search, Sparkles, Sun, X } from "lucide-react";
import { navLinks, company } from "@/data/site";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { SearchModal } from "./SearchModal";
import { BrandWordmark } from "./BrandWordmark";
import { openFreeQuoteModal } from "./FreeQuoteModal";

export const DayNightToggle = ({ onDark, className = "" }: { onDark?: boolean; className?: string }) => {
  const { isNight, toggle } = useTheme();

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label={isNight ? "Switch to Day View" : "Switch to Night View"}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative inline-flex h-9 sm:h-10 items-center gap-1.5 sm:gap-2 rounded-full border px-2.5 sm:px-3.5 text-xs font-semibold backdrop-blur-xl transition-all shadow-soft hover:shadow-[0_0_20px_rgba(22,163,74,0.45)] shrink-0 ${
        onDark
          ? "border-white/30 bg-white/10 text-white hover:border-emerald-400/60"
          : "border-border/70 bg-card/80 text-foreground hover:border-primary/60 hover:text-primary"
      } ${className}`}
      style={{ transitionDuration: "500ms" }}
    >
      {/* Icon Disc Wrapper */}
      <span className="relative flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center overflow-hidden rounded-full bg-gradient-brand text-slate-950 shadow-sm shrink-0">
        {/* Sun Icon (Rotates 180deg & morphs scale) */}
        <motion.span
          animate={{
            rotate: isNight ? 180 : 0,
            scale: isNight ? 0 : 1,
            opacity: isNight ? 0 : 1,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-950" />
        </motion.span>

        {/* Moon Icon (Fades in with smooth rotate morph) */}
        <motion.span
          animate={{
            rotate: isNight ? 0 : -180,
            scale: isNight ? 1 : 0,
            opacity: isNight ? 1 : 0,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Moon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-950 fill-slate-950" />
        </motion.span>
      </span>

      {/* Track Label with Stars / Cloud Morph */}
      <div className="relative flex items-center shrink-0">
        <AnimatePresence mode="wait">
          {isNight ? (
            <motion.span
              key="night-track"
              initial={{ opacity: 0, scale: 0.8, x: 4 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -4 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap"
            >
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-400 animate-pulse shrink-0" />
              <span className="hidden sm:inline-block text-[11px] sm:text-xs">Night View</span>
            </motion.span>
          ) : (
            <motion.span
              key="day-track"
              initial={{ opacity: 0, scale: 0.8, x: -4 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 4 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap"
            >
              <Cloud className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline-block text-[11px] sm:text-xs">Day View</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
};

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          const isScrolled = y > 20;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));

          // Hide while scrolling down past 80px; show while scrolling up
          if (y > 80 && y > last + 5) {
            setHidden((prev) => (!prev ? true : prev));
          } else if (y < last - 5 || y <= 80) {
            setHidden((prev) => (prev ? false : prev));
          }
          last = y;
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setOpenDropdown(null);
    setOpenMobileDropdown(null);
  }, [location.pathname]);

  const onDark = !scrolled && location.pathname === "/";

  return (
    <motion.header
      animate={{ y: hidden && !open && !searchOpen ? "-100%" : "0%" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter,border-color] duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[74px] w-full max-w-[1440px] items-center justify-between px-2.5 sm:px-4 lg:px-5 xl:px-8 gap-1.5 sm:gap-2 lg:gap-3 min-w-0" aria-label="Main navigation">
        {/* Header Logo & Brand Wordmark */}
        <Link to="/" className="group flex items-center gap-1.5 sm:gap-2.5 shrink-0 mr-0.5 sm:mr-1.5 lg:mr-2 xl:mr-4">
          <motion.div
            animate={{ y: [0, -3.5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-1.5 sm:gap-2.5"
          >
            <motion.img
              src="/logo-icon.png"
              alt="SSR Solar Power Logo Icon"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.3 }}
              className="h-8 w-8 sm:h-9 sm:w-9 lg:h-9 lg:w-9 xl:h-11 xl:w-11 object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
            />
            <BrandWordmark onDark={onDark} className="text-xs sm:text-sm lg:text-xs xl:text-base 2xl:text-lg" />
          </motion.div>
        </Link>

        {/* Desktop Nav Links with Active Underline Animation */}
        <ul className="hidden items-center lg:flex gap-0.5 xl:gap-1 shrink min-w-0">
          {navLinks.map((link) => {
            const isCalcLink = link.href === "/calculator";

            if (link.hasDropdown) {
              const isChildActive = link.children?.some(
                (c) => location.pathname === c.href
              );
              const isOpen = openDropdown === link.label;

              return (
                <li
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    type="button"
                    onClick={() => setOpenDropdown((prev) => (prev === link.label ? null : link.label))}
                    className={`group relative inline-flex items-center gap-0.5 lg:gap-1 whitespace-nowrap rounded-full px-1.5 lg:px-2 xl:px-2.5 2xl:px-3 py-1.5 2xl:py-2 text-xs lg:text-[12px] xl:text-[13.5px] 2xl:text-sm font-medium transition-colors duration-300 ${
                      isChildActive
                        ? onDark
                          ? "text-[hsl(48_96%_60%)] font-semibold"
                          : "text-primary font-semibold"
                        : onDark
                        ? "text-white/85 hover:text-white"
                        : "text-foreground/80 hover:text-primary"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      className={`h-3 w-3 xl:h-3.5 xl:w-3.5 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                    {isChildActive && (
                      <motion.span
                        layoutId="activeNavUnderline"
                        className={`absolute inset-x-2 -bottom-0.5 h-[2.5px] rounded-full ${
                          onDark
                            ? "bg-[hsl(48_96%_60%)] shadow-[0_0_10px_rgba(250,204,21,0.6)]"
                            : "bg-gradient-brand shadow-glow"
                        }`}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-0 top-full mt-1.5 w-56 rounded-2xl border border-border/80 bg-card/95 p-1.5 shadow-xl backdrop-blur-xl z-50"
                      >
                        {link.children?.map((child) => (
                          <NavLink
                            key={child.href}
                            to={child.href}
                            onClick={() => setOpenDropdown(null)}
                            className={({ isActive }) =>
                              `block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                                isActive
                                  ? "bg-primary/15 text-primary font-semibold"
                                  : "text-foreground/85 hover:bg-muted hover:text-primary"
                              }`
                            }
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            }

            const isActive = location.pathname === link.href;
            return (
              <li key={link.href} className={`relative ${isCalcLink ? "hidden xl:block" : ""}`}>
                <NavLink
                  to={link.href}
                  className={() =>
                    `group relative whitespace-nowrap rounded-full px-1.5 lg:px-2 xl:px-2.5 2xl:px-3 py-1.5 2xl:py-2 text-xs lg:text-[12px] xl:text-[13.5px] 2xl:text-sm font-medium transition-colors duration-300 ${
                      isActive
                        ? onDark
                          ? "text-[hsl(48_96%_60%)] font-semibold"
                          : "text-primary font-semibold"
                        : onDark
                        ? "text-white/85 hover:text-white"
                        : "text-foreground/80 hover:text-primary"
                    }`
                  }
                >
                  <span>{link.label}</span>
                  {isActive ? (
                    <motion.span
                      layoutId="activeNavUnderline"
                      className={`absolute inset-x-2 -bottom-0.5 h-[2.5px] rounded-full ${
                        onDark
                          ? "bg-[hsl(48_96%_60%)] shadow-[0_0_10px_rgba(250,204,21,0.6)]"
                          : "bg-gradient-brand shadow-glow"
                      }`}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : (
                    <span className="absolute inset-x-2 -bottom-0.5 h-[2px] origin-left scale-x-0 rounded-full bg-primary/60 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Action Controls: Get Free Quote -> Search -> Day/Night View -> Mobile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0">
          <Button
            type="button"
            onClick={openFreeQuoteModal}
            className="btn-premium btn-gold-shine inline-flex rounded-full px-2.5 sm:px-3.5 lg:px-3.5 xl:px-5 py-1.5 sm:py-2 text-xs lg:text-[12.5px] xl:text-sm font-semibold whitespace-nowrap hover:scale-[1.03] shrink-0"
          >
            Get Free Quote
          </Button>

          <button
            type="button"
            onClick={() => {
              setSearchOpen((s) => !s);
              setOpen(false);
            }}
            aria-label="Search the site"
            className={`inline-flex h-8 w-8 sm:h-9 sm:w-9 lg:h-9 lg:w-9 xl:h-10 xl:w-10 items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary shrink-0 ${
              onDark ? "border-white/30 bg-white/10 text-white" : "border-border bg-card/70 text-foreground"
            }`}
          >
            <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
          <DayNightToggle onDark={onDark} />
          <button
            type="button"
            onClick={() => {
              setOpen((o) => !o);
              setSearchOpen(false);
            }}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={`inline-flex h-8 w-8 sm:h-9 sm:w-9 lg:h-9 lg:w-9 xl:h-10 xl:w-10 items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-0.5 lg:hidden shrink-0 ${
              onDark ? "border-white/30 bg-white/10 text-white" : "border-border bg-card/70"
            }`}
          >
            {open ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
        </div>
      </nav>

      {/* Activated Functional Search Bar Modal / Dropdown */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onDark={onDark}
      />

      {/* Mobile Menu Open/Close Animation */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
            exit={{ opacity: 0, height: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="bg-background/95 backdrop-blur-xl border-t border-border/60 overflow-hidden shadow-xl lg:hidden max-h-[calc(100vh-74px)] overflow-y-auto"
          >
            <motion.ul
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.04, delayChildren: 0.03 } },
                closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
              }}
              className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 grid gap-1 py-5"
            >
              {navLinks.map((link) => {
                if (link.hasDropdown) {
                  const isMobileOpen = openMobileDropdown === link.label;

                  return (
                    <motion.li
                      key={link.label}
                      variants={{
                        open: { opacity: 1, y: 0 },
                        closed: { opacity: 0, y: -8 },
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenMobileDropdown((prev) => (prev === link.label ? null : link.label))}
                        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-muted"
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-300 ${
                            isMobileOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {isMobileOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden pl-3 space-y-1 pt-1"
                          >
                            {link.children?.map((child) => (
                              <NavLink
                                key={child.href}
                                to={child.href}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                  `block rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                                    isActive
                                      ? "bg-primary/15 text-primary font-semibold"
                                      : "hover:bg-muted text-foreground/80"
                                  }`
                                }
                              >
                                {child.label}
                              </NavLink>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  );
                }

                return (
                  <motion.li
                    key={link.href}
                    variants={{
                      open: { opacity: 1, y: 0 },
                      closed: { opacity: 0, y: -8 },
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <NavLink
                      to={link.href}
                      className={({ isActive }) =>
                        `block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                          isActive
                            ? "bg-primary/15 text-primary font-semibold"
                            : "hover:bg-muted text-foreground/80 hover:text-foreground"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.li>
                );
              })}
              <motion.li
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: -8 },
                }}
                transition={{ duration: 0.2 }}
                className="mt-2 grid gap-2"
              >
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      openFreeQuoteModal();
                    }}
                    className="btn-gold-shine flex-1 rounded-full"
                  >
                    Get Free Quote
                  </Button>
                  <DayNightToggle />
                </div>
                <a href={`tel:${company.phone}`} className="text-center text-sm text-muted-foreground">
                  {company.phone}
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

