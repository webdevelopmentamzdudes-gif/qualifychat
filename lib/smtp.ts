import nodemailer from "nodemailer";

function smtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim()
  );
}

function createTransport() {
  const port = Number(process.env.SMTP_PORT || "465");
  const secure =
    process.env.SMTP_SECURE === "true" ||
    process.env.SMTP_SECURE === "1" ||
    port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendSmtpEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!smtpConfigured()) {
    console.warn(
      "SMTP not configured (SMTP_HOST, SMTP_USER, SMTP_PASS) — skipping email."
    );
    return { ok: false as const, error: "missing_smtp" };
  }

  const from =
    process.env.SMTP_FROM?.trim() ||
    `QualifyChat <${process.env.SMTP_USER}>`;

  const transport = createTransport();
  await transport.sendMail({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  return { ok: true as const };
}
