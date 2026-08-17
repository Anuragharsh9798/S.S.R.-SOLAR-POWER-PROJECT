import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

import { api } from "@/lib/api";

interface TestimonialsProps {
  isHomePage?: boolean;
}

export const Testimonials = ({ isHomePage = false }: TestimonialsProps) => {
  const [items, setItems] = useState<TestimonialItem[]>(testimonials);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Review Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "Mau, Uttar Pradesh",
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

  useEffect(() => {
    if (isPaused || isModalOpen) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % Math.max(1, total));
    }, 5000);
    return () => clearInterval(t);
  }, [isPaused, isModalOpen, total]);

  const go = (dir: number) => {
    setIndex((i) => (i + dir + total) % total);
  };

  const getCardOffset = (cardIdx: number, activeIdx: number, count: number) => {
    let diff = cardIdx - activeIdx;
    if (diff < -Math.floor(count / 2)) diff += count;
    if (diff > Math.floor(count / 2)) diff -= count;
    return diff;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "Mau, Uttar Pradesh",
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

  // Form submission handler -> POST /api/v1/reviews
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0 || formData.rating < 1 || formData.rating > 5) {
      toast.error("Please select a rating (1 to 5 stars) before submitting.");
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
    <MotionSection animation="fadeRight" className="section relative overflow-hidden py-20">
      {/* Background Glow */}
      <div aria-hidden className="blob -left-20 top-1/3 h-80 w-80 bg-primary/10" />
      <div aria-hidden className="blob -right-20 bottom-10 h-80 w-80 bg-emerald-500/10" />

      <div className="container-wide relative z-10">
        <SectionHeading
          eyebrow="Verified Client Feedback"
          title={
            <>
              What our customers <span className="text-gradient">actually say</span>
            </>
          }
          description="Trusted by homeowners and businesses for reliable solar solutions, quality installation and dependable support."
        />

        {isHomePage ? (
          /* COMPACT HOME PAGE PREVIEW: 3 FEATURED REVIEWS ONLY */
          <div className="mt-12 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {items.slice(0, 3).map((item, idx) => (
                <motion.div
                  key={`${item.name}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl border border-border/80 bg-card/95 backdrop-blur-xl shadow-soft hover:border-emerald-500/50 hover:shadow-[0_12px_35px_rgba(16,185,129,0.18)] transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center gap-1 mb-3.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < item.rating
                              ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                              : "fill-muted/40 text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <blockquote className="text-sm text-foreground/90 font-medium leading-relaxed italic line-clamp-4">
                      &ldquo;{item.quote}&rdquo;
                    </blockquote>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/50 flex flex-col space-y-1">
                    <h4 className="font-display font-bold text-base text-foreground">{item.name}</h4>
                    <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <span>📍 {item.location}</span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* DUAL ACTION BUTTONS: VIEW ALL REVIEWS & SHARE YOUR REVIEW */}
            <div className="flex flex-wrap items-center justify-center gap-4 z-20 pt-2">
              <Link to="/testimonials">
                <Button
                  variant="outline"
                  className="rounded-full px-6 h-12 text-sm font-semibold border-primary/50 text-foreground hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-2"
                >
                  View All Reviews ({items.length}) <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="btn-premium rounded-full bg-gradient-brand px-6 h-12 text-sm font-bold text-primary-foreground shadow-glow flex items-center gap-2"
              >
                <PenSquare className="h-4 w-4" /> Share Your Review
              </Button>
            </div>
          </div>
        ) : (
          /* FULL TESTIMONIALS PAGE: INTERACTIVE 3D CAROUSEL BROWSER FOR ALL REVIEWS */
          <div
            className="relative mx-auto mt-14 max-w-5xl flex flex-col items-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* 3D Stacked Testimonial Cards Container */}
            <div className="relative w-full h-[370px] sm:h-[350px] md:h-[330px] flex items-center justify-center px-4 overflow-hidden py-4">
              {items.map((item, i) => {
                const diff = getCardOffset(i, index, total);
                const isCenter = diff === 0;

                // Compute 3D position & depth effect values
                let x = "0%";
                let y = 0;
                let scale = 1;
                let opacity = 1;
                let rotate = 0;
                let zIndex = 30;
                let filter = "brightness(1) blur(0px)";

                if (diff === 0) {
                  x = "0%";
                  y = -6;
                  scale = 1;
                  opacity = 1;
                  rotate = 0;
                  zIndex = 30;
                  filter = "brightness(1) blur(0px)";
                } else if (diff === -1) {
                  x = "-30%";
                  y = 4;
                  scale = 0.84;
                  opacity = 0.38;
                  rotate = -5;
                  zIndex = 10;
                  filter = "brightness(0.65) blur(1.5px)";
                } else if (diff === 1) {
                  x = "30%";
                  y = 4;
                  scale = 0.84;
                  opacity = 0.38;
                  rotate = 5;
                  zIndex = 10;
                  filter = "brightness(0.65) blur(1.5px)";
                } else if (diff < -1) {
                  x = "-60%";
                  y = 10;
                  scale = 0.7;
                  opacity = 0;
                  rotate = -10;
                  zIndex = 0;
                  filter = "brightness(0.5) blur(3px)";
                } else {
                  x = "60%";
                  y = 10;
                  scale = 0.7;
                  opacity = 0;
                  rotate = 10;
                  zIndex = 0;
                  filter = "brightness(0.5) blur(3px)";
                }

                return (
                  <motion.div
                    key={`${item.name}-${i}`}
                    initial={false}
                    animate={{ x, y, scale, opacity, rotate, zIndex, filter }}
                    transition={{
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    onClick={() => {
                      if (diff === -1) go(-1);
                      if (diff === 1) go(1);
                    }}
                    className={`absolute w-full sm:w-[85%] md:w-[660px] select-none ${
                      isCenter ? "" : "cursor-pointer hidden sm:block"
                    } ${Math.abs(diff) > 1 ? "pointer-events-none" : ""}`}
                  >
                    <TestimonialCardItem item={item} isCenter={isCenter} />
                  </motion.div>
                );
              })}
            </div>

            {/* Navigation Controls & Carousel Progress */}
            <div className="mt-10 flex flex-wrap items-center justify-between w-full max-w-xl gap-4 px-4 z-20">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => go(-1)}
                aria-label="Previous review"
                className="flex items-center gap-2 rounded-full border border-border/80 bg-card/90 px-5 py-2.5 text-xs sm:text-sm font-semibold text-foreground shadow-soft hover:border-primary/50 hover:text-primary transition-all"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </motion.button>

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
                      className={`h-2 rounded-full transition-all duration-500 ${
                        i === index ? "w-6 bg-gradient-brand shadow-glow" : "w-2 bg-border hover:bg-muted-foreground/50"
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
                className="flex items-center gap-2 rounded-full border border-border/80 bg-card/90 px-5 py-2.5 text-xs sm:text-sm font-semibold text-foreground shadow-soft hover:border-primary/50 hover:text-primary transition-all"
              >
                Next <ChevronRight className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Prominent Write / Submit Review CTA Button */}
            <div className="mt-8 pt-2 text-center z-20">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={() => {
                    resetForm();
                    setIsModalOpen(true);
                  }}
                  className="btn-premium rounded-full bg-gradient-brand px-8 h-13 text-sm sm:text-base font-bold text-primary-foreground shadow-glow flex items-center gap-2.5 mx-auto"
                >
                  <PenSquare className="h-4 w-4" /> Write a Review
                </Button>
              </motion.div>
              <p className="text-xs text-muted-foreground mt-2.5">
                Have you installed SSR Solar Power in UP? Share your experience with our team.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* GOOGLE MAPS STYLE PROGRESSIVE REVIEW MODAL FORM */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[9999] w-[92vw] sm:max-w-[540px] max-h-[85vh] flex flex-col rounded-3xl border-slate-800 bg-slate-950 text-white p-0 shadow-2xl backdrop-blur-2xl overflow-hidden [overscroll-behavior:contain]">
          {/* Pinned Visible Header */}
          <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-slate-800/80 bg-slate-950 z-20">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="text-xl font-bold flex items-center gap-2 text-white">
                <Sparkles className="h-5 w-5 text-amber-400" /> Share Your Review
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Rate your SSR Solar Power experience in UP. Your rating opens quick feedback chips.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Internal Scrollable Content Body with Wheel Event Stop Propagation */}
          <div
            onWheel={(e) => e.stopPropagation()}
            className="p-5 sm:p-6 overflow-y-auto flex-1 max-h-[85vh] [overscroll-behavior:contain] text-white"
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
                    placeholder="e.g., Mau / Ballia / Azamgarh / Belthara Road"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    className="rounded-xl border-slate-800 bg-slate-900/90 text-white text-sm focus:border-emerald-500"
                  />
                  {/* Location Quick Presets */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["Mau", "Ballia", "Kutubpur", "Azamgarh", "Gopalpur", "Belthara Road", "Konauli"].map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, location: `${loc}, Uttar Pradesh` }))}
                        className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-semibold text-slate-300 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
                      >
                        + {loc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* STEP 1: Star Rating (Unselected 0 by default) */}
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
                          className="p-1 transition-transform hover:scale-125 focus:outline-none"
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

                {/* STEP 2: REVEALED PROGRESSIVE SECTIONS (Only visible after selecting 1-5 stars) */}
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

                    {/* What did you like about our service? (Multi-select) */}
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

                    {/* Add Project Photos (Optional) */}
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

                    {apiError && (
                      <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400 mt-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{apiError}</span>
                      </div>
                    )}

                    {/* Prominent Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-xl bg-gradient-brand py-3 h-12 text-sm font-bold text-primary-foreground shadow-glow flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
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
                  </motion.div>
                )}
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </MotionSection>
  );
};

/* Individual Horizontal Testimonial Card Item */
const TestimonialCardItem = ({
  item,
  isCenter,
}: {
  item: TestimonialItem;
  isCenter: boolean;
}) => (
  <div
    className={`group relative w-full overflow-hidden text-center p-6 sm:p-8 md:p-9 rounded-3xl transition-all duration-500 testimonial-card-gradient-border bg-card/95 backdrop-blur-xl ${
      isCenter
        ? "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_15px_35px_-10px_rgba(34,197,94,0.25)]"
        : ""
    }`}
  >
    {/* Clean Customer Rating Stars */}
    <div className="mb-4 flex items-center justify-center gap-1.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 sm:h-5 w-4 sm:w-5 transition-transform duration-300 group-hover:scale-110 ${
            i < item.rating
              ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]"
              : "fill-muted/40 text-muted-foreground/30"
          }`}
        />
      ))}
    </div>

    {/* Customer Review Quote Content */}
    <blockquote className="text-sm sm:text-base md:text-lg font-medium text-foreground leading-relaxed italic max-w-2xl mx-auto">
      &ldquo;{item.quote}&rdquo;
    </blockquote>

    {/* Clean Customer Details Footer - Name & Address/Location ONLY */}
    <div className="mt-6 pt-4 border-t border-border/50 flex flex-col items-center justify-center space-y-1">
      <h3 className="font-display font-bold text-base sm:text-lg text-foreground tracking-tight">
        {item.name}
      </h3>
      <p className="text-xs sm:text-sm font-semibold text-emerald-400 flex items-center justify-center gap-1">
        <span>📍 {item.location}</span>
      </p>
    </div>
  </div>
);

export default Testimonials;
