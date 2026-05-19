import { createClient } from "@/lib/supabase/server";
import { updateChatbotSettings } from "@/app/actions/chatbot";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const FIELD_OPTS = [
  { id: "name", label: "Name" },
  { id: "phone", label: "Phone" },
  { id: "email", label: "Email" },
  { id: "service_required", label: "Service required" },
  { id: "preferred_datetime", label: "Preferred date / time" },
  { id: "message", label: "Message / notes" },
] as const;

export default async function ChatbotSettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();

  const { data: settings } = business?.id
    ? await supabase
        .from("chatbot_settings")
        .select("*")
        .eq("business_id", business.id)
        .maybeSingle()
    : { data: null };

  if (!settings || !business) {
    return (
      <p className="text-muted-foreground">
        Chatbot settings not found — refresh after your business profile is created.
      </p>
    );
  }

  const enabled = new Set(
    (settings.lead_capture_fields as string[] | null) ?? FIELD_OPTS.map((f) => f.id)
  );

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Chatbot settings</h1>
        <p className="text-muted-foreground">
          Brand your widget and tune how leads are collected from visitors.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Assistant branding</CardTitle>
          <CardDescription>
            Defaults: name “AI Assistant”, greeting “Hi! How can I help you today?”
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateChatbotSettings} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="chatbot_name">Chatbot name</Label>
                <Input
                  id="chatbot_name"
                  name="chatbot_name"
                  defaultValue={settings.chatbot_name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chatbot_color">Brand color</Label>
                <Input
                  id="chatbot_color"
                  name="chatbot_color"
                  type="color"
                  className="h-12 w-full cursor-pointer"
                  defaultValue={settings.chatbot_color || "#2563eb"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="greeting_message">Greeting message</Label>
              <Textarea
                id="greeting_message"
                name="greeting_message"
                rows={3}
                defaultValue={settings.greeting_message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="human_handover_message">Human handover message</Label>
              <Textarea
                id="human_handover_message"
                name="human_handover_message"
                rows={3}
                defaultValue={settings.human_handover_message}
              />
            </div>

            <div className="space-y-3">
              <Label>Lead capture fields</Label>
              <p className="text-xs text-muted-foreground">
                Checked fields are mentioned by the AI when qualifying visitors.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {FIELD_OPTS.map((f) => (
                  <label
                    key={f.id}
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      name={`field_${f.id}`}
                      defaultChecked={enabled.has(f.id)}
                      className="size-4 rounded border-input"
                    />
                    {f.label}
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit">Save chatbot settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
