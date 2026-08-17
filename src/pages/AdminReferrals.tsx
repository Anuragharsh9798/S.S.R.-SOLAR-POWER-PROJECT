import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { SectionHeading } from "@/components/SectionHeading";
import { MotionSection } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import {
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Eye,
  EyeOff,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  Lock,
  LogOut,
  UserCheck,
  AlertTriangle,
  Loader2,
  Sparkles,
  ChevronRight,
  FileText,
  Phone,
  User,
  MapPin,
  Calendar,
  IndianRupee,
} from "lucide-react";

export interface ReferralClaim {
  id: string;
  claimNumber: string;
  referrerName: string;
  referrerPhone: string;
  friendName: string;
  friendPhone: string;
  friendCity: string;
  rewardAmount: number | string | any;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
  adminNotes?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export const getRewardNumeric = (val: any): number => {
  if (val === null || val === undefined) return 5000;
  if (typeof val === "number") return isNaN(val) ? 5000 : val;
  if (typeof val === "string") {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 5000 : parsed;
  }
  if (typeof val === "object") {
    if (typeof val.toNumber === "function") {
      try {
        const num = val.toNumber();
        if (typeof num === "number" && !isNaN(num)) return num;
      } catch {}
    }
    if (val.value !== undefined) return getRewardNumeric(val.value);
    if (Array.isArray(val.d) && val.d.length > 0) {
      const numStr = val.d.join("");
      const parsed = parseFloat(numStr);
      if (!isNaN(parsed)) return parsed;
    }
    if (typeof val.toString === "function") {
      const str = val.toString();
      if (str && str !== "[object Object]") {
        const parsed = parseFloat(str);
        if (!isNaN(parsed)) return parsed;
      }
    }
  }
  return 5000;
};

export const formatRewardAmount = (val: any): string => {
  const num = getRewardNumeric(val);
  return `₹${num.toLocaleString("en-IN")}`;
};

export const AdminReferrals = () => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<"SUPER_ADMIN" | "ADMIN" | "STAFF">("ADMIN");

