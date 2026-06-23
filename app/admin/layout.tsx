import { requirePlatformAdmin } from "@/lib/admin/require-admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { Logo } from "@/components/brand/logo";
import { Shield } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requirePlatformAdmin();
  const emailInitial = (user.email ?? "A").charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex min-h-16 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-border bg-background/95 px-4 py-2 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <AdminMobileNav />
            <div className="lg:hidden">
              <Logo />
            </div>
            <span className="hidden items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-800 sm:inline-flex">
              <Shield className="size-3.5" aria-hidden />
              Admin portal
            </span>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden max-w-[11rem] flex-col gap-1 text-right sm:flex lg:max-w-[16rem]">
              <span className="text-xs leading-none text-muted-foreground">
                Platform admin
              </span>
              <span
                className="truncate text-sm font-medium leading-tight text-foreground"
                title={user.email ?? "Account"}
              >
                {user.email}
              </span>
            </div>
            <div className="flex size-9 items-center justify-center rounded-full bg-amber-500 text-sm font-semibold text-white">
              {emailInitial}
            </div>
            <LogoutButton />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
