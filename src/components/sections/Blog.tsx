import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, AlertTriangle, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { blogPosts, BlogPost } from "@/data/site";
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
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="img-alive h-full w-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">{post.category}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readTime}</span>
        </div>
        <h3 className="mt-4 text-lg font-semibold leading-snug">{post.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">{post.excerpt}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{post.date}</span>
          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReadMore?.(post);
            }}
            variant="ghost"
            className="h-9 rounded-full px-4 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            Read More <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
  useEffect(() => {
    if (post) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [post]);

  if (!post) return null;

  return (
    <Dialog open={!!post} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[9999] w-[94vw] sm:max-w-[760px] max-h-[88vh] flex flex-col rounded-3xl border-slate-800 bg-slate-950 text-white p-0 shadow-2xl backdrop-blur-2xl overflow-hidden [overscroll-behavior:contain]">
        {/* Pinned Visible Header */}
        <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-slate-800/80 bg-slate-950 z-20 flex items-center justify-between">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2 text-white">
              <BookOpen className="h-5 w-5 text-emerald-400" /> {post.category}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 flex items-center gap-2">
              <span>{post.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Article Body */}
        <div
          onWheel={(e) => e.stopPropagation()}
          className="p-6 sm:p-8 overflow-y-auto flex-1 max-h-[88vh] [overscroll-behavior:contain] text-slate-200 space-y-6"
        >
          {/* Header Image */}
          <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-800 shadow-lg">
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            {post.title}
          </h1>

          {/* Excerpt Summary */}
          <div className="rounded-2xl border-l-4 border-emerald-500 bg-emerald-950/30 p-4 text-emerald-300/90 text-sm font-medium italic leading-relaxed">
            {post.excerpt}
          </div>

          {/* Article Paragraphs */}
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-300 pt-2">
            {post.content.map((paragraph, i) => (
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const BlogSection = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <MotionSection animation="fadeLeft" className="section bg-gradient-soft">
      <div className="container-wide">
        <SectionHeading
          eyebrow="From the Blog"
          title={<>Solar knowledge, <span className="text-gradient">without the jargon</span></>}
          description="Practical guides on subsidy, maintenance, policy changes and choosing the right hardware."
        />
        <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-4">
          {blogPosts.slice(0, 4).map((p, i) => (
            <BlogCard key={p.slug} post={p} index={i} onReadMore={(post) => setSelectedPost(post)} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-8">
            <Link to="/blog">View all articles</Link>
          </Button>
        </div>
      </div>

      <BlogArticleModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </MotionSection>
  );
};
