"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/landing/section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { features } from "@/components/landing/landing-data";

export function FeaturesSection() {
  return (
    <Section
      id="features"
      eyebrow="Features"
      title="Built to convert visitors, not annoy them"
      subtitle="Every capability is designed to capture, qualify, and route — without breaking trust."
      tint
    >
      <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <StaggerItem key={f.title}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft landing-card-glow"
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-brand-gradient opacity-0 blur-2xl transition-opacity group-hover:opacity-20"
                aria-hidden
              />
              <div className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow transition-transform group-hover:scale-105">
                <f.icon className="size-5" aria-hidden />
              </div>
              {f.tag ? (
                <span className="ml-2 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  {f.tag}
                </span>
              ) : null}
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
