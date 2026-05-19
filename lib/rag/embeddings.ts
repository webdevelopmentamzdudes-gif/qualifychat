import OpenAI from "openai";
import {
  EMBEDDING_DIMENSIONS,
  EMBEDDING_MODEL,
} from "@/lib/knowledge/constants";

export async function embedTexts(
  openai: OpenAI,
  texts: string[]
): Promise<number[][]> {
  if (texts.length === 0) return [];

  const batchSize = 50;
  const all: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize).map((t) => t.slice(0, 8000));
    const res = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: batch,
      dimensions: EMBEDDING_DIMENSIONS,
    });
    for (const item of res.data) {
      all.push(item.embedding);
    }
  }

  return all;
}

export async function embedQuery(
  openai: OpenAI,
  query: string
): Promise<number[]> {
  const res = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: query.slice(0, 8000),
    dimensions: EMBEDDING_DIMENSIONS,
  });
  return res.data[0].embedding;
}
