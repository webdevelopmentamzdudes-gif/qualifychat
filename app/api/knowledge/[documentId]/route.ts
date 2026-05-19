import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getBusinessForUser } from "@/lib/knowledge/get-user-business";
import { KNOWLEDGE_BUCKET } from "@/lib/knowledge/constants";
import { processKnowledgeDocument } from "@/lib/rag/process-document";

export const runtime = "nodejs";
export const maxDuration = 60;

async function assertOwnDocument(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  documentId: string
) {
  const business = await getBusinessForUser(supabase, userId);
  if (!business) return null;

  const { data: doc } = await supabase
    .from("knowledge_documents")
    .select("*")
    .eq("id", documentId)
    .eq("business_id", business.id)
    .maybeSingle();

  return doc;
}

/** Get document detail including extracted text preview */
export async function GET(
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

  const doc = await assertOwnDocument(supabase, user.id, context.params.documentId);
  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ document: doc });
}

/** Update enabled flag or extracted text (re-embeds on text edit) */
export async function PATCH(
  req: Request,
  context: { params: { documentId: string } }
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const doc = await assertOwnDocument(supabase, user.id, context.params.documentId);
  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const admin = createAdminClient();

  if (typeof body.is_enabled === "boolean") {
    await admin
      .from("knowledge_documents")
      .update({ is_enabled: body.is_enabled })
      .eq("id", doc.id);
  }

  if (typeof body.extracted_text === "string") {
    try {
      await processKnowledgeDocument(admin, doc.id, {
        textOverride: body.extracted_text,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Re-processing failed";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  const { data: updated } = await supabase
    .from("knowledge_documents")
    .select("*")
    .eq("id", doc.id)
    .single();

  return NextResponse.json({ document: updated });
}

/** Delete document, chunks, and storage file */
export async function DELETE(
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

  const doc = await assertOwnDocument(supabase, user.id, context.params.documentId);
  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const admin = createAdminClient();

  await admin.storage.from(KNOWLEDGE_BUCKET).remove([doc.file_path]);
  await admin.from("knowledge_documents").delete().eq("id", doc.id);

  return NextResponse.json({ ok: true });
}
