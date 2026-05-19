import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

function statusVariant(
  s: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (s) {
    case "QUALIFIED":
      return "default";
    case "NEW":
      return "secondary";
    case "NEEDS_HUMAN_FOLLOW_UP":
      return "destructive";
    default:
      return "outline";
  }
}

export default async function LeadsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();

  const leads =
    business?.id != null
      ? (
          await supabase
            .from("leads")
            .select("*")
            .eq("business_id", business.id)
            .order("created_at", { ascending: false })
        ).data ?? []
      : [];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <p className="text-muted-foreground">
          Every captured visitor session appears here with qualification status.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All leads</CardTitle>
          <CardDescription>
            Name, contact fields, status, and conversation summary at capture time.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Summary</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-muted-foreground">
                    No leads yet — open your public chatbot and start a conversation.
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">
                      {lead.name?.trim() || "—"}
                    </TableCell>
                    <TableCell>{lead.phone?.trim() || "—"}</TableCell>
                    <TableCell>{lead.email?.trim() || "—"}</TableCell>
                    <TableCell className="max-w-[140px] truncate">
                      {lead.service_required?.trim() || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(lead.lead_status)}>
                        {lead.lead_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden max-w-xs truncate text-muted-foreground lg:table-cell">
                      {(lead.ai_summary || lead.conversation_summary)?.trim()
                        ? (() => {
                            const s = (
                              lead.ai_summary ||
                              lead.conversation_summary ||
                              ""
                            ).trim();
                            return s.length > 120 ? `${s.slice(0, 120)}…` : s;
                          })()
                        : "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {format(new Date(lead.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                      >
                        View details
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
