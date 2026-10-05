import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Seo } from '@/components/Seo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Settings,
  ShieldCheck,
  Building2,
  Users,
  Lock,
  Activity,
  RefreshCw,
  Save,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  UserCheck,
  UserX,
  Clock,
  Shield,
  KeyRound,
  FileCode,
} from 'lucide-react';

export interface SettingsResponse {
  role: string;
  business: {
    companyName: string;
    contactEmail: string;
    hotlinePhone: string;
    officeAddress: string;
    operatingHours: string;
    gstin: string;
    defaultSubsidyScheme: string;
    defaultReferralRewardRs: number;
  };
  security?: {
    sessionDuration: string;
    loginRateLimitPerMin: number;
    allowedCorsOrigins: string[];
    auditLoggingActive: boolean;
    rbacEnforcementMode: string;
    httpsCookiesEnabled: boolean;
  };
  users?: Array<{
    id: string;
    email: string;
    phone: string;
    fullName: string;
    isActive: boolean;
    createdAt: string;
    role?: { id: string; name: string; description?: string };
  }>;
  roles?: Array<{ id: string; name: string; description?: string }>;
}

export interface AuditLogItem {
  id: string;
  action: string;
  actorId?: string;
  userEmail?: string;
  entityName: string;
  entityId?: string;
  changesJson?: string;
  createdAt: string;
}

