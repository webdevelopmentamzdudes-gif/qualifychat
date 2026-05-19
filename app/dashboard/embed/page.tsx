import { createClient } from "@/lib/supabase/server";
import { CopyEmbedButton } from "@/components/dashboard/copy-embed-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function EmbedPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("id,business_name")
    .eq("user_id", user!.id)
    .maybeSingle();

  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  const chatUrl = business
    ? `${base}/chatbot/${business.id}`
    : `${base}/chatbot/your-business-id`;

  const scriptLine = business
    ? `<script src="${base}/embed.js" data-business-id="${business.id}" async defer></script>`
    : `<script src="${base}/embed.js" data-business-id="YOUR_BUSINESS_ID" async defer></script>`;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Embed code</h1>
        <p className="text-muted-foreground">
          Paste one script tag on your marketing site to show the floating QualifyChat widget.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Public chatbot URL</CardTitle>
          <CardDescription>
            Share this link or load it inside an iframe — no login required for visitors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-border bg-muted/40 p-4 font-mono text-sm break-all">
            {chatUrl}
          </div>
          <CopyEmbedButton text={chatUrl} label="Copy chat URL" />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Embed script</CardTitle>
          <CardDescription>
            Adds a bottom-right launcher that opens your branded assistant on any page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-border bg-muted/40 p-4 font-mono text-sm break-all whitespace-pre-wrap">
            {scriptLine}
          </div>
          <CopyEmbedButton text={scriptLine} label="Copy embed snippet" />
          {business ? (
            <p className="text-xs text-muted-foreground">
              Business:{" "}
              <span className="font-medium text-foreground">
                {business.business_name}
              </span>{" "}
              — ID{" "}
              <span className="font-mono">{business.id}</span>
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
