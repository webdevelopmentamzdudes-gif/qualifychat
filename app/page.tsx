import Link from "next/link";
import type { ComponentType } from "react";
import {
  ArrowRight,
  Bot,
  CalendarClock,
  CheckCircle2,
  LineChart,
  Mail,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { HeroPreview } from "@/components/landing/hero-preview";
import { LandingNav } from "@/components/landing/nav";

const industries = [
  { label: "Clinics", emoji: "🏥" },
  { label: "Salons", emoji: "💇" },
  { label: "Real Estate", emoji: "🏠" },
  { label: "Gyms", emoji: "🏋️" },
  { label: "Restaurants", emoji: "🍽️" },
  { label: "Services", emoji: "🛠️" },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <LandingNav />

      <main className="relative">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-mesh" aria-hidden />
          <div className="absolute inset-0 -z-10 bg-grid opacity-60" aria-hidden />

          <div className="container relative grid gap-12 py-20 lg:grid-cols-2 lg:py-28">
            <div className="flex max-w-xl flex-col justify-center">
              <Reveal>
                <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft backdrop-blur">
                  <Sparkles className="size-3.5 text-primary" aria-hidden />
                  AI sales agent · 24/7 for your website
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Turn website visitors into{" "}
                  <span className="text-gradient animate-gradient">
                    qualified leads
                  </span>{" "}
                  with a 24/7 AI Sales Agent
                </h1>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="mt-5 text-pretty text-lg text-muted-foreground">
                  QualifyChat replies to customer questions, captures contact
                  details, qualifies leads, and helps your team follow up faster.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/signup"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "group bg-brand-gradient text-white shadow-glow transition-all hover:shadow-elevated"
                    )}
                  >
                    Start Free Demo
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="#how"
                    className={cn(
                      buttonVariants({ size: "lg", variant: "outline" })
                    )}
                  >
                    See how it works
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.45}>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    No credit card
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    Demo business included
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    Embed in 60 seconds
                  </span>
                </div>
              </Reveal>
            </div>

            <div className="flex items-center justify-center">
              <HeroPreview />
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <Section
          id="problem"
          eyebrow="The problem"
          title="Missed chats = missed revenue"
          subtitle="Visitors bounce when nobody answers. Manual queues burn your team. Generic bots invent answers and break trust."
        >
          <Stagger className="grid gap-5 sm:grid-cols-3">
            <StaggerItem>
              <ProblemCard
                icon={MessageSquare}
                title="Slow responses"
                body="Customers expect instant answers — especially on mobile."
              />
            </StaggerItem>
            <StaggerItem>
              <ProblemCard
                icon={LineChart}
                title="Funnel leaks"
                body="Interest fades when forms feel long and impersonal."
              />
            </StaggerItem>
            <StaggerItem>
              <ProblemCard
                icon={ShieldCheck}
                title="Risky generic bots"
                body="You need grounded answers from your real services & pricing."
              />
            </StaggerItem>
          </Stagger>
        </Section>

        {/* HOW IT WORKS */}
        <Section
          id="how"
          eyebrow="How it works"
          title="Three steps to a smarter inbox"
          subtitle="Connect your business profile, tune the assistant, and publish. Visitors chat — you get structured leads."
          tint
        >
          <Stagger className="grid gap-5 md:grid-cols-3">
            <StaggerItem>
              <StepCard
                n={1}
                title="Add your business context"
                body="Services, FAQs, hours, tone — everything the AI is allowed to say."
                accent="from-brand-1/15 to-brand-2/15"
              />
            </StaggerItem>
            <StaggerItem>
              <StepCard
                n={2}
                title="Customize the chatbot"
                body="Name, greeting, brand color, and the lead fields you want to collect."
                accent="from-brand-2/15 to-brand-3/15"
              />
            </StaggerItem>
            <StaggerItem>
              <StepCard
                n={3}
                title="Embed or share a link"
                body="Drop one script on your site, or send prospects your public chat URL."
                accent="from-brand-3/15 to-brand-1/15"
              />
            </StaggerItem>
          </Stagger>
        </Section>

        {/* FEATURES */}
        <Section
          id="features"
          eyebrow="Features"
          title="Built to convert visitors, not annoy them"
          subtitle="Every feature is designed to capture, qualify, and route — without making promises the business can't keep."
        >
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <FeatureCard {...f} />
              </StaggerItem>
            ))}
          </Stagger>
        </Section>

        {/* INDUSTRIES */}
        <Section
          id="industries"
          eyebrow="Industries"
          title="Made for local & service businesses"
          subtitle="Where every appointment matters and trust is everything."
          tint
        >
          <Stagger className="flex flex-wrap justify-center gap-3">
            {industries.map((i) => (
              <StaggerItem key={i.label}>
                <span className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated">
                  <span className="text-base" aria-hidden>
                    {i.emoji}
                  </span>
                  {i.label}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </Section>

        {/* PRICING */}
        <Section
          id="pricing"
          eyebrow="Pricing"
          title="Simple, predictable pricing"
          subtitle="Choose a plan that matches your traffic. Upgrade or downgrade anytime."
        >
          <Stagger className="grid gap-6 lg:grid-cols-3">
            <StaggerItem>
              <PricingCard
                name="Starter"
                price="$99"
                description="One chatbot, full dashboard, email alerts."
                features={[
                  "Up to 500 conversations / mo",
                  "Lead capture + qualification",
                  "Email notifications",
                  "Embed widget",
                ]}
              />
            </StaggerItem>
            <StaggerItem>
              <PricingCard
                name="Growth"
                price="$199"
                description="Higher limits, priority routing, team collaboration."
                highlighted
                features={[
                  "Up to 2,500 conversations / mo",
                  "Custom branding & color",
                  "Priority email + analytics",
                  "Team seats (coming)",
                ]}
              />
            </StaggerItem>
            <StaggerItem>
              <PricingCard
                name="Pro"
                price="$399"
                description="Multi-location, advanced routing (roadmap)."
                features={[
                  "Unlimited conversations",
                  "Multiple businesses",
                  "Custom integrations",
                  "Dedicated support",
                ]}
              />
            </StaggerItem>
          </Stagger>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Pricing shown for positioning — billing integration can be added later.
          </p>
        </Section>

        {/* CTA */}
        <section className="container py-20">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center shadow-elevated sm:p-16">
              <div
                className="absolute inset-0 -z-10 bg-brand-gradient opacity-90 animate-gradient"
                aria-hidden
              />
              <div className="pointer-events-none absolute -right-10 -top-10 size-60 rounded-full bg-white/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-10 size-60 rounded-full bg-white/15 blur-3xl" />

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to capture more qualified leads?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/90">
                Create your workspace, load the demo clinic profile, and test the
                chatbot in minutes.
              </p>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "mt-8 bg-white text-primary shadow-elevated hover:bg-white/95"
                )}
              >
                Start Free Demo
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-border bg-card/50">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground sm:flex-row">
          <Logo />
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-foreground">
              Sign in
            </Link>
            <Link href="/signup" className="hover:text-foreground">
              Sign up
            </Link>
            <span>© {new Date().getFullYear()} QualifyChat</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* --------------- Reusable section + cards --------------- */

function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  tint,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  tint?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative border-t border-border py-20",
        tint && "bg-muted/40"
      )}
    >
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-4 text-pretty text-muted-foreground">
                {subtitle}
              </p>
            ) : null}
          </div>
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

