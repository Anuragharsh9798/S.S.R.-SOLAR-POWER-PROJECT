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
  FileText,
  Search,
  Filter,
  RefreshCw,
  Sun,
  Eye,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  Zap,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

export interface QuotationItem {
  id: string;
  quoteNumber: string;
  customerId?: string | null;
  fullName: string;
  phone: string;
  email?: string | null;
  address: string;
  houseNumber?: string | null;
  area?: string | null;
  city: string;
  district?: string | null;
  state: string;
  pincode?: string | null;
  monthlyBillAmount?: any;
  monthlyUnits?: number | null;
  electricityRate?: any;
  solarType: string;
  recommendedCapacityKw?: number | null;
  estimatedGrossCost?: any;
  estimatedCentralSubsidy?: any;
  estimatedStateSubsidy?: any;
  estimatedNetCost?: any;
  estimatedAnnualSavings?: any;
  contactTime?: string | null;
  status: string;
  message?: string | null;
  createdAt: string;
  customer?: any;
  assignedTo?: any;
}

export const formatMoney = (val: any): string => {
  if (val === null || val === undefined) return '₹0';
  const num = typeof val === 'number' ? val : parseFloat(val);
  return isNaN(num) ? '₹0' : `₹${num.toLocaleString('en-IN')}`;
};

