import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  buildUnifiedMessages,
  getOrCreateChatSession,
  isLiveMode,
} from "@/lib/live-agent/session-service";

export const runtime = "nodejs";

const bodySchema = z.object({
  businessId: z.string().uuid(),
  sessionId: z.string().min(4),
  content: z.string().min(1).max(4000),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { businessId, sessionId, content } = parsed.data;
    const admin = createAdminClient();
    const session = await getOrCreateChatSession(admin, businessId, sessionId);

    if (!isLiveMode(session.mode)) {
      return NextResponse.json(
        { error: "Session is not in live agent mode" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    await admin.from("live_messages").insert({
      business_id: businessId,
      session_id: sessionId,
      sender: "visitor",
      content: content.trim(),
    });

    await admin
      .from("chat_sessions")
      .update({
        last_preview: content.trim().slice(0, 280),
        updated_at: now,
        ...(session.mode === "waiting_agent"
          ? { alert_seen_at: null }
          : {}),
      })
      .eq("id", session.id);

    const messages = await buildUnifiedMessages(admin, businessId, sessionId);

    return NextResponse.json({
      ok: true,
      mode: session.mode,
      messages,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
