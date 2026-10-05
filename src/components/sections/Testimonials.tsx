import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  PenSquare,
  Star,
  Send,
  Sparkles,
  Check,
  Camera,
  ThumbsUp,
  Gauge,
  Smile,
  Building2,
  Home,
  Zap,
  ArrowRight,
  Quote,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { testimonials, TestimonialItem } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { MotionSection } from "@/components/motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface TestimonialsProps {
  isHomePage?: boolean;
  className?: string;
}

export const Testimonials = ({ isHomePage = false, className = "" }: TestimonialsProps) => {
  const [items, setItems] = useState<TestimonialItem[]>(testimonials);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1200);

  // Review Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    rating: 0, // Unselected by default (0 stars)
    quote: "",
    systemType: "",
    installType: "",
    likedAspects: [] as string[],
    performance: "",
    experience: "",
    photos: [] as File[],
  });

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [moderationNotice, setModerationNotice] = useState<string | null>(null);

  // Track viewport width for responsive card deck calculations
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch approved reviews from backend API on mount
  useEffect(() => {
    const fetchApprovedReviews = async () => {
      setLoadingReviews(true);
      try {
        const data = await api.get<any[]>("/api/v1/reviews");
        if (Array.isArray(data) && data.length > 0) {
          const approvedOnly = data
            .filter((r) => r.isApproved === true || r.isApproved === undefined)
            .map((r) => ({
              name: r.name,
              location: r.location || "Uttar Pradesh",
              rating: r.rating || 5,
              quote: r.quote || r.comment || "",
            }));

          if (approvedOnly.length > 0) {
            setItems(approvedOnly);
          }
        }
      } catch (err) {
        console.warn("Could not fetch reviews from backend API, using fallback:", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchApprovedReviews();
  }, []);

  const total = items.length;

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Subtle auto-advance every 6.5 seconds (pauses on user hover or modal open)
  useEffect(() => {
    if (isPaused || isModalOpen) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 6500);

    return () => clearInterval(timer);
  }, [total, isPaused, isModalOpen]);

  const go = (step: number) => {
    setIndex((prev) => (prev + step + total) % total);
  };

  const getCardOffset = (cardIdx: number, activeIdx: number, count: number) => {
    let diff = cardIdx - activeIdx;
    if (diff < -Math.floor(count / 2)) diff += count;
    if (diff > Math.floor(count / 2)) diff -= count;
    return diff;
  };

  // Smooth, refined layered-deck 3D calculations
  const getDeckStyles = (diff: number, width: number) => {
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;

    if (diff === 0) {
      // MAIN ACTIVE FRONT CARD: Highest visual focus, fully readable
      return {
        x: "0%",
        y: 0,
        scale: 1,
        opacity: 1,
        rotate: 0,
        zIndex: 30,
        filter: "brightness(1) blur(0px)",
        pointerEvents: "auto" as const,
        isCenter: true,
      };
    } else if (diff === -1) {
      // LEFT BACKGROUND CARD: Layered behind with subtle offset and soft opacity
      return {
        x: isMobile ? "-14%" : isTablet ? "-22%" : "-28%",
        y: isMobile ? 8 : 12,
        scale: isMobile ? 0.9 : 0.88,
        opacity: isMobile ? 0.28 : 0.45,
        rotate: isMobile ? -1.5 : -3,
        zIndex: 15,
        filter: "brightness(0.72) blur(1.5px)",
        pointerEvents: "auto" as const,
        isCenter: false,
      };
    } else if (diff === 1) {
      // RIGHT BACKGROUND CARD: Layered behind with subtle offset and soft opacity
      return {
        x: isMobile ? "14%" : isTablet ? "22%" : "28%",
        y: isMobile ? 8 : 12,
        scale: isMobile ? 0.9 : 0.88,
        opacity: isMobile ? 0.28 : 0.45,
        rotate: isMobile ? 1.5 : 3,
        zIndex: 15,
        filter: "brightness(0.72) blur(1.5px)",
        pointerEvents: "auto" as const,
        isCenter: false,
      };
    } else if (diff < -1) {
      // FAR LEFT TRANSITION (Hidden cleanly)
      return {
        x: isMobile ? "-35%" : "-52%",
        y: 20,
        scale: 0.76,
        opacity: 0,
        rotate: -6,
        zIndex: 0,
        filter: "brightness(0.5) blur(3px)",
        pointerEvents: "none" as const,
        isCenter: false,
      };
    } else {
      // FAR RIGHT TRANSITION (Hidden cleanly)
      return {
        x: isMobile ? "35%" : "52%",
        y: 20,
        scale: 0.76,
        opacity: 0,
        rotate: 6,
        zIndex: 0,
        filter: "brightness(0.5) blur(3px)",
        pointerEvents: "none" as const,
        isCenter: false,
      };
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      rating: 0,
      quote: "",
      systemType: "",
      installType: "",
      likedAspects: [],
      performance: "",
      experience: "",
      photos: [],
    });
    setHoverRating(null);
    setSubmitSuccess(false);
    setApiError(null);
    setModerationNotice(null);
  };

  const handleRatingSelect = (star: number) => {
    setFormData((prev) => ({ ...prev, rating: star }));
  };

  const handleAspectToggle = (aspect: string) => {
    setFormData((prev) => {
      const exists = prev.likedAspects.includes(aspect);
      return {
        ...prev,
        likedAspects: exists
          ? prev.likedAspects.filter((a) => a !== aspect)
          : [...prev.likedAspects, aspect],
      };
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files).slice(0, 3);
      setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...filesArr].slice(0, 3) }));
    }
  };

  const removePhoto = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
    }));
  };

  // Form submission handler -> POST /api/v1/reviews
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast.error("Please tap a star rating (1 to 5 stars) before submitting.");
      return;
    }

    if (!formData.name.trim() || !formData.quote.trim()) {
      toast.error("Please fill in your full name and review message.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setApiError(null);

    const payload = {
      name: formData.name.trim(),
      location: formData.location.trim() || "Uttar Pradesh",
      rating: formData.rating,
      quote: formData.quote.trim(),
      solarType: formData.systemType || undefined,
      installType: formData.installType || undefined,
      performance: formData.performance || undefined,
      experience: formData.experience || undefined,
      likedAspects: formData.likedAspects.length > 0 ? formData.likedAspects : undefined,
    };

    try {
      const res = await api.post<any>("/api/v1/reviews", payload);

      setSubmitSuccess(true);
      const notice =
        res?.message ||
        "Thank you! Your review has been submitted successfully and is pending administrator moderation before display.";
      setModerationNotice(notice);
      toast.success("Review submitted for moderation!", {
        description: "Our admin team will review and approve your submission shortly.",
      });

      setTimeout(() => {
        resetForm();
        setIsModalOpen(false);
      }, 3200);
    } catch (err: any) {
      console.error("Submit review API error:", err);
      const errMsg = err.message || "Failed to submit review. Please try again.";
      setApiError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MotionSection animation="fadeRight" className={`section relative overflow-hidden py-10 md:py-14 bg-background/50 ${className}`}>
      {/* Subtle Background Glows */}
      <div aria-hidden className="blob -left-24 top-1/4 h-80 w-80 bg-primary/10" />
      <div aria-hidden className="blob -right-24 bottom-12 h-80 w-80 bg-emerald-500/10" />

      <div className="container-wide relative z-10">
        <SectionHeading
          eyebrow="Verified Client Feedback"
          title={
            <>
              What our customers <span className="text-gradient">actually say</span>
            </>
          }
          description="Real rooftop and commercial solar installation experiences from verified property owners across Uttar Pradesh."
        />

        {/* STACKED LAYERED-CARD TESTIMONIAL CAROUSEL DECK */}
        <div
          className="relative mx-auto mt-8 md:mt-10 max-w-5xl flex flex-col items-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Deck Stage Container with Preserved Height */}
          <div className="relative w-full h-[390px] sm:h-[370px] md:h-[350px] flex items-center justify-center px-4 overflow-hidden py-4">
            {items.map((item, i) => {
              const diff = getCardOffset(i, index, total);
              const layer = getDeckStyles(diff, viewportWidth);

              return (
                <motion.div
                  key={`${item.name}-${i}`}
                  initial={false}
                  animate={{
                    x: layer.x,
                    y: layer.y,
                    scale: layer.scale,
                    opacity: layer.opacity,
                    rotate: layer.rotate,
                    zIndex: layer.zIndex,
                    filter: layer.filter,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() => {
                    if (diff === -1) go(-1);
                    if (diff === 1) go(1);
                  }}
                  style={{
                    pointerEvents: layer.pointerEvents,
                  }}
                  className={`absolute w-[92%] sm:w-[84%] md:w-[640px] lg:w-[680px] max-w-[680px] select-none ${
                    layer.isCenter
                      ? "cursor-default"
                      : "cursor-pointer hover:opacity-75 transition-opacity"
                  }`}
                >
                  <TestimonialCardDeckItem item={item} isFront={layer.isCenter} />
                </motion.div>
              );
            })}
          </div>

          {/* Navigation Controls: Previous / Next Buttons & Active Progress Pill */}
          <div className="mt-6 md:mt-7 flex flex-wrap items-center justify-between w-full max-w-xl gap-4 px-4 z-30">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => go(-1)}
              aria-label="Previous review"
              className="flex items-center gap-2 rounded-full border border-border/80 bg-card/90 px-5 py-2.5 text-xs sm:text-sm font-semibold text-foreground shadow-soft hover:border-primary/50 hover:text-primary transition-all backdrop-blur-md cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </motion.button>

            {/* Pagination Count & Progress Dots */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-muted-foreground tracking-wider">
                0{index + 1} <span className="text-muted-foreground/40">/</span> 0{total}
              </span>
              <div className="flex items-center gap-1.5">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                      i === index
                        ? "w-6 bg-gradient-brand shadow-glow"
                        : "w-2 bg-border hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => go(1)}
              aria-label="Next review"
              className="flex items-center gap-2 rounded-full border border-border/80 bg-card/90 px-5 py-2.5 text-xs sm:text-sm font-semibold text-foreground shadow-soft hover:border-primary/50 hover:text-primary transition-all backdrop-blur-md cursor-pointer"
            >
              Next <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Action Row: Write a Review CTA (+ View All Reviews on Homepage) */}
          <div className="mt-5 md:mt-6 flex flex-wrap items-center justify-center gap-4 text-center z-30">
            {isHomePage && (
              <Link to="/testimonials">
                <Button
                  variant="outline"
                  className="rounded-full px-6 h-11 text-sm font-semibold border-primary/50 text-foreground hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-2 cursor-pointer"
                >
                  View All Reviews ({items.length}) <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="btn-premium btn-gold-shine rounded-full px-7 h-11 text-sm sm:text-base font-bold text-primary-foreground shadow-glow flex items-center gap-2.5 mx-auto cursor-pointer"
              >
                <PenSquare className="h-4 w-4" /> Write a Review
              </Button>
            </motion.div>
          </div>
          <p className="text-xs text-muted-foreground mt-2.5 text-center">
            Installed rooftop or commercial solar with SSR Solar Power in UP? Share your review.
          </p>
        </div>
      </div>

      {/* GOOGLE MAPS STYLE PROGRESSIVE REVIEW MODAL FORM */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[9999] w-[94vw] sm:max-w-[540px] max-h-[90vh] flex flex-col rounded-3xl border-slate-800 bg-slate-950 text-white p-0 gap-0 shadow-2xl backdrop-blur-2xl overflow-hidden [overscroll-behavior:contain]">
          {/* Pinned Header */}
          <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-slate-800/80 bg-slate-950 z-20">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="text-xl font-bold flex items-center gap-2 text-white">
                <Sparkles className="h-5 w-5 text-amber-400" /> Share Your Review
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Rate your SSR Solar Power experience in UP. Your rating unlocks quick feedback options.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Internal Scrollable Content Body */}
          <div
            onWheel={(e) => e.stopPropagation()}
            className="p-5 sm:p-6 overflow-y-auto flex-1 min-h-0 [overscroll-behavior:contain] text-white"
          >
            {submitSuccess ? (
              <div className="py-8 text-center space-y-3 bg-emerald-950/30 rounded-2xl border border-emerald-500/40 p-5">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-lg text-emerald-400">Thank You!</h4>
                <p className="text-sm font-semibold text-slate-200">
                  Your review has been submitted for verification.
                </p>
                <p className="text-xs text-slate-400">
                  It will be reviewed by our team before being displayed on our website.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 pt-1">
                {/* Name Field */}
                <div className="space-y-1.5">
                  <Label htmlFor="review-name" className="text-xs font-semibold text-slate-300">
                    Your Full Name *
                  </Label>
                  <Input
                    id="review-name"
                    type="text"
                    required
                    placeholder="e.g., Ramesh Gupta"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="rounded-xl border-slate-800 bg-slate-900/90 text-white text-sm focus:border-emerald-500"
                  />
                </div>

                {/* Location Field */}
                <div className="space-y-1.5">
                  <Label htmlFor="review-location" className="text-xs font-semibold text-slate-300">
                    Location (District / Area in UP) *
                  </Label>
                  <Input
                    id="review-location"
                    type="text"
                    required
                    placeholder="e.g., Mau, Lucknow, Varanasi, Azamgarh, etc."
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    className="rounded-xl border-slate-800 bg-slate-900/90 text-white text-sm focus:border-emerald-500"
                  />
                </div>

                {/* STEP 1: Star Rating */}
                <div className="space-y-1.5 rounded-2xl bg-slate-900/60 p-4 border border-slate-800 text-center">
                  <Label className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                    Overall Rating *
                  </Label>
                  <div className="flex items-center justify-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = (hoverRating ?? formData.rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              active
                                ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.85)]"
                                : "fill-slate-900 text-slate-700 hover:text-slate-500"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] font-medium text-slate-400">
                    {formData.rating === 0 ? (
                      <span className="text-amber-400/80 animate-pulse">Tap stars to rate your overall experience</span>
                    ) : (
                      <span className="text-amber-400 font-bold">{formData.rating} out of 5 Stars Selected</span>
                    )}
                  </p>
                </div>

                {/* Review Textarea */}
                <div className="space-y-1.5">
                  <Label htmlFor="review-quote" className="text-xs font-semibold text-slate-300">
                    Your Review / Feedback *
                  </Label>
                  <Textarea
                    id="review-quote"
                    required
                    rows={3}
                    placeholder="Share details about solar performance, bill reduction, structure quality, or installation experience..."
                    value={formData.quote}
                    onChange={(e) => setFormData((prev) => ({ ...prev, quote: e.target.value }))}
                    className="rounded-xl border-slate-800 bg-slate-900/90 text-white text-sm focus:border-emerald-500"
                  />
                </div>

                {/* STEP 2: Progressive Details */}
                {formData.rating > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="space-y-5 pt-3 border-t border-slate-800/80"
                  >
                    {/* Solar System Type */}
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-amber-400" /> Solar System Type
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {["On-Grid Solar", "Hybrid Solar"].map((type) => {
                          const isSelected = formData.systemType === type;
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  systemType: isSelected ? "" : type,
                                }))
                              }
                              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                                isSelected
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/60 font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                                  : "bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white"
                              }`}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                              {type}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Installation Type */}
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Home className="h-3.5 w-3.5 text-sky-400" /> Installation Type
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: "Residential", icon: Home },
                          { label: "Commercial", icon: Building2 },
                        ].map((type) => {
                          const isSelected = formData.installType === type.label;
                          const IconComponent = type.icon;
                          return (
                            <button
                              key={type.label}
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  installType: isSelected ? "" : type.label,
                                }))
                              }
                              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                                isSelected
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/60 font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                                  : "bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white"
                              }`}
                            >
                              {isSelected ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <IconComponent className="h-3.5 w-3.5 text-slate-400" />
                              )}
                              {type.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* What did you like about our service? */}
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <ThumbsUp className="h-3.5 w-3.5 text-emerald-400" /> What did you like about our service?
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Installation Quality",
                          "Product Quality",
                          "Professional Team",
                          "Fast Installation",
                          "After-Sales Service",
                          "Support & Guidance",
                          "Value for Money",
                        ].map((aspect) => {
                          const isSelected = formData.likedAspects.includes(aspect);
                          return (
                            <button
                              key={aspect}
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  likedAspects: isSelected
                                    ? prev.likedAspects.filter((a) => a !== aspect)
                                    : [...prev.likedAspects, aspect],
                                }))
                              }
                              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                                isSelected
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/60 font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                                  : "bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white"
                              }`}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                              {aspect}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* System Performance */}
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Gauge className="h-3.5 w-3.5 text-purple-400" /> System Performance
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {["Excellent", "Good", "Average", "Needs Improvement"].map((perf) => {
                          const isSelected = formData.performance === perf;
                          return (
                            <button
                              key={perf}
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  performance: isSelected ? "" : perf,
                                }))
                              }
                              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                                isSelected
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/60 font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                                  : "bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white"
                              }`}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                              {perf}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Installation Experience */}
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Smile className="h-3.5 w-3.5 text-amber-400" /> Installation Experience
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"].map((exp) => {
                          const isSelected = formData.experience === exp;
                          return (
                            <button
                              key={exp}
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  experience: isSelected ? "" : exp,
                                }))
                              }
                              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                                isSelected
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/60 font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                                  : "bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white"
                              }`}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                              {exp}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Add Project Photos */}
                    <div className="space-y-2 pt-1">
                      <Label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Camera className="h-3.5 w-3.5 text-emerald-400" /> Add Project Photos (Optional)
                        </span>
                      </Label>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs font-medium text-slate-300 hover:border-emerald-500/60 hover:text-emerald-400 transition-colors">
                          <Camera className="h-4 w-4 text-emerald-400" />
                          <span>
                            {formData.photos.length > 0
                              ? `${formData.photos.length} photo(s) attached`
                              : "Upload Site / Panel Photos"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              if (e.target.files) {
                                setFormData((prev) => ({ ...prev, photos: Array.from(e.target.files!) }));
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                        {formData.photos.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, photos: [] }))}
                            className="text-[10px] text-slate-400 hover:text-rose-400 underline"
                          >
                            Clear photos
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {apiError && (
                  <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400 mt-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{apiError}</span>
                  </div>
                )}

                {/* Submit Review Button - Always visible and at the bottom of the form */}
                <div className="pt-2 pb-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-gradient-brand py-3 h-12 text-sm font-bold text-primary-foreground shadow-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting for Moderation...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Submit Review for Verification
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </MotionSection>
  );
};

/* Individual Stacked Deck Testimonial Card Component */
const TestimonialCardDeckItem = ({
  item,
  isFront,
}: {
  item: TestimonialItem;
  isFront: boolean;
}) => {
  const initial = item.name ? item.name.charAt(0).toUpperCase() : "S";

  return (
    <div
      className={`group relative w-full overflow-hidden text-left p-6 sm:p-8 md:p-9 rounded-3xl transition-all duration-500 border bg-card/95 backdrop-blur-2xl ${
        isFront
          ? "border-emerald-500/40 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5),0_0_30px_-5px_rgba(22,163,74,0.2)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_-5px_rgba(34,197,94,0.3)]"
          : "border-border/60 shadow-md bg-card/85"
      }`}
    >
      {/* Decorative Golden Ambient Accent */}
      <div
        aria-hidden
        className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-sun opacity-10 blur-2xl pointer-events-none"
      />

      {/* Top Header Row: Rating Stars + Verified Customer Tag + Quote Icon */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {/* 5-Star Rating */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 sm:h-4.5 w-4 sm:w-4.5 transition-transform duration-300 ${
                  i < item.rating
                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                    : "fill-muted/40 text-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          {/* Verified Badge */}
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-2.5 py-0.5">
            <CheckCircle2 className="h-3 w-3" /> Verified Client
          </span>
        </div>

        {/* Decorative Quote Icon */}
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
          <Quote className="h-3.5 w-3.5 fill-primary/25" />
        </div>
      </div>

      {/* Customer Review Quote Content */}
      <blockquote className="text-sm sm:text-base md:text-lg font-medium text-foreground leading-relaxed italic">
        &ldquo;{item.quote}&rdquo;
      </blockquote>

      {/* Bottom Author Row: Avatar + Name + District Location */}
      <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Avatar Initial Disc */}
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-gradient-brand text-slate-950 font-display font-bold text-sm sm:text-base shadow-md shrink-0">
            {initial}
          </div>

          <div className="flex flex-col">
            <h3 className="font-display font-bold text-base sm:text-lg text-foreground tracking-tight leading-snug">
              {item.name}
            </h3>
            <p className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
              <span>📍 {item.location}</span>
            </p>
          </div>
        </div>

        {/* UP Solar Guarantee Badge */}
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/60 rounded-full px-3 py-1 border border-border/60">
          <Sparkles className="h-3 w-3 text-amber-400" /> 25Y Warranty
        </span>
      </div>
    </div>
  );
};

export default Testimonials;

