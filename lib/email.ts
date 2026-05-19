import { sendSmtpEmail } from "@/lib/smtp";
import type { LeadStatus } from "@/lib/types";

async function sendOwnerEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  return sendSmtpEmail(params);
}

/** First time a visitor becomes a lead in the dashboard. */
export async function sendNewLeadEmail(params: {
  to: string;
  businessName: string;
  dashboardUrl: string;
  name: string;
  phone: string;
  email: string;
  serviceRequired: string;
  leadStatus: LeadStatus;
  summary: string;
}) {
  const html = `
    <h2>New lead on QualifyChat</h2>
    <p><strong>Business:</strong> ${escapeHtml(params.businessName)}</p>
    <ul>
      <li><strong>Name:</strong> ${escapeHtml(params.name || "—")}</li>
      <li><strong>Phone:</strong> ${escapeHtml(params.phone || "—")}</li>
      <li><strong>Email:</strong> ${escapeHtml(params.email || "—")}</li>
      <li><strong>Service:</strong> ${escapeHtml(params.serviceRequired || "—")}</li>
      <li><strong>Status:</strong> ${escapeHtml(params.leadStatus)}</li>
    </ul>
    ${params.summary ? `<p><strong>Summary</strong></p><p>${escapeHtml(params.summary)}</p>` : ""}
    <p><a href="${escapeHtml(params.dashboardUrl)}">View lead in dashboard</a></p>
  `;

  return sendOwnerEmail({
    to: params.to,
    subject: `New lead — ${params.businessName || "QualifyChat"}`,
    html,
  });
}

/** Visitor asked for a live human on chat. */
export async function sendLiveAgentRequestEmail(params: {
  to: string;
  businessName: string;
  sessionId: string;
  preview: string;
  dashboardUrl: string;
}) {
  const html = `
    <h2>Live agent requested</h2>
    <p>A visitor on <strong>${escapeHtml(params.businessName)}</strong> asked to speak with your team.</p>
    <p><strong>Last message:</strong> ${escapeHtml(params.preview || "—")}</p>
    <p><a href="${escapeHtml(params.dashboardUrl)}">Open live chat inbox</a></p>
    <p style="color:#666;font-size:13px;">Reply from the dashboard as soon as you can — they are waiting.</p>
  `;

  return sendOwnerEmail({
    to: params.to,
    subject: `Live agent requested — ${params.businessName || "QualifyChat"}`,
    html,
  });
}

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

  return sendOwnerEmail({
    to: params.to,
    subject: "New qualified lead — QualifyChat",
    html,
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
