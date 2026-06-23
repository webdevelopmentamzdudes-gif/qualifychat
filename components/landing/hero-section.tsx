"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Play, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { HeroPreview } from "@/components/landing/hero-preview";
import { heroStats } from "@/components/landing/landing-data";

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-landing-dark text-white">
      <div className="absolute inset-0 landing-hero-grid" aria-hidden />
      <div
        className="pointer-events-none absolute -left-32 top-20 size-96 rounded-full bg-brand-1/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 size-96 rounded-full bg-brand-2/15 blur-3xl"
        aria-hidden
      />

      <div className="container relative grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <div className="flex max-w-xl flex-col justify-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 self-start rounded-full landing-glass px-3 py-1 text-xs font-medium text-white/80">
              <Sparkles className="size-3.5 text-brand-3" aria-hidden />
              AI sales agent · 24/7 for your website
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              Turn Website Visitors Into{" "}
              <span className="bg-gradient-to-r from-[hsl(var(--brand-1))] via-[hsl(var(--brand-2))] to-[hsl(var(--brand-3))] bg-clip-text text-transparent">
                Qualified Leads
              </span>{" "}
              — Automatically
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-5 text-pretty text-lg text-white/70">
              QualifyChat is a 24/7 AI sales agent that answers questions,
              captures contact details, qualifies intent, and sends your team
              ready-to-follow-up leads.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group bg-brand-gradient text-white shadow-glow transition-all hover:shadow-elevated hover:opacity-95"
                )}
              >
                Start Free Demo
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#demo"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                )}
              >
                <Play className="mr-2 size-4" aria-hidden />
                Watch How It Works
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400" />
                No credit card required
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400" />
                Embed in 60 seconds
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400" />
                Built for service businesses
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {heroStats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  className="rounded-xl landing-glass px-4 py-3"
                >
                  <p className="text-sm font-semibold text-white">{s.label}</p>
                  <p className="mt-0.5 text-xs text-white/55">{s.sub}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="flex items-center justify-center lg:justify-end">
          <HeroPreview variant="dark" />
        </div>
      </div>
    </section>
  );
}
