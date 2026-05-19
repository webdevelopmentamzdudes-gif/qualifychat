import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";
import { Logo } from "@/components/brand/logo";
import { CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      {/* Right form side first on small screens */}
      <div className="relative flex flex-col bg-background lg:order-1">
        <header className="flex items-center justify-between p-6 lg:hidden">
          <Link href="/">
            <Logo />
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Sign in
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md animate-fade-in">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                Create your workspace
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Demo business included — ready on first dashboard visit.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated">
              <SignupForm />
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already registered?{" "}
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Visual side */}
      <div className="relative hidden overflow-hidden bg-brand-gradient animate-gradient lg:order-2 lg:block">
        <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
        <div className="absolute -right-20 -top-20 size-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 size-96 -translate-x-1/3 translate-y-1/3 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <Link href="/" className="inline-flex items-center text-white">
            <Logo />
          </Link>
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.18em] text-white/70">
              Get started
            </p>
            <h2 className="text-balance text-3xl font-bold leading-tight">
              Capture leads while you sleep.
              <br />
              <span className="text-white/80">Try it in under 2 minutes.</span>
            </h2>
            <ul className="space-y-3 text-white/90">
              {[
                "Demo business auto-loaded",
                "Embed the widget anywhere",
                "Qualified leads via email",
              ].map((line) => (
                <li key={line} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} QualifyChat
          </p>
        </div>
      </div>
    </div>
  );
}
