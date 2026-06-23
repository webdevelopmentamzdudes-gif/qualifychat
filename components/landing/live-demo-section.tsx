"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/landing/section";
import {
  liveDemoScript,
  leadStages,
  type LeadStage,
} from "@/components/landing/landing-data";

type LeadData = {
  name: string;
  email: string;
  phone: string;
  service: string;
  timeline: string;
  status: string;
  summary: string;
};

const emptyLead: LeadData = {
  name: "—",
  email: "—",
  phone: "—",
  service: "—",
  timeline: "—",
  status: "New Visitor",
  summary: "Waiting for conversation…",
};

function leadForStage(stage: LeadStage): LeadData {
  if (stage === "visitor") return { ...emptyLead };
  if (stage === "engaged") {
    return {
      ...emptyLead,
      status: "Engaged",
      service: "Hydrafacial",
      summary: "Visitor asked about availability this week.",
    };
  }
  if (stage === "captured") {
    return {
      name: "Sarah Chen",
      email: "sarah@example.com",
      phone: "555-0142",
      service: "Hydrafacial",
      timeline: "This week",
      status: "Contact Captured",
      summary: "Contact details captured in chat.",
    };
  }
  return {
    name: "Sarah Chen",
    email: "sarah@example.com",
    phone: "555-0142",
    service: "Hydrafacial",
    timeline: "This week",
    status: "Qualified Lead",
    summary:
      "Interested in Hydrafacial pricing and booking this week. Ready for team follow-up.",
  };
}

function stageFromStep(step: number): LeadStage {
  if (step <= 0) return "visitor";
  if (step <= 1) return "engaged";
  if (step <= 3) return "captured";
  return "qualified";
}

export function LiveDemoSection() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);

  const visibleMessages = reduceMotion
    ? liveDemoScript
    : liveDemoScript.slice(0, Math.min(step + 1, liveDemoScript.length));

  const stage = stageFromStep(step);
  const lead = useMemo(() => leadForStage(stage), [stage]);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setStep((s) => (s >= liveDemoScript.length ? 0 : s + 1));
    }, 2200);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <Section
      id="demo"
      eyebrow="Live preview"
      title="AI sales agent in action"
      subtitle="Watch a visitor move from first message to qualified lead — automatically."
      dark
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="rounded-2xl landing-glass p-5 landing-card-glow">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-brand-gradient">
              <Bot className="size-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">GlowCare Clinic</p>
              <p className="text-xs text-white/50">AI qualification demo</p>
            </div>
          </div>
          <div className="mt-4 space-y-2 min-h-[280px]" aria-live="polite">
            {visibleMessages.map((m, i) => (
              <motion.div
                key={`${i}-${m.text.slice(0, 12)}`}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm",
                  m.role === "bot"
                    ? "mr-auto rounded-bl-md bg-white/10 text-white"
                    : "ml-auto rounded-br-md bg-brand-gradient text-white"
                )}
              >
                {m.text}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {leadStages.map((s) => (
              <span
                key={s.key}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-all",
                  stage === s.key
                    ? "bg-brand-gradient text-white shadow-glow"
                    : "bg-white/10 text-white/50"
                )}
              >
                {s.label}
              </span>
            ))}
          </div>

          <motion.div
            key={stage}
            initial={reduceMotion ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-6 landing-card-glow"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-3">
              Lead card
            </p>
            <p className="mt-1 text-lg font-bold">Incoming opportunity</p>

            <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              {(
                [
                  ["Name", lead.name],
                  ["Email", lead.email],
                  ["Phone", lead.phone],
                  ["Service interest", lead.service],
                  ["Timeline", lead.timeline],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="rounded-lg bg-white/5 px-3 py-2">
                  <dt className="text-xs text-white/50">{label}</dt>
                  <dd className="mt-0.5 font-medium text-white">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 rounded-lg bg-white/5 px-3 py-2">
              <dt className="text-xs text-white/50">Lead status</dt>
              <dd className="mt-1">
                <span
                  className={cn(
                    "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    stage === "qualified"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-white/10 text-white/80"
                  )}
                >
                  {lead.status}
                </span>
              </dd>
            </div>

            <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-xs font-medium text-white/50">Summary</p>
              <p className="mt-1 text-sm leading-relaxed text-white/80">
                {lead.summary}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
