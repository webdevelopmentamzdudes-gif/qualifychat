export type ChatSessionMode = "ai" | "waiting_agent" | "live" | "closed";

export type LiveMessageSender = "visitor" | "owner" | "system";

export type ChatSessionRow = {
  id: string;
  business_id: string;
  session_id: string;
  mode: ChatSessionMode;
  last_preview: string;
  live_requested_at: string | null;
  live_started_at: string | null;
  owner_user_id: string | null;
  alert_seen_at: string | null;
  created_at: string;
  updated_at: string;
};

export type LiveMessageRow = {
  id: string;
  business_id: string;
  session_id: string;
  sender: LiveMessageSender;
  content: string;
  created_at: string;
};

export type UnifiedChatMessage = {
  id: string;
  role: "user" | "assistant" | "agent" | "system";
  content: string;
  createdAt: string;
};
