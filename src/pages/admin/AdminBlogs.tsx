import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Seo } from '@/components/Seo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Newspaper,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Tag,
} from 'lucide-react';

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string | string[];
  readTime: string;
  featuredImage?: string;
  image?: string;
  category?: string;
  categoryName?: string;
  date?: string;
  publishedAt?: string;
  isPublished: boolean;
  createdAt?: string;
}

export const AdminBlogs: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'STAFF';
  const isSuperAdmin = role === 'SUPER_ADMIN';
  const canManage = role === 'SUPER_ADMIN' || role === 'ADMIN';

  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Form Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryName, setCategoryName] = useState('Solar Guide');
  const [readTime, setReadTime] = useState('6 min read');
  const [excerpt, setExcerpt] = useState('');
  const [contentStr, setContentStr] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  // Delete Confirmation Modal
  const [deletingBlog, setDeletingBlog] = useState<BlogItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<BlogItem[]>('/api/v1/admin/blogs');
      setBlogs(data || []);
    } catch (err: any) {
      console.error('Failed to fetch blogs:', err);
      const msg = err.message || 'Unable to retrieve blog posts list.';
      setError(msg);
      toast.error('Failed to load blogs', { description: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openCreateModal = () => {
    setEditingBlog(null);
    setTitle('');
    setSlug('');
    setCategoryName('Solar Guide');
    setReadTime('6 min read');
    setExcerpt('');
    setContentStr('');
    setFeaturedImage('');
    setIsPublished(true);
    setIsFormOpen(true);
  };

  const openEditModal = (b: BlogItem) => {
    setEditingBlog(b);
    setTitle(b.title);
    setSlug(b.slug);
    setCategoryName(b.categoryName || b.category || 'Solar Guide');
    setReadTime(b.readTime || '6 min read');
    setExcerpt(b.excerpt || '');
    
    if (Array.isArray(b.content)) {
      setContentStr(b.content.join('\n\n'));
    } else {
      setContentStr(b.content || '');
    }
    
    setFeaturedImage(b.featuredImage || b.image || '');
    setIsPublished(b.isPublished !== false);
    setIsFormOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingBlog) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) {
      toast.error('Permission Denied', { description: 'Only ADMIN or SUPER_ADMIN can manage blogs.' });
      return;
    }

    setFormSubmitting(true);
    try {
      const payload = {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        excerpt,
        content: contentStr,
        readTime,
        featuredImage: featuredImage || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1000&q=80',
        isPublished,
      };

      if (editingBlog) {
        await api.patch(`/api/v1/admin/blogs/${editingBlog.id}`, payload);
        toast.success('Blog Post Updated', { description: `Article "${title}" saved successfully.` });
      } else {
        await api.post('/api/v1/admin/blogs', payload);
        toast.success('Blog Post Created', { description: `New article "${title}" published successfully.` });
      }

      setIsFormOpen(false);
      fetchBlogs();
    } catch (err: any) {
      console.error('Failed to save blog:', err);
      toast.error('Save Failed', { description: err.message || 'Unable to save blog post.' });
    } finally {
      setFormSubmitting(false);
    }
  };

  const togglePublishStatus = async (b: BlogItem) => {
    if (!canManage) {
      toast.error('Permission Denied', { description: 'Requires ADMIN or SUPER_ADMIN role.' });
      return;
    }

    try {
      const updatedStatus = !b.isPublished;
      await api.patch(`/api/v1/admin/blogs/${b.id}`, { isPublished: updatedStatus });
      toast.success(updatedStatus ? 'Article Published' : 'Article Unpublished', {
        description: `"${b.title}" is now ${updatedStatus ? 'published live' : 'hidden as draft'}.`,
      });
      fetchBlogs();
    } catch (err: any) {
      console.error('Failed to toggle status:', err);
      toast.error('Status Toggle Failed', { description: err.message || 'Unable to update status.' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBlog) return;
    if (!isSuperAdmin) {
      toast.error('Permission Denied', { description: 'Delete permission is restricted to SUPER_ADMIN role only.' });
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/api/v1/admin/blogs/${deletingBlog.id}`);
      toast.success('Blog Post Deleted', { description: `Article "${deletingBlog.title}" has been deleted.` });
      setDeletingBlog(null);
      fetchBlogs();
    } catch (err: any) {
      console.error('Failed to delete blog:', err);
      toast.error('Delete Failed', { description: err.message || 'Unable to delete blog post.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'PUBLISHED' && b.isPublished) ||
        (statusFilter === 'DRAFT' && !b.isPublished);

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        (b.categoryName && b.categoryName.toLowerCase().includes(q));

      return matchesStatus && matchesQuery;
    });
  }, [blogs, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      <Seo
        title="Blogs & Articles Management | Admin Dashboard | SSR Solar Power"
        description="Publish, edit, and manage SSR Solar blog articles and educational guides."
        path="/admin/blogs"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-4 w-4" /> Administrative Management ({role})
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Blogs & Educational Articles
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Create, publish, edit, and organize solar energy articles, government subsidy guides, and technical news.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={fetchBlogs}
            disabled={loading}
            variant="outline"
            size="sm"
            className="rounded-full border-border hover:bg-muted font-bold text-xs"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {canManage && (
            <Button
              onClick={openCreateModal}
              size="sm"
              className="btn-premium rounded-full bg-gradient-brand font-bold text-primary-foreground text-xs shadow-glow"
            >
              <Plus className="mr-1.5 h-4 w-4" /> Create New Article
            </Button>
          )}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl bg-card p-4 border border-border shadow-soft">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search article by title, excerpt, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0 hidden md:block" />
          {['ALL', 'PUBLISHED', 'DRAFT'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="flex items-center justify-between rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
          <Button onClick={fetchBlogs} variant="outline" size="sm" className="rounded-full text-xs font-bold">
            Retry
          </Button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="p-12 text-center space-y-3 rounded-2xl bg-card border border-border">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-xs font-semibold text-muted-foreground">Loading blog articles database...</p>
        </div>
      )}

      {/* BLOGS GRID */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.length === 0 ? (
            <div className="col-span-full p-12 text-center space-y-3 rounded-3xl bg-card border border-border">
              <Newspaper className="h-10 w-10 mx-auto text-muted-foreground/40" />
              <h4 className="text-sm font-bold text-foreground">No Blog Articles Found</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No articles match your current search query or status filter.
              </p>
            </div>
          ) : (
            filteredBlogs.map((b) => (
              <div
                key={b.id}
                className="calc-card-gradient-border overflow-hidden rounded-3xl bg-card shadow-soft hover:shadow-glow transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-muted overflow-hidden">
                    <img
                      src={b.featuredImage || b.image || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1000&q=80'}
                      alt={b.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-background/90 text-foreground font-bold text-[10px] backdrop-blur-md">
                        <Tag className="h-3 w-3 mr-1 text-primary" />
                        {b.categoryName || b.category || 'Solar Guide'}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {b.readTime || '5 min read'}
                      </span>
                      <span>{b.date || 'Recent'}</span>
                    </div>

                    <h3 className="font-bold text-base text-foreground line-clamp-2 leading-snug">
                      {b.title}
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {b.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 border-t border-border/60 flex items-center justify-between">
                  <Badge
                    className={`text-[10px] font-bold ${
                      b.isPublished
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                    }`}
                  >
                    {b.isPublished ? 'PUBLISHED' : 'DRAFT'}
                  </Badge>

                  <div className="flex items-center gap-2">
                    {canManage && (
                      <>
                        <Button
                          onClick={() => togglePublishStatus(b)}
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 rounded-lg text-xs font-semibold"
                          title={b.isPublished ? 'Unpublish' : 'Publish'}
                        >
                          {b.isPublished ? <XCircle className="h-3.5 w-3.5 text-amber-500" /> : <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                        </Button>
                        <Button
                          onClick={() => openEditModal(b)}
                          variant="outline"
                          size="sm"
                          className="h-8 px-2.5 rounded-lg text-xs font-semibold"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                        </Button>
                      </>
                    )}

                    <Button
                      onClick={() => setDeletingBlog(b)}
                      disabled={!isSuperAdmin}
                      variant="ghost"
                      size="sm"
                      className={`h-8 px-2 rounded-lg text-xs font-semibold ${
                        isSuperAdmin ? 'text-destructive hover:bg-destructive/10' : 'text-muted-foreground cursor-not-allowed opacity-50'
                      }`}
                      title={!isSuperAdmin ? 'Delete restricted to SUPER_ADMIN role' : 'Delete Article'}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* CREATE / EDIT FORM DIALOG */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              {editingBlog ? 'Edit Blog Article' : 'Create New Article'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Fill in solar article details, excerpt, and full markdown content.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 pt-2 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="blogTitle" className="font-semibold text-foreground">Article Title *</Label>
              <Input
                id="blogTitle"
                required
                placeholder="e.g. 8 Things to Check Before Installing Rooftop Solar"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="h-10 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="blogSlug" className="font-semibold text-foreground">URL Slug *</Label>
                <Input
                  id="blogSlug"
                  required
                  placeholder="e.g. 8-things-before-installing-rooftop-solar"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="h-10 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="blogCategory" className="font-semibold text-foreground">Category Name *</Label>
                <Input
                  id="blogCategory"
                  required
                  placeholder="e.g. Government Policies, Solar Checklist..."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="blogReadTime" className="font-semibold text-foreground">Estimated Read Time</Label>
                <Input
                  id="blogReadTime"
                  placeholder="e.g. 6 min read"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="blogImage" className="font-semibold text-foreground">Featured Image URL</Label>
                <Input
                  id="blogImage"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="blogExcerpt" className="font-semibold text-foreground">Short Summary / Excerpt *</Label>
              <Textarea
                id="blogExcerpt"
                required
                rows={2}
                placeholder="Brief summary appearing on blog cards..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="blogContent" className="font-semibold text-foreground">Full Article Body *</Label>
              <Textarea
                id="blogContent"
                required
                rows={8}
                placeholder="Write full article body content..."
                value={contentStr}
                onChange={(e) => setContentStr(e.target.value)}
                className="rounded-xl text-xs font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="blogPublish"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded text-primary focus:ring-primary"
              />
              <Label htmlFor="blogPublish" className="font-semibold text-foreground cursor-pointer">
                Publish Immediately on Website
              </Label>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="rounded-full text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={formSubmitting} className="btn-premium rounded-full bg-gradient-brand font-bold text-xs text-primary-foreground shadow-glow">
                {formSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editingBlog ? 'Save Changes' : 'Publish Article'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={!!deletingBlog} onOpenChange={(open) => !open && setDeletingBlog(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Confirm Article Deletion
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to delete <span className="font-bold text-foreground">"{deletingBlog?.title}"</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setDeletingBlog(null)} className="rounded-full text-xs">
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isDeleting || !isSuperAdmin}
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold text-xs"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete Article'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
