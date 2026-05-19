import { createClient } from "@/lib/supabase/server";
import { updateBusinessProfile } from "@/app/actions/business";
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

const tones = ["Professional", "Friendly", "Luxury", "Casual"] as const;

export default async function BusinessProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user!.id)
    .maybeSingle();

  if (!business) {
    return (
      <p className="text-muted-foreground">
        No business found — refresh the dashboard to create your demo workspace.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business profile</h1>
        <p className="text-muted-foreground">
          This information powers your AI assistant — keep it accurate and up to date.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Company details</CardTitle>
          <CardDescription>
            Services, pricing, and FAQs are injected into the AI context (nothing is invented).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateBusinessProfile} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="business_name">Business name</Label>
                <Input
                  id="business_name"
                  name="business_name"
                  required
                  defaultValue={business.business_name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  name="industry"
                  defaultValue={business.industry ?? ""}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_description">Business description</Label>
              <Textarea
                id="business_description"
                name="business_description"
                rows={4}
                defaultValue={business.business_description ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="services_offered">Services offered</Label>
              <Textarea
                id="services_offered"
                name="services_offered"
                rows={5}
                defaultValue={business.services_offered ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricing_details">Pricing details</Label>
              <Textarea
                id="pricing_details"
                name="pricing_details"
                rows={4}
                defaultValue={business.pricing_details ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="faqs">FAQs</Label>
              <Textarea
                id="faqs"
                name="faqs"
                rows={6}
                defaultValue={business.faqs ?? ""}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="working_hours">Working hours</Label>
                <Input
                  id="working_hours"
                  name="working_hours"
                  defaultValue={business.working_hours ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={business.location ?? ""}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact email</Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  defaultValue={business.contact_email ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact phone</Label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  defaultValue={business.contact_phone ?? ""}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website_url">Website URL</Label>
              <Input
                id="website_url"
                name="website_url"
                type="url"
                placeholder="https://"
                defaultValue={business.website_url ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone_of_voice">Tone of voice</Label>
              <select
                id="tone_of_voice"
                name="tone_of_voice"
                defaultValue={business.tone_of_voice ?? "Professional"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {tones.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit">Save changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
