import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  MAX_FILE_BYTES,
} from "@/lib/knowledge/constants";

export function validateKnowledgeFile(file: File): string | null {
  if (file.size > MAX_FILE_BYTES) {
    return `File is too large. Max ${MAX_FILE_BYTES / 1024 / 1024} MB.`;
  }

  const name = file.name.toLowerCase();
  const extOk = ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
  const mimeOk = ALLOWED_MIME_TYPES.includes(
    file.type as (typeof ALLOWED_MIME_TYPES)[number]
  );

  if (!extOk && !mimeOk) {
    return "Unsupported file type. Upload PDF, DOCX, TXT, or Markdown.";
  }

  return null;
}
