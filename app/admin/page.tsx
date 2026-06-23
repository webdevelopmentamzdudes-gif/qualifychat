import Link from "next/link";
import { fetchAdminOverview } from "@/lib/admin/queries";
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
import {
  Building2,
  Users,
  MessageSquare,
  CheckCircle2,
  UserCircle,
  ArrowRight,
} from "lucide-react";

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

export default async function AdminOverviewPage() {
  const { counts, recentBusinesses, recentLeads } = await fetchAdminOverview();

  const stats = [
    {
      title: "Businesses",
      value: counts.businesses,
      icon: Building2,
      href: "/admin/businesses",
    },
    {
      title: "Users",
      value: counts.users,
      icon: UserCircle,
      href: "/admin/users",
    },
    {
      title: "Total leads",
      value: counts.leads,
      icon: Users,
      href: "/admin/leads",
    },
    {
      title: "Qualified",
      value: counts.qualifiedLeads,
      icon: CheckCircle2,
      href: "/admin/leads",
    },
    {
      title: "Conversations",
      value: counts.conversations,
      icon: MessageSquare,
      href: "/admin/leads",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Platform overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cross-tenant metrics for all QualifyChat accounts.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(({ title, value, icon: Icon, href }) => (
          <Link key={title} href={href} className="group">
            <Card className="transition-shadow hover:shadow-elevated">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="size-4 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{value.toLocaleString()}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent businesses</CardTitle>
              <CardDescription>Newest sign-ups on the platform</CardDescription>
            </div>
            <Link
              href="/admin/businesses"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              View all
              <ArrowRight className="ml-1 size-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentBusinesses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No businesses yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBusinesses.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">
                        {b.business_name || "Untitled"}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {format(new Date(b.created_at), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent leads</CardTitle>
              <CardDescription>Latest leads across all businesses</CardDescription>
            </div>
            <Link
              href="/admin/leads"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              View all
              <ArrowRight className="ml-1 size-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <p className="text-sm text-muted-foreground">No leads yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLeads.map((lead) => {
                    const businessName =
                      (lead.businesses as { business_name?: string } | null)
                        ?.business_name ?? "—";
                    return (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div className="font-medium">{lead.name || "—"}</div>
                          <div className="text-xs text-muted-foreground">
                            {lead.email || lead.phone || "No contact"}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{businessName}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant(lead.lead_status)}>
                            {lead.lead_status}
                          </Badge>
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
    </div>
  );
}
