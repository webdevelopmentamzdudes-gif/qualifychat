import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateLeadNotes } from "@/app/actions/leads";
import { LeadSummarySection } from "@/components/dashboard/lead-summary-section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
export default async function LeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!lead) notFound();

  const { data: biz } = await supabase
    .from("businesses")
    .select("user_id")
    .eq("id", lead.business_id)
    .maybeSingle();

  if (!biz || biz.user_id !== user!.id) notFound();

  const { data: turns } = await supabase
    .from("conversations")
    .select("*")
    .eq("lead_id", lead.id)
    .order("created_at", { ascending: true });

  const boundNotes = updateLeadNotes.bind(null, lead.id);
  const displaySummary =
    lead.ai_summary?.trim() || lead.conversation_summary?.trim() || "";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard/leads"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to leads
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {lead.name?.trim() || "Unnamed lead"}
          </h1>
          <p className="text-muted-foreground">
            Created {format(new Date(lead.created_at), "MMM d, yyyy h:mm a")}
          </p>
        </div>
        <Badge className="w-fit">{lead.lead_status}</Badge>
      </div>

      <LeadSummarySection leadId={lead.id} initialSummary={displaySummary} />

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Contact & request</CardTitle>
          <CardDescription>Captured fields from the chat session</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <Row label="Phone" value={lead.phone} />
          <Row label="Email" value={lead.email} />
          <Row label="Service required" value={lead.service_required} />
          <Row label="Preferred date / time" value={lead.preferred_datetime} />
          <Row label="Message / notes from visitor" value={lead.message} />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Full conversation</CardTitle>
          <CardDescription>
            Complete chat between the visitor and your AI assistant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(turns ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No linked messages yet — older sessions may predate lead linkage.
            </p>
          ) : (
            (turns ?? []).map((t) => (
              <div key={t.id} className="space-y-2">
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-indigo-600 px-4 py-2.5 text-sm text-white shadow-sm">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-indigo-100">
                      Visitor · {format(new Date(t.created_at), "h:mm a")}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap">{t.user_message}</p>
                  </div>
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-border bg-muted/50 px-4 py-2.5 text-sm shadow-sm">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Assistant
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-foreground">
                    {t.ai_response}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Internal notes</CardTitle>
          <CardDescription>For your team — not shown to visitors</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={boundNotes} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={4}
                defaultValue={lead.notes ?? ""}
                placeholder="Call back tomorrow, VIP client, etc."
              />
            </div>
            <Button type="submit">Save notes</Button>
          </form>
        </CardContent>
      </Card>

      <Link href="/dashboard/leads" className={cn(buttonVariants({ variant: "ghost" }))}>
        Return to leads
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-foreground">{value?.trim() ? value : "—"}</p>
    </div>
  );
}
