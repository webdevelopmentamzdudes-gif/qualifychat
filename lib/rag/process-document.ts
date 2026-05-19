import type { SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import {
  KNOWLEDGE_BUCKET,
  MAX_CHUNKS_PER_DOCUMENT,
} from "@/lib/knowledge/constants";
import { chunkText } from "@/lib/rag/chunk-text";
import { extractTextFromBuffer } from "@/lib/rag/extract-text";
import { embedTexts } from "@/lib/rag/embeddings";

/**
 * Download file from storage, extract text, chunk, embed, and store in document_chunks.
 * Can also re-process from extracted_text only (manual edit path).
 */
export async function processKnowledgeDocument(
  admin: SupabaseClient,
  documentId: string,
  options?: { textOverride?: string }
) {
  const { data: doc, error: docErr } = await admin
    .from("knowledge_documents")
    .select("*")
    .eq("id", documentId)
    .single();

  if (docErr || !doc) throw new Error("Document not found");

  await admin
    .from("knowledge_documents")
    .update({ status: "processing", error_message: "" })
    .eq("id", documentId);

  await admin.from("document_chunks").delete().eq("document_id", documentId);

  try {
    let text = options?.textOverride?.trim() ?? "";

    if (!text) {
      const { data: fileData, error: dlErr } = await admin.storage
        .from(KNOWLEDGE_BUCKET)
        .download(doc.file_path);

      if (dlErr || !fileData) {
        throw new Error(dlErr?.message || "Could not download file");
      }

      const buffer = Buffer.from(await fileData.arrayBuffer());
      text = await extractTextFromBuffer(
        buffer,
        doc.mime_type || "",
        doc.file_name
      );
    }

    if (!text || text.length < 10) {
      throw new Error(
        "No readable text found in this file. Try a different format or paste text manually."
      );
    }

    let chunks = chunkText(text);
    if (chunks.length > MAX_CHUNKS_PER_DOCUMENT) {
      chunks = chunks.slice(0, MAX_CHUNKS_PER_DOCUMENT);
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) throw new Error("OPENAI_API_KEY is not configured");

    const openai = new OpenAI({ apiKey: openaiKey });
    const embeddings = await embedTexts(openai, chunks);

    const rows = chunks.map((content, index) => ({
      document_id: documentId,
      business_id: doc.business_id,
      chunk_index: index,
      content,
      token_estimate: Math.ceil(content.length / 4),
      embedding: embeddings[index],
    }));

    if (rows.length > 0) {
      const { error: insErr } = await admin.from("document_chunks").insert(rows);
      if (insErr) throw insErr;
    }

    await admin
      .from("knowledge_documents")
      .update({
        status: "ready",
        extracted_text: text.slice(0, 500000),
        chunk_count: chunks.length,
        error_message: "",
      })
      .eq("id", documentId);

    return { chunkCount: chunks.length, textLength: text.length };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Processing failed";
    await admin
      .from("knowledge_documents")
      .update({ status: "failed", error_message: message })
      .eq("id", documentId);
    throw e;
  }
}
