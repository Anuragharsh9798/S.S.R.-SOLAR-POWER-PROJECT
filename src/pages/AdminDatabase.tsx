import React, { useState, useEffect } from "react";
import { Seo } from "@/components/Seo";
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
import { api } from "@/lib/api";
import {
  Database,
  ShieldCheck,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  Lock,
  LogOut,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileText,
  Users,
  MessageSquare,
  Award,
  Layers,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
} from "lucide-react";

export interface TableMeta {
  key: string;
  name: string;
  description: string;
  readOnly: boolean;
  count: number;
}

export const AdminDatabase = () => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<any>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Database metadata state
  const [tables, setTables] = useState<TableMeta[]>([]);
  const [activeTableKey, setActiveTableKey] = useState<string>("customers");
  const [tableLoading, setTableLoading] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Active record modal states
  const [viewRecord, setViewRecord] = useState<any | null>(null);
  const [editRecord, setEditRecord] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState<Record<string, any>>({});
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  useEffect(() => {
    if (isAuthenticated && activeTableKey) {
      loadRecords(activeTableKey, page, limit, search);
    }
  }, [activeTableKey, page, limit, isAuthenticated]);

  const checkAuthAndFetch = async () => {
    setAuthLoading(true);
    setError(null);
    try {
      const profile = await api.get<{ user: any }>("/api/v1/auth/me");
      if (profile && profile.user) {
        const userRole = profile.user.role || profile.user.roleName;
        if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") {
          setIsAuthenticated(true);
          setAdminUser(profile.user);
          await loadTables();
        } else {
          setIsAuthenticated(false);
          setError("Access Denied: Database management requires SUPER_ADMIN or ADMIN privileges.");
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const loadTables = async () => {
    try {
      const data = await api.get<TableMeta[]>("/api/v1/admin/database/tables");
      setTables(data || []);
      if (data && data.length > 0 && !activeTableKey) {
        setActiveTableKey(data[0].key);
      }
    } catch (err: any) {
      console.error("Failed to load database tables:", err);
      const msg = err.message || "Failed to load database tables.";
      setError(msg);
    }
  };

  const loadRecords = async (tableKey: string, pageNum: number, limitNum: number, searchTerm: string) => {
    setTableLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: limitNum.toString(),
      });
      if (searchTerm.trim()) {
        queryParams.set("search", searchTerm.trim());
      }

      const res = await api.get<any>(`/api/v1/admin/database/${tableKey}?${queryParams.toString()}`);
      setRecords(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      console.error(`Failed to load ${tableKey} records:`, err);
      const msg = err.message || `Failed to fetch data for ${tableKey}.`;
      setError(msg);
      toast.error("Failed to load records", { description: msg });
    } finally {
      setTableLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSubmitting(true);
    setError(null);
    try {
      const res = await api.post<{ user: any; token?: string }>("/api/v1/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });

      if (res && res.user) {
        if (res.token) {
          api.setToken(res.token);
        }
        const role = res.user.role || res.user.roleName;
        if (role === "SUPER_ADMIN" || role === "ADMIN") {
          setIsAuthenticated(true);
          setAdminUser(res.user);
          toast.success("Admin Authentication Successful", {
            description: `Logged in as ${res.user.fullName || res.user.email} (${role})`,
          });
          await loadTables();
        } else {
          api.setToken(null);
          setIsAuthenticated(false);
          setError("Access Denied: Account lacks required database management permissions.");
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);
      const msg = err.message || "Invalid administrative credentials.";
      setError(msg);
      toast.error("Login Failed", { description: msg });
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/v1/auth/logout");
    } catch {
      // Ignore
    } finally {
      api.setToken(null);
      setIsAuthenticated(false);
      setAdminUser(null);
      setRecords([]);
      setTables([]);
      toast.info("Logged out of Admin Portal");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadRecords(activeTableKey, 1, limit, search);
  };

  const openEditModal = (record: any) => {
    setEditRecord(record);
    const copy = { ...record };
    delete copy.id;
    delete copy.createdAt;
    delete copy.updatedAt;
    setEditFormData(copy);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRecord) return;
    setIsSubmittingEdit(true);
    try {
      await api.patch(`/api/v1/admin/database/${activeTableKey}/${editRecord.id}`, editFormData);
      toast.success("Record Updated Successfully!", {
        description: `Updated record ID: ${editRecord.id}`,
      });
      setEditRecord(null);
      await loadRecords(activeTableKey, page, limit, search);
      await loadTables();
    } catch (err: any) {
      console.error("Failed to update record:", err);
      toast.error("Update Failed", {
        description: err.message || "Failed to update database record.",
      });
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/v1/admin/database/${activeTableKey}/${deleteTarget.id}`);
      toast.success("Record Deleted", {
        description: `Successfully deleted record ID: ${deleteTarget.id}`,
      });
      setDeleteTarget(null);
      await loadRecords(activeTableKey, page, limit, search);
      await loadTables();
    } catch (err: any) {
      console.error("Failed to delete record:", err);
      toast.error("Deletion Failed", {
        description: err.message || "Destructive deletion failed or forbidden.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const activeTableMeta = tables.find((t) => t.key === activeTableKey);
  const isSuperAdmin = adminUser?.role === "SUPER_ADMIN" || adminUser?.roleName === "SUPER_ADMIN";

  // Helper to format table values cleanly
  const renderCellContent = (key: string, val: any) => {
    if (val === null || val === undefined) return <span className="text-muted-foreground italic">null</span>;
    if (typeof val === "boolean") {
      return val ? (
        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">True</Badge>
      ) : (
        <Badge variant="outline" className="text-muted-foreground">False</Badge>
      );
    }
    if (typeof val === "object") {
      if (val.d && Array.isArray(val.d)) {
        return <span className="font-bold text-foreground font-mono">₹{parseFloat(val.d.join("")).toLocaleString("en-IN")}</span>;
      }
      return <span className="font-mono text-[11px] truncate max-w-[150px] inline-block">{JSON.stringify(val)}</span>;
    }
    const str = String(val);
    if (key.toLowerCase().includes("date") || key.toLowerCase().includes("at")) {
      try {
        const d = new Date(str);
        if (!isNaN(d.getTime())) return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
      } catch {}
    }
    return <span className="truncate max-w-[200px] inline-block font-medium">{str}</span>;
  };

  return (
    <div className="space-y-6">
      <Seo
        title="Controlled Database Management | SSR Solar Power Admin"
        description="Secure, audited data management portal for SSR Solar Power backend records."
        path="/admin/database"
      />

      <div className="space-y-6">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/60 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Database className="h-4 w-4" /> Controlled Data Management
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                Database Records Management
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Audited business data access for SSR Solar Power administrators.
              </p>
            </div>

            {isAuthenticated && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-xs font-semibold">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span className="text-foreground">{adminUser?.fullName || adminUser?.email}</span>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary">
                    {adminUser?.role || adminUser?.roleName}
                  </Badge>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-destructive hover:bg-destructive/10 font-medium"
                >
                  <LogOut className="mr-1.5 h-4 w-4" /> Logout
                </Button>
              </div>
            )}
          </div>

          {/* Loading Auth */}
          {authLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Verifying database management permissions...</p>
            </div>
          ) : !isAuthenticated ? (
            /* ADMIN LOGIN FORM */
            <div className="mx-auto max-w-md">
              <div className="calc-card-gradient-border relative overflow-hidden rounded-3xl bg-card p-8 shadow-card space-y-6">
                <div className="text-center space-y-2">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Lock className="h-7 w-7" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Database Management Login</h2>
                  <p className="text-xs text-muted-foreground">
                    Sign in with an authorized SUPER_ADMIN or ADMIN account.
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive">
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="adminEmail" className="text-xs font-semibold text-foreground">
                      Admin Email
                    </Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      required
                      placeholder="admin@ssrsolar.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="adminPassword" className="text-xs font-semibold text-foreground">
                      Password
                    </Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loginSubmitting}
                    className="btn-premium w-full h-11 rounded-full bg-gradient-brand font-bold text-primary-foreground shadow-glow"
                  >
                    {loginSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Verifying Access...
                      </span>
                    ) : (
                      "Sign In to Database Portal"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            /* DATABASE MANAGEMENT INTERFACE */
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left Sidebar: Business Table Selector */}
              <div className="lg:col-span-3 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
                  Business Data Tables
                </div>
                <div className="space-y-1.5">
                  {tables.map((t) => {
                    const isActive = activeTableKey === t.key;
                    return (
                      <button
                        key={t.key}
                        onClick={() => {
                          setActiveTableKey(t.key);
                          setPage(1);
                          setSearch("");
                        }}
                        className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold text-left transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md font-bold"
                            : "bg-card border border-border/70 text-foreground hover:bg-accent"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Layers className={`h-4 w-4 shrink-0 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                          <span className="truncate">{t.name}</span>
                        </div>
                        <Badge
                          variant={isActive ? "outline" : "secondary"}
                          className={`text-[10px] font-mono shrink-0 ml-2 ${
                            isActive ? "border-primary-foreground/40 text-primary-foreground" : ""
                          }`}
                        >
                          {t.count}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Content Area: Table Data Records */}
              <div className="lg:col-span-9 space-y-6">
                {/* Active Table Title & Search Toolbar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-card p-5 border border-border shadow-soft">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-foreground">{activeTableMeta?.name}</h2>
                      {activeTableMeta?.readOnly && (
                        <Badge variant="outline" className="border-amber-500/40 text-amber-600 bg-amber-500/10 font-semibold text-[10px]">
                          <Lock className="w-2.5 h-2.5 mr-1" /> Read-Only
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{activeTableMeta?.description}</p>
                  </div>

                  <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 sm:w-72">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search records..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-9 rounded-xl text-xs"
                      />
                    </div>
                    <Button type="submit" size="sm" variant="outline" className="h-9 rounded-xl shrink-0">
                      Search
                    </Button>
                  </form>
                </div>

                {/* Table Data View */}
                <div className="calc-card-gradient-border overflow-hidden rounded-2xl bg-card shadow-card">
                  {tableLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-xs text-muted-foreground">Querying database records...</p>
                    </div>
                  ) : error ? (
                    <div className="py-16 text-center space-y-3 px-4">
                      <AlertTriangle className="mx-auto h-10 w-10 text-destructive" />
                      <h3 className="text-base font-bold text-foreground">Database Error</h3>
                      <p className="text-xs text-muted-foreground max-w-md mx-auto">{error}</p>
                    </div>
                  ) : records.length === 0 ? (
                    <div className="py-16 text-center space-y-3 px-4">
                      <Database className="mx-auto h-10 w-10 text-muted-foreground/40" />
                      <h3 className="text-base font-bold text-foreground">No Records Found</h3>
                      <p className="text-xs text-muted-foreground">
                        {search ? `No records match search term '${search}'.` : "This database table has zero entries."}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="border-b border-border bg-muted/50 font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                            <tr>
                              {Object.keys(records[0]).slice(0, 6).map((col) => (
                                <th key={col} className="p-3.5">{col}</th>
                              ))}
                              <th className="p-3.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/60">
                            {records.map((row, idx) => (
                              <tr key={row.id || idx} className="hover:bg-muted/30 transition-colors">
                                {Object.keys(records[0]).slice(0, 6).map((col) => (
                                  <td key={col} className="p-3.5">
                                    {renderCellContent(col, row[col])}
                                  </td>
                                ))}
                                <td className="p-3.5 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      onClick={() => setViewRecord(row)}
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground"
                                      title="View Record JSON"
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                    </Button>

                                    {!activeTableMeta?.readOnly && (
                                      <Button
                                        onClick={() => openEditModal(row)}
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 rounded-lg text-primary hover:bg-primary/10"
                                        title="Edit Record"
                                      >
                                        <Edit className="h-3.5 w-3.5" />
                                      </Button>
                                    )}

                                    {!activeTableMeta?.readOnly && isSuperAdmin && (
                                      <Button
                                        onClick={() => setDeleteTarget(row)}
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 rounded-lg text-destructive hover:bg-destructive/10"
                                        title="Delete Record (SUPER_ADMIN Only)"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Bar */}
                      <div className="flex items-center justify-between border-t border-border bg-muted/30 p-4 text-xs">
                        <div className="text-muted-foreground">
                          Showing <span className="font-bold text-foreground">{(page - 1) * limit + 1}</span> to{" "}
                          <span className="font-bold text-foreground">{Math.min(page * limit, total)}</span> of{" "}
                          <span className="font-bold text-foreground">{total}</span> records
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1}
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg px-3"
                          >
                            <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
                          </Button>
                          <span className="font-semibold text-foreground px-2">
                            Page {page} of {totalPages}
                          </span>
                          <Button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg px-3"
                          >
                            Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
      </div>

      {/* VIEW RECORD MODAL */}
      <Dialog open={!!viewRecord} onOpenChange={(open) => !open && setViewRecord(null)}>
        <DialogContent className="max-w-xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <FileText className="h-5 w-5 text-primary" /> View Record Metadata
            </DialogTitle>
            <DialogDescription className="text-xs">
              Complete JSON payload for record ID: {viewRecord?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <pre className="max-h-96 overflow-y-auto rounded-xl border border-border bg-muted/60 p-4 text-[11px] font-mono leading-relaxed text-foreground">
              {JSON.stringify(viewRecord, null, 2)}
            </pre>
          </div>
          <DialogFooter>
            <Button onClick={() => setViewRecord(null)} variant="outline" className="w-full rounded-xl">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT RECORD MODAL */}
      <Dialog open={!!editRecord} onOpenChange={(open) => !open && setEditRecord(null)}>
        <DialogContent className="max-w-lg rounded-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Edit className="h-5 w-5 text-primary" /> Edit Record ({activeTableMeta?.name})
            </DialogTitle>
            <DialogDescription className="text-xs">
              Modify permitted attributes for ID: {editRecord?.id}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 py-2 text-xs">
            {Object.keys(editFormData).map((field) => (
              <div key={field} className="space-y-1">
                <Label htmlFor={`edit-${field}`} className="text-xs font-semibold capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </Label>
                {typeof editFormData[field] === "boolean" ? (
                  <select
                    id={`edit-${field}`}
                    value={editFormData[field] ? "true" : "false"}
                    onChange={(e) => setEditFormData({ ...editFormData, [field]: e.target.value === "true" })}
                    className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                ) : typeof editFormData[field] === "string" && editFormData[field].length > 60 ? (
                  <Textarea
                    id={`edit-${field}`}
                    value={editFormData[field] || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, [field]: e.target.value })}
                    className="rounded-xl min-h-[70px] text-xs"
                  />
                ) : (
                  <Input
                    id={`edit-${field}`}
                    value={editFormData[field] ?? ""}
                    onChange={(e) => setEditFormData({ ...editFormData, [field]: e.target.value })}
                    className="h-10 rounded-xl text-xs"
                  />
                )}
              </div>
            ))}

            <DialogFooter className="pt-4">
              <Button type="button" onClick={() => setEditRecord(null)} variant="outline" className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmittingEdit} className="rounded-xl bg-primary text-primary-foreground font-bold">
                {isSubmittingEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" /> Confirm Destructive Deletion
            </DialogTitle>
            <DialogDescription className="text-xs">
              This action is permanent and will be logged in system audit logs.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 space-y-3 text-xs">
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-destructive leading-relaxed font-medium">
              Are you sure you want to permanently delete record ID <span className="font-mono font-bold">{deleteTarget?.id}</span> from <span className="font-bold">{activeTableMeta?.name}</span>?
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button onClick={() => setDeleteTarget(null)} variant="outline" disabled={isDeleting} className="rounded-xl sm:flex-1">
              Cancel
            </Button>
            <Button onClick={handleDeleteSubmit} variant="destructive" disabled={isDeleting} className="rounded-xl font-bold sm:flex-1">
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Permanently Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDatabase;
