import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, AlertTriangle, BookOpen, Loader2, AlertCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { blogPosts as fallbackBlogPosts, BlogPost, getRelevantSolarImage, solarImagesList } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { MotionSection } from "@/components/motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";

export const BlogCard = ({
  post,
  index = 0,
  onReadMore,
}: {
  post: BlogPost;
  index?: number;
  onReadMore?: (post: BlogPost) => void;
}) => {
  const articleSlug = post.slug || "solar-guide";
  const articleDate = post.date || (post as any).publishedAt || "Recent";
  const categoryName = post.category || "Solar Guide";
  const readTimeText = post.readTime || "5 min read";
  const [imgSrc, setImgSrc] = useState(() => getRelevantSolarImage(post, index));

  useEffect(() => {
    setImgSrc(getRelevantSolarImage(post, index));
  }, [post, index]);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onReadMore) {
      onReadMore(post);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ y: -6 }}
      className="group blog-card-glow relative transition-all duration-500 flex flex-col h-full"
    >
      <div className="relative flex flex-col justify-between h-full w-full overflow-hidden rounded-3xl transition-all duration-500 blog-card-gradient-border bg-card shadow-card">
        {/* Top Image & Content Area */}
        <div className="flex-1 flex flex-col">
          <div
            onClick={handleOpenModal}
            className="aspect-[16/9] w-full overflow-hidden bg-muted shrink-0 cursor-pointer"
          >
            <img
              src={imgSrc}
              alt={post.title}
              loading="lazy"
              onError={() => {
                setImgSrc(solarImagesList[index % solarImagesList.length]);
              }}
              className="img-alive h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {categoryName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" /> {readTimeText}
              </span>
            </div>

            <h3
              onClick={handleOpenModal}
              className="text-sm sm:text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2 cursor-pointer text-left"
            >
              {post.title}
            </h3>

            <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2 text-left">
              {post.excerpt}
            </p>
          </div>
        </div>

        {/* Bottom Pinned Footer with Visible Read More Button */}
        <div className="p-4 sm:p-5 pt-3 border-t border-border/50 flex items-center justify-between shrink-0 bg-card/50">
          <span className="text-[11px] font-semibold text-muted-foreground">{articleDate}</span>

          <button
            type="button"
            onClick={handleOpenModal}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-600 text-emerald-600 dark:text-emerald-400 hover:text-white px-3.5 py-1.5 text-xs font-bold transition-all duration-300 shadow-xs border border-emerald-500/30 hover:border-emerald-600 group/btn shrink-0 cursor-pointer"
          >
            <span>Read More</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export const BlogArticleModal = ({
  post,
  onClose,
}: {
  post: BlogPost | null;
  onClose: () => void;
}) => {
  const [detailData, setDetailData] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);

  useEffect(() => {
    if (post) {
      document.body.style.overflow = "hidden";
      const fetchBlogBySlug = async () => {
        setLoadingDetail(true);
        setSlugError(null);
        setDetailData(null);
        try {
          const data = await api.get<any>(`/api/v1/blogs/${post.slug}`);
          if (data && data.title) {
            setDetailData(data);
          } else {
            setDetailData(post);
          }
        } catch (err: any) {
          console.warn("Could not fetch blog by slug from backend:", err);
          if (err.statusCode === 404) {
            setSlugError(`Article "${post.slug}" was not found on backend server.`);
          } else {
            setDetailData(post);
          }
        } finally {
          setLoadingDetail(false);
        }
      };

      fetchBlogBySlug();
    } else {
      document.body.style.overflow = "";
      setDetailData(null);
      setSlugError(null);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [post]);

  if (!post) return null;

  const article = detailData || post;
  const contentParagraphs: string[] = (() => {
    if (!article || !article.content) return [];
    if (Array.isArray(article.content)) return article.content;
    if (typeof article.content === "string") {
      try {
        const parsed = JSON.parse(article.content);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Plain string
      }
      return article.content.split("\n\n");
    }
    return [];
  })();

  return (
    <Dialog open={!!post} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[9999] w-[94vw] sm:max-w-[760px] max-h-[88vh] flex flex-col rounded-3xl border-slate-800 bg-slate-950 text-white p-0 shadow-2xl backdrop-blur-2xl overflow-hidden [overscroll-behavior:contain]">
        <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-slate-800/80 bg-slate-950 z-20 flex items-center justify-between">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2 text-white">
              <BookOpen className="h-5 w-5 text-emerald-400" /> {article.category || post.category}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 flex items-center gap-2">
              <span>{article.date || article.publishedAt || post.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {article.readTime || post.readTime}
              </span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div
          onWheel={(e) => e.stopPropagation()}
          className="p-6 sm:p-8 overflow-y-auto flex-1 max-h-[88vh] [overscroll-behavior:contain] text-slate-200 space-y-6"
        >
          {loadingDetail ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-400" />
              <p className="text-xs text-slate-400">Loading article content from backend...</p>
            </div>
          ) : slugError ? (
            <div className="py-12 text-center space-y-3 bg-rose-950/20 border border-rose-500/30 rounded-2xl p-6">
              <AlertCircle className="mx-auto h-8 w-8 text-rose-400" />
              <h4 className="font-bold text-base text-rose-300">Article Unavailable</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">{slugError}</p>
            </div>
          ) : (
            <>
              <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-800 shadow-lg bg-slate-900">
                <img
                  src={getRelevantSolarImage(article || post)}
                  alt={article.title || post.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1000&q=80";
                  }}
                  className="h-full w-full object-cover"
                />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {article.title || post.title}
              </h1>

              {(article.excerpt || post.excerpt) && (
                <div className="rounded-2xl border-l-4 border-emerald-500 bg-emerald-950/30 p-4 text-emerald-300/90 text-sm font-medium italic leading-relaxed">
                  {article.excerpt || post.excerpt}
                </div>
              )}

              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-300 pt-2">
                {contentParagraphs.map((paragraph: string, i: number) => (
                  <p key={i} className="text-slate-300 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-200/90 space-y-1 backdrop-blur shadow-soft">
                <p className="font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 text-[11px]">
                  <AlertTriangle className="h-4 w-4 text-amber-400" /> Notice &amp; Disclaimer
                </p>
                <p className="leading-relaxed">
                  This article is provided for general educational purposes only. Solar generation, savings, warranty terms, approvals, metering arrangements and government benefits may vary depending on system design, location, manufacturer and applicable regulations. Please verify the latest information with the relevant DISCOM, MNRE or official government portal.
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const BlogSection = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<any[]>("/api/v1/blogs");
        if (Array.isArray(data) && data.length > 0) {
          setArticles(data);
        } else {
          setArticles(fallbackBlogPosts);
        }
      } catch (err: any) {
        console.warn("Could not fetch blog list from backend, using fallback:", err);
        setError(err.message || "Unable to load articles.");
        setArticles(fallbackBlogPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <MotionSection animation="fadeLeft" className="section py-10 md:py-14 bg-gradient-soft">
      <div className="container-wide space-y-8 sm:space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3.5 pb-2">
          <span className="eyebrow">From the Blog</span>
          <h2 className="text-3xl leading-tight sm:text-4xl md:text-[2.5rem] font-extrabold text-foreground tracking-tight">
            Solar knowledge, <span className="text-gradient">without the jargon</span>
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Explore practical guides and educational articles from SSR Solar Power covering rooftop solar installations, on-grid and hybrid systems, routine maintenance, and electricity bill savings. Stay informed with verified government subsidy updates, policy changes, and expert solar technology advice designed to help you make well-planned energy decisions.
          </p>
        </div>

        {error && (
          <div className="mx-auto max-w-lg flex items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[340px] rounded-3xl border border-border bg-card/60 p-5 animate-pulse space-y-3">
                <div className="aspect-[16/9] rounded-2xl bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted" />
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-9 rounded-full bg-muted" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="py-16 text-center space-y-3 rounded-3xl border border-dashed border-border p-8 bg-card/40">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground/60" />
            <h4 className="text-base font-bold text-foreground">No Blog Articles Found</h4>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              There are currently no published articles in the database.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {articles.slice(0, 4).map((p, i) => (
              <BlogCard key={p.slug || i} post={p} index={i} onReadMore={(post) => setSelectedPost(post)} />
            ))}
          </div>
        )}

        {/* Prominent Explore More Blogs Button */}
        <div className="pt-2 sm:pt-4 flex items-center justify-center">
          <Link
            to="/blog"
            id="explore-more-blogs-btn"
            className="group inline-flex items-center gap-2 rounded-full bg-emerald-500/15 hover:bg-emerald-600 text-emerald-600 dark:text-emerald-400 hover:text-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition-all duration-300 shadow-xs hover:shadow-md border border-emerald-500/30 hover:border-emerald-600 hover:scale-[1.03] active:scale-[0.98]"
          >
            <span>Explore More Blogs</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
          </Link>
        </div>
      </div>

      <BlogArticleModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </MotionSection>
  );
};
