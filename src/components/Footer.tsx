import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Sun,
  Youtube,
} from "lucide-react";
import { company, services, products } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MotionSection } from "@/components/motion";

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Solar Calculator", href: "/calculator" },
  { label: "Subsidy", href: "/subsidy" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
];

const socials = [
  {
    icon: Facebook,
    label: "Facebook",
    color: "hover:text-blue-500 hover:border-blue-500/60 hover:bg-blue-500/10 hover:shadow-[0_0_22px_rgba(59,130,246,0.6)]",
  },
  {
    icon: Instagram,
    label: "Instagram",
    color: "hover:text-pink-500 hover:border-pink-500/60 hover:bg-pink-500/10 hover:shadow-[0_0_22px_rgba(236,72,153,0.6)]",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    color: "hover:text-sky-400 hover:border-sky-400/60 hover:bg-sky-400/10 hover:shadow-[0_0_22px_rgba(56,189,248,0.6)]",
  },
  {
    icon: Youtube,
    label: "YouTube",
    color: "hover:text-red-500 hover:border-red-500/60 hover:bg-red-500/10 hover:shadow-[0_0_22px_rgba(239,68,68,0.6)]",
  },
];

export const Footer = () => (
  <MotionSection animation="fadeUp" className="relative mt-10 overflow-hidden border-t bg-surface">
    {/* Ambient background blobs for footer */}
    <div className="blob -left-24 top-10 h-64 w-64 bg-primary/20" aria-hidden />
    <div className="blob -right-16 bottom-0 h-72 w-72 bg-secondary/20" aria-hidden />

    <div className="container-wide relative py-16">
      <div className="grid gap-8 lg:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.3fr_0.85fr_1.25fr_0.85fr_1.35fr]">
        {/* Column 1: Brand, Better Contact Section & Google Map */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link to="/" className="group flex items-center gap-2.5">
            <img
              src="/logo-icon.png"
              alt="SSR Solar Power Logo Icon"
              className="h-10 w-10 object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
            />
            <span className="font-display text-lg font-bold">SSR Solar Power</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            SSR Solar Power designs, installs and maintains premium residential and commercial solar
            energy systems — engineered for 25 years of clean, predictable savings.
          </p>

          {/* Better Contact Section Card */}
          <div className="mt-5 rounded-2xl border border-border/80 bg-card/70 p-4 shadow-soft space-y-2.5 backdrop-blur">
            <a
              href="https://maps.google.com/?q=Kutubpur,+Bahadurpur,+Mau,+Uttar+Pradesh+221602"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 text-xs text-muted-foreground transition-colors hover:text-primary group/contact"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary group-hover/contact:scale-110 transition-transform" />
              <span>{company.address}</span>
            </a>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <a href={`tel:${company.phone}`} className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary font-semibold">
                <Phone className="h-3.5 w-3.5 text-primary" /> {company.phone}
              </a>
              <a href={`mailto:${company.email}`} className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary font-semibold">
                <Mail className="h-3.5 w-3.5 text-primary" /> {company.email}
              </a>
            </div>
          </div>

          {/* Embedded OpenStreetMap Container */}
          <div className="mt-4 overflow-hidden rounded-2xl border border-border/80 shadow-soft h-32 relative group/map">
            <iframe
              title="SSR Solar Power Location Map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=83.5135%2C25.9358%2C83.5335%2C25.9558&layer=mapnik&marker=25.9459%2C83.5235"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(0.3) opacity(0.9)" }}
              loading="lazy"
              className="w-full h-full transition-all duration-500 group-hover/map:scale-105 group-hover/map:filter-none"
            />
            <a
              href="https://www.openstreetmap.org/?mlat=25.9459&mlon=83.5235#map=16/25.9459/83.5235"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 rounded-full bg-black/75 px-3 py-1 text-[10px] font-bold text-white backdrop-blur hover:bg-primary hover:text-slate-950 transition-all flex items-center gap-1 shadow-md"
            >
              <Globe className="h-3 w-3" /> View Map
            </a>
          </div>
        </motion.div>

        {/* Column 2: Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16 }}
        >
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">Quick Links</h3>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link to={l.href} className="inline-block transition-all duration-300 hover:translate-x-1.5 hover:text-primary font-medium">{l.label}</Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Column 3: Uttar Pradesh Active Service Areas (Placed vertically between Quick Links & Services) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="space-y-4"
        >
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-emerald-500 dark:text-emerald-400" /> Service Areas
          </h3>
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-950/40 p-4 backdrop-blur shadow-soft space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Uttar Pradesh Active Service Areas
            </h4>
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {["Mau", "Ballia", "Azamgarh", "Deoria", "Gorakhpur", "Ghazipur", "Varanasi"].map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-background/95 dark:bg-slate-900/90 px-2.5 py-1 text-xs font-bold text-foreground dark:text-emerald-300 shadow-xs transition-colors hover:border-emerald-500"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                  {area}
                </span>
              ))}
            </div>
            <p className="text-[11px] font-medium text-muted-foreground pt-1">
              On-grid &amp; hybrid rooftop solar installation with full UP subsidy assistance.
            </p>
          </div>
        </motion.div>

        {/* Column 4: Services */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.28 }}
        >
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">Services</h3>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            {services.map((s) => (
              <li key={s.slug}>
                <Link to="/services" className="inline-block transition-all duration-300 hover:translate-x-1.5 hover:text-primary font-medium">{s.title}</Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Column 5: Products, Newsletter & Animated Social Icons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.34 }}
        >
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">Products</h3>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            {products.slice(0, 4).map((p) => (
              <li key={p.slug}>
                <Link to="/products" className="inline-block transition-all duration-300 hover:translate-x-1.5 hover:text-primary font-medium">{p.name}</Link>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-foreground">Newsletter</h3>
          <form
            className="mt-4 flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Subscribed — solar insights are on the way.");
              (e.target as HTMLFormElement).reset();
            }}
          >
            <Input type="email" required placeholder="Your email" aria-label="Email address" className="h-11 rounded-full border-border/80 focus:border-primary/60 transition-all duration-300" />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button type="submit" className="btn-premium group h-11 rounded-full bg-gradient-brand px-5 font-semibold text-primary-foreground shadow-glow hover:shadow-[0_0_22px_rgba(22,163,74,0.65)] transition-all duration-300">
                Join <Send className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </form>

          {/* Animated Social Icons with Hover Glow */}
          <div className="mt-6 flex gap-2.5">
            {socials.map(({ icon: Icon, label, color }, index) => (
              <motion.a
                key={label}
                href="#"
                aria-label={label}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.35 + index * 0.08 }}
                whileHover={{ y: -6, rotate: 12, scale: 1.18 }}
                whileTap={{ scale: 0.9 }}
                className={`group flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card text-foreground transition-all duration-300 shadow-soft ${color}`}
              >
                <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-14 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-muted-foreground sm:flex-row"
      >
        <p>© 2026 SSR Solar Power. All Rights Reserved.</p>
        <div className="flex gap-6 text-xs font-medium">
          <Link to="/privacy-policy" className="transition-colors hover:text-primary">Privacy Policy</Link>
          <Link to="/terms" className="transition-colors hover:text-primary">Terms &amp; Conditions</Link>
        </div>
      </motion.div>
    </div>
  </MotionSection>
);
