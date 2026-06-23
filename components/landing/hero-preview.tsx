"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const chat = [
  { role: "bot" as const, text: "Hi! How can I help you today?" },
  { role: "user" as const, text: "I'd like a Hydrafacial next Monday." },
  {
    role: "bot" as const,
    text: "Great — Hydrafacial starts from $80. What name, email, and phone should we use?",
  },
  { role: "user" as const, text: "Sarah Chen · sarah@example.com · 555-0142" },
];

type Props = { variant?: "light" | "dark" };

export function HeroPreview({ variant = "light" }: Props) {
  const reduceMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(reduceMotion ? chat.length : 1);
  const [showLead, setShowLead] = useState(reduceMotion);

  const dark = variant === "dark";

  useEffect(() => {
    if (reduceMotion) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    chat.forEach((_, i) => {
      if (i > 0) {
        timers.push(setTimeout(() => setVisibleCount(i + 1), 800 + i * 900));
      }
    });
    timers.push(
      setTimeout(() => setShowLead(true), 800 + chat.length * 900 + 400)
    );
    return () => timers.forEach(clearTimeout);
  }, [reduceMotion]);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-md"
    >
      <div
        className={cn(
          "absolute -inset-6 -z-10 blur-3xl",
          dark ? "bg-brand-1/25" : "bg-brand-gradient opacity-30 animate-gradient"
        )}
        aria-hidden
      />

      <div
        className={cn(
          "rounded-3xl p-5 shadow-elevated",
          dark
            ? "landing-glass landing-card-glow"
            : "border border-border bg-card/90 backdrop-blur-xl"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 border-b pb-3",
            dark ? "border-white/10" : "border-border"
          )}
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow">
            <Bot className="size-5" aria-hidden />
          </div>
          <div className="flex-1">
            <p className={cn("text-sm font-semibold", dark && "text-white")}>
              GlowCare Assistant
            </p>
            <p
              className={cn(
                "flex items-center gap-1.5 text-xs",
                dark ? "text-white/60" : "text-muted-foreground"
              )}
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
              </span>
              Online · Qualifying lead
            </p>
          </div>
          <Sparkles
            className={cn("size-4", dark ? "text-white/40" : "text-muted-foreground")}
            aria-hidden
          />
        </div>

        <div className="space-y-2 py-4" aria-live="polite">
          {chat.slice(0, visibleCount).map((m, i) => (
            <motion.div
              key={i}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={
                m.role === "bot"
                  ? cn(
                      "mr-auto max-w-[88%] rounded-2xl rounded-bl-md px-3.5 py-2.5 text-sm shadow-soft",
                      dark
                        ? "bg-white/10 text-white"
                        : "bg-muted text-foreground"
                    )
                  : "ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-brand-gradient px-3.5 py-2.5 text-sm text-white shadow-glow"
              }
            >
              {m.text}
            </motion.div>
          ))}

          {visibleCount < chat.length && !reduceMotion ? (
            <div
              className={cn(
                "mr-auto inline-flex items-center gap-1 rounded-2xl rounded-bl-md px-4 py-3 shadow-soft animate-typing",
                dark ? "bg-white/10" : "bg-muted"
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-40" />
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-40" />
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-40" />
            </div>
          ) : null}
        </div>

        <motion.div
          initial={false}
          animate={{
            opacity: showLead ? 1 : 0,
            y: showLead ? 0 : 8,
          }}
          className={cn(
            "rounded-xl border p-2.5 text-xs",
            dark
              ? "border-emerald-500/30 bg-emerald-500/10 text-white/80"
              : "border-border bg-background/70 text-muted-foreground"
          )}
        >
          <span className="font-medium text-emerald-400">→ Dashboard</span>
          {" · "}
          <span className={cn("font-medium", dark ? "text-white" : "text-foreground")}>
            Sarah Chen
          </span>
          {" · "}
          <span className={cn("font-medium", dark ? "text-white" : "text-foreground")}>
            sarah@example.com
          </span>
          {" · "}
          <span className="rounded-full bg-primary/20 px-2 py-0.5 font-semibold text-primary">
            QUALIFIED
          </span>
        </motion.div>
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className={cn(
          "absolute -left-4 top-8 hidden rounded-2xl px-3 py-2 text-xs shadow-elevated sm:block animate-float landing-glass",
          !dark && "border border-border bg-card"
        )}
      >
        <p className="font-semibold text-white">Lead captured</p>
        <p className="text-white/55">Sent to inbox</p>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className={cn(
          "absolute -right-2 bottom-16 hidden rounded-2xl px-3 py-2 text-xs shadow-elevated sm:block",
          dark ? "landing-glass" : "border border-border bg-card",
          !reduceMotion && "animate-float"
        )}
        style={reduceMotion ? undefined : { animationDelay: "1s" }}
      >
        <p className={cn("font-semibold", dark ? "text-white" : "text-foreground")}>
          24/7 active
        </p>
        <p className={dark ? "text-white/55" : "text-muted-foreground"}>
          Never miss a chat
        </p>
      </motion.div>
    </motion.div>
  );
}