  const getRoleHeading = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "Super Admin Login";
      case "STAFF":
        return "Staff Login";
      case "ADMIN":
      default:
        return "Admin Login";
    }
  };

  const getRoleSubtitle = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "Sign in with Super Admin credentials to access referral claims.";
      case "STAFF":
        return "Sign in with Staff credentials to view referral claims.";
      case "ADMIN":
      default:
        return "Sign in with Admin credentials to access referral claims.";
    }
  };

  // Referral data state
  const [referrals, setReferrals] = useState<ReferralClaim[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modal states
  const [selectedClaim, setSelectedClaim] = useState<ReferralClaim | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [approveTarget, setApproveTarget] = useState<ReferralClaim | null>(null);
  const [approveNotes, setApproveNotes] = useState("");
  const [isApproving, setIsApproving] = useState(false);

  const [rejectTarget, setRejectTarget] = useState<ReferralClaim | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectNotes, setRejectNotes] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const [markPaidTarget, setMarkPaidTarget] = useState<ReferralClaim | null>(null);
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    setAuthLoading(true);
    setError(null);
    try {
      // First verify user session via /auth/me
      const profile = await api.get<{ user: any }>("/api/v1/auth/me");
      if (profile && profile.user) {
        const userRole = profile.user.role || profile.user.roleName;
        if (userRole === "SUPER_ADMIN" || userRole === "ADMIN" || userRole === "STAFF") {
          setIsAuthenticated(true);
          setAdminUser(profile.user);
          await loadReferrals();
        } else {
          setIsAuthenticated(false);
          setError("Access Denied: Your account role does not have admin permissions.");
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      // Session invalid or not logged in
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const loadReferrals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<ReferralClaim[]>("/api/v1/admin/referrals");
      setReferrals(data || []);
    } catch (err: any) {
      console.error("Failed to fetch referrals:", err);
      const msg = err.message || "Failed to load referral claims from backend API.";
      setError(msg);
      toast.error("Failed to load referrals", { description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSubmitting(true);
    setError(null);

    try {
      const res = await api.post<{ user: any }>("/api/v1/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });

      if (res && res.user) {
        const actualRole = res.user.role || res.user.roleName;

        // Verify backend authenticated role matches selected role
        if (actualRole !== selectedRole) {
          try { await api.post("/api/v1/auth/logout"); } catch {}
          setIsAuthenticated(false);
          setAdminUser(null);
          const mismatchMsg = "Selected role does not match this account.";
          setError(mismatchMsg);
          toast.error("Role Mismatch", { description: mismatchMsg });
          return;
        }

        if (actualRole === "SUPER_ADMIN" || actualRole === "ADMIN" || actualRole === "STAFF") {
          setIsAuthenticated(true);
          setAdminUser(res.user);
          toast.success("Authentication Successful", {
            description: `Welcome back, ${res.user.fullName || res.user.email} (${actualRole})`,
          });
          await loadReferrals();
        } else {
          setIsAuthenticated(false);
          setError("Access Denied: Account lacks required administrative privileges.");
          toast.error("Access Denied", {
            description: "Account lacks required administrative privileges.",
          });
        }
      }
    } catch (err: any) {
      console.error("Admin login error:", err);
      const errMsg = err.message || "Invalid administrative credentials";
      setError(errMsg);
      toast.error("Login Failed", { description: errMsg });
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/v1/auth/logout");
    } catch {
      // Ignore logout errors
    } finally {
      setIsAuthenticated(false);
      setAdminUser(null);
      setReferrals([]);
      toast.info("Logged out of Admin Portal");
    }
  };

  // Workflow Handlers
  const handleApproveSubmit = async () => {
    if (!approveTarget) return;
    setIsApproving(true);
    try {
      await api.patch(`/api/v1/admin/referrals/${approveTarget.claimNumber}/approve`, {
        adminNotes: approveNotes.trim() || undefined,
      });
      toast.success("Referral Claim Approved!", {
        description: `Claim #${approveTarget.claimNumber} has been approved.`,
      });
      setApproveTarget(null);
      setApproveNotes("");
      await loadReferrals();
    } catch (err: any) {
      console.error("Failed to approve claim:", err);
      toast.error("Approval Failed", {
        description: err.message || "Unable to approve referral claim.",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectTarget) return;
    if (!rejectionReason.trim()) {
      toast.error("Rejection Reason Required", {
        description: "Please specify why this referral claim is being rejected.",
      });
      return;
    }
    setIsRejecting(true);
    try {
      await api.patch(`/api/v1/admin/referrals/${rejectTarget.claimNumber}/reject`, {
        rejectionReason: rejectionReason.trim(),
        adminNotes: rejectNotes.trim() || undefined,
      });
      toast.success("Referral Claim Rejected", {
        description: `Claim #${rejectTarget.claimNumber} has been rejected.`,
      });
      setRejectTarget(null);
      setRejectionReason("");
      setRejectNotes("");
      await loadReferrals();
    } catch (err: any) {
      console.error("Failed to reject claim:", err);
      toast.error("Rejection Failed", {
        description: err.message || "Unable to reject referral claim.",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const handleMarkPaidSubmit = async () => {
    if (!markPaidTarget) return;
    setIsMarkingPaid(true);
    try {
      await api.patch(`/api/v1/admin/referrals/${markPaidTarget.claimNumber}/mark-paid`, {
        adminNotes: paymentNotes.trim() || undefined,
      });
      toast.success("Reward Marked as Paid!", {
        description: `Claim #${markPaidTarget.claimNumber} is marked as paid.`,
      });
      setMarkPaidTarget(null);
      setPaymentNotes("");
      await loadReferrals();
    } catch (err: any) {
      console.error("Failed to mark claim as paid:", err);
      toast.error("Payment Update Failed", {
        description: err.message || "Unable to mark claim as paid.",
      });
    } finally {
      setIsMarkingPaid(false);
    }
  };

  // Filtered referrals list
  const filteredReferrals = referrals.filter((item) => {
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.claimNumber.toLowerCase().includes(q) ||
      item.referrerName.toLowerCase().includes(q) ||
      item.referrerPhone.toLowerCase().includes(q) ||
      item.friendName.toLowerCase().includes(q) ||
      item.friendPhone.toLowerCase().includes(q) ||
      item.friendCity.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  // Role permissions check
  const currentUserRole = adminUser?.role || adminUser?.roleName;
  const canManageActions = currentUserRole === "SUPER_ADMIN" || currentUserRole === "ADMIN";

  // Calculate statistics
  const totalCount = referrals.length;
  const pendingCount = referrals.filter((r) => r.status === "PENDING").length;
  const approvedCount = referrals.filter((r) => r.status === "APPROVED").length;
  const paidCount = referrals.filter((r) => r.status === "PAID").length;
  const totalPaidAmount = referrals
    .filter((r) => r.status === "PAID")
    .reduce((sum, r) => sum + getRewardNumeric(r.rewardAmount), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/30 hover:bg-amber-500/20 font-bold px-2.5 py-0.5">
            <Clock className="w-3 h-3 mr-1" /> PENDING
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/30 hover:bg-blue-500/20 font-bold px-2.5 py-0.5">
            <CheckCircle2 className="w-3 h-3 mr-1" /> APPROVED
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 font-bold px-2.5 py-0.5">
            <XCircle className="w-3 h-3 mr-1" /> REJECTED
          </Badge>
        );
      case "PAID":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/20 font-bold px-2.5 py-0.5">
            <DollarSign className="w-3 h-3 mr-1" /> PAID
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <Seo
        title="Admin Referral Claims Management | SSR Solar Power"
        description="Administrative portal for reviewing, approving, rejecting, and disbursing SSR Solar referral rewards."
        path="/admin/referrals"
      />

      <section className="relative min-h-[85vh] pb-16 pt-28 md:pb-24 md:pt-36">
        <div className="container-wide">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/60 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <ShieldCheck className="h-4 w-4" /> Admin Portal
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                Referral Claims Management
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Review, verify, and disburse rewards for SSR Solar Power customer referrals.
              </p>
            </div>

            {isAuthenticated && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-xs font-semibold">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span className="text-foreground">{adminUser?.fullName || adminUser?.email}</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase font-bold ${
                      currentUserRole === "STAFF"
                        ? "border-amber-500/40 text-amber-600 bg-amber-500/10"
                        : "text-primary"
                    }`}
                  >
                    {currentUserRole}
                    {currentUserRole === "STAFF" && " (View Only)"}
                  </Badge>
                </div>
                <Button
                  onClick={loadReferrals}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-border hover:bg-muted font-medium"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh List
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-destructive hover:bg-destructive/10 font-medium"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </div>
            )}
          </div>

          {/* Loading Initial Auth State */}
          {authLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Verifying administrative access...</p>
            </div>
          ) : !isAuthenticated ? (
            /* ADMIN LOGIN FORM */
            <div className="mx-auto max-w-md">
              <div className="calc-card-gradient-border relative overflow-hidden rounded-3xl bg-card p-8 shadow-card space-y-6">
                <div className="text-center space-y-2">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Lock className="h-7 w-7" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{getRoleHeading(selectedRole)}</h2>
                  <p className="text-xs text-muted-foreground">
                    {getRoleSubtitle(selectedRole)}
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="loginAsRole" className="text-xs font-semibold text-foreground">
                      Login As *
                    </Label>
                    <select
                      id="loginAsRole"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as any)}
                      className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="SUPER_ADMIN">SUPER ADMIN</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="STAFF">STAFF</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="adminEmail" className="text-xs font-semibold text-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      required
                      placeholder="e.g. superadmin@ssrsolar.com, admin@ssrsolar.com, staff@ssrsolar.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="adminPassword" className="text-xs font-semibold text-foreground">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="adminPassword"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="h-11 rounded-xl pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                        title={showPassword ? "Hide password" : "Show password"}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loginSubmitting}
                    className="btn-premium w-full h-11 rounded-full bg-gradient-brand font-bold text-primary-foreground shadow-glow"
                  >
                    {loginSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Authenticating...
                      </span>
                    ) : (
                      "Sign In to Admin Portal"
                    )}
                  </Button>
                </form>

                <div className="rounded-xl border border-border/80 bg-muted/40 p-3.5 text-center text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">Protected Area:</span> Access is strictly monitored and limited to authorized SSR Solar Power staff and administrators.
                </div>
              </div>
            </div>
          ) : (
            /* ADMIN MANAGEMENT DASHBOARD */
            <div className="space-y-6">
              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="calc-card-gradient-border rounded-2xl bg-card p-5 shadow-soft">
                  <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span>Total Claims</span>
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="mt-2 text-2xl font-black text-foreground">{totalCount}</div>
                </div>

                <div className="calc-card-gradient-border rounded-2xl bg-card p-5 shadow-soft">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-600">
                    <span>Pending Verification</span>
                    <Clock className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="mt-2 text-2xl font-black text-amber-600">{pendingCount}</div>
                </div>

                <div className="calc-card-gradient-border rounded-2xl bg-card p-5 shadow-soft">
                  <div className="flex items-center justify-between text-xs font-semibold text-blue-600">
                    <span>Approved Claims</span>
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="mt-2 text-2xl font-black text-blue-600">{approvedCount}</div>
                </div>

                <div className="calc-card-gradient-border rounded-2xl bg-card p-5 shadow-soft">
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-600">
                    <span>Total Disbursed</span>
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="mt-2 text-2xl font-black text-emerald-600">
                    ₹{totalPaidAmount.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{paidCount} claims paid</div>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-card p-4 border border-border shadow-soft">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by claim #, referrer, friend, or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-xs font-medium text-muted-foreground shrink-0">Filter:</span>
                  <div className="flex flex-wrap gap-1">
                    {["ALL", "PENDING", "APPROVED", "PAID", "REJECTED"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                          statusFilter === status
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Claims Table Container */}
              <div className="calc-card-gradient-border overflow-hidden rounded-2xl bg-card shadow-card">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-xs text-muted-foreground">Fetching referral claims from database...</p>
                  </div>
                ) : error ? (
                  <div className="py-16 text-center space-y-4 px-4">
                    <AlertTriangle className="mx-auto h-10 w-10 text-destructive" />
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-foreground">API Error Loading Referrals</h3>
                      <p className="text-xs text-muted-foreground max-w-md mx-auto">{error}</p>
                    </div>
                    <Button onClick={loadReferrals} variant="outline" className="rounded-full">
                      Retry Loading
                    </Button>
                  </div>
                ) : filteredReferrals.length === 0 ? (
                  <div className="py-16 text-center space-y-3 px-4">
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground/50" />
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-foreground">No Referral Claims Found</h3>
                      <p className="text-xs text-muted-foreground">
                        {searchQuery || statusFilter !== "ALL"
                          ? "No records match your search query or status filter."
                          : "No referral claims have been submitted yet."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-border bg-muted/50 font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="p-4">Claim #</th>
                          <th className="p-4">Referrer Details</th>
                          <th className="p-4">Friend Details</th>
                          <th className="p-4">City</th>
                          <th className="p-4">Reward</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Submitted Date</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {filteredReferrals.map((claim) => (
                          <tr key={claim.id} className="hover:bg-muted/30 transition-colors">
                            {/* Claim # */}
                            <td className="p-4 font-mono font-bold text-primary whitespace-nowrap">
                              {claim.claimNumber}
                            </td>

                            {/* Referrer */}
                            <td className="p-4">
                              <div className="font-bold text-foreground">{claim.referrerName}</div>
                              <div className="text-muted-foreground font-mono text-[11px]">
                                {claim.referrerPhone}
                              </div>
                            </td>

                            {/* Friend */}
                            <td className="p-4">
                              <div className="font-bold text-foreground">{claim.friendName}</div>
                              <div className="text-muted-foreground font-mono text-[11px]">
                                {claim.friendPhone}
                              </div>
                            </td>

                            {/* City */}
                            <td className="p-4 font-medium text-foreground whitespace-nowrap">
                              {claim.friendCity}
                            </td>

                            {/* Reward Amount */}
                            <td className="p-4 font-bold text-foreground whitespace-nowrap">
                              {formatRewardAmount(claim.rewardAmount)}
                            </td>

                            {/* Status */}
                            <td className="p-4 whitespace-nowrap">{getStatusBadge(claim.status)}</td>

                            {/* Date */}
                            <td className="p-4 text-muted-foreground whitespace-nowrap">
                              {new Date(claim.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>

                            {/* Actions */}
                            <td className="p-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  onClick={() => {
                                    setSelectedClaim(claim);
                                    setIsViewModalOpen(true);
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2.5 rounded-lg text-foreground hover:bg-accent font-semibold"
                                >
                                  <Eye className="h-3.5 w-3.5 mr-1" /> View
                                </Button>

                                {canManageActions && claim.status === "PENDING" && (
                                  <>
                                    <Button
                                      onClick={() => {
                                        setApproveTarget(claim);
                                        setApproveNotes("");
                                      }}
                                      size="sm"
                                      className="h-8 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setRejectTarget(claim);
                                        setRejectionReason("");
                                        setRejectNotes("");
                                      }}
                                      size="sm"
                                      variant="destructive"
                                      className="h-8 px-2.5 rounded-lg font-semibold shadow-sm"
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}

                                {canManageActions && claim.status === "APPROVED" && (
                                  <Button
                                    onClick={() => {
                                      setMarkPaidTarget(claim);
                                      setPaymentNotes("");
                                    }}
                                    size="sm"
                                    className="h-8 px-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm"
                                  >
                                    Mark Paid
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* VIEW DETAILS DIALOG */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <FileText className="h-5 w-5 text-primary" /> Claim Details #{selectedClaim?.claimNumber}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Complete metadata record stored in database.
            </DialogDescription>
          </DialogHeader>

          {selectedClaim && (
            <div className="space-y-4 py-2 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-muted-foreground font-medium">Status</span>
                <span>{getStatusBadge(selectedClaim.status)}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 bg-muted/40 p-3 rounded-xl border border-border/60">
                  <div className="text-muted-foreground font-semibold flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-primary" /> Referrer Name
                  </div>
                  <div className="font-bold text-foreground text-sm">{selectedClaim.referrerName}</div>
                  <div className="text-muted-foreground font-mono">{selectedClaim.referrerPhone}</div>
                </div>

                <div className="space-y-1 bg-muted/40 p-3 rounded-xl border border-border/60">
                  <div className="text-muted-foreground font-semibold flex items-center gap-1">
                    <UserCheck className="h-3.5 w-3.5 text-emerald-500" /> Friend Name
                  </div>
                  <div className="font-bold text-foreground text-sm">{selectedClaim.friendName}</div>
                  <div className="text-muted-foreground font-mono">{selectedClaim.friendPhone}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 bg-muted/40 p-3 rounded-xl border border-border/60">
                  <div className="text-muted-foreground font-semibold flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-amber-500" /> Friend City
                  </div>
                  <div className="font-bold text-foreground">{selectedClaim.friendCity}</div>
                </div>

                <div className="space-y-1 bg-muted/40 p-3 rounded-xl border border-border/60">
                  <div className="text-muted-foreground font-semibold flex items-center gap-1">
                    <IndianRupee className="h-3.5 w-3.5 text-primary" /> Reward Amount
                  </div>
                  <div className="font-bold text-foreground text-sm">
                    {formatRewardAmount(selectedClaim.rewardAmount)}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 bg-muted/30 p-3 rounded-xl border border-border/60">
                <div className="text-muted-foreground font-semibold flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Submitted Timestamp
                </div>
                <div className="font-mono text-foreground">
                  {new Date(selectedClaim.createdAt).toLocaleString("en-IN")}
                </div>
              </div>

              {selectedClaim.reviewedBy && (
                <div className="space-y-1.5 bg-muted/30 p-3 rounded-xl border border-border/60">
                  <div className="text-muted-foreground font-semibold">Reviewed By Admin</div>
                  <div className="font-mono text-foreground">{selectedClaim.reviewedBy}</div>
                  {selectedClaim.reviewedAt && (
                    <div className="text-[11px] text-muted-foreground">
                      On {new Date(selectedClaim.reviewedAt).toLocaleString("en-IN")}
                    </div>
                  )}
                </div>
              )}

              {selectedClaim.rejectionReason && (
                <div className="space-y-1.5 bg-destructive/10 p-3 rounded-xl border border-destructive/30 text-destructive">
                  <div className="font-bold">Rejection Reason:</div>
                  <p className="leading-relaxed">{selectedClaim.rejectionReason}</p>
                </div>
              )}

              {selectedClaim.adminNotes && (
                <div className="space-y-1.5 bg-primary/5 p-3 rounded-xl border border-primary/20 text-foreground">
                  <div className="font-semibold text-primary">Admin Notes:</div>
                  <p className="leading-relaxed">{selectedClaim.adminNotes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsViewModalOpen(false)} variant="outline" className="w-full rounded-xl">
              Close Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* APPROVE CONFIRMATION DIALOG */}
      <Dialog open={!!approveTarget} onOpenChange={(open) => !open && setApproveTarget(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" /> Approve Referral Claim
            </DialogTitle>
            <DialogDescription className="text-xs">
              Confirm approval for claim #{approveTarget?.claimNumber} ({approveTarget?.friendName})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-emerald-700 dark:text-emerald-300">
              Approving this claim validates that the rooftop solar installation site survey or booking was verified.
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="approveNotes" className="text-xs font-semibold text-foreground">
                Optional Admin Notes
              </Label>
              <Textarea
                id="approveNotes"
                placeholder="e.g. Site survey passed. Customer installation confirmed."
                value={approveNotes}
                onChange={(e) => setApproveNotes(e.target.value)}
                className="rounded-xl min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              onClick={() => setApproveTarget(null)}
              variant="outline"
              disabled={isApproving}
              className="rounded-xl sm:flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApproveSubmit}
              disabled={isApproving}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold sm:flex-1"
            >
              {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REJECT CONFIRMATION DIALOG */}
      <Dialog open={!!rejectTarget} onOpenChange={(open) => !open && setRejectTarget(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" /> Reject Referral Claim
            </DialogTitle>
            <DialogDescription className="text-xs">
              Rejecting claim #{rejectTarget?.claimNumber} ({rejectTarget?.friendName})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="rejectionReason" className="text-xs font-semibold text-foreground">
                Rejection Reason *
              </Label>
              <Input
                id="rejectionReason"
                required
                placeholder="e.g. Duplicate referral / Insufficient roof space"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="rounded-xl h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rejectNotes" className="text-xs font-semibold text-foreground">
                Optional Admin Internal Notes
              </Label>
              <Textarea
                id="rejectNotes"
                placeholder="e.g. Verified with site survey engineer."
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                className="rounded-xl min-h-[70px]"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              onClick={() => setRejectTarget(null)}
              variant="outline"
              disabled={isRejecting}
              className="rounded-xl sm:flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectSubmit}
              variant="destructive"
              disabled={isRejecting || !rejectionReason.trim()}
              className="rounded-xl font-bold sm:flex-1"
            >
              {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MARK PAID CONFIRMATION DIALOG */}
      <Dialog open={!!markPaidTarget} onOpenChange={(open) => !open && setMarkPaidTarget(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-primary">
              <DollarSign className="h-5 w-5 text-emerald-500" /> Mark Reward as Paid
            </DialogTitle>
            <DialogDescription className="text-xs">
              Disburse reward of {formatRewardAmount(markPaidTarget?.rewardAmount)} for claim #{markPaidTarget?.claimNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-3.5 text-foreground">
              Marking this claim as PAID completes the referral lifecycle.
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="paymentNotes" className="text-xs font-semibold text-foreground">
                Payment / Transaction Notes (Optional)
              </Label>
              <Input
                id="paymentNotes"
                placeholder="e.g. Bank Transfer Ref: UTR9823748234 / Paid via UPI"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                className="rounded-xl h-10"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              onClick={() => setMarkPaidTarget(null)}
              variant="outline"
              disabled={isMarkingPaid}
              className="rounded-xl sm:flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleMarkPaidSubmit}
              disabled={isMarkingPaid}
              className="rounded-xl bg-primary text-primary-foreground font-bold sm:flex-1 shadow-glow"
            >
              {isMarkingPaid ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminReferrals;
