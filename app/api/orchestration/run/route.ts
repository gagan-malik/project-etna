/**
 * POST /api/orchestration/run
 * Non-streaming orchestration run.
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { validateInput } from "@/lib/validation";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import {
  runCreateSchema,
  classifyIntent,
  routeIntent,
  fetchOrchestrationContext,
  executeRunSync,
} from "@/lib/orchestration";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const correlationId =
    req.headers.get("X-Correlation-ID") ?? `run-${Date.now()}`;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Session required" },
        { status: 401 }
      );
    }

    const rateLimitResult = checkRateLimit(
      session.user.id,
      "/api/orchestration/run"
    );
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later.",
        },
        {
          status: 429,
          headers: getRateLimitHeaders(
            rateLimitResult.remaining,
            rateLimitResult.resetTime
          ),
        }
      );
    }

    const body = await req.json();
    const validation = validateInput(runCreateSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", message: validation.error },
        { status: 400 }
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

    const { finalOutput, status } = await executeRunSync({
      runId: run.id,
      userId: session.user.id,
      input,
      intent,
      agentIds,
      context,
      model,
      conversationId,
      spaceId,
    });

    const runWithTasks = await prisma.agent_runs.findUnique({
      where: { id: run.id },
      include: {
        agent_tasks: { orderBy: { orderIndex: "asc" } },
      },
    });

    return NextResponse.json(
      {
        data: {
          run: runWithTasks,
          finalOutput,
          status,
        },
      },
      {
        status: 200,
        headers: { "X-Correlation-ID": correlationId },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error(`[${correlationId}] Orchestration run error:`, err);
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to execute run" },
      { status: 500, headers: { "X-Correlation-ID": correlationId } }
    );
  }
}
