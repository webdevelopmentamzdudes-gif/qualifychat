"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Headphones, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type InboxSession = {
  id: string;
  session_id: string;
  mode: string;
  last_preview: string;
  live_requested_at: string | null;
  alert_seen_at: string | null;
};

export function LiveAgentAlert() {
  const [waiting, setWaiting] = useState<InboxSession[]>([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/live-chat/inbox");
      if (!res.ok) return;
      const data = await res.json();
      setWaiting(data.waiting ?? []);
      setUnseenCount(data.unseenCount ?? 0);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 5000);
    return () => window.clearInterval(id);
  }, [load]);

  async function acknowledge() {
    await fetch("/api/live-chat/owner/ack", { method: "POST" });
    setDismissed(true);
    void load();
  }

  if (waiting.length === 0 || dismissed) return null;

  const urgent = unseenCount > 0;

  return (
    <div
      className={cn(
        "relative border-b px-4 py-3 sm:px-6",
        urgent
          ? "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50"
          : "border-border bg-muted/50"
      )}
      role="alert"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full",
              urgent ? "bg-amber-500 text-white" : "bg-primary/10 text-primary"
            )}
          >
            {urgent ? (
              <AlertCircle className="size-5 animate-pulse" />
            ) : (
              <Headphones className="size-5" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {urgent
                ? `${unseenCount} customer${unseenCount === 1 ? "" : "s"} waiting for a live agent`
                : `${waiting.length} open live chat request${waiting.length === 1 ? "" : "s"}`}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
              Latest: {waiting[0]?.last_preview || "Live agent requested"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/dashboard/live-chat/${encodeURIComponent(waiting[0].session_id)}`}
            className={cn(buttonVariants({ size: "sm" }), "shadow-glow")}
          >
            Join live chat
          </Link>
          <Link
            href="/dashboard/live-chat"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            View inbox
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => void acknowledge()}
            aria-label="Dismiss alert"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
