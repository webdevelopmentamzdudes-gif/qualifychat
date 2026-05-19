export const KNOWLEDGE_BUCKET = "knowledge-docs";

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const ALLOWED_EXTENSIONS = [".pdf", ".txt", ".md", ".docx"] as const;

export const MAX_FILE_BYTES =
  Number(process.env.KNOWLEDGE_MAX_FILE_MB || 10) * 1024 * 1024;

export const MAX_CHUNKS_PER_DOCUMENT = Number(
  process.env.KNOWLEDGE_MAX_CHUNKS_PER_DOC || 150
);

export const EMBEDDING_MODEL =
  process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

export const EMBEDDING_DIMENSIONS = 1536;

export const CHUNK_SIZE_CHARS = 2400;
export const CHUNK_OVERLAP_CHARS = 300;

export const RAG_MATCH_COUNT = 8;
export const RAG_MATCH_THRESHOLD = 0.65;
