import { createClient } from "@/lib/supabase/server";
import { updateAccountProfile } from "@/app/actions/profile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default async function AccountSettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user!.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account settings</h1>
        <p className="text-muted-foreground">
          Profile details stored in Supabase — email changes use Supabase Auth.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Display name shown inside your workspace header.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateAccountProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={profile?.full_name ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email_display">Email</Label>
              <Input
                id="email_display"
                value={user?.email ?? ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Managed by Supabase Auth — update via password recovery or Auth UI.
              </p>
            </div>
            <Button type="submit">Save profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
