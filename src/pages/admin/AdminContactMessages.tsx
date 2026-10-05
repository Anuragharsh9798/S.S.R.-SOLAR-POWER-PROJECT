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
  Mail,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  Clock,
  Eye,
  User,
  Phone,
  ShieldCheck,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

export interface ContactMessageItem {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const AdminContactMessages: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'STAFF';

  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // View Modal State
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<ContactMessageItem[]>('/api/v1/admin/contact-messages');
      setMessages(data || []);
    } catch (err: any) {
      console.error('Failed to fetch contact messages:', err);
      const msg = err.message || 'Unable to retrieve customer inquiries.';
      setError(msg);
      toast.error('Failed to load messages', { description: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkHandled = async (msg: ContactMessageItem) => {
    try {
      await api.patch(`/api/v1/admin/contact-messages/${msg.id}/read`, { isRead: true });
      toast.success('Inquiry Marked as Handled', { description: `Message from "${msg.fullName}" marked as resolved.` });
      fetchMessages();
    } catch (err: any) {
      console.error('Failed to mark message as read:', err);
      toast.error('Action Failed', { description: err.message || 'Unable to update status.' });
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'UNHANDLED' && !m.isRead) ||
        (statusFilter === 'HANDLED' && m.isRead);

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        m.fullName.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.phone && m.phone.toLowerCase().includes(q)) ||
        (m.subject && m.subject.toLowerCase().includes(q)) ||
        m.message.toLowerCase().includes(q);

      return matchesStatus && matchesQuery;
    });
  }, [messages, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      <Seo
        title="Contact Messages Inbox | Admin Dashboard | SSR Solar Power"
        description="Review and respond to website contact form inquiries and customer messages."
        path="/admin/contact-messages"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-4 w-4" /> Administrative Management ({role})
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Contact Messages & Inquiries
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Customer inquiries submitted via website contact form and support channels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={fetchMessages}
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
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl bg-card p-4 border border-border shadow-soft">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0 hidden md:block" />
          {['ALL', 'UNHANDLED', 'HANDLED'].map((st) => (
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
          <Button onClick={fetchMessages} variant="outline" size="sm" className="rounded-full text-xs font-bold">
            Retry
          </Button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="p-12 text-center space-y-3 rounded-2xl bg-card border border-border">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-xs font-semibold text-muted-foreground">Loading contact messages inbox...</p>
        </div>
      )}

      {/* MESSAGES LIST */}
      {!loading && (
        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="p-12 text-center space-y-3 rounded-3xl bg-card border border-border">
              <Mail className="h-10 w-10 mx-auto text-muted-foreground/40" />
              <h4 className="text-sm font-bold text-foreground">No Contact Messages Found</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No customer inquiries match your current search query or status filter.
              </p>
            </div>
          ) : (
            filteredMessages.map((m) => (
              <div
                key={m.id}
                className="calc-card-gradient-border rounded-3xl bg-card p-6 shadow-soft space-y-3 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-extrabold text-sm">
                      {m.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-sm flex items-center gap-2">
                        <span>{m.fullName}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span>{m.email}</span>
                        {m.phone && (
                          <span className="flex items-center gap-1">
                            • <Phone className="h-3 w-3 text-emerald-500" /> {m.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      className={`text-[10px] font-bold ${
                        m.isRead
                          ? 'bg-blue-500/10 text-blue-600 border border-blue-500/30'
                          : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                      }`}
                    >
                      {m.isRead ? 'HANDLED' : 'NEW INQUIRY'}
                    </Badge>
                  </div>
                </div>

                {m.subject && (
                  <div className="font-semibold text-xs text-foreground">
                    Subject: <span className="font-normal text-muted-foreground">{m.subject}</span>
                  </div>
                )}

                <p className="text-xs text-foreground leading-relaxed italic bg-muted/30 p-3.5 rounded-2xl border border-border/50 line-clamp-3">
                  "{m.message}"
                </p>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(m.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => {
                        setSelectedMessage(m);
                        setIsViewModalOpen(true);
                      }}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2.5 rounded-lg text-xs font-semibold"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> View Full
                    </Button>

                    {!m.isRead && (
                      <Button
                        onClick={() => handleMarkHandled(m)}
                        size="sm"
                        className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Mark Handled
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* VIEW MESSAGE MODAL */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" /> Message Inquiry
            </DialogTitle>
            <DialogDescription className="text-xs">
              Complete customer contact message details.
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="rounded-2xl bg-muted/40 p-4 border border-border space-y-2">
                <div className="font-bold text-foreground text-sm">{selectedMessage.fullName}</div>
                <div className="text-muted-foreground">Email: {selectedMessage.email}</div>
                {selectedMessage.phone && <div className="text-muted-foreground">Phone: {selectedMessage.phone}</div>}
              </div>

              {selectedMessage.subject && (
                <div>
                  <span className="font-bold text-foreground block">Subject:</span>
                  <div className="text-muted-foreground">{selectedMessage.subject}</div>
                </div>
              )}

              <div>
                <span className="font-bold text-foreground block mb-1">Message Content:</span>
                <p className="text-foreground leading-relaxed bg-card p-3 rounded-xl border border-border whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              {!selectedMessage.isRead && (
                <Button
                  onClick={() => {
                    handleMarkHandled(selectedMessage);
                    setIsViewModalOpen(false);
                  }}
                  className="btn-premium w-full rounded-full bg-gradient-brand font-bold text-xs text-primary-foreground shadow-glow mt-2"
                >
                  <CheckCircle2 className="mr-1.5 h-4 w-4" /> Mark as Handled
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
