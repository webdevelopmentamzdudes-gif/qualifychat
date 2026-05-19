import type { SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import {
  RAG_MATCH_COUNT,
  RAG_MATCH_THRESHOLD,
} from "@/lib/knowledge/constants";
import { embedQuery } from "@/lib/rag/embeddings";

export type RetrievedChunk = {
  content: string;
  similarity: number;
};

/**
 * Find the most relevant document chunks for a visitor question.
 * Falls back to recent chunks if vector search is unavailable.
 */
export async function retrieveRelevantChunks(
  admin: SupabaseClient,
  businessId: string,
  userMessage: string,
  openai: OpenAI
): Promise<RetrievedChunk[]> {
  try {
    const queryEmbedding = await embedQuery(openai, userMessage);

    const { data, error } = await admin.rpc("match_document_chunks", {
      p_business_id: businessId,
      p_query_embedding: queryEmbedding,
      p_match_count: RAG_MATCH_COUNT,
      p_match_threshold: RAG_MATCH_THRESHOLD,
    });

    if (error) {
      console.warn("Vector search failed, using fallback:", error.message);
    } else if (data && data.length > 0) {
      return data as RetrievedChunk[];
    }
  } catch (e) {
    console.warn("RAG retrieval error, using fallback:", e);
  }

  return fallbackChunks(admin, businessId);
}

async function fallbackChunks(
  admin: SupabaseClient,
  businessId: string
): Promise<RetrievedChunk[]> {
  const { data: docs } = await admin
    .from("knowledge_documents")
    .select("id, extracted_text")
    .eq("business_id", businessId)
    .eq("is_enabled", true)
    .eq("status", "ready")
    .limit(5);

  if (!docs?.length) return [];

  const combined = docs
    .map((d) => d.extracted_text)
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 12000);

  if (!combined) return [];

  return [{ content: combined, similarity: 1 }];
}

export function formatRagContext(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return "";

  const body = chunks
    .map((c, i) => `[Excerpt ${i + 1}]\n${c.content.trim()}`)
    .join("\n\n");

  return `
Relevant excerpts from uploaded business documents (use ONLY with the business profile above; never invent facts not present here):
${body}
`.trim();
}
