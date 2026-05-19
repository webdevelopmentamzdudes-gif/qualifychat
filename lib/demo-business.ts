import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Seeds the GlowCare Clinic demo profile for a new account when they have no businesses yet.
 */
export async function seedDemoBusinessIfEmpty(
  supabase: SupabaseClient,
  userId: string
) {
  const { count, error: countError } = await supabase
    .from("businesses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError) throw countError;
  if ((count ?? 0) > 0) return null;

  const { data: biz, error: bizError } = await supabase
    .from("businesses")
    .insert({
      user_id: userId,
      business_name: "GlowCare Clinic",
      industry: "Skin Clinic",
      business_description:
        "GlowCare Clinic provides professional skin treatments, consultations, and beauty services.",
      services_offered: `- Acne treatment
- Hydrafacial
- Laser hair removal
- Pigmentation treatment
- Skin consultation`,
      pricing_details: `- Consultation starts from $30
- Hydrafacial starts from $80
- Laser hair removal pricing depends on area`,
      faqs: `Q: Do I need an appointment?
A: Yes, appointments are recommended.

Q: Are consultations available online?
A: Yes, online consultations are available.

Q: Where are you located?
A: Main city center branch.`,
      working_hours: "Monday to Saturday, 10 AM to 7 PM",
      location: "Main city center branch",
      contact_email: "hello@glowcare.example.com",
      contact_phone: "+1 (555) 010-0200",
      website_url: "https://glowcare.example.com",
      tone_of_voice: "Friendly",
    })
    .select("id")
    .single();

  if (bizError) throw bizError;

  const { error: settingsError } = await supabase.from("chatbot_settings").insert({
    business_id: biz.id,
    chatbot_name: "AI Assistant",
    greeting_message: "Hi! How can I help you today?",
    chatbot_color: "#2563eb",
    human_handover_message:
      "Thanks for sharing the details. Our team will review your request and contact you shortly.",
    lead_capture_fields: [
      "name",
      "phone",
      "email",
      "service_required",
      "preferred_datetime",
      "message",
    ],
  });

  if (settingsError) throw settingsError;

  return biz.id as string;
}
