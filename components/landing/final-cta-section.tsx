import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function FinalCtaSection() {
  return (
    <section className="container py-20 lg:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-landing-dark p-10 text-center shadow-elevated sm:p-16">
          <div
            className="pointer-events-none absolute inset-0 landing-hero-grid opacity-60"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-10 -top-10 size-60 rounded-full bg-brand-1/30 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-12 -left-10 size-60 rounded-full bg-brand-2/20 blur-3xl"
            aria-hidden
          />

          <h2 className="relative text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Stop letting ready-to-buy visitors leave without a conversation.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-white/70">
            Launch your 24/7 AI sales agent, capture qualified leads, and give
            your team cleaner follow-up opportunities.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group bg-white text-primary shadow-elevated hover:bg-white/95"
              )}
            >
              Start Free Demo
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#how"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              )}
            >
              <Play className="mr-2 size-4" aria-hidden />
              See How It Works
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
