"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Users,
  MessageSquare,
  Headphones,
  Bot,
  Code,
  Settings,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/business", label: "Business Profile", icon: Building2 },
  { href: "/dashboard/knowledge", label: "Knowledge Base", icon: BookOpen },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  {
    href: "/dashboard/conversations",
    label: "Conversations",
    icon: MessageSquare,
  },
  {
    href: "/dashboard/live-chat",
    label: "Live Chat",
    icon: Headphones,
  },
  { href: "/dashboard/chatbot", label: "Chatbot Settings", icon: Bot },
  { href: "/dashboard/embed", label: "Embed Code", icon: Code },
  { href: "/dashboard/account", label: "Account Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <Logo />
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                active
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {active ? (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 -z-10 rounded-lg bg-brand-gradient shadow-glow"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              ) : null}
              <Icon className="size-4 shrink-0" aria-hidden />
              <span className="relative">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="size-3.5" aria-hidden />
          View landing page
        </Link>
      </div>
    </aside>
  );
}
