"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";

const chat = [
  { role: "bot" as const, text: "Hi! How can I help you today?" },
  { role: "user" as const, text: "I'd like a Hydrafacial next Monday." },
  {
    role: "bot" as const,
    text: "Great choice — Hydrafacial starts from $80. What name and email should we use to confirm your slot?",
  },
  { role: "user" as const, text: "John Doe, john@example.com" },
];

export function HeroPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-md"
    >
      {/* glow */}
      <div className="absolute -inset-6 -z-10 bg-brand-gradient opacity-30 blur-3xl animate-gradient" />

      <div className="rounded-3xl border border-border bg-card/90 p-5 shadow-elevated backdrop-blur-xl">
        <div className="flex items-center gap-3 border-b border-border pb-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow">
            <Bot className="size-5" aria-hidden />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">AI Assistant</p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
              </span>
              Online · GlowCare Clinic
            </p>
          </div>
          <Sparkles className="size-4 text-muted-foreground" aria-hidden />
        </div>

        <div className="space-y-2 py-4">
          {chat.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.35, duration: 0.45 }}
              className={
                m.role === "bot"
                  ? "mr-auto max-w-[85%] rounded-2xl rounded-bl-md bg-muted px-3.5 py-2.5 text-sm text-foreground shadow-soft"
                  : "ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-brand-gradient px-3.5 py-2.5 text-sm text-white shadow-glow"
              }
            >
              {m.text}
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + chat.length * 0.35 + 0.2 }}
            className="mr-auto inline-flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-3 shadow-soft animate-typing"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
          </motion.div>
        </div>

        <div className="rounded-xl border border-border bg-background/70 p-2 text-xs text-muted-foreground">
          Captured: <span className="font-medium text-foreground">John Doe</span> ·{" "}
          <span className="font-medium text-foreground">john@example.com</span> ·{" "}
          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
            QUALIFIED
          </span>
        </div>
      </div>

      {/* floating badges */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute -left-6 top-10 hidden rounded-2xl border border-border bg-card px-3 py-2 text-xs shadow-elevated sm:block animate-float"
      >
        <p className="font-semibold">+127% reply rate</p>
        <p className="text-muted-foreground">vs forms</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute -right-4 bottom-12 hidden rounded-2xl border border-border bg-card px-3 py-2 text-xs shadow-elevated sm:block"
        style={{ animation: "float 7s ease-in-out infinite 1s" }}
      >
        <p className="font-semibold">24/7 capture</p>
        <p className="text-muted-foreground">never miss a lead</p>
      </motion.div>
    </motion.div>
  );
}
