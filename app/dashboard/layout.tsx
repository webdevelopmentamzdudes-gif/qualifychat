import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { Logo } from "@/components/brand/logo";
import { seedDemoBusinessIfEmpty } from "@/lib/demo-business";
import { LiveAgentAlert } from "@/components/dashboard/live-agent-alert";
import { isPlatformAdminEmail } from "@/lib/admin/auth";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    try {
      await seedDemoBusinessIfEmpty(supabase, user.id);
    } catch (e) {
      console.error("Demo seed:", e);
    }
  }

  const emailInitial = (user?.email ?? "U").charAt(0).toUpperCase();
  const showAdminLink = isPlatformAdminEmail(user?.email);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex min-h-16 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-border bg-background/95 px-4 py-2 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <MobileSidebar />
            <div className="lg:hidden">
              <Logo />
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            {showAdminLink ? (
              <Link
                href="/admin"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "hidden gap-1.5 border-amber-500/40 text-amber-800 hover:bg-amber-500/10 sm:inline-flex"
                )}
              >
                <Shield className="size-3.5" aria-hidden />
                Admin
              </Link>
            ) : null}
            <div className="hidden max-w-[11rem] flex-col gap-1 text-right sm:flex lg:max-w-[16rem]">
              <span className="text-xs leading-none text-muted-foreground">
                Signed in
              </span>
              <span
                className="truncate text-sm font-medium leading-tight text-foreground"
                title={user?.email ?? "Account"}
              >
                {user?.email ?? "Account"}
              </span>
            </div>
            <div className="flex size-9 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white shadow-glow">
              {emailInitial}
            </div>
            <LogoutButton />
          </div>
        </header>

        <LiveAgentAlert />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
