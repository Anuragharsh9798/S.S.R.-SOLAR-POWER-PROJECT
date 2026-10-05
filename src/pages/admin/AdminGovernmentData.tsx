import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Seo } from '@/components/Seo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Building2,
  Edit,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Calendar,
  IndianRupee,
  CheckCircle2,
} from 'lucide-react';

export interface GovtStatItem {
  id: string;
  metric: string;
  value: string;
  unit: string;
  source: string;
  sourceUrl?: string;
  effectiveDate?: string;
  lastVerifiedAt?: string;
  updatedAt?: string;
}

export const AdminGovernmentData: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'STAFF';
  const canUpdate = role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'CONTENT_MANAGER';

  const [stats, setStats] = useState<GovtStatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Edit Modal State
  const [editingStat, setEditingStat] = useState<GovtStatItem | null>(null);
  const [metric, setMetric] = useState('');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('₹');
  const [source, setSource] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<GovtStatItem[]>('/api/v1/admin/government-statistics');
      setStats(data || []);
    } catch (err: any) {
      console.error('Failed to fetch government statistics:', err);
      const msg = err.message || 'Unable to retrieve government benchmarks.';
      setError(msg);
      toast.error('Failed to load statistics', { description: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const openEditModal = (s: GovtStatItem) => {
    setEditingStat(s);
    setMetric(s.metric);
    setValue(s.value);
    setUnit(s.unit || '₹');
    setSource(s.source || 'MNRE / PM Surya Ghar');
    setSourceUrl(s.sourceUrl || '');
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStat) return;
    if (!canUpdate) {
      toast.error('Permission Denied', { description: 'Only authorized roles can update government statistics.' });
      return;
    }

    setSubmitting(true);
    try {
      await api.patch(`/api/v1/admin/government-statistics/${editingStat.id}`, {
        metric,
        value,
        unit,
        source,
        sourceUrl,
        lastVerifiedAt: new Date().toISOString(),
      });

      toast.success('Benchmark Updated', {
        description: `Successfully updated "${metric}" to ${unit} ${value}.`,
      });

      setEditingStat(null);
      fetchStats();
    } catch (err: any) {
      console.error('Failed to update stat:', err);
      toast.error('Update Failed', { description: err.message || 'Unable to update statistic.' });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStats = stats.filter(
    (s) =>
      s.metric.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Seo
        title="PM Surya Ghar & Government Statistics | Admin Dashboard | SSR Solar Power"
        description="Official MNRE & UPNEDA solar subsidy benchmarks and verified government statistics."
        path="/admin/government-data"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-4 w-4" /> Administrative Management ({role})
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            PM Surya Ghar & Government Statistics
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Authoritative solar subsidy rates, Central CFA benchmarks, and UPNEDA state financial assistance records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={fetchStats}
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

      {/* Search Toolbar */}
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-card p-4 border border-border shadow-soft">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search metric, source agency, benchmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl text-xs"
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground hidden md:block">
          Verified Statistics: <span className="text-foreground font-extrabold">{filteredStats.length}</span>
        </span>
      </div>

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="flex items-center justify-between rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
          <Button onClick={fetchStats} variant="outline" size="sm" className="rounded-full text-xs font-bold">
            Retry
          </Button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="p-12 text-center space-y-3 rounded-2xl bg-card border border-border">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-xs font-semibold text-muted-foreground">Loading government benchmarks...</p>
        </div>
      )}

      {/* STATS GRID */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStats.length === 0 ? (
            <div className="col-span-full p-12 text-center space-y-3 rounded-3xl bg-card border border-border">
              <Building2 className="h-10 w-10 mx-auto text-muted-foreground/40" />
              <h4 className="text-sm font-bold text-foreground">No Government Statistics Found</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No verified benchmarks match your search query.
              </p>
            </div>
          ) : (
            filteredStats.map((s) => (
              <div
                key={s.id}
                className="calc-card-gradient-border rounded-3xl bg-card p-6 shadow-soft hover:shadow-glow transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-3">
                    <span className="text-[11px] font-extrabold uppercase text-primary tracking-wider">
                      {s.source}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> VERIFIED
                    </Badge>
                  </div>

                  <h3 className="font-bold text-base text-foreground leading-snug">{s.metric}</h3>

                  <div className="mt-3 text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    {s.unit} {s.value}
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                    {s.sourceUrl && (
                      <a
                        href={s.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                      >
                        <span>Official Source Link</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    <div className="flex items-center gap-1 text-[11px]">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>
                        Last Verified:{' '}
                        {s.lastVerifiedAt
                          ? new Date(s.lastVerifiedAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : s.effectiveDate || 'Recent'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground font-mono">{s.id}</span>
                  <Button
                    onClick={() => openEditModal(s)}
                    disabled={!canUpdate}
                    variant="outline"
                    size="sm"
                    className={`h-8 px-3 rounded-lg text-xs font-semibold ${
                      !canUpdate ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" /> Update Benchmark
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* EDIT STAT DIALOG */}
      <Dialog open={!!editingStat} onOpenChange={(open) => !open && setEditingStat(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" /> Update Government Benchmark
            </DialogTitle>
            <DialogDescription className="text-xs">
              Update verified subsidy rate or statistic benchmark returned by official government portals.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateSubmit} className="space-y-4 pt-2 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="statMetric" className="font-semibold text-foreground">Metric Title *</Label>
              <Input
                id="statMetric"
                required
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                className="h-10 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="statValue" className="font-semibold text-foreground">Benchmark Value *</Label>
                <Input
                  id="statValue"
                  required
                  placeholder="e.g. 78,000"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="h-10 rounded-xl font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="statUnit" className="font-semibold text-foreground">Unit Prefix / Symbol</Label>
                <Input
                  id="statUnit"
                  placeholder="e.g. ₹ or units"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="statSource" className="font-semibold text-foreground">Official Source Agency *</Label>
              <Input
                id="statSource"
                required
                placeholder="e.g. MNRE PM Surya Ghar National Portal"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="statUrl" className="font-semibold text-foreground">Source Documentation URL</Label>
              <Input
                id="statUrl"
                placeholder="https://pmsuryaghar.gov.in/..."
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="h-10 rounded-xl text-primary font-mono text-[11px]"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setEditingStat(null)} className="rounded-full text-xs">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !canUpdate}
                className="btn-premium rounded-full bg-gradient-brand font-bold text-xs text-primary-foreground shadow-glow"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Benchmark'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
