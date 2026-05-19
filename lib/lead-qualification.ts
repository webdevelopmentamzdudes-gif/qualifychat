import type { LeadStatus } from "@/lib/types";

/**
 * Rules from product spec:
 * QUALIFIED: name + (phone OR email), AND intent around services/pricing/booking.
 * NEEDS_HUMAN_FOLLOW_UP: complaints, custom pricing, booking-ready, complexity, missing knowledge signals.
 */
export function computeLeadStatus(params: {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  /** Combined lowercased text from user messages in this session */
  userTranscript: string;
  /** True when the model signals uncertainty / handover */
  aiSuggestsHandover?: boolean;
}): LeadStatus {
  const t = params.userTranscript.toLowerCase();
  const name = (params.name || "").trim();
  const phone = (params.phone || "").trim();
  const email = (params.email || "").trim();

  const hasName = name.length >= 2;
  const hasContact = hasName && (phone.length >= 7 || email.includes("@"));

  const complaint =
    /\b(complaint|refund|angry|terrible|awful|sue|lawyer|legal)\b/i.test(t);
  const customPricing =
    /\b(custom\s+pric|negotiat|discount\s+only|special\s+deal\s+for\s+me)\b/i.test(
      t
    );
  const bookingReady =
    /\b(book\s+now|confirm\s+booking|pay\s+deposit|charge\s+my\s+card|i\s*'?ll\s+take\s+that\s+slot)\b/i.test(
      t
    );
  const complexQuestion =
    /\b(warranty|guarantee|medical\s+diagnosis|prescription|insurance\s+claim|contract\s+terms)\b/i.test(
      t
    );

  if (
    complaint ||
    customPricing ||
    bookingReady ||
    complexQuestion ||
    params.aiSuggestsHandover
  ) {
    return "NEEDS_HUMAN_FOLLOW_UP";
  }

  const intent =
    /\b(service|price|pricing|cost|how\s+much|book|booking|appointment|consultation|availability|schedule|slot|when\s+can|hours)\b/i.test(
      t
    );

  if (hasContact && intent) {
    return "QUALIFIED";
  }

  if (intent && !hasContact) {
    return "NEW";
  }

  if (hasContact && !intent) {
    return "NEW";
  }

  return "NOT_QUALIFIED";
}
