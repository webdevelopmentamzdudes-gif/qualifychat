"use client";

import { motion } from "framer-motion";
import { MessageSquare, FileText, Bot } from "lucide-react";
import { Section } from "@/components/landing/section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { painPoints } from "@/components/landing/landing-data";

const icons = [MessageSquare, FileText, Bot];

export function ProblemSection() {
  return (
    <Section
      id="problem"
      eyebrow="The problem"
      title="Your website is getting traffic. You're just losing leads before they convert."
      subtitle="Visitors leave when nobody answers, forms feel impersonal, and bad bots break trust."
    >
      <Stagger className="grid gap-5 md:grid-cols-3">
        {painPoints.map((p, i) => {
          const Icon = icons[i] ?? MessageSquare;
          return (
            <StaggerItem key={p.title}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group h-full rounded-2xl border border-border bg-card p-6 shadow-soft landing-card-glow transition-shadow"
              >
                <div className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-gradient-soft text-primary transition-transform group-hover:scale-105">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="mt-5 font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </motion.div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
