import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  image?: string;
  children?: ReactNode;
  rightContent?: ReactNode;
}

export const PageHero = ({
  eyebrow,
  title,
  description,
  image = "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1920&q=80",
  children,
  rightContent,
}: PageHeroProps) => {
  const { pathname } = useLocation();
  const crumbs = pathname.split("/").filter(Boolean);

  return (
    <section className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
      <img
        src={image}
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-25 dark:opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/92 to-background" aria-hidden />

      <div className="container-wide relative">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <Link to="/" className="hover:text-primary">Home</Link>
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              <ChevronRight className="h-3.5 w-3.5" />
              <span className={`capitalize ${i === crumbs.length - 1 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {c.replace(/-/g, " ")}
              </span>
            </span>
          ))}
        </nav>

        {rightContent ? (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6 xl:col-span-5"
            >
              {eyebrow && <span className="eyebrow">{eyebrow}</span>}
              <h1 className="mt-3.5 text-4xl leading-[1.08] text-balance md:text-5xl lg:text-6xl">{title}</h1>
              {description && (
                typeof description === "string" ? (
                  <p className="mt-3.5 md:mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
                ) : (
                  <div className="mt-3.5 md:mt-4 space-y-3 text-base leading-relaxed text-muted-foreground md:text-lg">{description}</div>
                )
              )}
              {children && <div className="mt-6 md:mt-7">{children}</div>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6 xl:col-span-7"
            >
              {rightContent}
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h1 className="mt-3.5 text-4xl leading-[1.08] text-balance md:text-5xl lg:text-6xl">{title}</h1>
            {description && (
              typeof description === "string" ? (
                <p className="mt-3.5 md:mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
              ) : (
                <div className="mt-3.5 md:mt-4 max-w-3xl space-y-3.5 text-base leading-relaxed text-muted-foreground md:text-lg">{description}</div>
              )
            )}
            {children && <div className="mt-6 md:mt-7">{children}</div>}
          </motion.div>
        )}
      </div>
    </section>
  );
};
