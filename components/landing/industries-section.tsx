"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/landing/section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { industries } from "@/components/landing/landing-data";

export function IndustriesSection() {
  return (
    <Section
      id="industries"
      eyebrow="Industries"
      title="Made for local & service businesses"
      subtitle="Where every appointment matters and trust is everything."
    >
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {industries.map((ind) => (
          <StaggerItem key={ind.label}>
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group h-full rounded-2xl border border-border bg-card p-5 shadow-soft landing-card-glow"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden>
                  {ind.emoji}
                </span>
                <h3 className="font-semibold">{ind.label}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {ind.useCase}
              </p>
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
