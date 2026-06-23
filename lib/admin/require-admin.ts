import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isPlatformAdminEmail } from "@/lib/admin/auth";

/** Server layout/page guard — redirects non-admins away from /admin. */
export async function requirePlatformAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectedFrom=/admin");
  }

  if (!isPlatformAdminEmail(user.email)) {
    redirect("/dashboard");
  }

  return user;
}
