import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Seo } from '@/components/Seo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Users,
  FileText,
  Clock,
  Briefcase,
  Gift,
  CheckCircle2,
  IndianRupee,
  Star,
  Newspaper,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  Loader2,
  ArrowRight,
  Activity,
  ChevronRight,
  Zap,
} from 'lucide-react';

export interface DashboardMetrics {
  totalCustomers: number;
  newQuoteRequests: number;
  pendingQuotes: number;
  totalProjects: number;
  pendingReferrals: number;
  approvedReferrals: number;
  paidReferrals: number;
  pendingReviews: number;
  publishedBlogs: number;
}

export interface RecentQuote {
  id: string;
  quoteNumber: string;
  fullName: string;
  phone: string;
  city: string;
  solarType: string;
  recommendedCapacityKw?: number;
  status: string;
  createdAt: string;
}

export interface RecentReferral {
  id: string;
  claimNumber: string;
  referrerName: string;
  friendName: string;
  friendCity: string;
  rewardAmount: any;
  status: string;
  createdAt: string;
}

export interface RecentProject {
  id: string;
  title: string;
  type: string;
  location: string;
  capacity: string;
  rating: number;
  createdAt: string;
}

export interface RecentReview {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
  isApproved: boolean;
  createdAt: string;
}

export interface RecentActivityItem {
  id: string;
  userEmail: string;
  action: string;
  entityName: string;
  createdAt: string;
}

export interface DashboardResponse {
  message?: string;
  actor?: any;
  metrics: DashboardMetrics;
  recentQuotes: RecentQuote[];
  recentReferrals: RecentReferral[];
  recentProjects: RecentProject[];
  recentReviews: RecentReview[];
  recentActivity: RecentActivityItem[];
}

export const formatRewardAmount = (val: any): string => {
  if (val === null || val === undefined) return '₹5,000';
  if (typeof val === 'number') return `₹${val.toLocaleString('en-IN')}`;
  if (typeof val === 'string') {
    const num = parseFloat(val);
    return isNaN(num) ? '₹5,000' : `₹${num.toLocaleString('en-IN')}`;
  }
  if (typeof val === 'object') {
    if (Array.isArray(val.d) && val.d.length > 0) {
      const num = parseFloat(val.d.join(''));
      if (!isNaN(num)) return `₹${num.toLocaleString('en-IN')}`;
    }
  }
  return '₹5,000';
};

