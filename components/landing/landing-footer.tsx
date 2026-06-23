import Link from "next/link";
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
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} QualifyChat. All rights reserved.
      </div>
    </footer>
  );
}
