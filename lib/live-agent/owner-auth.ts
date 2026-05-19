import { createClient } from "@/lib/supabase/server";

export async function getOwnedBusiness() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" as const };

  const { data: business } = await supabase
    .from("businesses")
    .select("id, business_name, user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!business) return { error: "No business profile found" as const };

  return { supabase, user, business };
}
