"use client";

import { motion } from "framer-motion";
import {
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Sparkles,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/landing/section";
import { Reveal } from "@/components/motion/reveal";

export function DashboardPreviewSection() {
  return (
    <Section
      id="dashboard"
      eyebrow="Owner dashboard"
      title="Everything your team needs to follow up fast"
      subtitle="Leads, qualification status, summaries, and conversation history — in one clean workspace."
      tint
    >
      <Reveal>
        <motion.div
          whileHover={{ scale: 1.005 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-elevated landing-card-glow"
        >
          <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
            <div className="flex gap-1.5" aria-hidden>
              <span className="size-2.5 rounded-full bg-red-400/80" />
              <span className="size-2.5 rounded-full bg-amber-400/80" />
              <span className="size-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <p className="flex-1 text-center text-xs text-muted-foreground">
              qualifychat.app/dashboard/leads
            </p>
          </div>

          <div className="grid gap-0 lg:grid-cols-5">
            <div className="border-b border-border p-4 lg:col-span-2 lg:border-b-0 lg:border-r">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Lead inbox
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  { name: "Sarah Chen", status: "QUALIFIED", active: true },
                  { name: "James Ortiz", status: "NEW", active: false },
                  { name: "Mia Patel", status: "FOLLOW UP", active: false },
                ].map((l) => (
                  <li
                    key={l.name}
                    className={
                      l.active
                        ? "rounded-lg border border-primary/30 bg-primary/5 px-3 py-2"
                        : "rounded-lg px-3 py-2 text-muted-foreground"
                    }
                  >
                    <p className="text-sm font-medium">{l.name}</p>
                    <p className="text-xs">{l.status}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 lg:col-span-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">Sarah Chen</h3>
                  <Badge className="mt-1 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15">
                    Qualified Lead
                  </Badge>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700">
                  <Bell className="size-3" />
                  High priority
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
                  <Mail className="size-4 text-primary" />
                  sarah@example.com
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
                  <Phone className="size-4 text-primary" />
                  555-0142
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
                  <Sparkles className="size-4 text-primary" />
                  Hydrafacial
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
                  <User className="size-4 text-primary" />
                  This week
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-border bg-muted/20 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <MessageSquare className="size-3.5" />
                  Conversation overview
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Sarah asked about Hydrafacial pricing and availability this week.
                  Contact details captured in chat. Ready for team to confirm slot
                  and send booking link.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </Reveal>
    </Section>
  );
}
