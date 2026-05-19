import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOwnedBusiness } from "@/lib/live-agent/owner-auth";
import { buildUnifiedMessages } from "@/lib/live-agent/session-service";

export const runtime = "nodejs";

const bodySchema = z.object({
  sessionId: z.string().min(4),
  content: z.string().min(1).max(4000),
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
  const { sessionId, content } = parsed.data;

  const { data: session } = await admin
    .from("chat_sessions")
    .select("id, mode")
    .eq("business_id", businessId)
    .eq("session_id", sessionId)
    .maybeSingle();

  if (!session || session.mode !== "live") {
    return NextResponse.json(
      { error: "Join the chat first before sending messages" },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();

  await admin.from("live_messages").insert({
    business_id: businessId,
    session_id: sessionId,
    sender: "owner",
    content: content.trim(),
  });

  await admin
    .from("chat_sessions")
    .update({
      last_preview: content.trim().slice(0, 280),
      updated_at: now,
    })
    .eq("id", session.id);

  const messages = await buildUnifiedMessages(admin, businessId, sessionId);

  return NextResponse.json({ ok: true, messages });
}
