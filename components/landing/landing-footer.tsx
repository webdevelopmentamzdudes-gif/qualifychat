import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";

const footerLinks = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "/login", label: "Sign in" },
  { href: "/signup", label: "Sign up" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container flex flex-col gap-8 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            24/7 AI sales agent for service businesses. Capture, qualify, and
            follow up faster.
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"
          aria-label="Footer"
        >
          {footerLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-border py-5">
        <div className="container flex flex-col items-center gap-3 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} QualifyChat. All rights reserved.</p>
          <div className="flex flex-col items-center gap-1.5 sm:items-end">
            <p>
              Powered by{" "}
              <span className="font-medium text-foreground">Atif Yasin Fattani</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-end">
              <a
                href="mailto:atiffattani021@gmail.com"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <Mail className="size-3.5" aria-hidden />
                atiffattani021@gmail.com
              </a>
              <a
                href="tel:+923152690584"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <Phone className="size-3.5" aria-hidden />
                +92 315 2690584
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
