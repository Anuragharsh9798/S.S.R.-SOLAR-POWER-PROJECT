import React, { useState, useEffect } from 'react';
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
  Briefcase,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Star,
  MapPin,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  type: string;
  location: string;
  capacity: string;
  capacityKw?: number;
  completedDate?: string;
  annualSavings?: string;
  rating: number;
  description?: string;
  featuredImage?: string;
  isFeatured?: boolean;
  images?: Array<{ id: string; imageUrl: string; caption?: string }>;
  createdAt?: string;
}

export const AdminProjects: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'STAFF';
  const isSuperAdmin = role === 'SUPER_ADMIN';
  const canManage = role === 'SUPER_ADMIN' || role === 'ADMIN';

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState('Residential');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [capacityKw, setCapacityKw] = useState('10');
  const [rating, setRating] = useState('5');
  const [description, setDescription] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Delete Confirmation Modal
  const [deletingProject, setDeletingProject] = useState<ProjectItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<ProjectItem[]>('/api/v1/projects');
      setProjects(data || []);
    } catch (err: any) {
      console.error('Failed to fetch projects:', err);
      const msg = err.message || 'Unable to retrieve projects list.';
      setError(msg);
      toast.error('Failed to load projects', { description: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setTitle('');
    setSlug('');
    setType('Residential');
    setLocation('Mau, Uttar Pradesh');
    setCapacity('10 kW');
    setCapacityKw('10');
    setRating('5');
    setDescription('');
    setFeaturedImage('');
    setIsFeatured(false);
    setIsFormOpen(true);
  };

  const openEditModal = (proj: ProjectItem) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setSlug(proj.slug);
    setType(proj.type);
    setLocation(proj.location);
    setCapacity(proj.capacity);
    setCapacityKw(proj.capacityKw ? String(proj.capacityKw) : '10');
    setRating(String(proj.rating || 5));
    setDescription(proj.description || '');
    setFeaturedImage(proj.featuredImage || '');
    setIsFeatured(proj.isFeatured || false);
    setIsFormOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingProject) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) {
      toast.error('Permission Denied', { description: 'Only ADMIN or SUPER_ADMIN can manage projects.' });
      return;
    }

    setFormSubmitting(true);
    try {
      const payload = {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        type,
        location,
        capacity,
        capacityKw: parseFloat(capacityKw) || 10,
        rating: parseInt(rating, 10) || 5,
        description,
        featuredImage: featuredImage || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1000&q=80',
        isFeatured,
      };

      if (editingProject) {
        await api.patch(`/api/v1/projects/${editingProject.id}`, payload);
        toast.success('Project Updated', { description: `Project "${title}" updated successfully.` });
      } else {
        await api.post('/api/v1/projects', payload);
        toast.success('Project Created', { description: `New project "${title}" added successfully.` });
      }

      setIsFormOpen(false);
      fetchProjects();
    } catch (err: any) {
      console.error('Failed to save project:', err);
      toast.error('Save Failed', { description: err.message || 'Unable to save project details.' });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;
    if (!isSuperAdmin) {
      toast.error('Permission Denied', { description: 'Delete permission is restricted to SUPER_ADMIN role only.' });
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/api/v1/projects/${deletingProject.id}`);
      toast.success('Project Deleted', { description: `Project "${deletingProject.title}" has been deleted.` });
      setDeletingProject(null);
      fetchProjects();
    } catch (err: any) {
      console.error('Failed to delete project:', err);
      toast.error('Delete Failed', { description: err.message || 'Unable to delete project.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Seo
        title="Projects Portfolio Management | Admin Dashboard | SSR Solar Power"
        description="Manage SSR Solar rooftop installation projects and showcase portfolio."
        path="/admin/projects"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-4 w-4" /> Administrative Management ({role})
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Projects Portfolio Management
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Create, edit, and manage residential, commercial, and industrial rooftop solar projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={fetchProjects}
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
              <Plus className="mr-1.5 h-4 w-4" /> Add New Project
            </Button>
          )}
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-card p-4 border border-border shadow-soft">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search project by title, location, type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl text-xs"
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground hidden md:block">
          Total Projects: <span className="text-foreground font-extrabold">{filteredProjects.length}</span>
        </span>
      </div>

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="flex items-center justify-between rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
          <Button onClick={fetchProjects} variant="outline" size="sm" className="rounded-full text-xs font-bold">
            Retry
          </Button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="p-12 text-center space-y-3 rounded-2xl bg-card border border-border">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-xs font-semibold text-muted-foreground">Loading solar projects portfolio...</p>
        </div>
      )}

      {/* PROJECTS GRID */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full p-12 text-center space-y-3 rounded-3xl bg-card border border-border">
              <Briefcase className="h-10 w-10 mx-auto text-muted-foreground/40" />
              <h4 className="text-sm font-bold text-foreground">No Projects Found</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No solar projects match your search query.
              </p>
            </div>
          ) : (
            filteredProjects.map((p) => (
              <div
                key={p.id}
                className="calc-card-gradient-border overflow-hidden rounded-3xl bg-card shadow-soft hover:shadow-glow transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-muted overflow-hidden">
                    <img
                      src={p.featuredImage || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1000&q=80'}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-background/90 text-foreground font-bold text-[10px] backdrop-blur-md">
                        {p.type}
                      </Badge>
                      {p.isFeatured && (
                        <Badge className="bg-amber-500 text-white font-bold text-[10px]">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-foreground line-clamp-1">{p.title}</h3>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs shrink-0">
                        <Star className="h-3.5 w-3.5 fill-amber-500" />
                        <span>{p.rating}.0</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{p.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span className="font-bold text-foreground">{p.capacity} Plant Capacity</span>
                      </div>
                    </div>

                    {p.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 italic leading-relaxed">
                        "{p.description}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-5 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground font-mono">{p.slug}</span>

                  <div className="flex items-center gap-2">
                    {canManage && (
                      <Button
                        onClick={() => openEditModal(p)}
                        variant="outline"
                        size="sm"
                        className="h-8 px-2.5 rounded-lg text-xs font-semibold"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
                    )}

                    <Button
                      onClick={() => setDeletingProject(p)}
                      disabled={!isSuperAdmin}
                      variant="ghost"
                      size="sm"
                      className={`h-8 px-2 rounded-lg text-xs font-semibold ${
                        isSuperAdmin ? 'text-destructive hover:bg-destructive/10' : 'text-muted-foreground cursor-not-allowed opacity-50'
                      }`}
                      title={!isSuperAdmin ? 'Delete restricted to SUPER_ADMIN role' : 'Delete Project'}
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
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              {editingProject ? 'Edit Solar Project' : 'Add New Solar Project'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Fill in rooftop installation specifications and portfolio showcase details.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 pt-2 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="projTitle" className="font-semibold text-foreground">Project Title *</Label>
              <Input
                id="projTitle"
                required
                placeholder="e.g. Green Meadows Villa Solar Rooftop"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="h-10 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="projSlug" className="font-semibold text-foreground">URL Slug *</Label>
                <Input
                  id="projSlug"
                  required
                  placeholder="e.g. green-meadows-villa"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="h-10 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="projType" className="font-semibold text-foreground">Installation Type *</Label>
                <select
                  id="projType"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 font-semibold text-foreground focus:outline-none"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="projLocation" className="font-semibold text-foreground">Location *</Label>
                <Input
                  id="projLocation"
                  required
                  placeholder="e.g. Mau, Uttar Pradesh"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="projCapacity" className="font-semibold text-foreground">Capacity Display *</Label>
                <Input
                  id="projCapacity"
                  required
                  placeholder="e.g. 10 kW"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="projImage" className="font-semibold text-foreground">Featured Image URL</Label>
              <Input
                id="projImage"
                placeholder="https://images.unsplash.com/photo-..."
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="projDesc" className="font-semibold text-foreground">Project Description</Label>
              <Textarea
                id="projDesc"
                rows={3}
                placeholder="Details of rooftop panels, inverter sizing, and customer energy savings..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="projFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded text-primary focus:ring-primary"
              />
              <Label htmlFor="projFeatured" className="font-semibold text-foreground cursor-pointer">
                Showcase on Homepage Featured Carousel
              </Label>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="rounded-full text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={formSubmitting} className="btn-premium rounded-full bg-gradient-brand font-bold text-xs text-primary-foreground shadow-glow">
                {formSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editingProject ? 'Save Changes' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={!!deletingProject} onOpenChange={(open) => !open && setDeletingProject(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Confirm Project Deletion
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to delete <span className="font-bold text-foreground">"{deletingProject?.title}"</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setDeletingProject(null)} className="rounded-full text-xs">
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isDeleting || !isSuperAdmin}
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold text-xs"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
