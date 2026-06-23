import { X, Check } from "lucide-react";
import { Section } from "@/components/landing/section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { beforeItems, afterItems } from "@/components/landing/landing-data";

export function BeforeAfterSection() {
  return (
    <Section
      eyebrow="Before vs after"
      title="From missed opportunities to a qualified pipeline"
      subtitle="See what changes when every visitor gets an instant, intelligent response."
      tint
    >
      <Stagger className="grid gap-6 lg:grid-cols-2">
        <StaggerItem>
          <Reveal>
            <div className="h-full rounded-2xl border border-border bg-card/80 p-8 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Before QualifyChat
              </p>
              <h3 className="mt-2 text-xl font-bold text-muted-foreground">
                Leads slip through the cracks
              </h3>
              <ul className="mt-6 space-y-4">
                {beforeItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                      <X className="size-3.5" aria-hidden />
                    </span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </StaggerItem>

        <StaggerItem>
          <Reveal delay={0.1}>
            <div className="relative h-full overflow-hidden rounded-2xl border border-primary/30 bg-card p-8 shadow-elevated landing-card-glow">
              <div
                className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-brand-gradient opacity-20 blur-3xl"
                aria-hidden
              />
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                After QualifyChat
              </p>
              <h3 className="mt-2 text-xl font-bold">Every chat becomes actionable</h3>
              <ul className="mt-6 space-y-4">
                {afterItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                      <Check className="size-3.5" aria-hidden />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </StaggerItem>
      </Stagger>
    </Section>
  );
}
