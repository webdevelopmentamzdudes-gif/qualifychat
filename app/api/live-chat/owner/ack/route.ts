import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOwnedBusiness } from "@/lib/live-agent/owner-auth";

export const runtime = "nodejs";

/** Mark waiting-agent alerts as seen (stops banner pulse). */
export async function POST() {
  const auth = await getOwnedBusiness();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date().toISOString();

  await admin
    .from("chat_sessions")
    .update({ alert_seen_at: now })
    .eq("business_id", auth.business.id)
    .eq("mode", "waiting_agent")
    .is("alert_seen_at", null);

  return NextResponse.json({ ok: true });
}
