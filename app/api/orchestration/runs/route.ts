/**
 * GET /api/orchestration/runs
 * List orchestration runs for the current user.
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { validateInput } from "@/lib/validation";
import { runsListQuerySchema } from "@/lib/orchestration/schemas";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const correlationId =
    req.headers.get("X-Correlation-ID") ?? `runs-${Date.now()}`;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Session required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());
    const validation = validateInput(runsListQuerySchema, query);
    const { limit, cursor } = validation.success
      ? validation.data
      : { limit: 20, cursor: undefined };

    const runs = await prisma.agent_runs.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        agent_tasks: {
          orderBy: { orderIndex: "asc" },
          select: { id: true, agentId: true, orderIndex: true, status: true },
        },
      },
    });

    const hasMore = runs.length > limit;
    const items = hasMore ? runs.slice(0, limit) : runs;
    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    return NextResponse.json(
      {
        data: {
          runs: items,
          nextCursor,
          hasMore,
        },
      },
      {
        status: 200,
        headers: { "X-Correlation-ID": correlationId },
      }
    );
  } catch (err) {
    console.error(`[${correlationId}] List runs error:`, err);
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to list runs" },
      { status: 500, headers: { "X-Correlation-ID": correlationId } }
    );
  }
}
