import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Heart, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { products } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { MotionSection } from "@/components/motion";

export const ProductCard = ({ product, index = 0 }: { product: (typeof products)[number]; index?: number }) => {
  const [wished, setWished] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
    >
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group relative transition-all duration-300 hover:shadow-[0_20px_45px_-15px_rgba(34,197,94,0.35)]"
      >
        <div className="relative h-full w-full overflow-hidden rounded-3xl p-7 transition-all duration-300 product-card-gradient-border">
          {/* Shine Sweep Effect on Hover */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
          />

          {/* Animated glowing border ring overlay on hover */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-transparent transition-colors duration-300 group-hover:border-primary/40 z-20" />

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
            <div className="h-full w-full overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="img-alive h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>

            {/* Image Overlay Tabs */}
            <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2 max-w-[85%]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground shadow-soft border border-amber-400/40">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-500" /> {product.warranty}
              </span>
              {product.slug === "solar-panels" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-emerald-400/70 px-3 py-1 text-xs font-bold text-emerald-300 shadow-xl">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Residential &amp; Commercial Use
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setWished((w) => !w);
                toast.success(wished ? "Removed from wishlist" : "Saved to wishlist");
              }}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={wished}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-background/85 backdrop-blur transition-transform duration-300 hover:scale-110"
            >
              <Heart className={`h-4 w-4 ${wished ? "fill-destructive text-destructive" : "text-foreground"}`} />
            </button>
          </div>

          <div className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{product.category}</p>
            <h3 className="mt-2 text-lg font-semibold transition-colors duration-300 group-hover:text-primary">{product.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{product.specs}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to={`/products/${product.slug}`}>
                <Button className="btn-premium h-10 rounded-full bg-gradient-brand px-6 text-sm font-bold text-primary-foreground shadow-glow transition-all duration-300 hover:scale-[1.03]">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
};

export const FeaturedProducts = ({ className = "" }: { className?: string } = {}) => (
  <MotionSection animation="zoomIn" className={`section py-10 md:py-14 bg-gradient-soft ${className}`}>
    <div className="container-wide">
      <SectionHeading
        eyebrow="Featured Products"
        title={<>Tier-1 hardware, <span className="text-gradient">honestly specified</span></>}
        description="Every component we install is field-proven, warranty-backed and matched to your generation target."
      />
      <div className="mt-8 md:mt-10 grid gap-6 md:grid-cols-2 mx-auto max-w-3xl">
        {products.map((p, i) => (
          <ProductCard key={p.slug} product={p} index={i} />
        ))}
      </div>
    </div>
  </MotionSection>
);
