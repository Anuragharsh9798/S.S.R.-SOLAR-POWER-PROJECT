import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Seo } from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Loader2,
  Sun,
  ShieldCheck,
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRole, setSelectedRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'STAFF'>('ADMIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to /admin
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const getHeading = (role: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF') => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin Login';
      case 'STAFF':
        return 'Staff Login';
      case 'ADMIN':
      default:
        return 'Admin Login';
    }
  };

  const getSubtitle = (role: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF') => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Sign in with Super Admin credentials to access system controls.';
      case 'STAFF':
        return 'Sign in with Staff credentials to view operational records.';
      case 'ADMIN':
      default:
        return 'Sign in with Admin credentials to manage system resources.';
    }
  };

  const handleRoleSelect = (role: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF') => {
    setSelectedRole(role);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // 1. Authenticate against backend API (returns database-authenticated user payload)
      const user = await login(email, password);

      const actualDatabaseRole = user?.role;

      // 2. Validate backend database role authorization
      if (
        actualDatabaseRole !== 'SUPER_ADMIN' &&
        actualDatabaseRole !== 'ADMIN' &&
        actualDatabaseRole !== 'STAFF'
      ) {
        await logout();
        const accessDeniedMsg = 'Access Denied: Account lacks required administrative privileges.';
        setError(accessDeniedMsg);
        toast.error('Access Denied', { description: accessDeniedMsg });
        return;
      }

      // 3. Verify selected dropdown role matches backend database authenticated role
      if (actualDatabaseRole !== selectedRole) {
        await logout();
        const mismatchMsg = `Selected role (${selectedRole}) does not match this account's database authorization (${actualDatabaseRole}).`;
        setError(mismatchMsg);
        toast.error('Role Verification Failed', { description: mismatchMsg });
        return;
      }

      // 4. Successful validation: redirect all valid roles (SUPER_ADMIN, ADMIN, STAFF) to /admin
      toast.success('Authentication Successful', {
        description: `Welcome back, ${user.fullName || user.email} (${actualDatabaseRole})`,
      });

      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Admin Login Error:', err);
      const errMsg = err.message || 'Invalid administrative credentials';
      setError(errMsg);
      toast.error('Login Failed', { description: errMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4 sm:p-6">
      <Seo
        title={`${getHeading(selectedRole)} | SSR Solar Power`}
        description="Administrative authentication portal for SSR Solar Power staff and administrators."
        path="/admin/login"
      />

      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
            <Sun className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            SSR SOLAR POWER
          </h1>
          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
            Administrative Management Portal
          </p>
        </div>

        {/* Card Form Container */}
        <div className="calc-card-gradient-border relative overflow-hidden rounded-3xl bg-card p-8 shadow-card space-y-6">
          <div className="text-center space-y-1">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-foreground">{getHeading(selectedRole)}</h2>
            <p className="text-xs text-muted-foreground">{getSubtitle(selectedRole)}</p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="loginAsRole" className="text-xs font-semibold text-foreground">
                Login As *
              </Label>
              <select
                id="loginAsRole"
                value={selectedRole}
                onChange={(e) => handleRoleSelect(e.target.value as any)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
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
              disabled={submitting}
              className="btn-premium w-full h-11 rounded-full bg-gradient-brand font-bold text-primary-foreground shadow-glow"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying Credentials...
                </span>
              ) : (
                `Sign In (${selectedRole.replace('_', ' ')})`
              )}
            </Button>
          </form>

          <div className="rounded-xl border border-border/80 bg-muted/40 p-3.5 text-center text-[11px] text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Protected Portal:</span> Permissions are enforced strictly by backend database authentication.
          </div>
        </div>

        <div className="text-center">
          <a
            href="/"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Return to SSR Solar Power Home
          </a>
        </div>
      </div>
    </div>
  );
};
