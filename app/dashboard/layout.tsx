import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { Logo } from "@/components/brand/logo";
import { seedDemoBusinessIfEmpty } from "@/lib/demo-business";
import { LiveAgentAlert } from "@/components/dashboard/live-agent-alert";

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

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <MobileSidebar />
            <div className="lg:hidden">
              <Logo />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-muted-foreground">Signed in</p>
              <p className="text-sm font-medium text-foreground">
                {user?.email ?? "Account"}
              </p>
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
