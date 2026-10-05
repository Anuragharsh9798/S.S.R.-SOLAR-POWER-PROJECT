import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Seo } from '@/components/Seo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  MapPin,
  Clock,
} from 'lucide-react';

export interface ReviewItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  systemSizeKw?: number;
  solarType?: string;
  quote: string;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: string;
}

export const AdminReviews: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'STAFF';
  const isSuperAdmin = role === 'SUPER_ADMIN';
  const canApprove = role === 'SUPER_ADMIN' || role === 'ADMIN';

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal Action Targets
  const [actionTarget, setActionTarget] = useState<ReviewItem | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'delete' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<ReviewItem[]>('/api/v1/admin/reviews');
      setReviews(data || []);
    } catch (err: any) {
      console.error('Failed to fetch reviews:', err);
      const msg = err.message || 'Unable to retrieve customer reviews.';
      setError(msg);
      toast.error('Failed to load reviews', { description: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleActionConfirm = async () => {
    if (!actionTarget || !actionType) return;

    setIsSubmitting(true);
    try {
      if (actionType === 'approve') {
        if (!canApprove) throw new Error('Permission denied: Requires ADMIN or SUPER_ADMIN role.');
        await api.patch(`/api/v1/admin/reviews/${actionTarget.id}/approve`, { isApproved: true });
        toast.success('Review Approved', { description: `Review from "${actionTarget.name}" is now live on the public website.` });
      } else if (actionType === 'reject') {
        if (!canApprove) throw new Error('Permission denied: Requires ADMIN or SUPER_ADMIN role.');
        await api.patch(`/api/v1/admin/reviews/${actionTarget.id}/reject`, {});
        toast.success('Review Rejected', { description: `Review from "${actionTarget.name}" status updated to pending.` });
      } else if (actionType === 'delete') {
        if (!isSuperAdmin) throw new Error('Permission denied: Delete is restricted to SUPER_ADMIN role only.');
        await api.delete(`/api/v1/admin/reviews/${actionTarget.id}`);
        toast.success('Review Deleted', { description: `Review from "${actionTarget.name}" deleted permanently.` });
      }

      setActionTarget(null);
      setActionType(null);
      fetchReviews();
    } catch (err: any) {
      console.error('Failed review action:', err);
      toast.error('Action Failed', { description: err.message || 'Operation failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'APPROVED' && r.isApproved) ||
        (statusFilter === 'PENDING' && !r.isApproved);

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.quote.toLowerCase().includes(q);

      return matchesStatus && matchesQuery;
    });
  }, [reviews, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      <Seo
        title="Customer Reviews Moderation | Admin Dashboard | SSR Solar Power"
        description="Moderate customer testimonials, approve solar reviews, and manage feedback."
        path="/admin/reviews"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-4 w-4" /> Administrative Management ({role})
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Customer Reviews Moderation
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Review submitted customer testimonials and approve eligible entries for public website display.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={fetchReviews}
            disabled={loading}
            variant="outline"
            size="sm"
            className="rounded-full border-border hover:bg-muted font-bold text-xs"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search & Status Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl bg-card p-4 border border-border shadow-soft">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by reviewer name, location, quote..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0 hidden md:block" />
          {['ALL', 'PENDING', 'APPROVED'].map((st) => (
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
          <Button onClick={fetchReviews} variant="outline" size="sm" className="rounded-full text-xs font-bold">
            Retry
          </Button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="p-12 text-center space-y-3 rounded-2xl bg-card border border-border">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-xs font-semibold text-muted-foreground">Loading reviews moderation queue...</p>
        </div>
      )}

      {/* REVIEWS LIST */}
      {!loading && (
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="p-12 text-center space-y-3 rounded-3xl bg-card border border-border">
              <Star className="h-10 w-10 mx-auto text-muted-foreground/40" />
              <h4 className="text-sm font-bold text-foreground">No Customer Reviews Found</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No reviews match your current search query or filter selection.
              </p>
            </div>
          ) : (
            filteredReviews.map((r) => (
              <div
                key={r.id}
                className="calc-card-gradient-border rounded-3xl bg-card p-6 shadow-soft space-y-4 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-extrabold text-sm">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-sm flex items-center gap-2">
                        <span>{r.name}</span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                          <Star className="h-3.5 w-3.5 fill-amber-500" />
                          <span>{r.rating}.0</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-primary" /> {r.location}
                        {r.solarType && ` • ${r.solarType} (${r.systemSizeKw || 3} kW)`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      className={`text-[10px] font-bold ${
                        r.isApproved
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                          : 'bg-purple-500/10 text-purple-600 border border-purple-500/30'
                      }`}
                    >
                      {r.isApproved ? 'APPROVED (LIVE)' : 'PENDING MODERATION'}
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-foreground leading-relaxed italic bg-muted/30 p-3.5 rounded-2xl border border-border/50">
                  "{r.quote}"
                </p>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(r.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {canApprove && (
                      <>
                        {!r.isApproved ? (
                          <Button
                            onClick={() => {
                              setActionTarget(r);
                              setActionType('approve');
                            }}
                            size="sm"
                            className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              setActionTarget(r);
                              setActionType('reject');
                            }}
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 rounded-lg text-xs font-semibold"
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" /> Unpublish
                          </Button>
                        )}
                      </>
                    )}

                    <Button
                      onClick={() => {
                        setActionTarget(r);
                        setActionType('delete');
                      }}
                      disabled={!isSuperAdmin}
                      variant="ghost"
                      size="sm"
                      className={`h-8 px-2 rounded-lg text-xs font-semibold ${
                        isSuperAdmin
                          ? 'text-destructive hover:bg-destructive/10'
                          : 'text-muted-foreground cursor-not-allowed opacity-50'
                      }`}
                      title={!isSuperAdmin ? 'Delete restricted to SUPER_ADMIN role' : 'Delete Review'}
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

      {/* CONFIRMATION ACTION DIALOG */}
      <Dialog open={!!actionTarget} onOpenChange={(open) => !open && setActionTarget(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground capitalize flex items-center gap-2">
              {actionType === 'delete' ? (
                <AlertTriangle className="h-5 w-5 text-destructive" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              )}
              Confirm {actionType} Review
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to {actionType} review from{' '}
              <span className="font-bold text-foreground">"{actionTarget?.name}"</span>?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setActionTarget(null)} className="rounded-full text-xs">
              Cancel
            </Button>
            <Button
              onClick={handleActionConfirm}
              disabled={isSubmitting}
              className={`rounded-full font-bold text-xs ${
                actionType === 'delete'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : 'btn-premium bg-gradient-brand text-primary-foreground'
              }`}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Action'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
