import { fetchAdminBusinesses } from "@/lib/admin/queries";
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
import { format } from "date-fns";

export default async function AdminBusinessesPage() {
  const businesses = await fetchAdminBusinesses();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Businesses
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {businesses.length} business{businesses.length === 1 ? "" : "es"} on
          the platform.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All businesses</CardTitle>
          <CardDescription>
            Owner account, contact details, and lead counts
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {businesses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No businesses yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Leads</TableHead>
                  <TableHead className="text-right">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <div className="font-medium">
                        {b.business_name || "Untitled"}
                      </div>
                      {b.website_url ? (
                        <a
                          href={b.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          {b.website_url.replace(/^https?:\/\//, "")}
                        </a>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {b.industry || "—"}
                    </TableCell>
                    <TableCell className="text-sm">{b.ownerEmail}</TableCell>
                    <TableCell className="text-sm">
                      {b.contact_email || "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {b.leadCount}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {format(new Date(b.created_at), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
