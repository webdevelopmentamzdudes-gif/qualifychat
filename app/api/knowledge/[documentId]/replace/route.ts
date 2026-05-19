import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getBusinessForUser } from "@/lib/knowledge/get-user-business";
import { KNOWLEDGE_BUCKET } from "@/lib/knowledge/constants";
import { validateKnowledgeFile } from "@/lib/knowledge/validate-file";
import { processKnowledgeDocument } from "@/lib/rag/process-document";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Replace file for an existing document and re-process */
export async function POST(
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

  const business = await getBusinessForUser(supabase, user.id);
  if (!business) {
    return NextResponse.json({ error: "No business" }, { status: 400 });
  }

  const { data: doc } = await supabase
    .from("knowledge_documents")
    .select("*")
    .eq("id", context.params.documentId)
    .eq("business_id", business.id)
    .maybeSingle();

  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const validationError = validateKnowledgeFile(file);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const admin = createAdminClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${business.id}/${doc.id}/${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await admin.storage.from(KNOWLEDGE_BUCKET).remove([doc.file_path]).catch(() => {});

  const { error: uploadErr } = await admin.storage
    .from(KNOWLEDGE_BUCKET)
    .upload(filePath, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });

  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  await admin
    .from("knowledge_documents")
    .update({
      file_name: file.name,
      file_path: filePath,
      mime_type: file.type || "",
      file_size_bytes: file.size,
      status: "processing",
    })
    .eq("id", doc.id);

  try {
    await processKnowledgeDocument(admin, doc.id);
    return NextResponse.json({ ok: true, status: "ready" });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Processing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
