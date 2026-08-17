import { useEffect, useState } from "react";
import { ArrowUp, Mail, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { company } from "@/data/site";
import { SolarChatbot } from "./SolarChatbot";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export const FloatingActions = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const floatingButtons = [
    {
      id: "whatsapp",
      label: "Chat on WhatsApp",
      href: `https://wa.me/${company.whatsapp}`,
      target: "_blank",
      rel: "noreferrer",
      icon: WhatsAppIcon,
      bgClass: "bg-[#25D366] text-white shadow-[0_0_20px_rgba(37,211,102,0.6)] hover:shadow-[0_0_28px_rgba(37,211,102,0.9)]",
      pulseClass: "bg-[#25D366]/40",
      floatDelay: 0,
    },
    {
      id: "call",
      label: "Call us",
      href: `tel:${company.phone}`,
      icon: Phone,
      bgClass: "bg-accent text-accent-foreground shadow-[0_0_20px_rgba(37,99,235,0.6)] hover:shadow-[0_0_28px_rgba(37,99,235,0.9)]",
      pulseClass: "bg-accent/40",
      floatDelay: 0.3,
    },
    {
      id: "email",
      label: "Email us",
      href: `mailto:${company.email}`,
      icon: Mail,
      bgClass: "bg-secondary text-secondary-foreground shadow-[0_0_20px_rgba(250,204,21,0.6)] hover:shadow-[0_0_28px_rgba(250,204,21,0.9)]",
      pulseClass: "bg-secondary/40",
      floatDelay: 0.6,
    },
  ];

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-center gap-3.5 select-none">
      {/* Solar AI Assistant Chatbot Button & Modal */}
      <SolarChatbot />
      {floatingButtons.map(({ id, label, href, target, rel, icon: Icon, bgClass, pulseClass, floatDelay }) => (
        <motion.a
          key={id}
          href={href}
          target={target}
          rel={rel}
          aria-label={label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -7, 0],
          }}
          transition={{
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: floatDelay,
            },
            duration: 0.4,
          }}
          whileHover={{ y: -8, scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          className={`group relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${bgClass}`}
        >
          {/* Continuous pulse aura ring */}
          <motion.span
            className={`pointer-events-none absolute inset-0 rounded-full ${pulseClass}`}
            animate={{ scale: [1, 1.45, 1], opacity: [0.65, 0, 0.65] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: floatDelay }}
            aria-hidden
          />

          <Icon className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
        </motion.a>
      ))}

      {/* Back To Top Floating Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            key="back-to-top"
            initial={{ opacity: 0, scale: 0.6, y: 12 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -6, 0],
            }}
            exit={{ opacity: 0, scale: 0.6, y: 12 }}
            transition={{
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.9,
              },
              duration: 0.35,
            }}
            whileHover={{ y: -8, scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-border/80 bg-card text-foreground shadow-glow hover:border-primary/60 hover:shadow-[0_0_22px_rgba(22,163,74,0.6)] transition-all duration-300"
          >
            {/* Pulse aura */}
            <motion.span
              className="pointer-events-none absolute inset-0 rounded-full bg-primary/30"
              animate={{ scale: [1, 1.4, 1], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 0.9 }}
              aria-hidden
            />
            <ArrowUp className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
