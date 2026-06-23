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
      "[QualifyChat email] SMTP not configured — set SMTP_HOST, SMTP_USER, SMTP_PASS on the running server and restart the app."
    );
    return { ok: false as const, error: "missing_smtp" };
  }

  const from =
    process.env.SMTP_FROM?.trim() ||
    `QualifyChat <${process.env.SMTP_USER}>`;

  try {
    const transport = createTransport();
    const info = await transport.sendMail({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    console.info(
      `[QualifyChat email] Sent to ${params.to} — messageId=${info.messageId ?? "ok"}`
    );
    return { ok: true as const };
  } catch (err) {
    console.error(
      `[QualifyChat email] SMTP send failed (to=${params.to}, host=${process.env.SMTP_HOST}, port=${process.env.SMTP_PORT || "465"}):`,
      err
    );
    return { ok: false as const, error: "smtp_send_failed" };
  }
}
