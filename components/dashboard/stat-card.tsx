"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: number;
  hint: string;
  icon: ReactNode;
  delay?: number;
  tone?: "default" | "positive" | "warning";
};

const tones = {
  default: "from-brand-1/15 to-brand-2/15 text-primary",
  positive: "from-emerald-500/15 to-emerald-400/10 text-emerald-600",
  warning: "from-amber-500/15 to-amber-400/10 text-amber-600",
};

export function StatCard({
  title,
  value,
  hint,
  icon,
  delay = 0,
  tone = "default",
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-elevated"
    >
      <div
        className={cn(
          "absolute -right-10 -top-10 size-32 rounded-full bg-gradient-to-br blur-2xl transition-opacity group-hover:opacity-80",
          tones[tone],
          "opacity-50"
        )}
        aria-hidden
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <p className="mt-3 text-3xl font-bold tracking-tight">
            <AnimatedNumber value={value} />
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-soft",
            tones[tone]
          )}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {value.toLocaleString()}
    </motion.span>
  );
}
