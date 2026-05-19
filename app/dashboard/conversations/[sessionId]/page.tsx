import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LeadSummarySection } from "@/components/dashboard/lead-summary-section";
import { ConversationThread } from "@/components/dashboard/conversation-thread";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default async function ConversationThreadPage({
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
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();

  if (!business) notFound();

  const { data: turns } = await supabase
    .from("conversations")
    .select("id, user_message, ai_response, created_at, lead_id")
    .eq("business_id", business.id)
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (!turns?.length) notFound();

  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("business_id", business.id)
    .eq("visitor_session_id", sessionId)
    .maybeSingle();

  const displaySummary =
    lead?.ai_summary?.trim() || lead?.conversation_summary?.trim() || "";

  const lastAt = turns[turns.length - 1]?.created_at;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link
          href="/dashboard/conversations"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to conversations
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Chat thread
        </h1>
        <p className="text-muted-foreground">
          {lastAt
            ? `Last activity ${format(new Date(lastAt), "MMM d, yyyy h:mm a")}`
            : null}
          {" · "}
          {turns.length} message{turns.length === 1 ? "" : "s"}
        </p>
      </div>

      {lead ? (
        <LeadSummarySection leadId={lead.id} initialSummary={displaySummary} />
      ) : (
        <Card className="border-dashed shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Conversation overview</CardTitle>
            <CardDescription>
              No lead record linked yet. Summary appears once contact details are
              captured in chat.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {lead ? (
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{lead.lead_status}</Badge>
          <Link
            href={`/dashboard/leads/${lead.id}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Open lead profile
          </Link>
        </div>
      ) : null}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Full conversation</CardTitle>
          <CardDescription>
            Complete transcript between the visitor and your AI assistant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConversationThread turns={turns} />
        </CardContent>
      </Card>
    </div>
  );
}
