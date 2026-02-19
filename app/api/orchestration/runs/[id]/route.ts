/**
 * GET /api/orchestration/runs/[id]
 * Get a single orchestration run with tasks.
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const correlationId =
    req.headers.get("X-Correlation-ID") ?? `run-${id}`;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Session required" },
        { status: 401 }
      );
    }

    const run = await prisma.agent_runs.findFirst({
      where: { id, userId: session.user.id },
      include: {
        agent_tasks: { orderBy: { orderIndex: "asc" } },
      },
    });

    if (!run) {
      return NextResponse.json(
        { error: "Not found", message: "Run not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: { run } },
      {
        status: 200,
        headers: { "X-Correlation-ID": correlationId },
      }
    );
  } catch (err) {
    console.error(`[${correlationId}] Get run error:`, err);
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to get run" },
      { status: 500, headers: { "X-Correlation-ID": correlationId } }
    );
  }
}
