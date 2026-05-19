"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateChatbotSettings(formData: FormData) {
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

  const fields = [
    "name",
    "phone",
    "email",
    "service_required",
    "preferred_datetime",
    "message",
  ];
  const enabled = fields.filter((f) => formData.get(`field_${f}`) === "on");

  const payload = {
    chatbot_name: String(formData.get("chatbot_name") ?? ""),
    greeting_message: String(formData.get("greeting_message") ?? ""),
    chatbot_color: String(formData.get("chatbot_color") ?? "#2563eb"),
    human_handover_message: String(
      formData.get("human_handover_message") ?? ""
    ),
    lead_capture_fields: enabled.length ? enabled : fields,
  };

  const { error } = await supabase
    .from("chatbot_settings")
    .update(payload)
    .eq("business_id", biz.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/chatbot");
}
