/**
 * POST /api/orchestration/run/stream
 * Streaming orchestration run (SSE).
 */

import { auth } from "@/auth";
import { validateInput } from "@/lib/validation";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import {
  runCreateSchema,
  classifyIntent,
  routeIntent,
  fetchOrchestrationContext,
  executeRunStreaming,
} from "@/lib/orchestration";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const correlationId =
    req.headers.get("X-Correlation-ID") ?? `stream-${Date.now()}`;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          message: "Session required",
        }),
        { status: 401 }
      );
    }

    const rateLimitResult = checkRateLimit(
      session.user.id,
      "/api/orchestration/run/stream"
    );
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            ...getRateLimitHeaders(
              rateLimitResult.remaining,
              rateLimitResult.resetTime
            ),
          },
        }
      );
    }

    const body = await req.json();
    const validation = validateInput(runCreateSchema, body);
    if (!validation.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request",
          message: validation.error,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { input, conversationId, spaceId, sources, model } = validation.data;

    const intent = classifyIntent(input);
    const agentIds = routeIntent(intent);

    const context = await fetchOrchestrationContext({
      userId: session.user.id,
      input,
      conversationId,
      spaceId,
      sources,
    });

    const run = await prisma.agent_runs.create({
      data: {
        userId: session.user.id,
        conversationId: conversationId ?? null,
        spaceId: spaceId ?? null,
        status: "pending",
        intent,
        input,
        model: model ?? null,
      },
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        function emit(event: Record<string, unknown>) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
          );
        }

        try {
          await executeRunStreaming(
            {
              runId: run.id,
              userId: session.user.id,
              input,
              intent,
              agentIds,
              context,
              model,
              conversationId,
              spaceId,
            },
            (evt) => emit(evt as Record<string, unknown>)
          );
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Unknown error";
          emit({ type: "error", error: message });
          console.error(`[${correlationId}] Orchestration stream error:`, err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Correlation-ID": correlationId,
      },
    });
  } catch (err) {
    console.error(`[${correlationId}] Orchestration stream setup error:`, err);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "Failed to start stream",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
