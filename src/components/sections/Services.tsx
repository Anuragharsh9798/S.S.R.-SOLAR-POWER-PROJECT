import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { services } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";

export const ServiceCard = ({ service, index = 0 }: { service: (typeof services)[number]; index?: number }) => {
  const Icon = service.icon;

  // 3D Hover & Tilt Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="perspective-1000"
    >
      <motion.article
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="group service-card-glow relative transition-all duration-500 ease-out hover:shadow-[0_20px_45px_-15px_rgba(34,197,94,0.35)]"
      >
        <div className="relative h-full w-full overflow-hidden rounded-3xl p-7 transition-all duration-500 service-card-gradient-border">
          {/* Shine Sweep Effect on Hover */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
          />

          {/* Smooth Glow Ring Overlay on Hover */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-transparent transition-colors duration-500 group-hover:border-primary/40 z-20" />

          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: index * 0.08 }}
              className="h-full w-full overflow-hidden"
            >
              <motion.img
                src={service.image}
                alt={service.title}
                loading="lazy"
                whileHover={{ scale: 1.12 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="img-alive h-full w-full object-cover transition-transform duration-700 ease-out"
              />
            </motion.div>

            {/* Icon Badge with Bounce Effect & Glow on Hover */}
            <motion.span
              whileHover={{ scale: 1.15 }}
              className="btn-premium absolute left-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-[0_0_22px_rgba(22,163,74,0.8)]"
            >
              <Icon className="h-6 w-6 text-primary-foreground transition-transform duration-500 group-hover:animate-bounce" />
            </motion.span>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-primary">{service.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
            <ul className="mt-4 space-y-2">
              {service.points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/90">
                  <Check className="h-4 w-4 text-primary shrink-0 transition-transform duration-300 group-hover:scale-110" /> {p}
                </li>
              ))}
            </ul>
            <Button asChild variant="ghost" className="mt-5 h-9 rounded-full px-4 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary/10 group-hover:bg-primary/15">
              <Link to="/calculator">
                Learn More <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
};

export const ServicesSection = () => (
  <section className="section">
    <div className="container-wide">
      <SectionHeading
        eyebrow="Our Services"
        title={<>Solar solutions for every <span className="text-gradient">roof and business</span></>}
        description="From a single-home rooftop to commercial business plants, one accountable partner throughout."
      />
      <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-2 mx-auto max-w-4xl">
        {services.map((s, i) => (
          <ServiceCard key={s.slug} service={s} index={i} />
        ))}
      </div>
    </div>
  </section>
);
