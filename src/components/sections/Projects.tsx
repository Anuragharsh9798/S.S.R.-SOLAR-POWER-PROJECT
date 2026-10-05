import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Gauge,
  MapPin,
  Star,
  TrendingUp,
  Loader2,
  AlertCircle,
  FolderOpen,
  X,
  Sparkles,
} from "lucide-react";
import { projects as fallbackProjects } from "@/data/site";
import residentialProjectImage from "@/assets/project-residential-rooftop.png";
import commercialSolarService from "@/assets/service-commercial-solar.png";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { MotionSection } from "@/components/motion";
import { api } from "@/lib/api";

const filters = ["All", "Residential", "Commercial"] as const;

export const ProjectsGrid = ({ heading = true, className = "" }: { heading?: boolean; className?: string }) => {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const [projectList, setProjectList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail Modal State (for GET /api/v1/projects/:id)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectDetail, setProjectDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<any[]>("/api/v1/projects");
        if (Array.isArray(data) && data.length > 0) {
          setProjectList(data);
        } else {
          // Fallback to initial site portfolio dataset if DB is empty
          setProjectList(fallbackProjects);
        }
      } catch (err: any) {
        console.error("Failed to fetch projects from backend:", err);
        setError(err.message || "Unable to load solar projects.");
        setProjectList(fallbackProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleOpenDetail = async (id: string) => {
    setSelectedProjectId(id);
    setLoadingDetail(true);
    setProjectDetail(null);
    try {
      const detail = await api.get<any>(`/api/v1/projects/${id}`);
      setProjectDetail(detail);
    } catch (err) {
      console.warn("Could not fetch detailed project by ID, using cached list item:", err);
      const fallbackItem = projectList.find((p) => p.id === id);
      setProjectDetail(fallbackItem || null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const visible =
    active === "All"
      ? projectList
      : projectList.filter((p) => (p.type || p.category) === active);

  return (
    <MotionSection animation="fadeUp" className={`section py-10 md:py-14 ${className}`}>
      <div className="container-wide space-y-7 md:space-y-8">
        {heading && (
          <SectionHeading
            eyebrow="Completed Projects"
            title={<>Plants delivering <span className="text-gradient">savings every sunrise</span></>}
            description="A selection of recently commissioned rooftop and ground-mount systems across Uttar Pradesh."
          />
        )}

        <div className="flex flex-wrap justify-center gap-2">
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

        {error && (
          <div className="mx-auto max-w-lg flex items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[420px] rounded-3xl border border-border bg-card/60 p-7 animate-pulse space-y-4"
              >
                <div className="aspect-[16/11] rounded-2xl bg-muted" />
                <div className="h-5 w-3/4 rounded-md bg-muted" />
                <div className="h-4 w-1/2 rounded-md bg-muted" />
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="h-12 rounded-xl bg-muted" />
                  <div className="h-12 rounded-xl bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center space-y-3 rounded-3xl border border-dashed border-border p-8 bg-card/40">
            <FolderOpen className="mx-auto h-10 w-10 text-muted-foreground/60" />
            <h4 className="text-base font-bold text-foreground">No Projects Found</h4>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              There are currently no commissioned solar installations listed under the "{active}" category.
            </p>
          </div>
        ) : (
          /* Project Grid */
          <motion.div layout className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((p) => {
                const defaultImg =
                  p.type === "Commercial" ||
                  p.category === "Commercial" ||
                  p.title?.toLowerCase().includes("commercial") ||
                  p.title?.toLowerCase().includes("tech")
                    ? commercialSolarService
                    : residentialProjectImage;

                const imgUrl = p.featuredImage || p.image || defaultImg;
                const capacityStr = p.capacityKw ? `${p.capacityKw} kW` : p.capacity || "5 kW";
                const completedStr = p.completedDate || p.completed || "Commissioned";
                const savingsStr = p.annualSavings || "₹ 60,000 / year";
                const ratingNum = p.rating || 5;

                return (
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
                      {/* Image Container */}
                      <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-muted">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
                          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.65 }}
                          className="h-full w-full overflow-hidden"
                        >
                          <motion.img
                            src={imgUrl}
                            alt={`${p.title} solar installation in ${p.location}`}
                            loading="lazy"
                            onError={(e: any) => {
                              e.currentTarget.src = defaultImg;
                            }}
                            whileHover={{ scale: 1.14 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="img-alive h-full w-full object-cover transition-transform duration-700 ease-out"
                          />
                        </motion.div>

                        <span className="absolute left-4 top-4 z-20 rounded-full bg-black/60 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur border border-white/20 shadow-sm">
                          {p.type || p.category || "Solar"}
                        </span>

                        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out space-y-3">
                            <h3 className="font-display text-xl font-bold text-white drop-shadow-sm">
                              {p.title}
                            </h3>

                            <p className="flex items-center gap-1.5 text-xs text-white/80">
                              <MapPin className="h-3.5 w-3.5 text-primary" /> {p.location}
                            </p>

                            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                              <div className="rounded-xl border border-white/20 bg-white/10 p-2.5 backdrop-blur text-white">
                                <span className="flex items-center gap-1 text-[10px] text-white/70 uppercase tracking-wider font-medium">
                                  <Gauge className="h-3 w-3 text-emerald-400" /> Capacity
                                </span>
                                <span className="mt-0.5 block font-bold text-white text-sm">{capacityStr}</span>
                              </div>

                              <div className="rounded-xl border border-white/20 bg-white/10 p-2.5 backdrop-blur text-white">
                                <span className="flex items-center gap-1 text-[10px] text-white/70 uppercase tracking-wider font-medium">
                                  <CalendarDays className="h-3 w-3 text-amber-400" /> Completed
                                </span>
                                <span className="mt-0.5 block font-bold text-white text-sm">{completedStr}</span>
                              </div>

                              <div className="col-span-2 rounded-xl border border-emerald-400/40 bg-emerald-950/60 p-2.5 backdrop-blur text-white">
                                <span className="flex items-center gap-1 text-[10px] text-emerald-300 uppercase tracking-wider font-semibold">
                                  <TrendingUp className="h-3 w-3 text-emerald-400" /> Annual Savings
                                </span>
                                <span className="mt-0.5 block font-bold text-emerald-400 text-sm">{savingsStr}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Base Card Body */}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-primary">
                          {p.title}
                        </h3>
                        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary" /> {p.location}
                        </p>
                        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-2xl bg-muted/60 p-3">
                            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Gauge className="h-3.5 w-3.5" /> Capacity
                            </dt>
                            <dd className="mt-1 font-semibold">{capacityStr}</dd>
                          </div>
                          <div className="rounded-2xl bg-muted/60 p-3">
                            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <CalendarDays className="h-3.5 w-3.5" /> Completed
                            </dt>
                            <dd className="mt-1 font-semibold">{completedStr}</dd>
                          </div>
                        </dl>
                        <div className="mt-5 flex items-center justify-between">
                          <div className="flex gap-0.5" aria-label={`${ratingNum} out of 5 stars`}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < ratingNum ? "fill-secondary text-secondary" : "text-muted-foreground/40"
                                }`}
                              />
                            ))}
                          </div>
                          <Button
                            variant="ghost"
                            onClick={() => handleOpenDetail(p.id)}
                            className="h-9 rounded-full px-4 text-sm font-semibold text-primary hover:bg-primary/10 cursor-pointer"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Single Project Detail Dialog (for GET /api/v1/projects/:id) */}
      <AnimatePresence>
        {selectedProjectId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl rounded-3xl border border-border bg-card p-6 md:p-8 shadow-2xl space-y-6"
            >
              <button
                onClick={() => setSelectedProjectId(null)}
                className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              {loadingDetail ? (
                <div className="py-12 text-center space-y-3">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  <p className="text-xs text-muted-foreground">Fetching project details from backend...</p>
                </div>
              ) : projectDetail ? (
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {projectDetail.type || projectDetail.category || "Solar Rooftop"}
                    </span>
                    <span className="text-xs text-muted-foreground">ID: {projectDetail.id}</span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold font-display text-foreground">{projectDetail.title}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> {projectDetail.location}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-border/80 bg-muted/30 p-3 text-center">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Capacity</span>
                      <p className="text-base font-bold text-primary mt-1">
                        {projectDetail.capacityKw ? `${projectDetail.capacityKw} kW` : projectDetail.capacity || "5 kW"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/80 bg-muted/30 p-3 text-center">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Commissioned</span>
                      <p className="text-base font-bold text-foreground mt-1">
                        {projectDetail.completedDate || projectDetail.completed || "Recent"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/80 bg-muted/30 p-3 text-center">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Annual Savings</span>
                      <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                        {projectDetail.annualSavings || "₹ 60,000"}
                      </p>
                    </div>
                  </div>

                  {projectDetail.description && (
                    <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 text-xs text-muted-foreground leading-relaxed">
                      <p className="font-semibold text-foreground mb-1">Project Case Study Summary:</p>
                      {projectDetail.description}
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <Button
                      onClick={() => setSelectedProjectId(null)}
                      className="rounded-full px-6 text-xs font-semibold"
                    >
                      Close Details
                    </Button>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MotionSection>
  );
};


