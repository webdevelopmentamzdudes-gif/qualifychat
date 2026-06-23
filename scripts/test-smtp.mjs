/**
 * Run on your live server (same env as the app) to test SMTP:
 *   node scripts/test-smtp.mjs you@gmail.com
 *
 * Loads .env.local if present, otherwise uses process.env from the host panel.
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import nodemailer from "nodemailer";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const to = process.argv[2];
if (!to) {
  console.error("Usage: node scripts/test-smtp.mjs recipient@example.com");
  process.exit(1);
}

const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT, SMTP_SECURE, SMTP_FROM } =
  process.env;

console.log("SMTP check:");
console.log("  SMTP_HOST:", SMTP_HOST || "(missing)");
console.log("  SMTP_USER:", SMTP_USER || "(missing)");
console.log("  SMTP_PASS:", SMTP_PASS ? "(set)" : "(missing)");
console.log("  SMTP_PORT:", SMTP_PORT || "465");
console.log("  SMTP_FROM:", SMTP_FROM || "(default)");

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.error("\nFAIL: SMTP_HOST, SMTP_USER, and SMTP_PASS must be set.");
  process.exit(1);
}

const port = Number(SMTP_PORT || "465");
const secure =
  SMTP_SECURE === "true" || SMTP_SECURE === "1" || port === 465;

const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port,
  secure,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

const from = SMTP_FROM?.trim() || `QualifyChat <${SMTP_USER}>`;

try {
  const info = await transport.sendMail({
    from,
    to,
    subject: "QualifyChat SMTP test",
    html: "<p>If you see this, SMTP works on your server.</p>",
  });
  console.log("\nOK: Email sent. messageId=", info.messageId);
  console.log("Check inbox and spam for:", to);
} catch (err) {
  console.error("\nFAIL: SMTP error:");
  console.error(err);
  process.exit(1);
}
