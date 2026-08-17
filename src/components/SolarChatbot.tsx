import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  User,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export const SolarChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Hello! I am your SSR Solar AI Assistant. Ask me about PM Surya Ghar subsidies, 530W panel specs, or rooftop solar sizing!",
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isSending]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || isSending) return;

    setChatError(null);
    setLastFailedMessage(null);

    // Add user message to history
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: messageContent,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsSending(true);

    try {
      // Call POST /api/v1/chat
      const res = await api.post<any>("/api/v1/chat", {
        message: messageContent,
        conversationId: conversationId || undefined,
      });

      if (res?.conversationId) {
        setConversationId(res.conversationId);
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: res?.reply || "Thank you! How else can I assist with your solar inquiry?",
        timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error("Chatbot API Error:", err);
      let errMsg = "Failed to communicate with Solar AI Assistant.";
      if (err.statusCode === 429) {
        errMsg = "Rate limit reached (Max 10 chat messages per minute). Please wait 1 minute before sending another message.";
      } else if (err.message) {
        errMsg = err.message;
      }

      setChatError(errMsg);
      setLastFailedMessage(messageContent);
    } finally {
      setIsSending(false);
    }
  };

  const handleRetry = () => {
    if (lastFailedMessage) {
      handleSendMessage(lastFailedMessage);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open Solar AI Assistant"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brand text-slate-950 shadow-glow transition-all duration-300 cursor-pointer"
      >
        {/* Aura Ring */}
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full bg-primary/40"
          animate={{ scale: [1, 1.45, 1], opacity: [0.65, 0, 0.65] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          aria-hidden
        />

        {isOpen ? (
          <X className="relative z-10 h-5 w-5 font-bold" />
        ) : (
          <Bot className="relative z-10 h-5 w-5 transition-transform group-hover:rotate-12" />
        )}
      </motion.button>

      {/* Expandable Chatbot Window Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-22 right-5 z-50 w-[92vw] sm:w-[380px] h-[520px] max-h-[80vh] flex flex-col rounded-3xl border border-border bg-card text-card-foreground shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/80 bg-surface/90 px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-slate-950 font-bold shadow-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold flex items-center gap-1.5 text-foreground">
                    Solar AI Assistant <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  </h4>
                  <p className="text-[10px] text-muted-foreground">Online · Powered by SSR Solar Knowledge</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Message History List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-card/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-gradient-brand text-slate-950"
                    }`}
                  >
                    {msg.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none font-medium"
                        : "bg-muted/80 text-foreground border border-border/60 rounded-tl-none"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`mt-1 block text-[9px] text-right ${
                        msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground/70"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {/* Typing / Loading Indicator */}
              {isSending && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-brand text-slate-950">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl bg-muted/70 px-3 py-2 border border-border/50">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    <span className="text-[11px] font-medium text-foreground">Assistant is thinking...</span>
                  </div>
                </div>
              )}

              {/* Error & Retry Option */}
              {chatError && (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Error Sending Message</span>
                  </div>
                  <p className="text-[11px] text-destructive/90 leading-tight">{chatError}</p>
                  {lastFailedMessage && (
                    <Button
                      size="sm"
                      onClick={handleRetry}
                      variant="outline"
                      className="h-7 text-[10px] rounded-full font-bold border-destructive/40 text-destructive hover:bg-destructive/10 flex items-center gap-1 mt-1"
                    >
                      <RefreshCw className="h-3 w-3" /> Retry Failed Message
                    </Button>
                  )}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 py-2 border-t border-border/40 bg-muted/20 flex gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
              {[
                "PM Surya Ghar Subsidy?",
                "530W Panel Specs?",
                "3kW Plant Cost?",
                "Mau Office Address?",
              ].map((chip) => (
                <button
                  key={chip}
                  disabled={isSending}
                  onClick={() => handleSendMessage(chip)}
                  className="shrink-0 rounded-full border border-border bg-card px-2.5 py-1 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Form Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 border-t border-border/80 bg-card p-3"
            >
              <Input
                type="text"
                placeholder="Ask about solar subsidies, costs, panels..."
                value={inputText}
                disabled={isSending}
                onChange={(e) => setInputText(e.target.value)}
                className="h-9 rounded-xl border-border bg-muted/40 text-xs focus:border-primary"
              />
              <Button
                type="submit"
                disabled={isSending || !inputText.trim()}
                className="h-9 w-9 shrink-0 rounded-xl bg-gradient-brand p-0 text-slate-950 font-bold shadow-sm cursor-pointer disabled:opacity-40"
              >
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
