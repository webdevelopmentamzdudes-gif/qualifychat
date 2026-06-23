"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/businesses", label: "Businesses" },
  { href: "/admin/leads", label: "All leads" },
  { href: "/admin/users", label: "Users" },
  { href: "/dashboard", label: "← My dashboard" },
];

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger
        className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }))}
        aria-label="Open admin menu"
      >
        <Menu className="size-4" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[min(100vw-2rem,280px)]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-base">
            <Shield className="size-4 text-amber-600" />
            Admin
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                pathname === l.href || pathname.startsWith(l.href + "/")
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
