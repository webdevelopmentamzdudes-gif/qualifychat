/** Lead workflow statuses stored in Supabase `leads.lead_status`. */
export type LeadStatus =
  | "NEW"
  | "QUALIFIED"
  | "NOT_QUALIFIED"
  | "NEEDS_HUMAN_FOLLOW_UP";

export type ToneOfVoice =
  | "Professional"
  | "Friendly"
  | "Luxury"
  | "Casual";

export type ChatMessage = {
  role: "user" | "assistant" | "agent" | "system";
  content: string;
};
