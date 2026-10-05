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
import aiAssistantLogo from "@/assets/ai-assistant-logo.png";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isSending]);

  // Isolate scroll so mousewheel & touch over assistant ONLY scroll the message list without moving the background page or triggering Lenis
  useEffect(() => {
    if (!isOpen) return;

    const scrollEl = scrollContainerRef.current;
    const modalEl = modalRef.current;

    const onMessageWheel = (e: WheelEvent) => {
      e.stopPropagation();
      if (!scrollEl) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollEl;
      const atTop = scrollTop <= 0 && e.deltaY < 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;

      // Prevent chaining scroll to the background webpage when reaching top/bottom
      if (atTop || atBottom) {
        e.preventDefault();
      }
    };

    const onModalWheel = (e: WheelEvent) => {
      e.stopPropagation();
      // If hovering outside message list (e.g., header, chips, footer), prevent page scroll
      if (scrollEl && !scrollEl.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.stopPropagation();
    };

    scrollEl?.addEventListener("wheel", onMessageWheel, { passive: false });
    modalEl?.addEventListener("wheel", onModalWheel, { passive: false });
    modalEl?.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      scrollEl?.removeEventListener("wheel", onMessageWheel);
      modalEl?.removeEventListener("wheel", onModalWheel);
      modalEl?.removeEventListener("touchmove", onTouchMove);
    };
  }, [isOpen]);

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
          <img
            src={aiAssistantLogo}
            alt="SSR Solar AI Assistant"
            className="relative z-10 h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 drop-shadow-sm"
          />
        )}
      </motion.button>

      {/* Expandable Chatbot Window Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={modalRef}
            data-lenis-prevent
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-[4.75rem] sm:bottom-20 right-3 sm:right-6 left-3 sm:left-auto w-auto sm:w-[400px] md:w-[420px] max-w-[calc(100vw-1.5rem)] h-[min(540px,calc(100dvh-6rem))] z-50 flex flex-col rounded-3xl border border-border bg-card/95 text-card-foreground shadow-2xl overflow-hidden backdrop-blur-xl overscroll-contain"
          >
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between border-b border-border/80 bg-surface/90 px-4 py-3 sm:px-5 sm:py-3.5 min-w-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950/80 dark:bg-slate-900 border border-primary/30 p-1 shadow-sm overflow-hidden">
                  <img
                    src={aiAssistantLogo}
                    alt="SSR Solar AI Assistant"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold flex items-center gap-1.5 text-foreground truncate">
                    Solar AI Assistant <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  </h4>
                  <p className="text-[10px] text-muted-foreground truncate">Online · PM Surya Ghar & Solar Support</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Close Solar AI Assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Message History List */}
            <div
              ref={scrollContainerRef}
              data-lenis-prevent
              className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-card/40 overscroll-contain"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 min-w-0 max-w-full ${
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold overflow-hidden ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-slate-950 border border-primary/40 p-0.5"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <User className="h-3.5 w-3.5" />
                    ) : (
                      <img src={aiAssistantLogo} alt="AI" className="h-full w-full object-contain" />
                    )}
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[80%] min-w-0 rounded-2xl p-3 text-xs leading-relaxed shadow-sm break-words [overflow-wrap:anywhere] ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none font-medium"
                        : "bg-muted/80 text-foreground border border-border/60 rounded-tl-none font-normal"
                    }`}
                  >
                    <div className="whitespace-pre-line break-words text-xs leading-relaxed">{msg.text}</div>
                    <span
                      className={`mt-1.5 block text-[9px] text-right font-mono ${
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
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 min-w-0">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 border border-primary/40 p-0.5 overflow-hidden">
                    <img src={aiAssistantLogo} alt="AI Thinking" className="h-full w-full object-contain" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl bg-muted/70 px-3 py-2 border border-border/50">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary shrink-0" />
                    <span className="text-[11px] font-medium text-foreground">Assistant is analyzing...</span>
                  </div>
                </div>
              )}

              {/* Error & Retry Option */}
              {chatError && (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive space-y-2 min-w-0">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Error Sending Message</span>
                  </div>
                  <p className="text-[11px] text-destructive/90 leading-tight break-words">{chatError}</p>
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
            <div className="shrink-0 px-3.5 py-2 border-t border-border/40 bg-muted/20 flex gap-1.5 overflow-x-auto text-[10px] no-scrollbar min-w-0 max-w-full">
              {[
                "PM Surya Ghar Subsidy?",
                "3kW Plant Sizing & Savings?",
                "530W Panel Specs?",
                "Inverter Fault Troubleshooting?",
                "How to Clean Solar Panels?",
                "Mau Office Location?",
              ].map((chip) => (
                <button
                  key={chip}
                  disabled={isSending}
                  onClick={() => handleSendMessage(chip)}
                  className="shrink-0 rounded-full border border-border bg-card px-2.5 py-1 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
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
              className="shrink-0 flex items-center gap-2 border-t border-border/80 bg-card p-3 min-w-0 max-w-full"
            >
              <Input
                type="text"
                placeholder="Ask about subsidies, sizing, faults..."
                value={inputText}
                disabled={isSending}
                onChange={(e) => setInputText(e.target.value)}
                className="h-9 min-w-0 flex-1 rounded-xl border-border bg-muted/40 text-xs focus:border-primary"
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
