import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeLeadStatus } from "@/lib/lead-qualification";
import { extractLeadHints, mergeLeadFields } from "@/lib/extract-contact";
import { assistantSuggestsHandover } from "@/lib/assistant-handover";
import { sendQualifiedLeadEmail } from "@/lib/email";
import {
  formatRagContext,
  retrieveRelevantChunks,
} from "@/lib/rag/retrieve";
import { generateLeadAiSummary } from "@/lib/generate-lead-summary";
import { visitorRequestsLiveAgent } from "@/lib/live-agent/detect-request";
import {
  getOrCreateChatSession,
  isLiveMode,
  requestLiveAgent,
} from "@/lib/live-agent/session-service";
import type { LeadStatus } from "@/lib/types";

export const runtime = "nodejs";

const bodySchema = z.object({
  businessId: z.string().uuid(),
  sessionId: z.string().min(4),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .min(1),
});

const SYSTEM_PROMPT_BASE = `You are an AI customer support and sales assistant for a business. Your job is to answer customer questions clearly, politely, and professionally. Use only the business information provided. If information is missing, say that the team can confirm it. Your goals are:
1. Help the customer
2. Explain services
3. Share pricing only if available
4. Ask relevant follow-up questions
5. Capture lead details
6. Qualify serious customers
7. Hand over complex questions to the human team

Do not make fake promises. Do not invent prices, medical claims, legal advice, or guarantees. Keep replies short, helpful, and conversion-focused.`;

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { businessId, sessionId, messages } = parsed.data;
    const last = messages[messages.length - 1];
    if (last.role !== "user") {
      return NextResponse.json(
        { error: "Last message must be from the user" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    const { data: business, error: bErr } = await admin
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .maybeSingle();

    if (bErr || !business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const { data: settings, error: sErr } = await admin
      .from("chatbot_settings")
      .select("*")
      .eq("business_id", businessId)
      .maybeSingle();

    if (sErr || !settings) {
      return NextResponse.json(
        { error: "Chatbot settings missing for this business" },
        { status: 404 }
      );
    }

    const chatSession = await getOrCreateChatSession(
      admin,
      businessId,
      sessionId
    );

    if (isLiveMode(chatSession.mode)) {
      return NextResponse.json(
        {
          error: "live_mode",
          liveMode: true,
          mode: chatSession.mode,
        },
        { status: 409 }
      );
    }

    if (visitorRequestsLiveAgent(last.content)) {
      await requestLiveAgent(
        admin,
        businessId,
        sessionId,
        last.content
      );
      const handoverReply =
        "You requested a live team member. Please wait — someone from our team will join this chat shortly. You can keep typing here while you wait.";
      return NextResponse.json({
        reply: handoverReply,
        liveMode: true,
        mode: "waiting_agent",
        sessionId,
      });
    }

    const businessBlock = `
Business information (only source of truth — never invent beyond this):
- Business name: ${business.business_name}
- Industry: ${business.industry || "Not specified"}
- Description: ${business.business_description || "Not specified"}
- Services offered:
${business.services_offered || "Not specified"}
- Pricing details:
${business.pricing_details?.trim() ? business.pricing_details : "Not specified — say the team can confirm pricing if asked."}
- FAQs:
${business.faqs || "None listed"}
- Working hours: ${business.working_hours || "Not specified"}
- Location: ${business.location || "Not specified"}
- Public contact email: ${business.contact_email || "Not specified"}
- Public phone: ${business.contact_phone || "Not specified"}
- Website: ${business.website_url || "Not specified"}
- Tone of voice for replies: ${business.tone_of_voice || "Professional"}

Chatbot display name: ${settings.chatbot_name}
Suggested greeting (visitor may already see it): ${settings.greeting_message}
When escalating or missing data, you may align with: ${settings.human_handover_message}
Lead fields enabled for capture (ask naturally when there is buying intent): ${JSON.stringify(settings.lead_capture_fields)}
`.trim();

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return NextResponse.json(
        { error: "Server missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey: openaiKey });
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const ragChunks = await retrieveRelevantChunks(
      admin,
      businessId,
      last.content,
      openai
    );
    const ragBlock = formatRagContext(ragChunks);

    const systemContent = [SYSTEM_PROMPT_BASE, businessBlock, ragBlock]
      .filter(Boolean)
      .join("\n\n");

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: systemContent,
        },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      temperature: 0.5,
      max_tokens: 600,
    });

    const reply =
      completion.choices[0]?.message?.content?.trim() ||
      "Thanks for your message. The team can confirm details with you shortly.";

    const userTranscript = messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join("\n");

    const latestHints = extractLeadHints(last.content);
    const { data: existingLead } = await admin
      .from("leads")
      .select("*")
      .eq("business_id", businessId)
      .eq("visitor_session_id", sessionId)
      .maybeSingle();

    const merged = mergeLeadFields(
      {
        name: existingLead?.name ?? undefined,
        phone: existingLead?.phone ?? undefined,
        email: existingLead?.email ?? undefined,
        service_required: existingLead?.service_required ?? undefined,
        preferred_datetime: existingLead?.preferred_datetime ?? undefined,
        message: existingLead?.message ?? undefined,
      },
      latestHints
    );

    const handover = assistantSuggestsHandover(
      reply,
      settings.human_handover_message || ""
    );

    const status = computeLeadStatus({
      name: merged.name,
      phone: merged.phone,
      email: merged.email,
      userTranscript,
      aiSuggestsHandover: handover,
    });

    const fullTranscript = [
      ...messages,
      { role: "assistant" as const, content: reply },
    ];

    const narrativeSummary = await generateLeadAiSummary(openai, {
      businessName: business.business_name || "Business",
      messages: fullTranscript,
      captured: {
        name: merged.name,
        phone: merged.phone,
        email: merged.email,
        service_required: merged.service_required,
        preferred_datetime: merged.preferred_datetime,
        message: merged.message,
      },
    });

    const summaryText =
      narrativeSummary ||
      existingLead?.ai_summary?.trim() ||
      "";

    const previousStatus = (existingLead?.lead_status || "NEW") as LeadStatus;

    const leadPayload = {
      business_id: businessId,
      visitor_session_id: sessionId,
      name: merged.name || "",
      phone: merged.phone || "",
      email: merged.email || "",
      service_required: merged.service_required || "",
      preferred_datetime: merged.preferred_datetime || "",
      message: merged.message || "",
      lead_status: status,
      conversation_summary: summaryText,
      ai_summary: summaryText,
      updated_at: new Date().toISOString(),
    };

    let leadId = existingLead?.id as string | undefined;

    if (existingLead) {
      const { data: upd, error: uErr } = await admin
        .from("leads")
        .update(leadPayload)
        .eq("id", existingLead.id)
        .select("id")
        .single();
      if (uErr) console.error(uErr);
      leadId = upd?.id;
    } else {
      const { data: ins, error: iErr } = await admin
        .from("leads")
        .insert({
          ...leadPayload,
          lead_status: status,
        })
        .select("id")
        .single();
      if (iErr) console.error(iErr);
      leadId = ins?.id;
    }

    await admin.from("conversations").insert({
      business_id: businessId,
      lead_id: leadId ?? null,
      session_id: sessionId,
      user_message: last.content,
      ai_response: reply,
      conversation_summary: summaryText.slice(0, 500),
    });

    await admin
      .from("chat_sessions")
      .update({
        last_preview: last.content.slice(0, 280),
        updated_at: new Date().toISOString(),
      })
      .eq("business_id", businessId)
      .eq("session_id", sessionId);

    if (visitorRequestsLiveAgent(last.content) || handover) {
      await requestLiveAgent(admin, businessId, sessionId, last.content);
    }

    if (
      status === "QUALIFIED" &&
      previousStatus !== "QUALIFIED" &&
      business.contact_email
    ) {
      await sendQualifiedLeadEmail({
        to: business.contact_email,
        businessName: business.business_name,
        name: merged.name || "",
        phone: merged.phone || "",
        email: merged.email || "",
        serviceRequired: merged.service_required || "",
        conversationSummary: summaryText,
        leadStatus: status,
        createdAtIso: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      reply,
      leadId: leadId ?? null,
      leadStatus: status,
      sessionId,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Chat failed. Please try again." },
      { status: 500 }
    );
  }
}
