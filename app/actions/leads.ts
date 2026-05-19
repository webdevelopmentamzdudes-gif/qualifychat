"use server";

import { revalidatePath } from "next/cache";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import {
  generateLeadAiSummary,
  messagesFromConversationTurns,
} from "@/lib/generate-lead-summary";

export async function updateLeadNotes(leadId: string, formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const notes = String(formData.get("notes") ?? "");

  const { error } = await supabase
    .from("leads")
    .update({ notes })
    .eq("id", leadId);

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/leads/${leadId}`);
  revalidatePath("/dashboard/leads");
}

export async function regenerateLeadSummary(
  leadId: string
): Promise<{ summary?: string; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .maybeSingle();

  if (!lead) return { error: "Lead not found" };

  const { data: biz } = await supabase
    .from("businesses")
    .select("business_name, user_id")
    .eq("id", lead.business_id)
    .maybeSingle();

  if (!biz || biz.user_id !== user.id) return { error: "Unauthorized" };

  const { data: turns } = await supabase
    .from("conversations")
    .select("user_message, ai_response")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: true });

  const messages = messagesFromConversationTurns(turns ?? []);
  if (messages.length === 0) {
    return { error: "No chat messages found for this lead." };
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) return { error: "OPENAI_API_KEY is not configured" };

  const openai = new OpenAI({ apiKey: openaiKey });
  const summary = await generateLeadAiSummary(openai, {
    businessName: biz.business_name || "Business",
    messages,
    captured: {
      name: lead.name ?? undefined,
      phone: lead.phone ?? undefined,
      email: lead.email ?? undefined,
      service_required: lead.service_required ?? undefined,
      preferred_datetime: lead.preferred_datetime ?? undefined,
      message: lead.message ?? undefined,
    },
  });

  if (!summary) {
    return { error: "Could not generate summary. Try again." };
  }

  const { error } = await supabase
    .from("leads")
    .update({
      ai_summary: summary,
      conversation_summary: summary,
    })
    .eq("id", leadId);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/leads/${leadId}`);
  revalidatePath("/dashboard/leads");

  return { summary };
}
