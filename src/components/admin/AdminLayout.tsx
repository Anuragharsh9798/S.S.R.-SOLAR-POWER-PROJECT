import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BrandWordmark } from '@/components/BrandWordmark';
import {
  LayoutDashboard,
  FileText,
  Users,
  Gift,
  Briefcase,
  Star,
  Newspaper,
  Building2,
  Mail,
  Bot,
  Settings,
  Database,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

interface SidebarItem {
  title: string;
  path: string;
  icon: React.ElementType;
  allowedRoles?: string[];
  badge?: string;
}

const sidebarItems: SidebarItem[] = [
  { title: 'Dashboard', path: '/admin', icon: LayoutDashboard, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
  { title: 'Quotations', path: '/admin/quotations', icon: FileText, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
  { title: 'Customers', path: '/admin/customers', icon: Users, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
  { title: 'Referrals', path: '/admin/referrals', icon: Gift, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
  { title: 'Projects', path: '/admin/projects', icon: Briefcase, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'] },
  { title: 'Reviews', path: '/admin/reviews', icon: Star, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'] },
  { title: 'Blogs', path: '/admin/blogs', icon: Newspaper, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'] },
  { title: 'Government Data', path: '/admin/government-data', icon: Building2, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'] },
  { title: 'Database', path: '/admin/database', icon: Database, allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
  { title: 'Contact Messages', path: '/admin/contact-messages', icon: Mail, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
  { title: 'Chatbot', path: '/admin/chatbot', icon: Bot, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
  { title: 'Settings', path: '/admin/settings', icon: Settings, allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
];

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role || 'STAFF';

  const visibleSidebarItems = sidebarItems.filter(
    (item) => !item.allowedRoles || item.allowedRoles.includes(role)
  );

  const getRoleBadgeStyle = (r: string) => {
    switch (r) {
      case 'SUPER_ADMIN':
        return 'border-purple-500/40 text-purple-600 bg-purple-500/10 dark:text-purple-400';
      case 'STAFF':
        return 'border-amber-500/40 text-amber-600 bg-amber-500/10 dark:text-amber-400';
      case 'ADMIN':
      default:
        return 'border-primary/40 text-primary bg-primary/10';
    }
  };

  const getPortalTitle = (r: string) => {
    switch (r) {
      case 'SUPER_ADMIN':
        return 'Super Admin Portal';
      case 'STAFF':
        return 'Staff Portal';
      case 'ADMIN':
      default:
        return 'Admin Portal';
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const activeNavItem = sidebarItems.find(
    (item) => item.path === location.pathname || (item.path !== '/admin' && location.pathname.startsWith(item.path))
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground font-sans antialiased">
      {/* Top Header */}
      <header className="shrink-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 rounded-xl"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Desktop Collapse Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>

            {/* Official SSR SOLAR POWER Logo & Brand Wordmark */}
            <Link to="/admin" className="flex items-center gap-2.5 group shrink-0">
              <img
                src="/logo-icon.png"
                alt="SSR Solar Power Logo"
                className="h-8 w-8 sm:h-9 sm:w-9 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105 shrink-0"
              />
              <div className="hidden sm:flex flex-col">
                <BrandWordmark className="text-xs sm:text-sm" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider -mt-0.5">
                  {getPortalTitle(role)}
                </span>
              </div>
            </Link>
          </div>

          {/* Right Header User Controls */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/50"
            >
              <span>View Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            {/* User Identity Pill */}
            <div className="flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="font-semibold text-foreground max-w-[120px] md:max-w-[180px] truncate">
                {user?.fullName || user?.email}
              </span>
              <Badge variant="outline" className={`text-[9px] uppercase font-bold px-1.5 py-0 ${getRoleBadgeStyle(role)}`}>
                {role}
              </Badge>
            </div>

            {/* Logout */}
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="rounded-full text-destructive hover:bg-destructive/10 text-xs font-bold"
            >
              <LogOut className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Mobile Slide-out Overlay Sidebar */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <div
              className="w-72 max-w-[85vw] h-full bg-card border-r border-border p-4 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/logo-icon.png"
                    alt="SSR Solar Power Logo"
                    className="h-8 w-8 object-contain shrink-0"
                  />
                  <div className="flex flex-col">
                    <BrandWordmark className="text-xs" />
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider -mt-0.5">
                      {getPortalTitle(role)}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setMobileOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto py-3 space-y-1 min-h-0">
                {visibleSidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.path ||
                    (item.path !== '/admin' && location.pathname.startsWith(item.path));

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground font-bold shadow-soft'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  );
                })}
              </div>

              <div className="border-t border-border/60 pt-3 shrink-0">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full justify-start text-xs font-bold text-destructive border-destructive/20 hover:bg-destructive/10 rounded-xl"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:flex flex-col h-full shrink-0 border-r border-border/60 bg-card/60 backdrop-blur-md transition-all duration-300 ${
            collapsed ? 'w-16' : 'w-64'
          }`}
        >
          <div className="p-3 border-b border-border/60 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">
              {!collapsed ? 'Navigation' : 'Menu'}
            </span>
          </div>

          <nav className="flex-1 overflow-y-auto p-2 space-y-1 min-h-0">
            {visibleSidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/admin' && location.pathname.startsWith(item.path));

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.title : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-brand text-primary-foreground font-bold shadow-soft'
                      : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              );
            })}
          </nav>

          {/* Sidebar Bottom Footer */}
          {!collapsed && (
            <div className="p-3 border-t border-border/60 text-center text-[10px] text-muted-foreground shrink-0">
              SSR Solar Admin v2.0
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-8 min-h-0">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Breadcrumb / Title Bar */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <span>Admin</span>
                  <span>/</span>
                  <span className="text-foreground font-semibold">
                    {activeNavItem?.title || 'Dashboard'}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mt-1">
                  {activeNavItem?.title || 'Dashboard Overview'}
                </h1>
              </div>
            </div>

            {/* Page Content Outlet */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
