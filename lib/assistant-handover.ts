/**
 * Heuristic: assistant reply suggests routing to humans / insufficient context.
 */
export function assistantSuggestsHandover(
  assistantText: string,
  humanHandoverMessage: string
): boolean {
  const t = assistantText.toLowerCase();
  const needle = humanHandoverMessage.slice(0, 40).toLowerCase();
  if (needle && t.includes(needle)) return true;

  return /\b(team (can|will) confirm|our team will|don't have (that |enough )?information|cannot confirm (the )?(price|details)|speak( to)? (a )?(human|specialist)|handover|escalat)/i.test(
    assistantText
  );
}
