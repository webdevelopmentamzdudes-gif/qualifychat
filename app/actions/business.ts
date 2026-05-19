"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateBusinessProfile(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: biz } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!biz) throw new Error("No business found");

  const payload = {
    business_name: String(formData.get("business_name") ?? ""),
    industry: String(formData.get("industry") ?? ""),
    business_description: String(formData.get("business_description") ?? ""),
    services_offered: String(formData.get("services_offered") ?? ""),
    pricing_details: String(formData.get("pricing_details") ?? ""),
    faqs: String(formData.get("faqs") ?? ""),
    working_hours: String(formData.get("working_hours") ?? ""),
    location: String(formData.get("location") ?? ""),
    contact_email: String(formData.get("contact_email") ?? ""),
    contact_phone: String(formData.get("contact_phone") ?? ""),
    website_url: String(formData.get("website_url") ?? ""),
    tone_of_voice: String(formData.get("tone_of_voice") ?? "Professional"),
  };

  const { error } = await supabase
    .from("businesses")
    .update(payload)
    .eq("id", biz.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/business");
}
