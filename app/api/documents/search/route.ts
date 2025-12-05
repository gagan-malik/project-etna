import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { findSimilarDocuments } from "@/lib/db";
import { generateEmbedding } from "@/lib/embeddings";

// POST /api/documents/search - Vector similarity search
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { query, limit = 5, spaceId } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    try {
      // Generate embedding for the query
      const embeddingResponse = await generateEmbedding(query, "openai");
      
      // Find similar documents using vector search
      const similarDocs = await findSimilarDocuments(
        embeddingResponse.embedding,
        limit,
        0.7, // similarity threshold
        spaceId || undefined
      );

      // Filter by user ownership
        const userDocs = await prisma.document_indexes.findMany({
          where: {
            id: { in: similarDocs.map((d: { id: string }) => d.id) },
            userId: session.user.id,
          },
        });

      return NextResponse.json({
        documents: userDocs,
        query,
        method: "vector",
        similarity: similarDocs.map((d: { id: string; similarity: number }) => ({
          id: d.id,
          similarity: d.similarity,
        })),
      });
    } catch (embeddingError) {
      console.error("Embedding error, falling back to text search:", embeddingError);
      
      // Fallback to text search if embedding fails
      const documents = await prisma.document_indexes.findMany({
        where: {
          userId: session.user.id,
          ...(spaceId && { spaceId }),
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json({
        documents,
        query,
        method: "text",
        note: "Vector search failed, using text search fallback",
      });
    }
  } catch (error) {
    console.error("Error searching documents:", error);
    return NextResponse.json(
      { error: "Failed to search documents" },
      { status: 500 }
    );
  }
}

