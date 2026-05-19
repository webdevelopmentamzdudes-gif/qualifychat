import type { SupabaseClient } from "@supabase/supabase-js";

export async function getBusinessForUser(
  supabase: SupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from("businesses")
    .select("id,business_name,user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}
