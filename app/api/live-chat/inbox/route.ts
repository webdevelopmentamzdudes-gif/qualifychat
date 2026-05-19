import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOwnedBusiness } from "@/lib/live-agent/owner-auth";

export const runtime = "nodejs";

export async function GET() {
  const auth = await getOwnedBusiness();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: sessions, error } = await admin
    .from("chat_sessions")
    .select("*")
    .eq("business_id", auth.business.id)
    .in("mode", ["waiting_agent", "live"])
    .order("updated_at", { ascending: false })
    .limit(30);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const waiting =
    sessions?.filter((s) => s.mode === "waiting_agent") ?? [];
  const live = sessions?.filter((s) => s.mode === "live") ?? [];
  const unseenWaiting = waiting.filter((s) => !s.alert_seen_at).length;

  return NextResponse.json({
    waiting,
    live,
    unseenCount: unseenWaiting,
    totalPending: waiting.length,
  });
}
