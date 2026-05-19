import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  buildUnifiedMessages,
  getOrCreateChatSession,
} from "@/lib/live-agent/session-service";

export const runtime = "nodejs";

const querySchema = z.object({
  businessId: z.string().uuid(),
  sessionId: z.string().min(4),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse({
    businessId: searchParams.get("businessId"),
    sessionId: searchParams.get("sessionId"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  const { businessId, sessionId } = parsed.data;
  const admin = createAdminClient();

  const session = await getOrCreateChatSession(admin, businessId, sessionId);
  const messages = await buildUnifiedMessages(admin, businessId, sessionId);

  return NextResponse.json({
    mode: session.mode,
    messages,
    liveRequestedAt: session.live_requested_at,
    liveStartedAt: session.live_started_at,
  });
}
