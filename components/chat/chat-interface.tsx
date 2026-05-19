"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Loader2, Bot, RefreshCcw, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";
import type { ChatSessionMode } from "@/lib/live-agent/types";

type PublicConfig = {
  businessId: string;
  businessName: string;
  chatbotName: string;
  greetingMessage: string;
  chatbotColor: string;
  humanHandoverMessage: string;
};

type Props = {
  businessId: string;
  embed?: boolean;
};

function getOrCreateSessionId(businessId: string) {
  const key = `qualifychat_session_${businessId}`;
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(key);
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(key, id);
  }
  return id;
}

function unifiedToChat(
  items: { role: string; content: string }[]
): ChatMessage[] {
  return items.map((m) => ({
    role: m.role as ChatMessage["role"],
    content: m.content,
  }));
}

export function ChatInterface({ businessId, embed }: Props) {
  const [config, setConfig] = useState<PublicConfig | null>(null);
  const [sessionId, setSessionId] = useState("");
  const [sessionMode, setSessionMode] = useState<ChatSessionMode>("ai");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestingAgent, setRequestingAgent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const accent = useMemo(
    () => config?.chatbotColor || "#6366f1",
    [config?.chatbotColor]
  );

  const inLiveFlow =
    sessionMode === "waiting_agent" || sessionMode === "live";

  useEffect(() => {
    setSessionId(getOrCreateSessionId(businessId));
  }, [businessId]);

  useEffect(() => {
    async function load() {
      try {
        const base =
          typeof window !== "undefined" ? window.location.origin : "";
        const res = await fetch(`${base}/api/public/business/${businessId}`);
        if (!res.ok) throw new Error("Could not load chatbot");
        const data = await res.json();
        setConfig(data);
      } catch {
        setError("Chatbot unavailable.");
      }
    }
    load();
  }, [businessId]);

  const syncSession = useCallback(async () => {
    if (!sessionId) return;
    try {
      const base =
        typeof window !== "undefined" ? window.location.origin : "";
      const res = await fetch(
        `${base}/api/live-chat/session?businessId=${encodeURIComponent(businessId)}&sessionId=${encodeURIComponent(sessionId)}`
      );
      if (!res.ok) return;
      const data = await res.json();
      setSessionMode(data.mode as ChatSessionMode);
      if (data.messages?.length) {
        setMessages(unifiedToChat(data.messages));
      } else if (config && messages.length === 0) {
        setMessages([{ role: "assistant", content: config.greetingMessage }]);
      }
    } catch {
      /* ignore poll errors */
    }
  }, [businessId, sessionId, config, messages.length]);

  useEffect(() => {
    if (!sessionId) return;
    void syncSession();
  }, [sessionId, syncSession]);

  useEffect(() => {
    if (!sessionId || !inLiveFlow) return;
    const id = window.setInterval(() => void syncSession(), 3000);
    return () => window.clearInterval(id);
  }, [sessionId, inLiveFlow, syncSession]);

  useEffect(() => {
    if (config && messages.length === 0 && sessionMode === "ai") {
      setMessages([{ role: "assistant", content: config.greetingMessage }]);
    }
  }, [config, messages.length, sessionMode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const requestLiveAgent = useCallback(async () => {
    if (!sessionId || requestingAgent) return;
    setRequestingAgent(true);
    setError(null);
    try {
      const res = await fetch("/api/live-chat/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          sessionId,
          preview: input.trim() || "Live agent requested",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setSessionMode("waiting_agent");
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: data.message as string,
        },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not request live agent");
    } finally {
      setRequestingAgent(false);
    }
  }, [businessId, input, requestingAgent, sessionId]);

  const sendLive = useCallback(
    async (text: string) => {
      const res = await fetch("/api/live-chat/visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, sessionId, content: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      setSessionMode(data.mode as ChatSessionMode);
      if (data.messages) {
        setMessages(unifiedToChat(data.messages));
      }
    },
    [businessId, sessionId]
  );

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || !sessionId) return;

    if (inLiveFlow) {
      const prevSnapshot = messages;
      setInput("");
      setLoading(true);
      setError(null);
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      try {
        await sendLive(text);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
        setMessages(prevSnapshot);
        setInput(text);
      } finally {
        setLoading(false);
        textareaRef.current?.focus();
      }
      return;
    }

    const prevSnapshot = messages;
    const userTurn: ChatMessage = { role: "user", content: text };
    const nextMessages = [...messages, userTurn];

    setInput("");
    setLoading(true);
    setError(null);
    setMessages(nextMessages);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          sessionId,
          messages: nextMessages.filter(
            (m) => m.role === "user" || m.role === "assistant"
          ),
        }),
      });

      const data = await res.json();

      if (res.status === 409 && data.liveMode) {
        setSessionMode(data.mode || "waiting_agent");
        await syncSession();
        return;
      }

      if (!res.ok) throw new Error(data.error || "Request failed");

      if (data.liveMode) {
        setSessionMode(data.mode || "waiting_agent");
        setMessages([
          ...nextMessages,
          { role: "system", content: data.reply as string },
        ]);
        return;
      }

      setMessages([
        ...nextMessages,
        { role: "assistant", content: data.reply as string },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setMessages(prevSnapshot);
      setInput(text);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }, [
    businessId,
    input,
    inLiveFlow,
    loading,
    messages,
    sendLive,
    sessionId,
    syncSession,
  ]);

  function reset() {
    setMessages(
      config ? [{ role: "assistant", content: config.greetingMessage }] : []
    );
    setSessionMode("ai");
    setError(null);
    setInput("");
  }

  if (error && !config) {
    return (
      <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elevated",
        embed ? "h-[min(580px,85vh)]" : "h-[min(640px,85vh)]"
      )}
    >
      <header
        className="relative flex items-center gap-3 px-4 py-3 text-white"
        style={{
          background: `linear-gradient(135deg, ${accent}, color-mix(in oklab, ${accent} 70%, #6d28d9))`,
        }}
      >
        <div className="absolute inset-0 bg-grid opacity-15" aria-hidden />
        <div className="relative flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
          <Bot className="size-5" aria-hidden />
        </div>
        <div className="relative flex-1">
          <p className="text-sm font-semibold leading-none">
            {sessionMode === "live"
              ? "Live team member"
              : sessionMode === "waiting_agent"
                ? "Waiting for agent…"
                : (config?.chatbotName ?? "AI Assistant")}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs opacity-90">
            <span className="relative flex size-1.5">
              <span
                className={cn(
                  "absolute inline-flex h-full w-full rounded-full opacity-75",
                  inLiveFlow ? "animate-ping bg-amber-300" : "animate-ping bg-emerald-300"
                )}
              />
              <span
                className={cn(
                  "relative inline-flex size-1.5 rounded-full",
                  inLiveFlow ? "bg-amber-400" : "bg-emerald-400"
                )}
              />
            </span>
            {config?.businessName ?? "Business"}
            {inLiveFlow ? " · live handover" : " · AI online"}
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="relative rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
          aria-label="Start new chat"
          title="Start new chat"
        >
          <RefreshCcw className="size-4" />
        </button>
      </header>

      {sessionMode === "waiting_agent" ? (
        <div className="border-b border-amber-200/60 bg-amber-50 px-4 py-2 text-center text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100">
          A team member has been notified. You can keep chatting here while you
          wait.
        </div>
      ) : null}

      {sessionMode === "live" ? (
        <div className="border-b border-emerald-200/60 bg-emerald-50 px-4 py-2 text-center text-xs text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-100">
          You are connected with a live team member.
        </div>
      ) : null}

      <ScrollArea className="min-h-0 flex-1 scrollbar-thin">
        <div className="space-y-2 p-4">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={`${i}-${m.role}-${m.content.slice(0, 12)}`}
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "flex w-full",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap break-words px-3.5 py-2.5 text-sm leading-relaxed shadow-soft",
                    m.role === "user" &&
                      "rounded-2xl rounded-br-md text-white",
                    m.role === "assistant" &&
                      "rounded-2xl rounded-bl-md bg-muted text-foreground",
                    m.role === "agent" &&
                      "rounded-2xl rounded-bl-md border border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-50",
                    m.role === "system" &&
                      "rounded-xl bg-muted/60 text-center text-xs text-muted-foreground"
                  )}
                  style={
                    m.role === "user"
                      ? {
                          background: `linear-gradient(135deg, ${accent}, color-mix(in oklab, ${accent} 70%, #6d28d9))`,
                        }
                      : undefined
                  }
                >
                  {m.role === "agent" ? (
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                      Live agent
                    </p>
                  ) : null}
                  {m.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {loading ? (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3 shadow-soft">
                  <span className="inline-flex items-center gap-1.5 animate-typing">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                  </span>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {error ? (
        <p className="border-t border-destructive/20 bg-destructive/5 px-4 py-2 text-xs text-destructive">
          {error}
        </p>
      ) : null}

      <div className="border-t border-border bg-background/80 p-3 backdrop-blur">
        {sessionMode === "ai" ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mb-2 w-full gap-2"
            disabled={requestingAgent || !sessionId}
            onClick={() => void requestLiveAgent()}
          >
            {requestingAgent ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Headphones className="size-4" />
            )}
            Talk to a live agent
          </Button>
        ) : null}

        <div className="flex items-end gap-2 rounded-2xl border border-border bg-card px-3 py-2 shadow-soft focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20">
          <textarea
            ref={textareaRef}
            className="min-h-[36px] max-h-32 flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder={
              inLiveFlow
                ? "Message the team…"
                : "Type your message…"
            }
            rows={1}
            value={input}
            disabled={!config || !sessionId}
            onChange={(e) => {
              setInput(e.target.value);
              if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
                textareaRef.current.style.height =
                  Math.min(textareaRef.current.scrollHeight, 128) + "px";
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
          />
          <Button
            type="button"
            size="icon-sm"
            className="shrink-0 text-white shadow-glow disabled:shadow-none"
            style={{
              background: `linear-gradient(135deg, ${accent}, color-mix(in oklab, ${accent} 70%, #6d28d9))`,
            }}
            onClick={() => void send()}
            disabled={loading || !input.trim()}
            aria-label="Send message"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Send className="size-4" aria-hidden />
            )}
          </Button>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          Powered by QualifyChat
        </p>
      </div>
    </motion.div>
  );
}
