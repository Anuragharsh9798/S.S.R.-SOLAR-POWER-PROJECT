import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Gauge, MapPin, Star, TrendingUp } from "lucide-react";
import { projects } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { MotionSection } from "@/components/motion";

const filters = ["All", "Residential", "Commercial"] as const;

export const ProjectsGrid = ({ heading = true }: { heading?: boolean }) => {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const visible = active === "All" ? projects : projects.filter((p) => p.type === active);

  return (
    <MotionSection animation="fadeUp" className="section">
      <div className="container-wide">
        {heading && (
          <SectionHeading
            eyebrow="Completed Projects"
            title={<>Plants delivering <span className="text-gradient">savings every sunrise</span></>}
            description="A selection of recently commissioned rooftop and ground-mount systems across Uttar Pradesh."
          />
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 ${
                active === f
                  ? "border-transparent bg-gradient-brand text-primary-foreground shadow-glow"
                  : "border-border bg-card hover:border-primary/40 hover:text-primary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <motion.article
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -8 }}
                className="group project-card-glow relative transition-all duration-500 hover:shadow-[0_20px_45px_-15px_rgba(34,197,94,0.35)]"
              >
                <div className="relative h-full w-full overflow-hidden rounded-3xl p-7 transition-all duration-500 project-card-gradient-border">
                  {/* Image Container with Zoom & Hover Overlay */}
                  <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-muted">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
                      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.65 }}
                      className="h-full w-full overflow-hidden"
                    >
                      <motion.img
                        src={p.image}
                        alt={`${p.title} solar installation in ${p.location}`}
                        loading="lazy"
                        whileHover={{ scale: 1.14 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="img-alive h-full w-full object-cover transition-transform duration-700 ease-out"
                      />
                    </motion.div>

                    {/* Top Type Badge */}
                    <span className="absolute left-4 top-4 z-20 rounded-full bg-black/60 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur border border-white/20 shadow-sm">
                      {p.type}
                    </span>

                    {/* Hover Overlay Container (Fades in on Hover) */}
                    <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out space-y-3">
                        {/* Project Name */}
                        <h3 className="font-display text-xl font-bold text-white drop-shadow-sm">
                          {p.title}
                        </h3>
                        
                        <p className="flex items-center gap-1.5 text-xs text-white/80">
                          <MapPin className="h-3.5 w-3.5 text-primary" /> {p.location}
                        </p>

                        {/* Capacity, Savings & Completion Date Grid */}
                        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                          <div className="rounded-xl border border-white/20 bg-white/10 p-2.5 backdrop-blur text-white">
                            <span className="flex items-center gap-1 text-[10px] text-white/70 uppercase tracking-wider font-medium">
                              <Gauge className="h-3 w-3 text-emerald-400" /> Capacity
                            </span>
                            <span className="mt-0.5 block font-bold text-white text-sm">{p.capacity}</span>
                          </div>

                          <div className="rounded-xl border border-white/20 bg-white/10 p-2.5 backdrop-blur text-white">
                            <span className="flex items-center gap-1 text-[10px] text-white/70 uppercase tracking-wider font-medium">
                              <CalendarDays className="h-3 w-3 text-amber-400" /> Completion Date
                            </span>
                            <span className="mt-0.5 block font-bold text-white text-sm">{p.completed}</span>
                          </div>

                          <div className="col-span-2 rounded-xl border border-emerald-400/40 bg-emerald-950/60 p-2.5 backdrop-blur text-white">
                            <span className="flex items-center gap-1 text-[10px] text-emerald-300 uppercase tracking-wider font-semibold">
                              <TrendingUp className="h-3 w-3 text-emerald-400" /> Annual Savings
                            </span>
                            <span className="mt-0.5 block font-bold text-emerald-400 text-sm">{p.savings}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Base Card Body (Visible when not hovering) */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-primary">{p.title}</h3>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" /> {p.location}
                    </p>
                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl bg-muted/60 p-3">
                        <dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><Gauge className="h-3.5 w-3.5" /> Capacity</dt>
                        <dd className="mt-1 font-semibold">{p.capacity}</dd>
                      </div>
                      <div className="rounded-2xl bg-muted/60 p-3">
                        <dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" /> Completed</dt>
                        <dd className="mt-1 font-semibold">{p.completed}</dd>
                      </div>
                    </dl>
                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex gap-0.5" aria-label={`${p.rating} out of 5 stars`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < p.rating ? "fill-secondary text-secondary" : "text-muted-foreground/40"}`}
                          />
                        ))}
                      </div>
                      <Button variant="ghost" className="h-9 rounded-full px-4 text-sm font-semibold text-primary hover:bg-primary/10">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </MotionSection>
  );
};

