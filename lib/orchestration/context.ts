/**
 * Fetch orchestration context: conversation messages, RAG, external sources.
 * Reuses logic from app/api/messages/stream.
 */

import { prisma } from "@/lib/prisma";
import { generateEmbedding } from "@/lib/embeddings";
import { findSimilarDocuments } from "@/lib/db";
import { searchMultipleSources } from "@/lib/sources/search";
import type { SourceType } from "@/components/chat/source-selector";
import type { OrchestrationContext } from "./types";

export interface FetchContextOptions {
  userId: string;
  input: string;
  conversationId?: string;
  spaceId?: string;
  sources?: string[];
}

/**
 * Fetch orchestration context for agent execution.
 * When conversationId is provided: verify ownership, load last 20 messages, RAG, external sources.
 */
export async function fetchOrchestrationContext(
  options: FetchContextOptions
): Promise<OrchestrationContext> {
  const { userId, input, conversationId, spaceId, sources = [] } = options;

  let messages: Array<{ role: "user" | "assistant" | "system"; content: string }> = [];
  let sourceContext = "";
  let spaceInstructions = "";

  if (conversationId) {
    const conversation = await prisma.conversations.findFirst({
      where: { id: conversationId, userId },
    });
    if (conversation) {
      const previousMessages = await prisma.messages.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
        take: 20,
      });
      messages = previousMessages.map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      }));
    }
  }

  if (spaceId) {
    const space = await prisma.spaces.findUnique({
      where: { id: spaceId },
      select: { instructions: true },
    });
    if (space?.instructions?.trim()) {
      spaceInstructions = "\n\n" + space.instructions.trim() + "\n\n";
    }
  }

  const sourceContextParts: string[] = [];

  const shouldSearchFiles =
    sources.includes("my_files") || sources.includes("org_files");
  if (shouldSearchFiles) {
    try {
      const embeddingResponse = await generateEmbedding(input, "openai");
      const similarDocs = await findSimilarDocuments(
        embeddingResponse.embedding,
        3,
        0.7,
        spaceId || undefined
      );

      const whereClause: {
        id: { in: string[] };
        userId: string;
        source?: { not?: string } | string;
      } = {
        id: { in: similarDocs.map((d: { id: string }) => d.id) },
        userId,
      };
      if (sources.includes("my_files") && !sources.includes("org_files")) {
        whereClause.source = { not: "org" };
      } else if (sources.includes("org_files") && !sources.includes("my_files")) {
        whereClause.source = "org";
      }

      const userDocs = await prisma.document_indexes.findMany({
        where: whereClause,
        take: 3,
      });

      if (userDocs.length > 0) {
        sourceContextParts.push(
          "\n\nRelevant context from your documents:\n" +
            userDocs
              .map(
                (doc, idx) =>
                  `[${idx + 1}] ${doc.title}\n${doc.content.substring(0, 500)}${doc.content.length > 500 ? "..." : ""}`
              )
              .join("\n\n")
        );
      }
    } catch {
      // Continue without RAG context if it fails
    }
  }

  const externalSources = sources.filter((s) =>
    ["web", "academic", "news", "finance"].includes(s)
  ) as SourceType[];
  const effectiveExternal: SourceType[] =
    externalSources.length > 0 ? (["web", ...externalSources] as SourceType[]) : ["web"];

  if (effectiveExternal.length > 0) {
    try {
      const searchResults = await searchMultipleSources(input, effectiveExternal);
      const contextParts: string[] = [];
      searchResults.forEach((result) => {
        if (result.results.length > 0) {
          const sourceName =
            result.source.charAt(0).toUpperCase() + result.source.slice(1);
          contextParts.push(`\n\n${sourceName} Search Results:`);
          result.results.slice(0, 3).forEach((item, idx) => {
            contextParts.push(
              `[${idx + 1}] ${item.title}\n   URL: ${item.url}\n   ${item.snippet}`
            );
          });
        }
      });
      if (contextParts.length > 0) {
        sourceContextParts.push(
          "\n\nExternal Search Results:" + contextParts.join("\n")
        );
      }
    } catch {
      // Continue without external search if it fails
    }
  }

  sourceContext = sourceContextParts.join("");

  if (sources.length > 0) {
    sourceContext +=
      `\n\nUser has selected the following data sources: ${sources.join(", ")}. When answering, prioritize information from these sources if available.`;
  }

  return {
    messages,
    sourceContext,
    spaceInstructions,
  };
}
