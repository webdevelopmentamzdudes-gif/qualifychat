# QualifyChat

QualifyChat is a B2B SaaS-style MVP where businesses configure an AI chatbot from their **business profile**, embed it on any website, and manage **leads**, **conversations**, and **chatbot settings** from a protected dashboard. OpenAI powers replies (server-side only); Supabase handles auth and data; **Resend** emails the owner on **new leads**, **live agent requests**, and when a lead becomes **QUALIFIED**.

## Features

- Marketing **landing page** with hero, problem, how it works, features, industries, pricing, and CTA.
- **Supabase Auth**: email/password **signup**, **login**, **logout**, middleware-protected **`/dashboard`** routes.
- **Dashboard** with KPI cards (total/new/qualified/follow-up leads), recent conversations, chatbot status, and business setup status.
- **Sidebar**: Dashboard, Business Profile, **Knowledge Base**, Leads, Conversations, Chatbot Settings, Embed Code, Account Settings.
- **Business profile** stored in Postgres (services, pricing, FAQs, hours, tone, contact, etc.).
- **AI chatbot** (`/chatbot/[businessId]`) — uses business profile + **uploaded documents (RAG)**; never invents facts beyond provided data.
- **Server `/api/chat`** route: OpenAI + lead extraction + qualification + conversation rows + **Resend** owner emails (new lead, live agent, qualified).
- **Embed script** (`public/embed.js`) — floating launcher + iframe to your hosted chat page.
- **Demo business** (“GlowCare Clinic”) auto-seeded on first dashboard load when the account has no businesses yet.

## Tech stack

- **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**, **shadcn/ui**
- **Supabase** (Auth + Postgres + RLS)
- **OpenAI API**
- **Resend** (transactional email)
- Deployable on **Vercel**

## Prerequisites

- Node.js 18+
- Supabase project
- OpenAI API key
- (Optional) Resend API key and verified sender/domain for production email

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` **public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` **secret** key → `SUPABASE_SERVICE_ROLE_KEY` (never expose this to the browser or commit it).
3. **Authentication → URL configuration**
   - **Site URL**: `http://localhost:3000` for local dev; your production URL on Vercel.
   - **Redirect URLs**: add `http://localhost:3000/auth/callback` and `https://YOUR_DOMAIN/auth/callback`.
4. Run the SQL migration (see below).

## SQL migration

Open **SQL Editor** in Supabase and run the full contents of:

`supabase/migrations/001_initial_schema.sql`

This creates tables (`profiles`, `businesses`, `chatbot_settings`, `leads`, `conversations`), **RLS policies**, triggers for `updated_at`, and an **`auth.users` → `profiles`** insert trigger.

Then run:

`supabase/migrations/002_knowledge_rag.sql`

This enables **pgvector**, creates `knowledge_documents` + `document_chunks`, the `match_document_chunks` search function, a private Storage bucket `knowledge-docs`, and RLS policies.

**Live agent handover (optional):** run `supabase/migrations/003_live_agent.sql` after 002. This adds `chat_sessions` + `live_messages` so visitors can request a human, you get a dashboard alert, and you can reply live from **Dashboard → Live Chat**.

**Note:** Public visitors never query sensitive tables directly from the browser. The chat widget calls **your** Next.js **`/api/chat`** route, which uses the **service role** server-side to read business data, retrieve document chunks, and insert conversations/leads.

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (browser + server with user session) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — **server only** (API routes) |
| `OPENAI_API_KEY` | OpenAI secret |
| `OPENAI_MODEL` | Optional; default `gpt-4o-mini` |
| `RESEND_API_KEY` | Resend API key for owner alert emails |
| `RESEND_FROM_EMAIL` | Verified “from” address in Resend (required for production) |
| `NEXT_PUBLIC_APP_URL` | Base URL of this app (used in embed instructions), e.g. `http://localhost:3000` or `https://your-domain.com` |
| `OPENAI_EMBEDDING_MODEL` | Optional; default `text-embedding-3-small` for knowledge base RAG |
| `KNOWLEDGE_MAX_FILE_MB` | Optional; max upload size per file (default `10`) |
| `KNOWLEDGE_MAX_CHUNKS_PER_DOC` | Optional; cap chunks per document (default `150`) |

