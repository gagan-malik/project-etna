import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { streamAIResponse, getAvailableModels } from "@/lib/ai";
import { generateEmbedding } from "@/lib/embeddings";
import { findSimilarDocuments } from "@/lib/db";
import { searchMultipleSources } from "@/lib/sources/search";
import { hasPremiumAccess } from "@/lib/subscription";
import { getHighestQualityModel } from "@/lib/ai/model-ranking";
import type { SourceType } from "@/components/chat/source-selector";

// POST /api/messages/stream - Create a message and stream AI response
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      conversationId,
      content,
      model,
      provider,
      sources = [],
      maxMode = false,
      useMultipleModels = false,
      workerSlug,
      expandedContent,
      additionalSkillIds = [],
    } = body;

    if (!conversationId) {
      return NextResponse.json(
        { error: "Missing required field: conversationId" },
        { status: 400 }
      );
    }

    // Allow empty content when worker or expanded content is provided
    const hasWorker = workerSlug && typeof workerSlug === "string" && workerSlug.trim();
    const hasExpanded = typeof expandedContent === "string" && expandedContent.trim().length > 0;
    const hasContent = typeof content === "string" && content.trim().length > 0;
    if (!hasContent && !hasExpanded && !hasWorker) {
      return NextResponse.json(
        { error: "Missing required field: content (or expandedContent / workerSlug with content)" },
        { status: 400 }
      );
    }

    const effectiveContent =
      hasExpanded
        ? (expandedContent as string).trim()
        : hasContent
          ? (content as string).trim()
          : hasWorker
            ? "Please proceed."
            : "";

    // Check premium access for premium features
    const userHasPremium = await hasPremiumAccess(session.user.id);

    if (maxMode && !userHasPremium) {
      return NextResponse.json(
        {
          error: "Premium feature",
          message: "MAX Mode requires a premium subscription. Please upgrade to access this feature.",
        },
        { status: 403 }
      );
    }

    if (useMultipleModels && !userHasPremium) {
      return NextResponse.json(
        {
          error: "Premium feature",
          message:
            "Use Multiple Models requires a premium subscription. Please upgrade to access this feature.",
        },
        { status: 403 }
      );
    }

    // Apply MAX Mode - override model with highest quality
    let modelToUse = model;
    let providerToUse = provider;
    if (maxMode && userHasPremium) {
      const availableModels = getAvailableModels();
      const highestQualityModel = getHighestQualityModel(availableModels);
      if (highestQualityModel) {
        modelToUse = highestQualityModel.id;
        providerToUse = highestQualityModel.provider;
      }
    }

    // Verify conversation ownership and load user preferences (for extension RPC tracer)
    const [conversation, user] = await Promise.all([
      prisma.conversations.findFirst({
        where: {
          id: conversationId,
          userId: session.user.id,
        },
      }),
      prisma.users.findUnique({
        where: { id: session.user.id },
        select: { userPreferences: true },
      }),
    ]);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const prefs = (user?.userPreferences as Record<string, unknown> | null) ?? {};
    if (prefs.extensionRpcTracer === true && process.env.NODE_ENV === "development") {
      console.log(`[RPC] POST /api/messages/stream ${new Date().toISOString()}`);
    }

    // Worker path: load worker by slug (user-scoped, optional space)
    let worker: { id: string; systemPrompt: string; modelId: string | null } | null = null;
    if (workerSlug && typeof workerSlug === "string") {
      const w = await prisma.workers.findFirst({
        where: {
          slug: workerSlug.trim(),
          userId: session.user.id,
          ...(conversation.spaceId ? { spaceId: conversation.spaceId } : {}),
        },
      });
      if (w) worker = { id: w.id, systemPrompt: w.systemPrompt, modelId: w.modelId };
      else {
        return NextResponse.json(
          { error: "Worker not found" },
          { status: 404 }
        );
      }
    }

    // Load enabled skills + any additional skill IDs for this message (Cursor-style / skill)
    const prefsSkillIds = (prefs.enabledSkillIds as string[] | undefined) ?? [];
    const extraIds = Array.isArray(additionalSkillIds) ? (additionalSkillIds as string[]) : [];
    const allSkillIds = [...new Set([...prefsSkillIds, ...extraIds])];
    let skillsContext = "";
    if (allSkillIds.length > 0) {
      const skillRows = await prisma.skills.findMany({
        where: {
          id: { in: allSkillIds },
          OR: [{ userId: null }, { userId: session.user.id }],
        },
        select: { systemPromptFragment: true },
      });
      if (skillRows.length > 0) {
        skillsContext =
          "\n\n## Additional guidelines (enabled skills)\n" +
          skillRows.map((s) => s.systemPromptFragment).join("\n\n");
      }
    }

    // Get conversation messages for context
    const previousMessages = await prisma.messages.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      take: 20, // Limit to last 20 messages for context
    });

    // Create user message (store effective content)
    await prisma.messages.create({
      data: {
        conversationId,
        role: "user",
        content: effectiveContent,
        metadata: worker ? { workerSlug } : {},
      },
    });

    // Update conversation's updatedAt timestamp
    await prisma.conversations.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Worker path: override model if worker has modelId
    if (worker?.modelId) {
      modelToUse = worker.modelId;
      providerToUse = null;
    }

    // RAG: Search for relevant documents (skip for worker path)
    let relevantContext = "";
    const shouldSearchFiles =
      !worker && (sources.includes("my_files") || sources.includes("org_files"));

    if (shouldSearchFiles) {
      try {
        const embeddingResponse = await generateEmbedding(effectiveContent, "openai");
        const similarDocs = await findSimilarDocuments(
          embeddingResponse.embedding,
          3, // Get top 3 relevant documents
          0.7,
          conversation.spaceId || undefined
        );

        // Build where clause based on selected sources
        const whereClause: any = {
          id: { in: similarDocs.map((d: { id: string }) => d.id) },
          userId: session.user.id,
        };

        // Filter by source type if specified
        if (sources.includes("my_files") && !sources.includes("org_files")) {
          // Only user's personal files (not org files)
          whereClause.source = { not: "org" };
        } else if (sources.includes("org_files") && !sources.includes("my_files")) {
          // Only org files
          whereClause.source = "org";
        }
        // If both are selected, include all files (no source filter)

        // Filter by user ownership and source
        const userDocs = await prisma.document_indexes.findMany({
          where: whereClause,
          take: 3,
        });

        if (userDocs.length > 0) {
          relevantContext = "\n\nRelevant context from your documents:\n" +
            userDocs.map((doc: any, idx: number) => 
              `[${idx + 1}] ${doc.title}\n${doc.content.substring(0, 500)}${doc.content.length > 500 ? "..." : ""}`
            ).join("\n\n");
        }
      } catch (ragError) {
        console.error("RAG error (continuing without context):", ragError);
        // Continue without RAG context if it fails
      }
    }

    // Search external sources (web, academic, news, finance)
    // Respect user preference: agentWebSearchTool OFF = never search web; ON = include web when selected or always for this request
    const agentWebSearchEnabled = prefs.agentWebSearchTool !== false;
    let externalSources: SourceType[] = sources.filter((s: SourceType) =>
      ["web", "academic", "news", "finance"].includes(s)
    ) as SourceType[];
    if (!agentWebSearchEnabled) {
      externalSources = externalSources.filter((s) => s !== "web");
    } else if (!externalSources.includes("web")) {
      externalSources = ["web", ...externalSources];
    }

    let externalSearchContext = "";
    if (!worker && externalSources.length > 0) {
      try {
        const searchResults = await searchMultipleSources(effectiveContent, externalSources);
        
        const contextParts: string[] = [];
        searchResults.forEach((result) => {
          if (result.results.length > 0) {
            const sourceName = result.source.charAt(0).toUpperCase() + result.source.slice(1);
            contextParts.push(`\n\n${sourceName} Search Results:`);
            result.results.slice(0, 3).forEach((item, idx) => {
              contextParts.push(
                `[${idx + 1}] ${item.title}\n   URL: ${item.url}\n   ${item.snippet}`
              );
            });
          }
        });

        if (contextParts.length > 0) {
          externalSearchContext = "\n\nExternal Search Results:" + contextParts.join("\n");
        }
      } catch (searchError) {
        console.error("External search error:", searchError);
        // Continue without external search context if it fails
      }
    }

    // Add source context to system message
    const sourceContext = sources.length > 0
      ? `\n\nUser has selected the following data sources: ${sources.join(", ")}. When answering, prioritize information from these sources if available.`
      : "";

    // Build context from third-party integrations if selected
    let integrationContext = "";
    const thirdPartySources: SourceType[] = sources.filter((s: SourceType) => 
      ["github", "gmail", "google_drive", "slack", "confluence", "microsoft_graph"].includes(s)
    ) as SourceType[];

    if (!worker && thirdPartySources.length > 0) {
      // TODO: Fetch data from integrations based on selected sources
      // For now, add a note that integrations are enabled
      integrationContext = `\n\nUser has enabled the following integrations: ${thirdPartySources.join(", ")}. Search these sources for relevant information.`;
    }

    // Prepare messages for AI
    const systemMessage = worker
      ? worker.systemPrompt + skillsContext
      : `You are an AI assistant. Answer the user's question based on the provided context and conversation history.${sourceContext}${integrationContext}${skillsContext}`;

    const userMessageContent = worker
      ? effectiveContent
      : [effectiveContent, relevantContext, externalSearchContext].filter(Boolean).join("\n");
    
    const aiMessages = [
      {
        role: "system" as const,
        content: systemMessage,
      },
      ...previousMessages.map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
      })),
      {
        role: "user" as const,
        content: userMessageContent,
      },
    ];

    // Create a ReadableStream for streaming response
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        
        try {
          // Handle Multiple Models if enabled
          if (useMultipleModels && userHasPremium) {
            const availableModels = getAvailableModels();
            const topModels = availableModels
              .filter((m) => m.available)
              .slice(0, 3); // Use top 3 models

            // Stream from multiple models in parallel
            const modelStreams = topModels.map((m) =>
              streamAIResponse(
                {
                  messages: aiMessages,
                  model: m.id,
                  temperature: 0.7,
                  maxTokens: 2000,
                },
                m.id
              )
            );

            // Combine responses from all models
            const responses: string[] = [];
            const modelNames: string[] = [];

            for (let i = 0; i < modelStreams.length; i++) {
              let modelResponse = "";
              for await (const chunk of modelStreams[i]) {
                if (chunk.content) {
                  modelResponse += chunk.content;
                }
                if (chunk.done) {
                  responses.push(modelResponse);
                  modelNames.push(topModels[i].name);
                  break;
                }
              }
            }

            // Combine all responses
            fullResponse = `Combined responses from ${modelNames.join(", ")}:\n\n`;
            responses.forEach((resp, idx) => {
              fullResponse += `[${modelNames[idx]}]:\n${resp}\n\n`;
            });

            // Stream the combined response
            const chunks = fullResponse.split("");
            for (const chunk of chunks) {
              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({ content: chunk, done: false })}\n\n`
                )
              );
            }

            controller.enqueue(
              new TextEncoder().encode(`data: ${JSON.stringify({ done: true })}\n\n`)
            );

            // Create assistant message in database
            await prisma.messages.create({
              data: {
                conversationId,
                role: "assistant",
                content: fullResponse,
                model: modelToUse || null,
                provider: providerToUse || null,
                metadata: {
                  streamed: true,
                  multipleModels: true,
                  modelsUsed: modelNames,
                },
              },
            });

            controller.close();
            return;
          }

          // Single model streaming (default)
          const aiStream = streamAIResponse(
            {
              messages: aiMessages,
              model: modelToUse || undefined,
              temperature: 0.7,
              maxTokens: 2000,
            },
            modelToUse
          );

          // Stream AI response
          for await (const chunk of aiStream) {
            if (chunk.content) {
              fullResponse += chunk.content;
              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({ content: chunk.content, done: false })}\n\n`
                )
              );
            }

            if (chunk.done) {
              // Send final message
              controller.enqueue(
                new TextEncoder().encode(`data: ${JSON.stringify({ done: true })}\n\n`)
              );

              // Create assistant message in database
              await prisma.messages.create({
                data: {
                  conversationId,
                  role: "assistant",
                  content: fullResponse,
                  model: modelToUse || null,
                  provider: providerToUse || null,
                  metadata: {
                    streamed: true,
                    maxMode: maxMode && userHasPremium,
                    ...chunk.metadata,
                  },
                },
              });

              controller.close();
              return;
            }
          }
        } catch (error: any) {
          console.error("AI streaming error:", error);
          
          // Send error to client
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ 
                error: error.message || "Failed to generate response",
                done: true 
              })}\n\n`
            )
          );

          // Create error message in database
          await prisma.messages.create({
            data: {
              conversationId,
              role: "assistant",
              content: `Error: ${error.message || "Failed to generate AI response"}`,
              model: model || null,
              provider: provider || null,
              metadata: {
                error: true,
                errorMessage: error.message,
              },
            },
          });

          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Error creating streaming message:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create streaming message" },
      { status: 500 }
    );
  }
}

