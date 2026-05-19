"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Send, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { ChatSessionMode } from "@/lib/live-agent/types";

type Unified = {
  id: string;
  role: "user" | "assistant" | "agent" | "system";
  content: string;
  createdAt: string;
};

type Props = {
  sessionId: string;
  businessId: string;
  initialMode: ChatSessionMode;
};

export function OwnerLiveChat({
  sessionId,
  businessId,
  initialMode,
}: Props) {
  const [mode, setMode] = useState<ChatSessionMode>(initialMode);
  const [messages, setMessages] = useState<Unified[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async () => {
    const res = await fetch(
      `/api/live-chat/session?businessId=${encodeURIComponent(businessId)}&sessionId=${encodeURIComponent(sessionId)}`
    );
    if (!res.ok) return;
    const data = await res.json();
    setMode(data.mode);
    setMessages(data.messages ?? []);
  }, [businessId, sessionId]);

  useEffect(() => {
    void loadMessages();
    const id = window.setInterval(() => void loadMessages(), 3000);
    return () => window.clearInterval(id);
  }, [loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function joinChat() {
    setJoining(true);
    try {
      const res = await fetch("/api/live-chat/owner/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Join failed");
      setMode("live");
      setMessages(data.messages ?? []);
      toast.success("You joined the live chat");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not join");
    } finally {
      setJoining(false);
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setLoading(true);
    setInput("");
    try {
      const res = await fetch("/api/live-chat/owner/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, content: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      setMessages(data.messages ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Send failed");
      setInput(text);
    } finally {
      setLoading(false);
    }
  }

  async function endLive() {
    if (!confirm("End live chat and return this visitor to the AI assistant?")) {
      return;
    }
    try {
      const res = await fetch("/api/live-chat/owner/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMode("ai");
      toast.success("Live chat ended — AI assistant resumed");
      await loadMessages();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not end chat");
    }
  }

  return (
    <div className="flex min-h-[480px] flex-col rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="text-sm font-semibold">Live chat</p>
          <p className="text-xs text-muted-foreground">
            Status:{" "}
            <span className="font-medium text-foreground">
              {mode === "waiting_agent"
                ? "Customer waiting"
                : mode === "live"
                  ? "You are live"
                  : "AI mode"}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          {mode === "waiting_agent" ? (
            <Button size="sm" disabled={joining} onClick={() => void joinChat()}>
              {joining ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : null}
              Join chat
            </Button>
          ) : null}
          {mode === "live" ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => void endLive()}
            >
              <PhoneOff className="mr-2 size-4" />
              End & return to AI
            </Button>
          ) : null}
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1 p-4">
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex",
                m.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm",
                  m.role === "user" &&
                    "rounded-br-md bg-indigo-600 text-white",
                  m.role === "assistant" && "rounded-bl-md bg-muted",
                  m.role === "agent" &&
                    "rounded-bl-md border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40",
                  m.role === "system" &&
                    "w-full rounded-lg bg-muted/50 text-center text-xs text-muted-foreground"
                )}
              >
                {m.role === "agent" ? (
                  <p className="mb-1 text-[10px] font-semibold uppercase text-emerald-700">
                    You (live)
                  </p>
                ) : null}
                {m.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {mode === "live" ? (
        <div className="border-t border-border p-3">
          <div className="flex gap-2">
            <Textarea
              rows={2}
              value={input}
              placeholder="Reply to customer…"
              className="min-h-[44px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage();
                }
              }}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              size="icon"
              disabled={loading || !input.trim()}
              onClick={() => void sendMessage()}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </div>
        </div>
      ) : (
        <p className="border-t border-border px-4 py-3 text-center text-xs text-muted-foreground">
          Join the chat to reply live. Until then, the AI bot is paused for this
          visitor.
        </p>
      )}
    </div>
  );
}
