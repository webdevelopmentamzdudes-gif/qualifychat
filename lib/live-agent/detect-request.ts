/** Visitor explicitly asks to speak with a human / live agent. */
export function visitorRequestsLiveAgent(text: string): boolean {
  const t = text.toLowerCase().trim();
  if (!t) return false;

  const patterns = [
    /\b(live|real|human|actual)\s+(agent|person|representative|staff|support)/,
    /\btalk\s+to\s+(a\s+)?(human|person|agent|someone|representative|manager)/,
    /\bspeak\s+to\s+(a\s+)?(human|person|agent|manager|representative)/,
    /\bconnect\s+me\s+(with|to)\s+(a\s+)?(human|agent|person|representative)/,
    /\bneed\s+(a\s+)?(human|real\s+person|live\s+agent|representative)/,
    /\b(customer\s+)?service\s+representative\b/,
    /\btransfer\s+(me\s+)?to\s+(an?\s+)?(agent|human|person)/,
    /\bcan\s+i\s+(chat|speak)\s+with\s+(a\s+)?(human|person|agent)/,
    /\blive\s+(chat|support|help)\b/,
    /\breal\s+person\b/,
  ];

  return patterns.some((p) => p.test(t));
}
