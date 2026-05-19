import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getBusinessForUser } from "@/lib/knowledge/get-user-business";
import { KNOWLEDGE_BUCKET } from "@/lib/knowledge/constants";
import { validateKnowledgeFile } from "@/lib/knowledge/validate-file";
import { processKnowledgeDocument } from "@/lib/rag/process-document";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Upload one or more files, extract text, chunk, and embed */
export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const business = await getBusinessForUser(supabase, user.id);
  if (!business) {
    return NextResponse.json(
      { error: "Create a business profile first." },
      { status: 400 }
    );
  }

  const formData = await req.formData();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const admin = createAdminClient();
  const results: { id: string; fileName: string; status: string }[] = [];

  for (const file of files) {
    const validationError = validateKnowledgeFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const documentId = crypto.randomUUID();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${business.id}/${documentId}/${safeName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadErr } = await admin.storage
      .from(KNOWLEDGE_BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
      });

    if (uploadErr) {
      return NextResponse.json(
        { error: `Upload failed: ${uploadErr.message}` },
        { status: 500 }
      );
    }

    const { data: docRow, error: insErr } = await admin
      .from("knowledge_documents")
      .insert({
        id: documentId,
        business_id: business.id,
        file_name: file.name,
        file_path: filePath,
        mime_type: file.type || "",
        file_size_bytes: file.size,
        status: "processing",
      })
      .select("id")
      .single();

    if (insErr || !docRow) {
      return NextResponse.json(
        { error: insErr?.message || "Could not save document record" },
        { status: 500 }
      );
    }

    try {
      await processKnowledgeDocument(admin, docRow.id);
      results.push({
        id: docRow.id,
        fileName: file.name,
        status: "ready",
      });
    } catch {
      results.push({
        id: docRow.id,
        fileName: file.name,
        status: "failed",
      });
    }
  }

  return NextResponse.json({ uploaded: results });
}
