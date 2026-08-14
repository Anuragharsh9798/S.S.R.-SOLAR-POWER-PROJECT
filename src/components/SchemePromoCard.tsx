import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { X, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export const SchemePromoCard = () => {
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target date: March 31, 2027 23:59:59
    const targetDate = new Date("2027-03-31T23:59:59").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, targetDate - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
  };

  if (dismissed) return null;

  const content = (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 99999,
      }}
      className="w-[calc(100vw-3rem)] max-w-xs sm:max-w-sm select-none pointer-events-auto"
    >
      <div className="group relative rounded-3xl p-[1.5px] bg-gradient-to-br from-emerald-500 via-amber-400/70 to-emerald-600 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_25px_rgba(34,197,94,0.25)]">
        <div className="relative rounded-[calc(1.5rem-1px)] bg-slate-950/95 p-4 sm:p-5 backdrop-blur-xl border border-white/10 text-foreground">
          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close promotion"
            className="absolute right-3.5 top-3.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Badge */}
          <div className="pr-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="h-3 w-3 animate-pulse text-amber-400" />
              Limited Period Government Benefit
            </span>
          </div>

          {/* Heading & Text */}
          <Link to="/subsidy" className="block mt-2.5 group/link">
            <h4 className="font-display text-base font-bold text-white transition-colors duration-200 group-hover/link:text-primary flex items-center justify-between">
              Hurry Up! Scheme Active
              <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover/link:opacity-100 transition-opacity duration-200" />
            </h4>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Last day to avail maximum subsidy offer: <span className="font-semibold text-primary">March 31, 2027</span>
            </p>

            {/* Countdown Grid */}
            <div className="grid grid-cols-4 gap-1.5 text-center my-3">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-1.5">
                <span className="block font-display text-sm font-extrabold text-emerald-400">{timeLeft.days}</span>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Days</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-900/80 p-1.5">
                <span className="block font-display text-sm font-extrabold text-white">{String(timeLeft.hours).padStart(2, "0")}</span>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Hours</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-900/80 p-1.5">
                <span className="block font-display text-sm font-extrabold text-white">{String(timeLeft.minutes).padStart(2, "0")}</span>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Mins</span>
              </div>
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/40 p-1.5">
                <span className="block font-display text-sm font-extrabold text-amber-400">{String(timeLeft.seconds).padStart(2, "0")}</span>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Secs</span>
              </div>
            </div>

            {/* Bottom Info Line */}
            <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground border-t border-white/10 pt-2.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-tight">
                Empanelled with DISCOM &amp; National Portal for 100% Direct Benefit Transfer (DBT).
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};
