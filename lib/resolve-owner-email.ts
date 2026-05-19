import type { SupabaseClient } from "@supabase/supabase-js";

function isValidEmail(value: string | null | undefined) {
  const s = value?.trim() ?? "";
  return s.length > 3 && s.includes("@");
}

/**
 * Email address for owner alerts: business contact email, else profile, else auth user.
 */
export async function resolveOwnerNotificationEmail(
  admin: SupabaseClient,
  business: { contact_email?: string | null; user_id: string }
): Promise<string | null> {
  if (isValidEmail(business.contact_email)) {
    return business.contact_email!.trim();
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("email")
    .eq("user_id", business.user_id)
    .maybeSingle();

  if (isValidEmail(profile?.email)) {
    return profile!.email!.trim();
  }

  const { data: authData, error } = await admin.auth.admin.getUserById(
    business.user_id
  );
  if (error) {
    console.warn("Could not load owner auth email:", error.message);
    return null;
  }

  if (isValidEmail(authData.user?.email)) {
    return authData.user!.email!.trim();
  }

  return null;
}
