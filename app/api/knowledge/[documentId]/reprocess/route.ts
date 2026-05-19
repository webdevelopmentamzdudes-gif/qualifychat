import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getBusinessForUser } from "@/lib/knowledge/get-user-business";
import { processKnowledgeDocument } from "@/lib/rag/process-document";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Re-run chunking + embeddings from stored file */
export async function POST(
  _req: Request,
  context: { params: { documentId: string } }
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const business = await getBusinessForUser(supabase, user.id);
  if (!business) {
    return NextResponse.json({ error: "No business" }, { status: 400 });
  }

  const { data: doc } = await supabase
    .from("knowledge_documents")
    .select("id")
    .eq("id", context.params.documentId)
    .eq("business_id", business.id)
    .maybeSingle();

  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const admin = createAdminClient();

  try {
    await processKnowledgeDocument(admin, doc.id);
    return NextResponse.json({ ok: true, status: "ready" });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Reprocess failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