export const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'STAFF';
  const isSuperAdmin = role === 'SUPER_ADMIN';
  const isAdmin = role === 'ADMIN';

  const [activeTab, setActiveTab] = useState<'business' | 'users' | 'security' | 'audit'>('business');
  const [data, setData] = useState<SettingsResponse | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Business Form State
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [hotlinePhone, setHotlinePhone] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [operatingHours, setOperatingHours] = useState('');
  const [gstin, setGstin] = useState('');
  const [businessSubmitting, setBusinessSubmitting] = useState(false);

  // Security Policy State
  const [sessionDuration, setSessionDuration] = useState('24 Hours');
  const [loginRateLimit, setLoginRateLimit] = useState(10);
  const [securitySubmitting, setSecuritySubmitting] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<SettingsResponse>('/api/v1/admin/settings');
      if (res && res.business) {
        setData(res);
        setCompanyName(res.business.companyName || 'SSR Solar Power');
        setContactEmail(res.business.contactEmail || 'contact@ssrsolar.com');
        setHotlinePhone(res.business.hotlinePhone || '+91 98765 43210');
        setOfficeAddress(res.business.officeAddress || '');
        setOperatingHours(res.business.operatingHours || '');
        setGstin(res.business.gstin || '');

        if (res.security) {
          setSessionDuration(res.security.sessionDuration || '24 Hours');
          setLoginRateLimit(res.security.loginRateLimitPerMin || 10);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch settings:', err);
      const msg = err.message || 'Unable to retrieve settings payload.';
      setError(msg);
      toast.error('Settings Access Failed', { description: msg });
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    if (!isSuperAdmin) return;
    try {
      const logs = await api.get<AuditLogItem[]>('/api/v1/admin/settings/audit-logs');
      setAuditLogs(logs || []);
    } catch (err: any) {
      console.error('Failed to fetch audit logs:', err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (activeTab === 'audit') {
      fetchAuditLogs();
    }
  }, [activeTab]);

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusinessSubmitting(true);
    try {
      const payload = {
        companyName,
        contactEmail,
        hotlinePhone,
        officeAddress,
        operatingHours,
        gstin,
      };
      await api.patch('/api/v1/admin/settings/business', payload);
      toast.success('Business Settings Updated', {
        description: 'Company contact and operational settings updated and audited.',
      });
      fetchSettings();
    } catch (err: any) {
      console.error('Failed to update business settings:', err);
      toast.error('Save Failed', { description: err.message || 'Unable to update settings.' });
    } finally {
      setBusinessSubmitting(false);
    }
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    setSecuritySubmitting(true);
    try {
      const payload = {
        sessionDuration,
        loginRateLimitPerMin: loginRateLimit,
      };
      await api.patch('/api/v1/admin/settings/security', payload);
      toast.success('Security Controls Updated', {
        description: 'Session timeout and security policies updated and audited.',
      });
      fetchSettings();
    } catch (err: any) {
      console.error('Failed to update security settings:', err);
      toast.error('Save Failed', { description: err.message || 'Unable to update policy.' });
    } finally {
      setSecuritySubmitting(false);
    }
  };

  const handleToggleUserStatus = async (uId: string, currentStatus: boolean, email: string) => {
    if (!isSuperAdmin) return;
    try {
      await api.patch(`/api/v1/admin/settings/users/${uId}/role`, {
        isActive: !currentStatus,
      });
      toast.success('User Account Updated', {
        description: `Account ${email} is now ${!currentStatus ? 'Active' : 'Disabled'}.`,
      });
      fetchSettings();
    } catch (err: any) {
      console.error('Failed to update user:', err);
      toast.error('User Update Failed', { description: err.message || 'Unable to update user.' });
    }
  };

  return (
    <div className="space-y-6">
      <Seo
        title="Admin System Settings | SSR Solar Power"
        description="Configure operational settings, RBAC role permissions, and security policies."
        path="/admin/settings"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Authorized Role ({role})
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            System Settings & Security Controls
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Manage operational parameters, RBAC user permissions, session security policies, and audit events.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={fetchSettings}
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

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('business')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'business'
              ? 'bg-primary text-primary-foreground shadow-soft'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Building2 className="h-4 w-4" /> Business Profile
        </button>

        {isSuperAdmin && (
          <>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'users'
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Users className="h-4 w-4" /> User & Role Management
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'security'
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Shield className="h-4 w-4" /> Session & Security Controls
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'audit'
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Activity className="h-4 w-4" /> Security Audit Log Stream
            </button>
          </>
        )}
      </div>

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="flex items-center justify-between rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
          <Button onClick={fetchSettings} variant="outline" size="sm" className="rounded-full text-xs font-bold">
            Retry
          </Button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="p-12 text-center space-y-3 rounded-2xl bg-card border border-border">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-xs font-semibold text-muted-foreground">Loading administrative settings...</p>
        </div>
      )}

      {/* TAB 1: BUSINESS SETTINGS */}
      {!loading && activeTab === 'business' && (
        <div className="calc-card-gradient-border rounded-3xl bg-card p-6 md:p-8 shadow-card max-w-3xl space-y-6">
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Company & Operational Profile</h3>
              <p className="text-xs text-muted-foreground">
                Operational details displayed across invoices, customer portal headers, and contact records.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveBusiness} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="companyName" className="font-semibold text-foreground">Company Name</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="h-10 rounded-xl font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contactEmail" className="font-semibold text-foreground">Official Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="hotlinePhone" className="font-semibold text-foreground">Customer Support Hotline</Label>
                <Input
                  id="hotlinePhone"
                  value={hotlinePhone}
                  onChange={(e) => setHotlinePhone(e.target.value)}
                  className="h-10 rounded-xl font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="gstin" className="font-semibold text-foreground">GSTIN Registration Number</Label>
                <Input
                  id="gstin"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="h-10 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="officeAddress" className="font-semibold text-foreground">Head Office Address</Label>
              <Input
                id="officeAddress"
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="operatingHours" className="font-semibold text-foreground">Operating Hours</Label>
              <Input
                id="operatingHours"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                className="h-10 rounded-xl"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                disabled={businessSubmitting}
                className="btn-premium rounded-full bg-gradient-brand font-bold text-xs text-primary-foreground shadow-glow px-6"
              >
                {businessSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
                Save Business Profile
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: USER & ROLE MANAGEMENT (SUPER_ADMIN ONLY) */}
      {!loading && activeTab === 'users' && isSuperAdmin && (
        <div className="space-y-6 max-w-4xl">
          <div className="calc-card-gradient-border rounded-3xl bg-card p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2 font-bold text-base text-foreground">
                <Users className="h-5 w-5 text-primary" />
                <span>System Accounts & Role Assignments</span>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px] uppercase font-bold">
                SUPER ADMIN RESTRICTED
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 uppercase font-bold border-b border-border text-[10px] text-muted-foreground">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Created</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data?.users?.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-semibold">
                        <div className="font-bold text-foreground">{u.fullName}</div>
                        <div className="text-[11px] text-muted-foreground">{u.email}</div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="font-bold text-[10px] uppercase">
                          {u.role?.name || 'STAFF'}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge
                          className={`text-[10px] font-bold ${
                            u.isActive
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                              : 'bg-destructive/10 text-destructive border-destructive/30'
                          }`}
                        >
                          {u.isActive ? 'ACTIVE' : 'DISABLED'}
                        </Badge>
                      </td>
                      <td className="p-3 text-muted-foreground whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          onClick={() => handleToggleUserStatus(u.id, u.isActive, u.email)}
                          variant="outline"
                          size="sm"
                          className="h-8 px-2.5 rounded-lg text-xs font-semibold"
                        >
                          {u.isActive ? <UserX className="h-3.5 w-3.5 mr-1 text-destructive" /> : <UserCheck className="h-3.5 w-3.5 mr-1 text-emerald-500" />}
                          {u.isActive ? 'Disable' : 'Enable'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY & SESSION CONTROLS (SUPER_ADMIN ONLY) */}
      {!loading && activeTab === 'security' && isSuperAdmin && (
        <div className="calc-card-gradient-border rounded-3xl bg-card p-6 md:p-8 shadow-card max-w-3xl space-y-6">
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Session Security Policies & RBAC Controls</h3>
              <p className="text-xs text-muted-foreground">
                System authentication parameters, session timeouts, and rate limits.
              </p>
            </div>
          </div>

          {/* SECURITY GUARANTEE BANNER */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-600 dark:text-emerald-400 space-y-1">
            <div className="font-bold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> Zero Credential Exposure Guarantee
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              Database URLs, PostgreSQL passwords, JWT secrets, AI keys, and private environment variables are isolated on the server and never sent to client scripts.
            </p>
          </div>

          <form onSubmit={handleSaveSecurity} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="sessionDur" className="font-semibold text-foreground">JWT Session Duration</Label>
                <select
                  id="sessionDur"
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(e.target.value)}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 font-semibold text-foreground focus:outline-none"
                >
                  <option value="8 Hours">8 Hours</option>
                  <option value="12 Hours">12 Hours</option>
                  <option value="24 Hours">24 Hours (Recommended)</option>
                  <option value="7 Days">7 Days</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rateLim" className="font-semibold text-foreground">Login Rate Limit (Req/Min/IP)</Label>
                <Input
                  id="rateLim"
                  type="number"
                  min={1}
                  max={60}
                  value={loginRateLimit}
                  onChange={(e) => setLoginRateLimit(parseInt(e.target.value, 10) || 10)}
                  className="h-10 rounded-xl font-bold"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
              <span className="font-bold text-foreground block">Active Protection Controls</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground text-[11px]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>HttpOnly Cookie Auth (`SameSite=Lax`)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Strict DB Role Verification</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Prompt Injection Defense Active</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Automated Audit Logging Active</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                disabled={securitySubmitting}
                className="btn-premium rounded-full bg-gradient-brand font-bold text-xs text-primary-foreground shadow-glow px-6"
              >
                {securitySubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
                Save Security Policies
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: AUDIT LOG STREAM (SUPER_ADMIN ONLY) */}
      {!loading && activeTab === 'audit' && isSuperAdmin && (
        <div className="calc-card-gradient-border rounded-3xl bg-card p-6 shadow-card space-y-4 max-w-4xl">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2 font-bold text-base text-foreground">
              <Activity className="h-5 w-5 text-primary" />
              <span>Real-Time Audit Log Stream</span>
            </div>
            <span className="text-xs text-muted-foreground font-semibold">Latest 100 System Events</span>
          </div>

          <div className="divide-y divide-border/60 max-h-[600px] overflow-y-auto">
            {auditLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">No audit log records found.</div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="font-bold text-foreground flex items-center gap-2">
                      <Badge variant="outline" className="text-[9px] font-mono font-bold bg-primary/10 text-primary">
                        {log.action}
                      </Badge>
                      <span>{log.entityName}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Actor: {log.userEmail || 'System'}
                      {log.changesJson && ` • Details: ${log.changesJson.substring(0, 100)}...`}
                    </div>
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono shrink-0">
                    {new Date(log.createdAt).toLocaleString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: 'short',
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
