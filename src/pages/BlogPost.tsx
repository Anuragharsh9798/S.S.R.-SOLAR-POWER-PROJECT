import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { scrollToTop } from "@/components/SmoothScroll";
import { Seo } from "@/components/Seo";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Button } from "@/components/ui/button";
import { MotionSection } from "@/components/motion";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  AlertTriangle,
  AlertCircle,
  Loader2,
  RefreshCw,
  FileText,
} from "lucide-react";
import { api } from "@/lib/api";
import { blogPosts as fallbackBlogPosts, getRelevantSolarImage } from "@/data/site";

export const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const fetchArticle = async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    setNotFound(false);
    setArticle(null);

    try {
      const data = await api.get<any>(`/api/v1/blogs/${slug}`);
      if (data && data.title) {
        setArticle(data);
      } else {
        const fallback = fallbackBlogPosts.find((b) => b.slug === slug);
        if (fallback) {
          setArticle(fallback);
        } else {
          setNotFound(true);
        }
      }
    } catch (err: any) {
      console.warn("Failed to fetch blog article by slug from backend:", err);
      const fallback = fallbackBlogPosts.find((b) => b.slug === slug);
      if (fallback) {
        setArticle(fallback);
      } else if (err.statusCode === 404) {
        setNotFound(true);
      } else {
        setError(err.message || "Unable to load article content from backend server.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
    scrollToTop({ immediate: true });
  }, [slug]);

  const contentParagraphs: string[] = (() => {
    if (!article || !article.content) return [];
    if (Array.isArray(article.content)) return article.content;
    if (typeof article.content === "string") {
      try {
        const parsed = JSON.parse(article.content);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Not JSON string
      }
      return article.content.split("\n\n");
    }
    return [];
  })();

  return (
    <Layout>
      <Seo
        title={article ? `${article.title} | SSR Solar Power Blog` : "Blog Article | SSR Solar Power"}
        description={article ? article.excerpt : "Read our latest solar guide and technical insights."}
        path={`/blog/${slug || ""}`}
      />

      <section className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/92 to-background"
          aria-hidden
        />
        <div className="blob -left-20 top-10 h-72 w-72 bg-primary/20" aria-hidden />
        <div className="blob -right-10 top-24 h-64 w-64 bg-secondary/20" aria-hidden />

        <div className="container-wide relative max-w-4xl mx-auto space-y-8">
          {/* Top Breadcrumb Navigation */}
          <div className="flex items-center justify-between">
            <Button
              asChild
              variant="ghost"
              className="rounded-full px-4 text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-2"
            >
              <Link to="/blog">
                <ArrowLeft className="h-4 w-4" /> Back to Articles
              </Link>
            </Button>
            {article && (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" /> {article.category || "Solar Guide"}
              </span>
            )}
          </div>

          {/* 1. LOADING STATE */}
          {loading && (
            <div className="py-20 text-center space-y-6 max-w-xl mx-auto rounded-3xl border border-border bg-card/40 p-10 animate-pulse">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
              <div className="space-y-3">
                <div className="h-6 w-3/4 rounded bg-muted mx-auto" />
                <div className="h-4 w-1/2 rounded bg-muted mx-auto" />
              </div>
              <p className="text-xs text-muted-foreground">Fetching complete article content from backend...</p>
            </div>
          )}

          {/* 2. ARTICLE NOT FOUND / 404 STATE */}
          {!loading && notFound && (
            <MotionSection animation="fadeUp" className="py-16 text-center space-y-6 rounded-3xl border border-destructive/30 bg-destructive/10 p-8 shadow-soft">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/20 text-destructive">
                <FileText className="h-7 w-7" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-xl font-bold text-foreground">Article Not Found</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The requested article slug <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-destructive">{slug}</code> could not be found on the backend database.
                </p>
              </div>
              <Button asChild className="btn-premium rounded-full bg-gradient-brand font-semibold text-primary-foreground">
                <Link to="/blog">Browse All Blog Articles</Link>
              </Button>
            </MotionSection>
          )}

          {/* 3. API ERROR STATE */}
          {!loading && !notFound && error && (
            <MotionSection animation="fadeUp" className="py-16 text-center space-y-6 rounded-3xl border border-destructive/30 bg-destructive/10 p-8 shadow-soft">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/20 text-destructive">
                <AlertCircle className="h-7 w-7" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-xl font-bold text-foreground">Failed to Load Article</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">{error}</p>
              </div>
              <Button onClick={fetchArticle} variant="outline" className="rounded-full px-6 text-xs font-semibold gap-2">
                <RefreshCw className="h-4 w-4" /> Retry Loading
              </Button>
            </MotionSection>
          )}

          {/* 4. SUCCESSFUL ARTICLE RENDERING STATE */}
          {!loading && !notFound && !error && article && (
            <MotionSection animation="fadeUp" className="space-y-8">
              {/* Article Header Metadata */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-amber-500" /> {article.date || "Recent"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="h-3.5 w-3.5 text-primary" /> {article.readTime || "5 min read"}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground leading-tight tracking-tight">
                  {article.title}
                </h1>
              </div>

              {/* Excerpt Callout Box */}
              {article.excerpt && (
                <div className="rounded-2xl border-l-4 border-primary bg-primary/10 p-5 text-sm sm:text-base font-medium italic text-foreground leading-relaxed">
                  {article.excerpt}
                </div>
              )}

              {/* Featured Image */}
              <div className="aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border shadow-soft bg-muted">
                <img
                  src={getRelevantSolarImage(article)}
                  alt={article.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1000&q=80";
                  }}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Complete Article Paragraphs */}
              <div className="calc-card-glow group relative transition-all duration-500">
                <div className="calc-card-gradient-border relative rounded-3xl bg-card p-6 sm:p-10 shadow-soft space-y-6">
                  {contentParagraphs.map((paragraph, i) => (
                    <p key={i} className="text-base sm:text-lg leading-relaxed text-muted-foreground/90 font-normal">
                      {paragraph}
                    </p>
                  ))}

                  {/* Mandatory Legal Notice & Disclaimer */}
                  <div className="mt-10 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-xs text-amber-200/90 space-y-2 backdrop-blur shadow-soft">
                    <p className="font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 text-xs">
                      <AlertTriangle className="h-4 w-4 text-amber-400" /> Notice &amp; Disclaimer
                    </p>
                    <p className="leading-relaxed text-muted-foreground">
                      This article is provided for general educational purposes only. Solar generation, savings, warranty terms, approvals, metering arrangements and government benefits may vary depending on system design, location, manufacturer and applicable regulations. Please verify the latest information with the relevant DISCOM, MNRE or official government portal.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className="pt-6 flex justify-between items-center">
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full px-6 text-xs font-semibold flex items-center gap-2"
                >
                  <Link to="/blog">
                    <ArrowLeft className="h-4 w-4" /> Back to All Articles
                  </Link>
                </Button>
              </div>
            </MotionSection>
          )}
        </div>
      </section>

      <CtaBanner />
    </Layout>
  );
};

export default BlogPost;