export const AdminDashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'STAFF';

  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<DashboardResponse>('/api/v1/admin/dashboard');
      if (res && res.metrics) {
        setData(res);
      } else {
        throw new Error('Invalid dashboard payload received from server.');
      }
    } catch (err: any) {
      console.error('Failed to fetch dashboard overview metrics:', err);
      const msg = err.message || 'Unable to connect to SSR Solar Power backend.';
      setError(msg);
      toast.error('Dashboard Error', { description: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const metrics = data?.metrics;

  return (
    <div className="space-y-8">
      <Seo
        title="Admin Dashboard Overview | SSR Solar Power"
        description="Real-time executive metrics and administrative data summary for SSR Solar Power."
        path="/admin"
      />

      {/* Header Banner */}
      <div className="calc-card-gradient-border relative overflow-hidden rounded-3xl bg-card p-6 md:p-8 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-extrabold uppercase bg-primary/10 text-primary border-primary/30">
                <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-500" /> Real DB Metrics ({role})
              </Badge>
              <span className="text-xs text-muted-foreground font-semibold">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, {user?.fullName || user?.email}!
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Live executive summary of active customers, pending quote requests, solar projects, referral claims, and customer reviews.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={fetchDashboardData}
              disabled={loading}
              variant="outline"
              size="sm"
              className="rounded-full border-border hover:bg-muted font-bold text-xs"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <NavLink
              to="/admin/referrals"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-xs font-bold text-primary-foreground shadow-glow hover:opacity-95 transition-all"
            >
              <Gift className="h-4 w-4" />
              <span>Manage Referrals</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="flex items-center justify-between rounded-2xl border border-destructive/30 bg-destructive/10 p-5 text-destructive shadow-soft">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <div>
              <h4 className="text-sm font-bold">Failed to Load Live Metrics</h4>
              <p className="text-xs text-destructive/90">{error}</p>
            </div>
          </div>
          <Button
            onClick={fetchDashboardData}
            variant="outline"
            size="sm"
            className="rounded-full border-destructive/30 text-destructive hover:bg-destructive/20 text-xs font-bold"
          >
            Retry Fetch
          </Button>
        </div>
      )}

      {/* LOADING STATE (Skeleton Cards) */}
      {loading && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="calc-card-gradient-border rounded-2xl bg-card p-5 space-y-3 animate-pulse">
                <div className="h-4 w-24 bg-muted rounded-md" />
                <div className="h-8 w-16 bg-muted rounded-md" />
                <div className="h-3 w-32 bg-muted/60 rounded-md" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="calc-card-gradient-border rounded-2xl bg-card p-6 space-y-4 animate-pulse">
              <div className="h-5 w-40 bg-muted rounded-md" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-12 bg-muted/40 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="calc-card-gradient-border rounded-2xl bg-card p-6 space-y-4 animate-pulse">
              <div className="h-5 w-40 bg-muted rounded-md" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-12 bg-muted/40 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REAL METRICS GRID (9 Cards Required) */}
      {!loading && metrics && (
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Live Metric Counters</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
              {/* 1. Total Customers */}
              <div className="calc-card-gradient-border rounded-2xl bg-card p-5 shadow-soft hover:shadow-glow transition-all">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>Total Customers</span>
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <div className="mt-2 text-2xl md:text-3xl font-black text-foreground">
                  {metrics.totalCustomers.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Registered in system</div>
              </div>

              {/* 2. New Quote Requests */}
              <div className="calc-card-gradient-border rounded-2xl bg-card p-5 shadow-soft hover:shadow-glow transition-all">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>New Quote Requests</span>
                  <FileText className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="mt-2 text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {metrics.newQuoteRequests.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Awaiting initial review</div>
              </div>

              {/* 3. Pending Quotes */}
              <div className="calc-card-gradient-border rounded-2xl bg-card p-5 shadow-soft hover:shadow-glow transition-all">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <span>Pending Quotes</span>
                  <Clock className="h-4 w-4 text-amber-500" />
                </div>
                <div className="mt-2 text-2xl md:text-3xl font-black text-amber-600 dark:text-amber-400">
                  {metrics.pendingQuotes.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">In progress / site survey</div>
              </div>

              {/* 4. Total Projects */}
              <div className="calc-card-gradient-border rounded-2xl bg-card p-5 shadow-soft hover:shadow-glow transition-all">
                <div className="flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Total Projects</span>
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <div className="mt-2 text-2xl md:text-3xl font-black text-primary">
                  {metrics.totalProjects.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Rooftop installations</div>
              </div>

              {/* 5. Pending Referrals */}
              <div className="calc-card-gradient-border rounded-2xl bg-card p-5 shadow-soft hover:shadow-glow transition-all">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <span>Pending Referrals</span>
                  <Gift className="h-4 w-4 text-amber-500" />
                </div>
                <div className="mt-2 text-2xl md:text-3xl font-black text-amber-600 dark:text-amber-400">
                  {metrics.pendingReferrals.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Awaiting verification</div>
              </div>

              {/* 6. Approved Referrals */}
              <div className="calc-card-gradient-border rounded-2xl bg-card p-5 shadow-soft hover:shadow-glow transition-all">
                <div className="flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>Approved Referrals</span>
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                </div>
                <div className="mt-2 text-2xl md:text-3xl font-black text-blue-600 dark:text-blue-400">
                  {metrics.approvedReferrals.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Verified & eligible for payout</div>
              </div>

              {/* 7. Paid Referrals */}
              <div className="calc-card-gradient-border rounded-2xl bg-card p-5 shadow-soft hover:shadow-glow transition-all">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>Paid Referrals</span>
                  <IndianRupee className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="mt-2 text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {metrics.paidReferrals.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Disbursed referral rewards</div>
              </div>

              {/* 8. Pending Reviews */}
              <div className="calc-card-gradient-border rounded-2xl bg-card p-5 shadow-soft hover:shadow-glow transition-all">
                <div className="flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
                  <span>Pending Reviews</span>
                  <Star className="h-4 w-4 text-purple-500" />
                </div>
                <div className="mt-2 text-2xl md:text-3xl font-black text-purple-600 dark:text-purple-400">
                  {metrics.pendingReviews.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Awaiting moderation</div>
              </div>

              {/* 9. Published Blogs */}
              <div className="calc-card-gradient-border rounded-2xl bg-card p-5 shadow-soft hover:shadow-glow transition-all">
                <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>Published Blogs</span>
                  <Newspaper className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="mt-2 text-2xl md:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  {metrics.publishedBlogs.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Live news & guides</div>
              </div>
            </div>
          </div>

          {/* 5 RECENT DATA SECTIONS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Recent Quote Requests */}
            <div className="calc-card-gradient-border rounded-3xl bg-card p-6 shadow-soft flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <h4 className="text-base font-bold text-foreground">Recent Quote Requests</h4>
                  </div>
                  <span className="text-xs text-muted-foreground font-semibold">Latest 5</span>
                </div>

                {data.recentQuotes.length === 0 ? (
                  /* EMPTY STATE */
                  <div className="p-8 text-center space-y-2 border border-dashed border-border rounded-2xl">
                    <FileText className="h-8 w-8 mx-auto text-muted-foreground/50" />
                    <p className="text-xs font-semibold text-muted-foreground">No quote requests recorded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.recentQuotes.map((q) => (
                      <div
                        key={q.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 text-xs"
                      >
                        <div>
                          <div className="font-bold text-foreground flex items-center gap-2">
                            <span>{q.fullName}</span>
                            <Badge variant="outline" className="text-[9px] font-mono font-bold text-primary">
                              {q.quoteNumber}
                            </Badge>
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {q.city} • {q.solarType} ({q.recommendedCapacityKw || 3} kW)
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={`text-[10px] font-bold ${
                              q.status === 'NEW'
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {q.status}
                          </Badge>
                          <div className="text-[10px] text-muted-foreground mt-1">
                            {new Date(q.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 2. Recent Referral Claims */}
            <div className="calc-card-gradient-border rounded-3xl bg-card p-6 shadow-soft flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-emerald-500" />
                    <h4 className="text-base font-bold text-foreground">Recent Referral Claims</h4>
                  </div>
                  <NavLink to="/admin/referrals" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                    <span>View All</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </NavLink>
                </div>

                {data.recentReferrals.length === 0 ? (
                  /* EMPTY STATE */
                  <div className="p-8 text-center space-y-2 border border-dashed border-border rounded-2xl">
                    <Gift className="h-8 w-8 mx-auto text-muted-foreground/50" />
                    <p className="text-xs font-semibold text-muted-foreground">No referral claims submitted yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.recentReferrals.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 text-xs"
                      >
                        <div>
                          <div className="font-bold text-foreground flex items-center gap-2">
                            <span>{r.referrerName}</span>
                            <span className="text-muted-foreground font-normal">referred</span>
                            <span className="text-primary font-semibold">{r.friendName}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {r.friendCity} • {formatRewardAmount(r.rewardAmount)} reward
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={`text-[10px] font-bold ${
                              r.status === 'PAID'
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                                : r.status === 'APPROVED'
                                ? 'bg-blue-500/10 text-blue-600 border-blue-500/30'
                                : r.status === 'REJECTED'
                                ? 'bg-destructive/10 text-destructive border-destructive/30'
                                : 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                            }`}
                          >
                            {r.status}
                          </Badge>
                          <div className="text-[10px] text-muted-foreground mt-1">
                            {new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Recent Projects */}
            <div className="calc-card-gradient-border rounded-3xl bg-card p-6 shadow-soft flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <h4 className="text-base font-bold text-foreground">Recent Solar Projects</h4>
                  </div>
                  <span className="text-xs text-muted-foreground font-semibold">Latest Portfolio</span>
                </div>

                {data.recentProjects.length === 0 ? (
                  /* EMPTY STATE */
                  <div className="p-8 text-center space-y-2 border border-dashed border-border rounded-2xl">
                    <Briefcase className="h-8 w-8 mx-auto text-muted-foreground/50" />
                    <p className="text-xs font-semibold text-muted-foreground">No solar projects registered yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.recentProjects.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 text-xs"
                      >
                        <div>
                          <div className="font-bold text-foreground">{p.title}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {p.location} • {p.capacity} ({p.type})
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="h-3.5 w-3.5 fill-amber-500" />
                            <span>{p.rating}.0</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-1">
                            {new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 4. Recent Reviews */}
            <div className="calc-card-gradient-border rounded-3xl bg-card p-6 shadow-soft flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-purple-500" />
                    <h4 className="text-base font-bold text-foreground">Recent Customer Reviews</h4>
                  </div>
                  <span className="text-xs text-muted-foreground font-semibold">Moderation List</span>
                </div>

                {data.recentReviews.length === 0 ? (
                  /* EMPTY STATE */
                  <div className="p-8 text-center space-y-2 border border-dashed border-border rounded-2xl">
                    <Star className="h-8 w-8 mx-auto text-muted-foreground/50" />
                    <p className="text-xs font-semibold text-muted-foreground">No customer reviews submitted yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.recentReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 text-xs"
                      >
                        <div className="max-w-[70%]">
                          <div className="font-bold text-foreground flex items-center gap-2">
                            <span>{rev.name}</span>
                            <span className="text-muted-foreground font-normal">({rev.location})</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5 italic">
                            "{rev.quote}"
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={`text-[10px] font-bold ${
                              rev.isApproved
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                                : 'bg-purple-500/10 text-purple-600 border-purple-500/30'
                            }`}
                          >
                            {rev.isApproved ? 'Approved' : 'Pending'}
                          </Badge>
                          <div className="text-[10px] text-muted-foreground mt-1">
                            {new Date(rev.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 5. Recent Admin Activity Log */}
          <div className="calc-card-gradient-border rounded-3xl bg-card p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <h4 className="text-base font-bold text-foreground">Recent Admin Activity</h4>
              </div>
              <span className="text-xs text-muted-foreground font-semibold">Security Audit Stream</span>
            </div>

            {data.recentActivity.length === 0 ? (
              /* EMPTY STATE */
              <div className="p-8 text-center space-y-2 border border-dashed border-border rounded-2xl">
                <Activity className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p className="text-xs font-semibold text-muted-foreground">No recent administrative activity recorded.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {data.recentActivity.map((act) => (
                  <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                        {act.action.substring(0, 3)}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">
                          {act.action} <span className="text-primary font-semibold">({act.entityName})</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Actor: {act.userEmail}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {new Date(act.createdAt).toLocaleString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: 'short',
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
