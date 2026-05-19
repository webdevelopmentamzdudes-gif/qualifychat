import OpenAI from "openai";

const MAX_MESSAGES = 24;
const MAX_CHARS_PER_MSG = 900;

export type SummaryMessage = {
  role: "user" | "assistant";
  content: string;
};

export type CapturedLeadFields = {
  name?: string;
  phone?: string;
  email?: string;
  service_required?: string;
  preferred_datetime?: string;
  message?: string;
};

/**
 * Produces a short narrative summary for dashboard / email — not a chat log.
 */
export async function generateLeadAiSummary(
  openai: OpenAI,
  params: {
    businessName: string;
    messages: SummaryMessage[];
    captured?: CapturedLeadFields;
  }
): Promise<string | null> {
  const transcript = params.messages
    .slice(-MAX_MESSAGES)
    .map((m) => {
      const label = m.role === "user" ? "Visitor" : "Assistant";
      const text = m.content.replace(/\s+/g, " ").trim().slice(0, MAX_CHARS_PER_MSG);
      return `${label}: ${text}`;
    })
    .join("\n");

  if (!transcript.trim()) return null;

  const captured = params.captured ?? {};
  const fieldsBlock = [
    captured.name?.trim() && `Name: ${captured.name.trim()}`,
    captured.phone?.trim() && `Phone: ${captured.phone.trim()}`,
    captured.email?.trim() && `Email: ${captured.email.trim()}`,
    captured.service_required?.trim() &&
      `Service / request: ${captured.service_required.trim()}`,
    captured.preferred_datetime?.trim() &&
      `Preferred time: ${captured.preferred_datetime.trim()}`,
    captured.message?.trim() && `Visitor note: ${captured.message.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  try {
    const completion = await openai.chat.completions.create({
      model,
      temperature: 0.3,
      max_tokens: 320,
      messages: [
        {
          role: "system",
          content: `You write concise lead summaries for the team at "${params.businessName}".

Write 3–5 sentences in plain English describing:
- What the visitor wanted or asked about
- What the assistant explained or offered
- Any concrete details (products, delivery area, dates, quantities, pricing, booking)
- Outcome or suggested next step for the human team

Rules:
- Do NOT paste the chat verbatim or list every message
- Do NOT use "User:", "Assistant:", "Latest:", or pipe-separated logs
- Do NOT invent facts that are not in the transcript or captured fields`,
        },
        {
          role: "user",
          content: `Captured fields (may be incomplete):\n${fieldsBlock || "None yet"}\n\nChat transcript:\n${transcript}`,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content?.trim();
    return text ? text.slice(0, 2500) : null;
  } catch (e) {
    console.error("generateLeadAiSummary failed:", e);
    return null;
  }
}

/** Build message list from stored conversation turns. */
export function messagesFromConversationTurns(
  turns: { user_message: string; ai_response: string }[]
): SummaryMessage[] {
  const out: SummaryMessage[] = [];
  for (const t of turns) {
    if (t.user_message?.trim()) {
      out.push({ role: "user", content: t.user_message });
    }
    if (t.ai_response?.trim()) {
      out.push({ role: "assistant", content: t.ai_response });
    }
  }
  return out;
}
