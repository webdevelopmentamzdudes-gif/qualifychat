import { Section } from "@/components/landing/section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { trustPoints } from "@/components/landing/landing-data";

export function TrustSection() {
  return (
    <Section
      id="trust"
      eyebrow="Trust & safety"
      title="AI answers from your business context — not random guesses."
      subtitle="QualifyChat is designed for businesses that can't afford wrong answers or missed accountability."
      dark
    >
      <Stagger className="grid gap-5 sm:grid-cols-2">
        {trustPoints.map((t) => (
          <StaggerItem key={t.title}>
            <div className="h-full rounded-2xl landing-glass p-6 landing-card-glow">
              <div className="inline-flex size-11 items-center justify-center rounded-xl bg-white/10 text-brand-3">
                <t.icon className="size-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-semibold text-white">{t.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                {t.body}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
