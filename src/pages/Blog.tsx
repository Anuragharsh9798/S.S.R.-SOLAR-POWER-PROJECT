import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { BlogCard, BlogArticleModal } from "@/components/sections/Blog";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { blogPosts, BlogPost } from "@/data/site";

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <Layout>
      <Seo
        title="Solar Blog | Tips, Policies & Maintenance Guides | SSR Solar Power"
        description="Practical solar articles from SSR Solar Power: installation tips, government policy updates, maintenance guides and industry news."
        path="/blog"
      />
      <PageHero
        eyebrow="Blog"
        title="Solar insights worth your time"
        description="Guides written by our engineers — no marketing fluff, just what actually affects your generation and returns."
        image="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&q=80"
      />

      <section className="section pt-0">
        <div className="container-wide grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((p, i) => (
            <BlogCard
              key={p.slug}
              post={p}
              index={i}
              onReadMore={(post) => setSelectedPost(post)}
            />
          ))}
        </div>
      </section>

      <BlogArticleModal post={selectedPost} onClose={() => setSelectedPost(null)} />

      <CtaBanner />
    </Layout>
  );
};

export default Blog;
