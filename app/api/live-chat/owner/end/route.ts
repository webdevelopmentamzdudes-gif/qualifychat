import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOwnedBusiness } from "@/lib/live-agent/owner-auth";

export const runtime = "nodejs";

const bodySchema = z.object({
  sessionId: z.string().min(4),
});

export async function POST(req: Request) {
  const auth = await getOwnedBusiness();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const admin = createAdminClient();
  const businessId = auth.business.id;
  const sessionId = parsed.data.sessionId;
  const now = new Date().toISOString();

  const endText =
    "The live agent has ended this chat. Our AI assistant can continue helping you with any other questions.";

  await admin.from("live_messages").insert({
    business_id: businessId,
    session_id: sessionId,
    sender: "system",
    content: endText,
  });

  const { error } = await admin
    .from("chat_sessions")
    .update({
      mode: "ai",
      owner_user_id: null,
      updated_at: now,
    })
    .eq("business_id", businessId)
    .eq("session_id", sessionId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, mode: "ai", message: endText });
}
