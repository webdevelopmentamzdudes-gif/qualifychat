import { fetchAdminLeads } from "@/lib/admin/queries";
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

export default async function AdminLeadsPage() {
  const leads = await fetchAdminLeads();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          All leads
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Showing up to 200 most recent leads across all businesses.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform leads</CardTitle>
          <CardDescription>
            {leads.length} lead{leads.length === 1 ? "" : "s"} loaded
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {leads.length === 0 ? (
            <p className="text-sm text-muted-foreground">No leads yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => {
                  const businessName =
                    (lead.businesses as { business_name?: string } | null)
                      ?.business_name ?? "—";
                  return (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">
                        {lead.name || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{lead.email || "—"}</div>
                        {lead.phone ? (
                          <div className="text-xs text-muted-foreground">
                            {lead.phone}
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-sm">{businessName}</TableCell>
                      <TableCell className="max-w-[12rem] truncate text-sm text-muted-foreground">
                        {lead.service_required || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(lead.lead_status)}>
                          {lead.lead_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {format(new Date(lead.created_at), "MMM d, yyyy HH:mm")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
