"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/landing/section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { howSteps } from "@/components/landing/landing-data";
import { cn } from "@/lib/utils";

export function HowItWorksSection() {
  return (
    <Section
      id="how"
      eyebrow="How it works"
      title="Three steps to a smarter lead inbox"
      subtitle="Connect your business, tune the assistant, and start capturing qualified conversations."
    >
      <div className="relative">
        <div
          className="absolute left-5 top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent md:left-1/2 md:block md:-translate-x-px"
          aria-hidden
        />

        <Stagger className="space-y-8 md:space-y-12">
          {howSteps.map((step, i) => (
            <StaggerItem key={step.n}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={cn(
                  "relative grid gap-6 md:grid-cols-2 md:items-center",
                  i % 2 === 1 && "md:[&>div:first-child]:order-2"
                )}
              >
                <div
                  className={cn(
                    "relative rounded-2xl border border-border bg-card p-6 shadow-soft landing-card-glow md:p-8",
                    i % 2 === 1 ? "md:text-right" : ""
                  )}
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-white shadow-glow">
                    {step.n}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>

                <div
                  className={cn(
                    "flex items-center",
                    i % 2 === 1 ? "md:justify-start" : "md:justify-end"
                  )}
                >
                  <div className="w-full max-w-sm rounded-2xl border border-dashed border-primary/25 bg-brand-gradient-soft p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Product UI
                    </p>
                    <p className="mt-2 font-medium">{step.visual}</p>
                    <div className="mt-4 space-y-2">
                      <div className="h-2 w-3/4 rounded-full bg-primary/20 animate-shimmer" />
                      <div className="h-2 w-full rounded-full bg-primary/15 animate-shimmer" />
                      <div className="h-2 w-5/6 rounded-full bg-primary/10 animate-shimmer" />
                    </div>
                  </div>
                </div>

                <div
                  className="absolute left-5 top-8 hidden size-3 -translate-x-1/2 rounded-full bg-brand-gradient shadow-glow md:left-1/2 md:block"
                  aria-hidden
                />
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
