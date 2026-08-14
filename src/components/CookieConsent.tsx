import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = window.localStorage.getItem("ssr-cookie-consent");
    if (!accepted) {
      const t = setTimeout(() => setVisible(true), 2200);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    window.localStorage.setItem("ssr-cookie-consent", "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-5 left-5 z-40 w-[min(24rem,calc(100vw-2.5rem))] rounded-3xl border p-5 shadow-card glass-strong"
        >
          <div className="flex items-start gap-3">
            <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
            <p className="text-sm text-muted-foreground">
              We use cookies to improve your browsing experience and understand how our solar tools are used.
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={accept} className="h-9 flex-1 rounded-full bg-gradient-brand text-sm font-semibold text-primary-foreground">
              Accept
            </Button>
            <Button onClick={accept} variant="outline" className="h-9 flex-1 rounded-full text-sm">
              Decline
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
