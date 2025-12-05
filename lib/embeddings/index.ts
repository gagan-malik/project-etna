/**
 * Embedding Service
 * Unified interface for generating embeddings from different providers
 */

import OpenAI from "openai";

export interface EmbeddingRequest {
  text: string;
  model?: string;
}

export interface EmbeddingResponse {
  embedding: number[];
  model: string;
  provider: string;
}

/**
 * Generate embedding using OpenAI
 */
export async function generateEmbeddingOpenAI(
  text: string,
  model: string = "text-embedding-3-small"
): Promise<EmbeddingResponse> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.embeddings.create({
    model,
    input: text,
  });

  return {
    embedding: response.data[0].embedding,
    model: response.model,
    provider: "openai",
  };
}

/**
 * Generate embedding using Google Gemini
 * Note: Gemini doesn't have a direct embeddings API, but we can use the generative model
 * For now, we'll use OpenAI as the primary embedding provider
 */
export async function generateEmbeddingGemini(
  text: string
): Promise<EmbeddingResponse> {
  // Gemini doesn't have embeddings API, so we'll use OpenAI as fallback
  // In production, you might want to use a different approach
  return generateEmbeddingOpenAI(text);
}

/**
 * Main embedding generation function
 * Uses OpenAI by default, falls back to available providers
 */
export async function generateEmbedding(
  text: string,
  provider: "openai" | "gemini" = "openai"
): Promise<EmbeddingResponse> {
  switch (provider) {
    case "openai":
      return generateEmbeddingOpenAI(text);
    case "gemini":
      return generateEmbeddingGemini(text);
    default:
      return generateEmbeddingOpenAI(text);
  }
}

/**
 * Generate embeddings for multiple texts in batch
 */
export async function generateEmbeddingsBatch(
  texts: string[],
  provider: "openai" | "gemini" = "openai"
): Promise<EmbeddingResponse[]> {
  if (provider === "openai") {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: texts,
    });

    return response.data.map((item, index) => ({
      embedding: item.embedding,
      model: response.model,
      provider: "openai",
    }));
  }

  // For other providers, generate one by one
  return Promise.all(
    texts.map((text) => generateEmbedding(text, provider))
  );
}

