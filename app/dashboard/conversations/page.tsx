import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
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

type ConvRow = {
  id: string;
  session_id: string;
  user_message: string;
  ai_response: string;
  created_at: string;
  lead_id: string | null;
};

export default async function ConversationsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();

  const rows: ConvRow[] =
    business?.id != null
      ? (
          await supabase
            .from("conversations")
            .select("id,session_id,user_message,ai_response,created_at,lead_id")
            .eq("business_id", business.id)
            .order("created_at", { ascending: false })
            .limit(120)
        ).data ?? []
      : [];

  const leadSummaries = new Map<string, string>();
  if (business?.id) {
    const { data: leads } = await supabase
      .from("leads")
      .select("id, visitor_session_id, ai_summary, conversation_summary")
      .eq("business_id", business.id);

    for (const lead of leads ?? []) {
      const summary =
        lead.ai_summary?.trim() || lead.conversation_summary?.trim() || "";
      if (lead.visitor_session_id && summary) {
        leadSummaries.set(lead.visitor_session_id, summary);
      }
    }
  }

  const sessions = new Map<
    string,
    {
      lastAt: string;
      preview: string;
      leadId: string | null;
      turnCount: number;
    }
  >();

  for (const r of rows) {
    const sid = r.session_id || r.id;
    const prev = sessions.get(sid);
    const ts = r.created_at;
    if (!prev) {
      sessions.set(sid, {
        lastAt: ts,
        preview: r.user_message,
        leadId: r.lead_id,
        turnCount: 1,
      });
    } else {
      prev.turnCount += 1;
      if (ts > prev.lastAt) {
        prev.lastAt = ts;
        prev.preview = r.user_message;
      }
      if (r.lead_id) prev.leadId = r.lead_id;
    }
  }

  const grouped = Array.from(sessions.entries()).sort((a, b) =>
    a[1].lastAt < b[1].lastAt ? 1 : -1
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
        <p className="text-muted-foreground">
          Visitor chat threads with AI summaries and full transcripts.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Threads</CardTitle>
          <CardDescription>
            Open a thread to read the AI overview and full chat history.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {grouped.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No conversations recorded yet. Share your chatbot link or embed
              code to start receiving messages.
            </p>
          ) : (
            grouped.map(([sessionId, meta]) => {
              const aiSummary = leadSummaries.get(sessionId);
              return (
                <div
                  key={sessionId}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(meta.lastAt), "MMM d, yyyy h:mm a")}
                      </p>
                      <Badge variant="secondary" className="text-[10px]">
                        {meta.turnCount} message
                        {meta.turnCount === 1 ? "" : "s"}
                      </Badge>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm font-medium text-foreground">
                      {meta.preview}
                    </p>
                    {aiSummary ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {aiSummary}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Open thread to view or generate AI summary.
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Link
                      href={`/dashboard/conversations/${encodeURIComponent(sessionId)}`}
                      className={cn(buttonVariants({ variant: "default", size: "sm" }))}
                    >
                      View thread
                    </Link>
                    {meta.leadId ? (
                      <Link
                        href={`/dashboard/leads/${meta.leadId}`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" })
                        )}
                      >
                        View lead
                      </Link>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
