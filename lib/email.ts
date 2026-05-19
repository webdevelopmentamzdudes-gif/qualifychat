import { Resend } from "resend";
import type { LeadStatus } from "@/lib/types";

/**
 * Sends transactional email when a lead becomes QUALIFIED (server-side only).
 */
export async function sendQualifiedLeadEmail(params: {
  to: string;
  businessName: string;
  name: string;
  phone: string;
  email: string;
  serviceRequired: string;
  conversationSummary: string;
  leadStatus: LeadStatus;
  createdAtIso: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("RESEND_API_KEY missing — skipping email.");
    return { ok: false as const, error: "missing_api_key" };
  }

  const from =
    process.env.RESEND_FROM_EMAIL || "QualifyChat <onboarding@resend.dev>";

  const resend = new Resend(key);

  const html = `
    <h2>New Qualified Lead Captured by QualifyChat</h2>
    <p><strong>Business:</strong> ${escapeHtml(params.businessName)}</p>
    <ul>
      <li><strong>Name:</strong> ${escapeHtml(params.name || "—")}</li>
      <li><strong>Phone:</strong> ${escapeHtml(params.phone || "—")}</li>
      <li><strong>Email:</strong> ${escapeHtml(params.email || "—")}</li>
      <li><strong>Service required:</strong> ${escapeHtml(params.serviceRequired || "—")}</li>
      <li><strong>Lead status:</strong> ${escapeHtml(params.leadStatus)}</li>
      <li><strong>Date/time:</strong> ${escapeHtml(params.createdAtIso)}</li>
    </ul>
    <p><strong>Conversation summary</strong></p>
    <p>${escapeHtml(params.conversationSummary || "—")}</p>
  `;

  await resend.emails.send({
    from,
    to: params.to,
    subject: "New Qualified Lead Captured by QualifyChat",
    html,
  });

  return { ok: true as const };
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
