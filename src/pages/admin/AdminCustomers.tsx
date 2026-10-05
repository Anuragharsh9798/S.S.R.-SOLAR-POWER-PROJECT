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
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Users,
  Search,
  RefreshCw,
  Eye,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Building2,
  IndianRupee,
} from 'lucide-react';

export interface CustomerItem {
  id: string;
  userId?: string | null;
  fullName: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  houseNumber?: string | null;
  area?: string | null;
  city?: string | null;
  district?: string | null;
  state?: string | null;
  pincode?: string | null;
  discomConsumerNo?: string | null;
  nationalPortalRegNo?: string | null;
  createdAt: string;
  quotationCount: number;
  reviewCount: number;
  quotations?: Array<{
    id: string;
    quoteNumber: string;
    status: string;
    solarType: string;
    recommendedCapacityKw?: number;
    estimatedNetCost?: any;
    createdAt: string;
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    quote: string;
    isApproved: boolean;
  }>;
}

export const AdminCustomers: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'STAFF';

  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // View Modal State
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<CustomerItem[]>('/api/v1/customers');
      setCustomers(data || []);
    } catch (err: any) {
      console.error('Failed to fetch customers:', err);
      const msg = err.message || 'Unable to retrieve registered customers from backend.';
      setError(msg);
      toast.error('Failed to load customers', { description: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        item.fullName.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.city && item.city.toLowerCase().includes(q)) ||
        (item.district && item.district.toLowerCase().includes(q)) ||
        (item.pincode && item.pincode.toLowerCase().includes(q))
      );
    });
  }, [customers, searchQuery]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / itemsPerPage));
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <Seo
        title="Customers Management | Admin Dashboard | SSR Solar Power"
        description="View registered solar customers, linked quotations, and project installations."
        path="/admin/customers"
      />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-4 w-4" /> Administrative Management ({role})
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Registered Customers
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Directory of registered solar installation customers, linked quotations, DISCOM accounts, and feedback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={fetchCustomers}
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
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customer by name, phone, email, city, pincode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl text-xs"
          />
        </div>
        <div className="text-xs text-muted-foreground font-semibold hidden md:block">
          Total Customers: <span className="text-foreground font-extrabold">{filteredCustomers.length}</span>
        </div>
      </div>

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="flex items-center justify-between rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
          <Button onClick={fetchCustomers} variant="outline" size="sm" className="rounded-full text-xs font-bold">
            Retry
          </Button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="p-12 text-center space-y-3 rounded-2xl bg-card border border-border">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-xs font-semibold text-muted-foreground">Loading registered customers...</p>
        </div>
      )}

      {/* DATA TABLE */}
      {!loading && (
        <div className="calc-card-gradient-border overflow-hidden rounded-3xl bg-card shadow-card space-y-4 p-4">
          {filteredCustomers.length === 0 ? (
            /* EMPTY STATE */
            <div className="p-12 text-center space-y-3">
              <Users className="h-10 w-10 mx-auto text-muted-foreground/40" />
              <h4 className="text-sm font-bold text-foreground">No Customers Found</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No customer records match your current search query.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <tbody className="divide-y divide-border/60">
                  {paginatedCustomers.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-sm">
                            {item.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-foreground text-sm">{item.fullName}</div>
                            <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-emerald-500" /> {item.phone}
                              </span>
                              {item.email && <span>• {item.email}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-foreground">
                          {item.city || 'Mau'}, {item.state || 'Uttar Pradesh'}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {item.area || item.address || 'Location registered'}
                          {item.pincode && ` (${item.pincode})`}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] font-bold bg-primary/10 text-primary border-primary/30">
                            <FileText className="h-3 w-3 mr-1" /> {item.quotationCount} Quotes
                          </Badge>
                          {item.reviewCount > 0 && (
                            <Badge variant="outline" className="text-[10px] font-bold bg-purple-500/10 text-purple-600 border-purple-500/30">
                              Feedback Added
                            </Badge>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-muted-foreground whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="p-4 text-right">
                        <Button
                          onClick={() => {
                            setSelectedCustomer(item);
                            setIsViewModalOpen(true);
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2.5 rounded-lg text-foreground hover:bg-accent font-semibold"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> Profile
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {filteredCustomers.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/60 pt-4 px-2 text-xs text-muted-foreground">
              <div>
                Showing <span className="font-bold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-bold text-foreground">
                  {Math.min(currentPage * itemsPerPage, filteredCustomers.length)}
                </span>{' '}
                of <span className="font-bold text-foreground">{filteredCustomers.length}</span> customers
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-semibold text-foreground px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CUSTOMER PROFILE MODAL */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {selectedCustomer?.fullName}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Customer profile, linked DISCOM account info, and related quotation history.
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-6 pt-3 text-xs">
              {/* Contact Information */}
              <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
                <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-primary" /> Contact & Account Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Phone Number</span>
                    <span className="font-bold text-foreground text-sm">{selectedCustomer.phone}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Email Address</span>
                    <span className="font-semibold text-foreground">{selectedCustomer.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">DISCOM Consumer No</span>
                    <span className="font-semibold text-foreground">
                      {selectedCustomer.discomConsumerNo || 'Not Provided'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">National Portal Reg No</span>
                    <span className="font-semibold text-foreground">
                      {selectedCustomer.nationalPortalRegNo || 'Not Provided'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address (Strictly No Raw GPS Coordinates Exposed) */}
              <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
                <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Registered Address
                </h4>
                <div className="text-foreground font-semibold">
                  {selectedCustomer.address || 'Address on file'}
                  {selectedCustomer.area && `, ${selectedCustomer.area}`}
                  {selectedCustomer.city && `, ${selectedCustomer.city}`}
                  {selectedCustomer.district && `, ${selectedCustomer.district}`}
                  {`, ${selectedCustomer.state || 'Uttar Pradesh'}`}
                  {selectedCustomer.pincode && ` - ${selectedCustomer.pincode}`}
                </div>
              </div>

              {/* Related Quotations History */}
              <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
                <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-primary" /> Linked Quotation Requests ({selectedCustomer.quotations?.length || 0})
                </h4>

                {(!selectedCustomer.quotations || selectedCustomer.quotations.length === 0) ? (
                  <div className="text-muted-foreground text-xs italic">No quotation history linked to this customer record.</div>
                ) : (
                  <div className="space-y-2.5">
                    {selectedCustomer.quotations.map((q) => (
                      <div key={q.id} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/60">
                        <div>
                          <div className="font-bold text-foreground font-mono">{q.quoteNumber}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {q.solarType} ({q.recommendedCapacityKw || 3} kW)
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="text-[10px] font-bold bg-primary/10 text-primary border-primary/30">
                            {q.status}
                          </Badge>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {new Date(q.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
