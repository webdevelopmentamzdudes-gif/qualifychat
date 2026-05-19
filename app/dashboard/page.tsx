import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Users,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Bot,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("id,business_name,business_description,contact_email,updated_at")
    .eq("user_id", user!.id)
    .maybeSingle();

  const businessId = business?.id;

  const stats = businessId
    ? await Promise.all([
        supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("business_id", businessId),
        supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("business_id", businessId)
          .eq("lead_status", "NEW"),
        supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("business_id", businessId)
          .eq("lead_status", "QUALIFIED"),
        supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("business_id", businessId)
          .eq("lead_status", "NEEDS_HUMAN_FOLLOW_UP"),
        supabase
          .from("conversations")
          .select("id,session_id,user_message,ai_response,created_at")
          .eq("business_id", businessId)
          .order("created_at", { ascending: false })
          .limit(5),
      ])
    : [null, null, null, null, null];

  const totalLeads = stats[0]?.count ?? 0;
  const newLeads = stats[1]?.count ?? 0;
  const qualified = stats[2]?.count ?? 0;
  const followUp = stats[3]?.count ?? 0;
  const recent = stats[4]?.data ?? [];

  const { data: chatbotRow } = businessId
    ? await supabase
        .from("chatbot_settings")
        .select("chatbot_name,greeting_message")
        .eq("business_id", businessId)
        .maybeSingle()
    : { data: null };

  const setupComplete =
    !!business?.business_name &&
    !!(business.business_description || "").trim().length;

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-fade-in">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <div
          className="absolute inset-0 -z-10 bg-brand-gradient opacity-90 animate-gradient"
          aria-hidden
        />
        <div className="pointer-events-none absolute -right-10 -top-10 size-60 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 size-60 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 text-white sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="size-3.5" />
              Workspace overview
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back
            </h1>
            <p className="mt-2 max-w-xl text-white/85">
              Here&apos;s what&apos;s happening with{" "}
              <span className="font-semibold text-white">
                {business?.business_name ?? "your business"}
              </span>
              .
            </p>
          </div>
          <Link
            href="/dashboard/embed"
            className={cn(
              buttonVariants(),
              "group bg-white text-primary shadow-elevated hover:bg-white/95"
            )}
          >
            Get embed code
            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total leads"
          value={totalLeads}
          hint="All captured leads"
          icon={<Users className="size-5" aria-hidden />}
          delay={0}
        />
        <StatCard
          title="New leads"
          value={newLeads}
          hint="Status: NEW"
          icon={<UserPlus className="size-5" aria-hidden />}
          delay={0.06}
        />
        <StatCard
          title="Qualified"
          value={qualified}
          hint="Ready for sales follow-up"
          icon={<CheckCircle2 className="size-5" aria-hidden />}
          tone="positive"
          delay={0.12}
        />
        <StatCard
          title="Needs follow-up"
          value={followUp}
          hint="Human recommended"
          icon={<AlertCircle className="size-5" aria-hidden />}
          tone="warning"
          delay={0.18}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden shadow-soft">
          <CardHeader className="border-b border-border bg-muted/30">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="size-4 text-primary" aria-hidden />
              Recent conversations
            </CardTitle>
            <CardDescription>Latest visitor chat turns</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {recent.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-brand-gradient-soft text-primary">
                  <MessageSquare className="size-5" />
                </div>
                <p className="text-sm font-medium">No conversations yet</p>
                <p className="max-w-xs text-xs text-muted-foreground">
                  Share your public chatbot link or embed the widget to start
                  capturing leads.
                </p>
                <Link
                  href="/dashboard/embed"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                >
                  Get embed code
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((row) => (
                  <li
                    key={row.id}
                    className="flex gap-3 p-4 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient-soft text-primary">
                      <Bot className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(row.created_at), "MMM d, yyyy · h:mm a")}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-foreground">
                        <span className="font-medium">Visitor:</span>{" "}
                        {row.user_message}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="size-4 text-primary" aria-hidden />
              Chatbot status
            </CardTitle>
            <CardDescription>Live assistant configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-700">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Online · ready for visitors
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="font-medium">
                {chatbotRow?.chatbot_name ?? "AI Assistant"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Greeting</p>
              <p className="text-sm text-foreground">
                {chatbotRow?.greeting_message ?? "—"}
              </p>
            </div>
            <Link
              href="/dashboard/chatbot"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-full"
              )}
            >
              Edit chatbot settings
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-soft lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="size-4 text-primary" aria-hidden />
              Business setup status
            </CardTitle>
            <CardDescription>
              Keep your profile accurate — the AI uses it as the only source of truth.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Badge
                className={
                  setupComplete
                    ? "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15"
                    : "bg-amber-500/15 text-amber-700 hover:bg-amber-500/15"
                }
                variant="secondary"
              >
                {setupComplete ? "Profile looks good" : "Needs details"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Last updated{" "}
                {business?.updated_at
                  ? format(new Date(business.updated_at), "MMM d, yyyy")
                  : "—"}
              </span>
            </div>
            <Link
              href="/dashboard/business"
              className={cn(
                buttonVariants(),
                "bg-brand-gradient text-white shadow-glow hover:opacity-95"
              )}
            >
              Edit business profile
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
