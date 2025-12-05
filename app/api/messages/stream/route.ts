import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { streamAIResponse } from "@/lib/ai";
import { generateEmbedding } from "@/lib/embeddings";
import { findSimilarDocuments } from "@/lib/db";

// POST /api/messages/stream - Create a message and stream AI response
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { conversationId, content, model, provider } = body;

    if (!conversationId || !content) {
      return NextResponse.json(
        { error: "Missing required fields: conversationId, content" },
        { status: 400 }
      );
    }

    // Verify conversation ownership
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: session.user.id,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Get conversation messages for context
    const previousMessages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      take: 20, // Limit to last 20 messages for context
    });

    // Create user message
    const userMessage = await prisma.message.create({
      data: {
        conversationId,
        role: "user",
        content,
        metadata: {},
      },
    });

    // Update conversation's updatedAt timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // RAG: Search for relevant documents
    let relevantContext = "";
    try {
      const embeddingResponse = await generateEmbedding(content, "openai");
      const similarDocs = await findSimilarDocuments(
        embeddingResponse.embedding,
        3, // Get top 3 relevant documents
        0.7,
        conversation.spaceId || undefined
      );

      // Filter by user ownership
      const userDocs = await prisma.documentIndex.findMany({
        where: {
          id: { in: similarDocs.map((d) => d.id) },
          userId: session.user.id,
        },
        take: 3,
      });

      if (userDocs.length > 0) {
        relevantContext = "\n\nRelevant context from your documents:\n" +
          userDocs.map((doc, idx) => 
            `[${idx + 1}] ${doc.title}\n${doc.content.substring(0, 500)}${doc.content.length > 500 ? "..." : ""}`
          ).join("\n\n");
      }
    } catch (ragError) {
      console.error("RAG error (continuing without context):", ragError);
      // Continue without RAG context if it fails
    }

    // Prepare messages for AI (include previous messages for context + RAG context)
    const aiMessages = [
      ...previousMessages.map((msg) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
      })),
      {
        role: "user" as const,
        content: relevantContext ? `${content}${relevantContext}` : content,
      },
    ];

    // Create a ReadableStream for streaming response
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        
        try {
          // Use real AI service
          const aiStream = streamAIResponse(
            {
              messages: aiMessages,
              model: model || undefined,
              temperature: 0.7,
              maxTokens: 2000,
            },
            model
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
              await prisma.message.create({
                data: {
                  conversationId,
                  role: "assistant",
                  content: fullResponse,
                  model: model || null,
                  provider: provider || null,
                  metadata: {
                    streamed: true,
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
          await prisma.message.create({
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

