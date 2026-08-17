import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, AlertTriangle, BookOpen, Loader2, AlertCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { blogPosts as fallbackBlogPosts, BlogPost } from "@/data/site";
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
}) => (
  <motion.article
    initial={{ opacity: 0, y: 26 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, delay: index * 0.07 }}
    whileHover={{ y: -6 }}
    className="group blog-card-glow relative transition-all duration-500 cursor-pointer"
    onClick={() => onReadMore?.(post)}
  >
    <div className="relative h-full w-full overflow-hidden rounded-3xl transition-all duration-500 blog-card-gradient-border">
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={post.image || post.featuredImage || "/images/blog/default.jpg"}
          alt={post.title}
          loading="lazy"
          className="img-alive h-full w-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">{post.category || "Solar Guide"}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readTime || "5 min read"}</span>
        </div>
        <h3 className="mt-4 text-lg font-semibold leading-snug">{post.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">{post.excerpt}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{post.date || "Recent"}</span>
          <Button
            type="button"
            asChild
            variant="ghost"
            className="h-9 rounded-full px-4 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            <Link
              to={`/blog/${post.slug}`}
              onClick={(e) => {
                e.stopPropagation();
                onReadMore?.(post);
              }}
            >
              Read More <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </motion.article>
);

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
      // Fetch article detail by slug from GET /api/v1/blogs/:slug
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
            // Use cached post item if API fails
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
        {/* Pinned Visible Header */}
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

        {/* Scrollable Article Body */}
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
              {/* Header Image */}
              <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-800 shadow-lg bg-slate-900">
                <img
                  src={article.featuredImage || article.image || post.image}
                  alt={article.title || post.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {article.title || post.title}
              </h1>

              {/* Excerpt Summary */}
              {(article.excerpt || post.excerpt) && (
                <div className="rounded-2xl border-l-4 border-emerald-500 bg-emerald-950/30 p-4 text-emerald-300/90 text-sm font-medium italic leading-relaxed">
                  {article.excerpt || post.excerpt}
                </div>
              )}

              {/* Article Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-300 pt-2">
                {contentParagraphs.map((paragraph: string, i: number) => (
                  <p key={i} className="text-slate-300 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Mandatory Legal Disclaimer Box */}
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
    <MotionSection animation="fadeLeft" className="section bg-gradient-soft">
      <div className="container-wide space-y-10">
        <SectionHeading
          eyebrow="From the Blog"
          title={<>Solar knowledge, <span className="text-gradient">without the jargon</span></>}
          description="Practical guides on subsidy, maintenance, policy changes and choosing the right hardware."
        />

        {error && (
          <div className="mx-auto max-w-lg flex items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[360px] rounded-3xl border border-border bg-card/60 p-6 animate-pulse space-y-4">
                <div className="aspect-[16/10] rounded-2xl bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted" />
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-10 rounded-full bg-muted" />
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
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
            {articles.slice(0, 4).map((p, i) => (
              <BlogCard key={p.slug || i} post={p} index={i} onReadMore={(post) => setSelectedPost(post)} />
            ))}
          </div>
        )}

        <div className="text-center pt-4">
          <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-8">
            <Link to="/blog">View all articles</Link>
          </Button>
        </div>
      </div>

      <BlogArticleModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </MotionSection>
  );
};

