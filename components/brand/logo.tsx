import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  showText?: boolean;
  /** Light text for dark / transparent headers */
  onDark?: boolean;
};

export function Logo({ className, showText = true, onDark = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex size-9 items-center justify-center rounded-xl bg-brand-gradient animate-gradient shadow-glow">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-5 text-white"
          aria-hidden
        >
          <path
            d="M4 6.5C4 5.12 5.12 4 6.5 4h11C18.88 4 20 5.12 20 6.5v8c0 1.38-1.12 2.5-2.5 2.5H13l-4 3v-3H6.5C5.12 17 4 15.88 4 14.5v-8Z"
            fill="currentColor"
            opacity="0.95"
          />
          <circle cx="9" cy="10.5" r="1.2" fill="hsl(244 75% 57%)" />
          <circle cx="12.5" cy="10.5" r="1.2" fill="hsl(244 75% 57%)" />
          <circle cx="16" cy="10.5" r="1.2" fill="hsl(244 75% 57%)" />
        </svg>
        <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/30" />
      </div>
      {showText ? (
        <div className="flex flex-col leading-tight">
          <span
            className={cn(
              "text-[15px] font-semibold tracking-tight",
              onDark ? "text-white" : "text-foreground"
            )}
          >
            Qualify
            <span className={onDark ? "text-brand-3" : "text-gradient"}>Chat</span>
          </span>
          <span
            className={cn(
              "text-[10px] uppercase tracking-[0.18em]",
              onDark ? "text-white/55" : "text-muted-foreground"
            )}
          >
            Chat · Qualify
          </span>
        </div>
      ) : null}
    </div>
  );
}
