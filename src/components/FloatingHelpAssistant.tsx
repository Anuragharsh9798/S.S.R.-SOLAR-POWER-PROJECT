import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  PhoneCall,
  FileText,
  X,
  Sparkles,
  HelpCircle,
  ArrowUpRight,
  Headphones,
} from "lucide-react";
import { company } from "@/data/site";

export const FloatingHelpAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none select-none">
      {/* Expanded Quick Action Glass Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(6px)" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto mb-4 w-72 rounded-3xl border border-white/30 dark:border-white/10 bg-card/90 dark:bg-card/80 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-2xl"
          >
            {/* Header Title */}
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-brand text-slate-950 shadow-glow">
                  <Headphones className="h-4 w-4" />
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground">Solar Support Desk</h4>
                  <p className="text-[10px] font-medium text-emerald-500 dark:text-emerald-400">Online · Instant Reply</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Action Buttons List */}
            <div className="mt-3.5 space-y-2.5">
              {/* 1. WhatsApp Button */}
              <motion.a
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.97 }}
                href={`https://wa.me/91${company.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                  "Hi SSR Solar Power, I need assistance with a Rooftop Solar Installation.",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl bg-emerald-600/90 dark:bg-emerald-600 px-4 py-3 text-xs font-semibold text-white shadow-glow transition-all hover:bg-emerald-600"
              >
                <span className="flex items-center gap-2.5">
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </span>
                <ArrowUpRight className="h-4 w-4 opacity-80" />
              </motion.a>

              {/* 2. Direct Call Button */}
              <motion.a
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.97 }}
                href={`tel:${company.phone}`}
                className="flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-xs font-semibold text-primary transition-all hover:bg-primary/20"
              >
                <span className="flex items-center gap-2.5">
                  <PhoneCall className="h-4 w-4" /> Call Expert Now
                </span>
                <span className="text-[11px] font-bold">{company.phone}</span>
              </motion.a>

              {/* 3. Get Free Quote Button */}
              <motion.div whileHover={{ scale: 1.02, x: 2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-2xl bg-gradient-brand px-4 py-3 text-xs font-bold text-slate-950 shadow-glow transition-all hover:opacity-95"
                >
                  <span className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4" /> Get Free Quote
                  </span>
                  <Sparkles className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button Badge */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        aria-label={isOpen ? "Close Help Assistant" : "Open Help Assistant"}
        className="pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-brand text-slate-950 shadow-[0_8px_30px_rgba(22,163,74,0.5)] border-2 border-white dark:border-slate-900 transition-all duration-300"
      >
        {/* Pulsing Aura Ring */}
        <span className="absolute -inset-1.5 rounded-full bg-primary/30 animate-ping opacity-75 pointer-events-none" />

        {/* Morphing Icon */}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close-icon"
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 90, scale: 0 }}
              transition={{ duration: 0.25 }}
            >
              <X className="h-6 w-6 text-slate-950 stroke-[2.5]" />
            </motion.span>
          ) : (
            <motion.span
              key="help-icon"
              initial={{ rotate: 90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: -90, scale: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-center"
            >
              <HelpCircle className="h-6 w-6 text-slate-950 stroke-[2.5]" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
