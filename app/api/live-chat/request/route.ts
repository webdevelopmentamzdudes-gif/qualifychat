import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { requestLiveAgent } from "@/lib/live-agent/session-service";
import { notifyOwnerLiveAgentRequest } from "@/lib/notify-owner";

export const runtime = "nodejs";

const bodySchema = z.object({
  businessId: z.string().uuid(),
  sessionId: z.string().min(4),
  preview: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { session, isNewRequest } = await requestLiveAgent(
      admin,
      parsed.data.businessId,
      parsed.data.sessionId,
      parsed.data.preview || "Live agent requested"
    );

    if (isNewRequest) {
      await notifyOwnerLiveAgentRequest(admin, parsed.data.businessId, {
        sessionId: parsed.data.sessionId,
        preview: parsed.data.preview || "Live agent requested",
      });
    }

    return NextResponse.json({
      ok: true,
      mode: session.mode,
      message:
        "You requested a live team member. Please wait — someone from our team will join this chat shortly.",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Could not request live agent" },
      { status: 500 }
    );
  }
}
