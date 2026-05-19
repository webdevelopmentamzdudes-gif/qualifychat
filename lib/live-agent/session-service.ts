import type { SupabaseClient } from "@supabase/supabase-js";
import type { ChatSessionMode, UnifiedChatMessage } from "@/lib/live-agent/types";

export async function getOrCreateChatSession(
  admin: SupabaseClient,
  businessId: string,
  sessionId: string
) {
  const { data: existing } = await admin
    .from("chat_sessions")
    .select("*")
    .eq("business_id", businessId)
    .eq("session_id", sessionId)
    .maybeSingle();

  if (existing) return existing;

  const { data: created, error } = await admin
    .from("chat_sessions")
    .insert({
      business_id: businessId,
      session_id: sessionId,
      mode: "ai",
    })
    .select("*")
    .single();

  if (error) throw error;
  return created;
}

export async function requestLiveAgent(
  admin: SupabaseClient,
  businessId: string,
  sessionId: string,
  preview: string
): Promise<{ session: Awaited<ReturnType<typeof getOrCreateChatSession>>; isNewRequest: boolean }> {
  const session = await getOrCreateChatSession(admin, businessId, sessionId);

  if (session.mode === "live" || session.mode === "waiting_agent") {
    return { session, isNewRequest: false };
  }

  const now = new Date().toISOString();
  const systemText =
    "You requested a live team member. Please wait — someone from our team will join this chat shortly.";

  await admin.from("live_messages").insert({
    business_id: businessId,
    session_id: sessionId,
    sender: "system",
    content: systemText,
  });

  const { data: updated, error } = await admin
    .from("chat_sessions")
    .update({
      mode: "waiting_agent",
      live_requested_at: now,
      alert_seen_at: null,
      last_preview: preview.slice(0, 280),
      updated_at: now,
    })
    .eq("id", session.id)
    .select("*")
    .single();

  if (error) throw error;

  await admin
    .from("leads")
    .update({
      lead_status: "NEEDS_HUMAN_FOLLOW_UP",
      updated_at: now,
    })
    .eq("business_id", businessId)
    .eq("visitor_session_id", sessionId);

  return { session: updated, isNewRequest: true };
}

export async function buildUnifiedMessages(
  admin: SupabaseClient,
  businessId: string,
  sessionId: string
): Promise<UnifiedChatMessage[]> {
  const { data: turns } = await admin
    .from("conversations")
    .select("id, user_message, ai_response, created_at")
    .eq("business_id", businessId)
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  const { data: live } = await admin
    .from("live_messages")
    .select("id, sender, content, created_at")
    .eq("business_id", businessId)
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  const out: UnifiedChatMessage[] = [];

  for (const t of turns ?? []) {
    if (t.user_message?.trim()) {
      out.push({
        id: `c-u-${t.id}`,
        role: "user",
        content: t.user_message,
        createdAt: t.created_at,
      });
    }
    if (t.ai_response?.trim()) {
      out.push({
        id: `c-a-${t.id}`,
        role: "assistant",
        content: t.ai_response,
        createdAt: t.created_at,
      });
    }
  }

  for (const m of live ?? []) {
    const role =
      m.sender === "visitor"
        ? "user"
        : m.sender === "owner"
          ? "agent"
          : "system";
    out.push({
      id: m.id,
      role,
      content: m.content,
      createdAt: m.created_at,
    });
  }

  out.sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return out;
}

export function isLiveMode(mode: ChatSessionMode) {
  return mode === "waiting_agent" || mode === "live";
}
