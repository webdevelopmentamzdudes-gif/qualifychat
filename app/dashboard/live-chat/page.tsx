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

export default async function LiveChatInboxPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();

  const sessions =
    business?.id != null
      ? (
          await supabase
            .from("chat_sessions")
            .select("*")
            .eq("business_id", business.id)
            .in("mode", ["waiting_agent", "live"])
            .order("updated_at", { ascending: false })
        ).data ?? []
      : [];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live chat inbox</h1>
        <p className="text-muted-foreground">
          Customers who asked for a human appear here. Join to chat from your
          dashboard — otherwise the AI handles everything.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Waiting & active</CardTitle>
          <CardDescription>
            Open a thread and click Join chat to talk live with the visitor.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No live agent requests right now. When a visitor clicks &quot;Talk
              to a live agent&quot; or asks for a human, you will see an alert
              here.
            </p>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        s.mode === "waiting_agent" ? "destructive" : "default"
                      }
                    >
                      {s.mode === "waiting_agent"
                        ? "Waiting for you"
                        : "Live now"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(s.updated_at), "MMM d, h:mm a")}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-foreground">
                    {s.last_preview || "Live agent requested"}
                  </p>
                </div>
                <Link
                  href={`/dashboard/live-chat/${encodeURIComponent(s.session_id)}`}
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  {s.mode === "waiting_agent" ? "Join chat" : "Open chat"}
                </Link>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