export const AdminQuotations: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'STAFF';

  const [quotations, setQuotations] = useState<QuotationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // View Modal State
  const [selectedQuote, setSelectedQuote] = useState<QuotationItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const fetchQuotations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<QuotationItem[]>('/api/v1/quotations');
      setQuotations(data || []);
    } catch (err: any) {
      console.error('Failed to fetch quotations:', err);
      const msg = err.message || 'Unable to retrieve quotation requests from backend.';
      setError(msg);
      toast.error('Failed to load quotations', { description: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // Filtered Quotations
  const filteredQuotations = useMemo(() => {
    return quotations.filter((item) => {
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.quoteNumber.toLowerCase().includes(q) ||
        item.fullName.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        item.city.toLowerCase().includes(q) ||
        (item.pincode && item.pincode.toLowerCase().includes(q));

      return matchesStatus && matchesQuery;
    });
  }, [quotations, searchQuery, statusFilter]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredQuotations.length / itemsPerPage));
  const paginatedQuotations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredQuotations.slice(start, start + itemsPerPage);
  }, [filteredQuotations, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 font-bold">NEW</Badge>;
      case 'PENDING':
      case 'IN_PROGRESS':
        return <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/30 font-bold">PENDING</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/30 font-bold">COMPLETED</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Seo
        title="Quotations Management | Admin Dashboard | SSR Solar Power"
        description="Review customer solar quote requests and sizing estimates."
        path="/admin/quotations"
      />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-4 w-4" /> Administrative Management ({role})
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Quotation Requests Management
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Review incoming customer solar plant sizing inquiries, location data, and financial estimates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={fetchQuotations}
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

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl bg-card p-4 border border-border shadow-soft">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by quote #, name, phone, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0 hidden md:block" />
          {['ALL', 'NEW', 'PENDING', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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
          <Button onClick={fetchQuotations} variant="outline" size="sm" className="rounded-full text-xs font-bold">
            Retry
          </Button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="p-12 text-center space-y-3 rounded-2xl bg-card border border-border">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-xs font-semibold text-muted-foreground">Loading quotation requests...</p>
        </div>
      )}

      {/* DATA TABLE */}
      {!loading && (
        <div className="calc-card-gradient-border overflow-hidden rounded-3xl bg-card shadow-card space-y-4 p-4">
          {filteredQuotations.length === 0 ? (
            /* EMPTY STATE */
            <div className="p-12 text-center space-y-3">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground/40" />
              <h4 className="text-sm font-bold text-foreground">No Quotation Requests Found</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No quote requests match your current search query or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-muted-foreground uppercase font-bold border-b border-border text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Quote #</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Solar Solution</th>
                    <th className="p-3">Estimated Cost</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Submitted</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedQuotations.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-primary whitespace-nowrap">
                        {item.quoteNumber}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-foreground">{item.fullName}</div>
                        <div className="text-[11px] text-muted-foreground">{item.phone}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-foreground">{item.city}</div>
                        <div className="text-[11px] text-muted-foreground">{item.state}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-foreground">
                          {item.solarType} ({item.recommendedCapacityKw || 3} kW)
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {item.monthlyUnits || 300} Units/mo
                        </div>
                      </td>
                      <td className="p-3 font-bold text-foreground whitespace-nowrap">
                        {formatMoney(item.estimatedNetCost)}
                      </td>
                      <td className="p-3 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                      <td className="p-3 text-muted-foreground whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          onClick={() => {
                            setSelectedQuote(item);
                            setIsViewModalOpen(true);
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 rounded-lg text-foreground hover:bg-accent font-semibold"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {filteredQuotations.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/60 pt-4 px-2 text-xs text-muted-foreground">
              <div>
                Showing <span className="font-bold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-bold text-foreground">
                  {Math.min(currentPage * itemsPerPage, filteredQuotations.length)}
                </span>{' '}
                of <span className="font-bold text-foreground">{filteredQuotations.length}</span> quotes
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

      {/* QUOTATION DETAILS MODAL */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Quote #{selectedQuote?.quoteNumber}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Complete breakdown of customer sizing calculation and solar financial estimates.
            </DialogDescription>
          </DialogHeader>

          {selectedQuote && (
            <div className="space-y-6 pt-3 text-xs">
              {/* Customer Contact Card */}
              <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
                <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary" /> Customer Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Full Name</span>
                    <span className="font-bold text-foreground text-sm">{selectedQuote.fullName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Phone Number</span>
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3 text-emerald-500" /> {selectedQuote.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Email Address</span>
                    <span className="font-semibold text-foreground">
                      {selectedQuote.email || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Preferred Contact Time</span>
                    <span className="font-semibold text-foreground">{selectedQuote.contactTime || 'Any Time'}</span>
                  </div>
                </div>
              </div>

              {/* Location Card (Strictly No Raw GPS Coordinates) */}
              <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
                <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Installation Location
                </h4>
                <div className="text-foreground font-semibold">
                  {selectedQuote.address}
                  {selectedQuote.area && `, ${selectedQuote.area}`}
                  {selectedQuote.city && `, ${selectedQuote.city}`}
                  {selectedQuote.district && `, ${selectedQuote.district}`}
                  {`, ${selectedQuote.state}`}
                  {selectedQuote.pincode && ` - ${selectedQuote.pincode}`}
                </div>
              </div>

              {/* Solar Solution Sizing & Financials */}
              <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
                <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-primary" /> Solar Solution & Sizing
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">System Type</span>
                    <span className="font-bold text-foreground">{selectedQuote.solarType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Recommended Size</span>
                    <span className="font-extrabold text-primary">{selectedQuote.recommendedCapacityKw || 3} kW</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Monthly Consumption</span>
                    <span className="font-semibold text-foreground">{selectedQuote.monthlyUnits || 300} Units</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Estimated Gross Cost</span>
                    <span className="font-semibold text-foreground">{formatMoney(selectedQuote.estimatedGrossCost)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Estimated Subsidies</span>
                    <span className="font-semibold text-emerald-600">
                      {formatMoney(
                        (parseFloat(selectedQuote.estimatedCentralSubsidy || 0) +
                          parseFloat(selectedQuote.estimatedStateSubsidy || 0))
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Estimated Net Cost</span>
                    <span className="font-black text-emerald-600 text-sm">{formatMoney(selectedQuote.estimatedNetCost)}</span>
                  </div>
                </div>
              </div>

              {selectedQuote.message && (
                <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-1">
                  <span className="text-muted-foreground block text-[10px] font-bold uppercase">Customer Notes</span>
                  <p className="text-foreground italic">{selectedQuote.message}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
