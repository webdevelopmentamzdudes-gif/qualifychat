/**
 * Lightweight extraction from free text — avoids inventing data; only captures obvious patterns.
 */

const EMAIL_RE =
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_RE =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3}[\s.-]?\d{3}[\s.-]?\d{3,4}/;

export type ExtractedLeadFields = {
  name?: string;
  phone?: string;
  email?: string;
  service_required?: string;
  preferred_datetime?: string;
  message?: string;
};

export function extractLeadHints(text: string): ExtractedLeadFields {
  const hints: ExtractedLeadFields = {};

  const emailMatch = text.match(EMAIL_RE);
  if (emailMatch) hints.email = emailMatch[0];

  const phoneMatch = text.match(PHONE_RE);
  if (phoneMatch) {
    const digits = phoneMatch[0].replace(/\D/g, "");
    if (digits.length >= 8) hints.phone = phoneMatch[0].trim();
  }

  const nameMatch = text.match(
    /(?:my name is|i am|i'm|this is)\s+([A-Za-z][A-Za-z\s'.-]{1,40})/i
  );
  if (nameMatch) hints.name = nameMatch[1].trim();

  const svc = text.match(
    /(?:need|want|looking for|interested in)\s+([^.?!\n]{3,80})/i
  );
  if (svc) hints.service_required = svc[1].trim();

  const when = text.match(
    /(?:on |next |this )(monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}[\/\-]\d{1,2}|at \d{1,2}(:\d{2})?\s*(am|pm)?)/i
  );
  if (when) hints.preferred_datetime = when[0].trim();

  if (text.length > 15 && !hints.service_required) {
    hints.message = text.slice(0, 500);
  }

  return hints;
}

export function mergeLeadFields(
  existing: ExtractedLeadFields,
  incoming: ExtractedLeadFields
): ExtractedLeadFields {
  return {
    name: incoming.name || existing.name,
    phone: incoming.phone || existing.phone,
    email: incoming.email || existing.email,
    service_required: incoming.service_required || existing.service_required,
    preferred_datetime:
      incoming.preferred_datetime || existing.preferred_datetime,
    message: incoming.message || existing.message,
  };
}
