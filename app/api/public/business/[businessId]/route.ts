import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Public config for embed + chat page (no secrets). Served only from the server.
 */
export async function GET(
  _req: Request,
  context: { params: { businessId: string } }
) {
  const { businessId } = context.params;

  try {
    const admin = createAdminClient();
    const { data: business, error: bErr } = await admin
      .from("businesses")
      .select("id,business_name")
      .eq("id", businessId)
      .maybeSingle();

    if (bErr || !business) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { data: settings, error: sErr } = await admin
      .from("chatbot_settings")
      .select(
        "chatbot_name,greeting_message,chatbot_color,human_handover_message"
      )
      .eq("business_id", businessId)
      .maybeSingle();

    if (sErr || !settings) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      businessId: business.id,
      businessName: business.business_name,
      chatbotName: settings.chatbot_name,
      greetingMessage: settings.greeting_message,
      chatbotColor: settings.chatbot_color,
      humanHandoverMessage: settings.human_handover_message,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
