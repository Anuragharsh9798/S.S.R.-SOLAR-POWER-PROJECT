import React, { useState, useEffect } from 'react';
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
  Bot,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Clock,
  User,
  Sparkles,
} from 'lucide-react';
import aiAssistantLogo from '@/assets/ai-assistant-logo.png';

export interface ChatConversationItem {
  id: string;
  sessionId: string;
  status: string;
  messageCount: number;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessageItem {
  id: string;
  senderType: 'USER' | 'BOT' | string;
  message: string;
  createdAt: string;
}

export interface ChatDetailResponse {
  id: string;
  sessionId: string;
  status: string;
  createdAt: string;
  messages: ChatMessageItem[];
}

export const AdminChatbot: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'STAFF';

  const [conversations, setConversations] = useState<ChatConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Session Detail State
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sessionDetail, setSessionDetail] = useState<ChatDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<ChatConversationItem[]>('/api/v1/admin/chatbot/conversations');
      setConversations(data || []);
    } catch (err: any) {
      console.error('Failed to fetch chatbot conversations:', err);
      const msg = err.message || 'Unable to retrieve AI chatbot conversation logs.';
      setError(msg);
      toast.error('Failed to load conversations', { description: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const openConversationDetail = async (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setDetailLoading(true);
    setIsDetailModalOpen(true);
    try {
      const res = await api.get<ChatDetailResponse>(`/api/v1/admin/chatbot/conversations/${sessionId}`);
      setSessionDetail(res);
    } catch (err: any) {
      console.error('Failed to fetch conversation transcript:', err);
      toast.error('Transcript Error', { description: err.message || 'Unable to load chat transcript.' });
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.sessionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Seo
        title="AI Chatbot Conversation Logs | Admin Dashboard | SSR Solar Power"
        description="Inspect SSR Solar AI Assistant user conversation logs and customer inquiries."
        path="/admin/chatbot"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-4 w-4" /> Administrative Management ({role})
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            AI Solar Consultant Conversation Logs
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Review user solar inquiry sessions, PM Surya Ghar subsidy questions, and AI consultant responses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={fetchConversations}
            disabled={loading}
            variant="outline"
            size="sm"
            className="rounded-full border-border hover:bg-muted font-bold text-xs"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Logs
          </Button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-card p-4 border border-border shadow-soft">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by session ID, last message text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl text-xs"
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground hidden md:block">
          Total Sessions: <span className="text-foreground font-extrabold">{filteredConversations.length}</span>
        </span>
      </div>

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="flex items-center justify-between rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
          <Button onClick={fetchConversations} variant="outline" size="sm" className="rounded-full text-xs font-bold">
            Retry
          </Button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="p-12 text-center space-y-3 rounded-2xl bg-card border border-border">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-xs font-semibold text-muted-foreground">Loading AI chatbot conversation logs...</p>
        </div>
      )}

      {/* CONVERSATION SESSIONS GRID */}
      {!loading && (
        <div className="space-y-4">
          {filteredConversations.length === 0 ? (
            <div className="p-12 text-center space-y-3 rounded-3xl bg-card border border-border">
              <Bot className="h-10 w-10 mx-auto text-muted-foreground/40" />
              <h4 className="text-sm font-bold text-foreground">No Chatbot Conversations Found</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No user chatbot sessions match your current search query.
              </p>
            </div>
          ) : (
            filteredConversations.map((c) => (
              <div
                key={c.id}
                onClick={() => openConversationDetail(c.sessionId)}
                className="calc-card-gradient-border rounded-3xl bg-card p-5 shadow-soft hover:shadow-glow transition-all cursor-pointer space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2 font-mono font-bold text-primary text-xs">
                    <Bot className="h-4 w-4 text-primary" />
                    <span>Session: {c.sessionId}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-bold bg-primary/10 text-primary border-primary/30">
                      <MessageSquare className="h-3 w-3 mr-1" /> {c.messageCount} Messages
                    </Badge>
                    <Badge className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                      {c.status}
                    </Badge>
                  </div>
                </div>

                <div className="text-xs text-foreground bg-muted/30 p-3 rounded-xl border border-border/50 truncate italic">
                  Last Message: "{c.lastMessage}"
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Updated:{' '}
                    {new Date(c.updatedAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  <span className="text-primary font-bold hover:underline flex items-center gap-1">
                    View Transcript →
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TRANSCRIPT DETAIL MODAL */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Chat Session Transcript
            </DialogTitle>
            <DialogDescription className="text-xs font-mono">
              Session ID: {selectedSessionId}
            </DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <div className="p-12 text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-xs font-semibold text-muted-foreground">Loading chat messages...</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-muted/20 rounded-2xl border border-border">
              {(!sessionDetail || !sessionDetail.messages || sessionDetail.messages.length === 0) ? (
                <div className="text-center text-xs text-muted-foreground p-8">No messages recorded in this session.</div>
              ) : (
                sessionDetail.messages.map((m) => {
                  const isUser = m.senderType === 'USER';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground mb-1">
                        {isUser ? (
                          <>
                            <span>User</span> <User className="h-3 w-3 text-primary" />
                          </>
                        ) : (
                          <>
                            <img src={aiAssistantLogo} alt="AI" className="h-3.5 w-3.5 object-contain inline-block" /> <span>AI Solar Consultant</span>
                          </>
                        )}
                      </div>

                      <div
                        className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? 'bg-primary text-primary-foreground font-medium rounded-tr-none shadow-soft'
                            : 'bg-card text-foreground border border-border rounded-tl-none shadow-soft'
                        }`}
                      >
                        {m.message}
                      </div>

                      <span className="text-[9px] text-muted-foreground mt-1 font-mono">
                        {new Date(m.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