Never commit `.env.local` or the service role key.

## OpenAI API key

Add `OPENAI_API_KEY` to `.env.local`. The key is read **only** in `app/api/chat/route.ts` on the server.

Optional: set `OPENAI_MODEL` (e.g. `gpt-4o-mini`) to control cost and behavior.

## Resend API key

1. Create an account at [resend.com](https://resend.com) and create an API key → `RESEND_API_KEY`.
2. Configure `RESEND_FROM_EMAIL` with a verified sender/domain in Resend (required for production).
3. Set **Business profile → Contact email** to the owner’s Gmail (or leave blank to use the **signup email** on the account).
4. Alerts are sent for: **first new lead**, **live agent requested**, and **lead becomes qualified** (with a link to the dashboard).

If Resend is not configured, the app still runs; emails are skipped with a console warning.

## Run locally

```bash
npm install
cp .env.example .env.local
# Edit .env.local with Supabase + OpenAI (+ optional Resend)

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

1. **Sign up** → confirm email if your Supabase project requires it.
2. Open **Dashboard** — the **GlowCare Clinic** demo business is created automatically if you had none.
3. Copy your **business ID** from **Embed code** and open `/chatbot/[businessId]` to test the widget.

## Deploy on Vercel (production: qualifychat.amzdudes.io)

1. Import [github.com/webdevelopmentamzdudes-gif/qualifychat](https://github.com/webdevelopmentamzdudes-gif/qualifychat) in [Vercel](https://vercel.com).
2. Add all variables from `.env.example` under **Project Settings → Environment Variables** (Production).
3. Set **`NEXT_PUBLIC_APP_URL`** = `https://qualifychat.amzdudes.io`
4. In Vercel **Domains**, add `qualifychat.amzdudes.io` and point DNS (CNAME to `cname.vercel-dns.com` or A record per Vercel).
5. In **Supabase → Authentication → URL configuration**:
   - **Site URL**: `https://qualifychat.amzdudes.io`
   - **Redirect URLs** (add both):
     - `https://qualifychat.amzdudes.io/auth/callback`
     - `http://localhost:3000/auth/callback` (keep for local dev)
6. Redeploy after env changes so embed URLs and auth use the live domain.

## Test the demo chatbot

1. Sign in and go to **Dashboard → Embed code**.
2. Open the **public chatbot URL** (or run locally: `/chatbot/<YOUR_BUSINESS_ID>`).
3. Ask about services using the seeded GlowCare copy; provide a **name** and **email** or **phone**, and mention **booking** or **pricing** to exercise qualification.
4. Refresh **Dashboard → Leads** and **Conversations** to see stored rows.

## Test the knowledge base (RAG)

1. Run `002_knowledge_rag.sql` in Supabase (see SQL migration above).
2. Sign in → **Dashboard → Knowledge Base**.
3. Upload a PDF or TXT with your services/pricing/SOPs.
4. Wait until status shows **Ready** (chunking + embeddings run on the server).
5. Open your public chatbot URL and ask a question that only appears in the uploaded doc.
6. The bot should answer from that document; if unsure, it should say the team can confirm.

You can **edit extracted text**, **replace** the file, **disable** a doc without deleting it, or **re-process** after changes.

## Embed on another website

Use the snippet from **Dashboard → Embed code**, for example:

```html
<script src="https://qualifychat.amzdudes.io/embed.js" data-business-id="YOUR_BUSINESS_UUID" async defer></script>
```

The script loads `embed.js` from your deployment, resolves the origin from the script URL, and opens an iframe to `/chatbot/[businessId]?embed=1`.

Ensure `NEXT_PUBLIC_APP_URL` matches your live domain so copied URLs in the dashboard are correct.

## Project scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run production build locally
- `npm run lint` — ESLint

## Security notes

- The **service role** key must only exist in server environment variables (Vercel / `.env.local`), never in client bundles.
- Dashboard data access relies on **Supabase RLS** with the logged-in user’s JWT.
- Visitor chat uses **`/api/chat`** with the service role for controlled reads/writes.

---

Built as an MVP — extend with billing webhooks, multi-business per account, analytics, and stricter embed tokens as you scale.
