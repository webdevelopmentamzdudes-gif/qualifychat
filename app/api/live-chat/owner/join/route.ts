import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOwnedBusiness } from "@/lib/live-agent/owner-auth";
import { buildUnifiedMessages } from "@/lib/live-agent/session-service";

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

  const { data: session, error: findErr } = await admin
    .from("chat_sessions")
    .select("*")
    .eq("business_id", businessId)
    .eq("session_id", sessionId)
    .maybeSingle();

  if (findErr || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const joinText = `Hi! I'm joining this chat live from ${auth.business.business_name || "our team"}. How can I help you?`;

  await admin.from("live_messages").insert({
    business_id: businessId,
    session_id: sessionId,
    sender: "owner",
    content: joinText,
  });

  const { data: updated, error } = await admin
    .from("chat_sessions")
    .update({
      mode: "live",
      live_started_at: session.live_started_at || now,
      owner_user_id: auth.user.id,
      alert_seen_at: now,
      updated_at: now,
    })
    .eq("id", session.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const messages = await buildUnifiedMessages(admin, businessId, sessionId);

  return NextResponse.json({
    ok: true,
    session: updated,
    messages,
  });
}
