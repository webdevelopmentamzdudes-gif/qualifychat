import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/brand/logo";
import { CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      {/* Left visual side */}
      <div className="relative hidden overflow-hidden bg-brand-gradient animate-gradient lg:block">
        <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
        <div className="absolute -left-20 -top-20 size-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 size-96 translate-x-1/3 translate-y-1/3 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <Link href="/" className="inline-flex items-center text-white">
            <Logo />
          </Link>
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.18em] text-white/70">
              Welcome back
            </p>
            <h2 className="text-balance text-3xl font-bold leading-tight">
              Your AI sales agent never sleeps.
              <br />
              <span className="text-white/80">Pick up where you left off.</span>
            </h2>
            <ul className="space-y-3 text-white/90">
              {[
                "See new leads in real time",
                "Tune the chatbot in seconds",
                "Track conversations end-to-end",
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

      {/* Right form side */}
      <div className="relative flex flex-col bg-background">
        <header className="flex items-center justify-between p-6 lg:hidden">
          <Link href="/">
            <Logo />
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Sign up
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md animate-fade-in">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Welcome back — manage your AI assistant and leads.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated">
              <Suspense
                fallback={
                  <p className="text-sm text-muted-foreground">Loading…</p>
                }
              >
                <LoginForm />
              </Suspense>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              No account?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