function ProblemCard({
  icon: Icon,
  title,
  body,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated">
      <div className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-gradient-soft text-primary transition-transform group-hover:scale-110">
        <Icon className="size-5" aria-hidden />
      </div>
      <h3 className="mt-5 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function StepCard({
  n,
  title,
  body,
  accent,
}: {
  n: number;
  title: string;
  body: string;
  accent: string;
}) {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated">
      <div
        className={cn(
          "absolute -right-12 -top-12 size-32 rounded-full bg-gradient-to-br opacity-70 blur-2xl transition-opacity group-hover:opacity-100",
          accent
        )}
        aria-hidden
      />
      <div className="relative">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-white shadow-glow">
          {n}
        </span>
        <h3 className="mt-5 font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}

const features = [
  {
    icon: Zap,
    title: "Grounded answers",
    description:
      "Responses use your profile only — no invented prices, claims, or promises.",
  },
  {
    icon: CalendarClock,
    title: "Lead capture",
    description:
      "Collect name, phone, email, service, timing, and notes automatically.",
  },
  {
    icon: Bot,
    title: "Qualification logic",
    description:
      "Statuses (Qualified, Needs human, etc.) keep your sales team focused.",
  },
  {
    icon: MessageSquare,
    title: "Conversation history",
    description: "Every turn is saved with summaries for fast review.",
  },
  {
    icon: Sparkles,
    title: "Embeddable widget",
    description:
      "Floating launcher + responsive chat for any website — one script tag.",
  },
  {
    icon: Mail,
    title: "Email alerts",
    description:
      "Qualified leads trigger an email to your business contact address.",
  },
];

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-elevated">
      <div className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow transition-transform group-hover:rotate-3 group-hover:scale-110">
        <Icon className="size-5" aria-hidden />
      </div>
      <h3 className="mt-5 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  description,
  features,
  highlighted,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated",
        highlighted
          ? "border-primary/40 ring-2 ring-primary/20"
          : "border-border"
      )}
    >
      {highlighted ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-gradient px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-glow">
          Most popular
        </span>
      ) : null}
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <p className="mt-6 text-4xl font-bold tracking-tight">
        {price}
        <span className="text-base font-normal text-muted-foreground">/mo</span>
      </p>
      <ul className="mt-6 space-y-2.5 text-sm">
        {features.map((f) => (
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
          "mt-8 block text-center",
          highlighted
            ? "bg-brand-gradient text-white shadow-glow hover:opacity-95"
            : "bg-foreground text-background hover:opacity-90"
        )}
      >
        Choose {name}
      </Link>
    </div>
  );
}
