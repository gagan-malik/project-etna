import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { validateInput } from "@/lib/validation";
import { runWorkerInvocation } from "@/lib/workers/invoke";
import { z } from "zod";

const invokeSchema = z.object({
  workerSlug: z.string().min(1).max(100),
  input: z.string().max(50_000),
  spaceId: z.string().optional(),
});

// POST /api/workers/invoke - Run a worker with input and return the response (auth required)
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = validateInput(invokeSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { workerSlug, input, spaceId } = validation.data;

    const content = await runWorkerInvocation({
      userId: session.user.id,
      spaceId: spaceId ?? null,
      workerSlug,
      input,
    });

    return NextResponse.json({ content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to invoke worker";
    if (message.includes("not found")) {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    console.error("Worker invoke error:", error);
    return NextResponse.json(
      { error: "Failed to invoke worker" },
      { status: 500 }
    );
  }
}
