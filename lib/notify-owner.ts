import type { SupabaseClient } from "@supabase/supabase-js";
import {
  sendLiveAgentRequestEmail,
  sendNewLeadEmail,
  sendQualifiedLeadEmail,
} from "@/lib/email";
import { resolveOwnerNotificationEmail } from "@/lib/resolve-owner-email";
import type { LeadStatus } from "@/lib/types";

function appUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

async function getBusinessForNotify(
  admin: SupabaseClient,
  businessId: string
) {
  const { data, error } = await admin
    .from("businesses")
    .select("id, business_name, contact_email, user_id")
    .eq("id", businessId)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export async function notifyOwnerNewLead(
  admin: SupabaseClient,
  businessId: string,
  params: {
    leadId: string;
    name: string;
    phone: string;
    email: string;
    serviceRequired: string;
    leadStatus: LeadStatus;
    summary: string;
  }
) {
  try {
    const business = await getBusinessForNotify(admin, businessId);
    if (!business) return;

    const to = await resolveOwnerNotificationEmail(admin, business);
    if (!to) {
      console.warn("No owner email for new-lead notification.");
      return;
    }

    const result = await sendNewLeadEmail({
      to,
      businessName: business.business_name,
      dashboardUrl: `${appUrl()}/dashboard/leads/${params.leadId}`,
      ...params,
    });
    if (!result.ok) {
      console.warn(`[QualifyChat email] New lead alert not sent (to=${to}).`);
    }
  } catch (e) {
    console.error("New lead notification failed:", e);
  }
}

export async function notifyOwnerLiveAgentRequest(
  admin: SupabaseClient,
  businessId: string,
  params: {
    sessionId: string;
    preview: string;
  }
) {
  try {
    const business = await getBusinessForNotify(admin, businessId);
    if (!business) return;

    const to = await resolveOwnerNotificationEmail(admin, business);
    if (!to) {
      console.warn("No owner email for live-agent notification.");
      return;
    }

    const result = await sendLiveAgentRequestEmail({
      to,
      businessName: business.business_name,
      sessionId: params.sessionId,
      preview: params.preview,
      dashboardUrl: `${appUrl()}/dashboard/live-chat/${encodeURIComponent(params.sessionId)}`,
    });
    if (!result.ok) {
      console.warn(`[QualifyChat email] Live agent alert not sent (to=${to}).`);
    }
  } catch (e) {
    console.error("Live agent notification failed:", e);
  }
}

export async function notifyOwnerQualifiedLead(
  admin: SupabaseClient,
  businessId: string,
  params: {
    name: string;
    phone: string;
    email: string;
    serviceRequired: string;
    conversationSummary: string;
    leadStatus: LeadStatus;
    createdAtIso: string;
  }
) {
  try {
    const business = await getBusinessForNotify(admin, businessId);
    if (!business) return;

    const to = await resolveOwnerNotificationEmail(admin, business);
    if (!to) {
      console.warn("No owner email for qualified-lead notification.");
      return;
    }

    await sendQualifiedLeadEmail({
      to,
      businessName: business.business_name,
      ...params,
    });
  } catch (e) {
    console.error("Qualified lead notification failed:", e);
  }
}
