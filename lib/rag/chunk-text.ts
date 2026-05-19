import { CHUNK_OVERLAP_CHARS, CHUNK_SIZE_CHARS } from "@/lib/knowledge/constants";

/**
 * Split long text into overlapping chunks for embedding.
 * Uses paragraph boundaries when possible.
 */
export function chunkText(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = "";

  const flush = () => {
    const piece = current.trim();
    if (piece) chunks.push(piece);
    current = "";
  };

  for (const para of paragraphs) {
    if (!current) {
      current = para;
      continue;
    }
    if ((current + "\n\n" + para).length <= CHUNK_SIZE_CHARS) {
      current = current + "\n\n" + para;
    } else {
      flush();
      if (para.length <= CHUNK_SIZE_CHARS) {
        current = para;
      } else {
        for (let i = 0; i < para.length; i += CHUNK_SIZE_CHARS - CHUNK_OVERLAP_CHARS) {
          chunks.push(para.slice(i, i + CHUNK_SIZE_CHARS));
        }
        current = "";
      }
    }
  }
  flush();

  if (chunks.length === 0 && normalized.length > 0) {
    for (let i = 0; i < normalized.length; i += CHUNK_SIZE_CHARS - CHUNK_OVERLAP_CHARS) {
      chunks.push(normalized.slice(i, i + CHUNK_SIZE_CHARS));
    }
  }

  return chunks;
}
