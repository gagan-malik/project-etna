/**
 * Document Indexing Service
 * Handles chunking documents and generating embeddings
 */

import { prisma } from "@/lib/prisma";
import { generateEmbedding } from "@/lib/embeddings";

export interface Chunk {
  text: string;
  startIndex: number;
  endIndex: number;
}

/**
 * Chunk text into smaller pieces for embedding
 * Uses a simple strategy: split by sentences, then group into chunks of max size
 */
export function chunkText(
  text: string,
  maxChunkSize: number = 1000,
  overlap: number = 200
): Chunk[] {
  if (text.length <= maxChunkSize) {
    return [{ text, startIndex: 0, endIndex: text.length }];
  }

  const chunks: Chunk[] = [];
  let startIndex = 0;

  // Split by sentences (simple approach)
  const sentences = text.split(/(?<=[.!?])\s+/);
  let currentChunk = "";

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxChunkSize) {
      currentChunk += sentence + " ";
    } else {
      if (currentChunk) {
        chunks.push({
          text: currentChunk.trim(),
          startIndex,
          endIndex: startIndex + currentChunk.length,
        });
        startIndex += currentChunk.length - overlap; // Overlap for context
        currentChunk = sentence + " ";
      } else {
        // Sentence is too long, split it
        const words = sentence.split(" ");
        let wordChunk = "";
        for (const word of words) {
          if ((wordChunk + word).length <= maxChunkSize) {
            wordChunk += word + " ";
          } else {
            if (wordChunk) {
              chunks.push({
                text: wordChunk.trim(),
                startIndex,
                endIndex: startIndex + wordChunk.length,
              });
              startIndex += wordChunk.length - overlap;
            }
            wordChunk = word + " ";
          }
        }
        currentChunk = wordChunk;
      }
    }
  }

  // Add remaining chunk
  if (currentChunk.trim()) {
    chunks.push({
      text: currentChunk.trim(),
      startIndex,
      endIndex: startIndex + currentChunk.length,
    });
  }

  return chunks;
}

/**
 * Index a document: chunk it and generate embeddings
 */
export async function indexDocument(
  documentId: string,
  text: string,
  provider: "openai" | "gemini" = "openai"
): Promise<void> {
  // Chunk the document
  const chunks = chunkText(text);

  // Get parent document info
  const parentDoc = await prisma.documentIndex.findUnique({
    where: { id: documentId },
    select: { userId: true, spaceId: true },
  });

  if (!parentDoc) {
    throw new Error("Parent document not found");
  }

  // Generate embeddings for each chunk
  for (const chunk of chunks) {
    try {
      const embeddingResponse = await generateEmbedding(chunk.text, provider);
      const embeddingString = `[${embeddingResponse.embedding.join(",")}]`;
      
      // Store chunk in DocumentIndex using raw SQL (embedding is Unsupported in Prisma)
      const result = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
        `INSERT INTO document_indexes (id, title, content, url, source, source_id, user_id, space_id, metadata, embedding, created_at, updated_at)
         VALUES (gen_random_uuid()::text, $1, $2, NULL, $3, $4, $5, $6, $7::jsonb, $8::vector, NOW(), NOW())
         RETURNING id`,
        `Chunk from document ${documentId}`,
        chunk.text,
        "chunk",
        documentId,
        parentDoc.userId,
        parentDoc.spaceId,
        JSON.stringify({
          chunkIndex: chunks.indexOf(chunk),
          startIndex: chunk.startIndex,
          endIndex: chunk.endIndex,
          parentDocumentId: documentId,
        }),
        embeddingString
      );
    } catch (error) {
      console.error(`Error indexing chunk ${chunks.indexOf(chunk)}:`, error);
      // Continue with other chunks
    }
  }
}

/**
 * Update document embedding (re-index)
 */
export async function reindexDocument(
  documentId: string,
  provider: "openai" | "gemini" = "openai"
): Promise<void> {
  const document = await prisma.documentIndex.findUnique({
    where: { id: documentId },
  });

  if (!document) {
    throw new Error("Document not found");
  }

  // Delete existing chunks
  await prisma.documentIndex.deleteMany({
    where: {
      source: "chunk",
      sourceId: documentId,
    },
  });

  // Re-index
  await indexDocument(documentId, document.content, provider);
}

