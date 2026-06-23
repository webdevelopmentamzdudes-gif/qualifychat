import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Section } from "@/components/landing/section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { pricingPlans } from "@/components/landing/landing-data";

export function PricingSection() {
  return (
    <Section
      id="pricing"
      eyebrow="Pricing"
      title="Simple, predictable pricing"
      subtitle="Choose a plan that matches your traffic. Upgrade or downgrade anytime."
    >
      <Stagger className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
        {pricingPlans.map((plan) => (
          <StaggerItem key={plan.name} className="h-full">
            <div
              className={cn(
                "relative flex h-full flex-col rounded-2xl border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 landing-card-glow",
                plan.highlighted
                  ? "border-primary/40 ring-2 ring-primary/20 scale-[1.02] lg:scale-105"
                  : "border-border"
              )}
            >
              {plan.highlighted ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-gradient px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-glow">
                  Most popular
                </span>
              ) : null}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <p className="mt-6 text-4xl font-bold tracking-tight">
                {plan.price}
                <span className="text-base font-normal text-muted-foreground">
                  /mo
                </span>
              </p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants(),
                  "mt-8 block text-center transition-transform hover:scale-[1.02]",
                  plan.highlighted
                    ? "bg-brand-gradient text-white shadow-glow hover:opacity-95"
                    : "bg-foreground text-background hover:opacity-90"
                )}
              >
                Start with {plan.name}
              </Link>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        Pricing shown for positioning — billing integration can be added later.
      </p>
    </Section>
  );
}
