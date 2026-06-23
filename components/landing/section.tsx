import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

type SectionProps = {
  id?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  tint?: boolean;
  dark?: boolean;
  className?: string;
};

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  tint,
  dark,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative border-t border-border py-20 lg:py-24",
        id && "scroll-mt-20",
        tint && !dark && "bg-muted/40",
        dark && "border-white/10 bg-landing-dark text-white",
        className
      )}
    >
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p
              className={cn(
                "text-xs font-semibold uppercase tracking-[0.18em]",
                dark ? "text-brand-3" : "text-primary"
              )}
            >
              {eyebrow}
            </p>
            <h2
              className={cn(
                "mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl",
                dark && "text-white"
              )}
            >
              {title}
            </h2>
            {subtitle ? (
              <p
                className={cn(
                  "mt-4 text-pretty",
                  dark ? "text-white/70" : "text-muted-foreground"
                )}
              >
                {subtitle}
              </p>
            ) : null}
          </div>
        </Reveal>
        <div className="mt-12 lg:mt-16">{children}</div>
      </div>
    </section>
  );
}
