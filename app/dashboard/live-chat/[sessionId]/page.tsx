import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OwnerLiveChat } from "@/components/dashboard/owner-live-chat";
import type { ChatSessionMode } from "@/lib/live-agent/types";
import { format } from "date-fns";

export default async function LiveChatSessionPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const sessionId = decodeURIComponent(params.sessionId);
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("id, business_name")
    .eq("user_id", user!.id)
    .maybeSingle();

  if (!business) notFound();

  const { data: session } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("business_id", business.id)
    .eq("session_id", sessionId)
    .maybeSingle();

  if (!session) notFound();

  const { data: lead } = await supabase
    .from("leads")
    .select("id, name, phone, email")
    .eq("business_id", business.id)
    .eq("visitor_session_id", sessionId)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/dashboard/live-chat"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Live chat inbox
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          Live chat with visitor
        </h1>
        <p className="text-sm text-muted-foreground">
          Session started{" "}
          {session.live_requested_at
            ? format(new Date(session.live_requested_at), "MMM d, h:mm a")
            : format(new Date(session.created_at), "MMM d, h:mm a")}
        </p>
        {lead ? (
          <p className="mt-1 text-sm">
            Lead:{" "}
            <span className="font-medium">
              {lead.name?.trim() || lead.phone || lead.email || "Captured"}
            </span>
            {" · "}
            <Link
              href={`/dashboard/leads/${lead.id}`}
              className="text-primary underline-offset-4 hover:underline"
            >
              View lead
            </Link>
          </p>
        ) : null}
      </div>

      <OwnerLiveChat
        sessionId={sessionId}
        businessId={business.id}
        initialMode={session.mode as ChatSessionMode}
      />
    </div>
  );
}
