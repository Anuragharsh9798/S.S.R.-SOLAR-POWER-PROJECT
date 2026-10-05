import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { BlogCard, BlogArticleModal } from "@/components/sections/Blog";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { blogPosts as fallbackBlogPosts, BlogPost } from "@/data/site";
import { api } from "@/lib/api";
import { AlertCircle, FileText } from "lucide-react";

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<any[]>("/api/v1/blogs");
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        } else {
          setPosts(fallbackBlogPosts);
        }
      } catch (err: any) {
        console.warn("Could not fetch blog posts from backend, using fallback:", err);
        setError(err.message || "Unable to load articles.");
        setPosts(fallbackBlogPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <Layout>
      <Seo
        title="Solar Blog | Tips, Policies & Maintenance Guides | SSR Solar Power"
        description="Practical solar articles from SSR Solar Power: installation tips, government policy updates, maintenance guides and industry news."
        path="/blog"
      />
      <PageHero
        eyebrow="Blog"
        title="Solar Insights & Practical Guides"
        className="pb-10 md:pb-14"
        description="Welcome to the SSR Solar Power blog, your comprehensive resource for practical solar energy knowledge. Discover insightful guides on residential and commercial rooftop solar, on-grid and hybrid power systems, system sizing, routine maintenance, and long-term electricity bill savings. We also provide timely updates on government initiatives like PM Surya Ghar Muft Bijli Yojana, state subsidies, DISCOM net metering guidelines, and reliable solar technology practices to help property owners make informed, cost-effective decisions."
        image="https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1920&q=80"
      />

      <section className="section pt-0 pb-10 md:pb-14">
        <div className="container-wide space-y-8">
          {error && (
            <div className="mx-auto max-w-lg flex items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[380px] rounded-3xl border border-border bg-card/60 p-6 animate-pulse space-y-4">
                  <div className="aspect-[16/10] rounded-2xl bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                  <div className="h-5 w-3/4 rounded bg-muted" />
                  <div className="h-10 rounded-full bg-muted" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="py-16 text-center space-y-3 rounded-3xl border border-dashed border-border p-8 bg-card/40">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground/60" />
              <h4 className="text-base font-bold text-foreground">No Blog Articles Found</h4>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                There are currently no published articles in the database.
              </p>
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <BlogCard
                  key={p.slug || i}
                  post={p}
                  index={i}
                  onReadMore={(post) => setSelectedPost(post)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <BlogArticleModal post={selectedPost} onClose={() => setSelectedPost(null)} />

      <CtaBanner />
    </Layout>
  );
};

export default Blog;

