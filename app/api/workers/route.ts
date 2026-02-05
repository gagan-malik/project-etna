import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { handleApiError, getUserFriendlyError } from "@/lib/error-handler";
import { validateInput } from "@/lib/validation";
import { z } from "zod";

const slugRegex = /^[a-z0-9-]+$/;
const MAX_SYSTEM_PROMPT_LENGTH = 16_000;

const createWorkerSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).refine((s) => slugRegex.test(s), {
    message: "Slug must be lowercase letters, numbers, and hyphens only",
  }),
  systemPrompt: z.string().min(1).max(MAX_SYSTEM_PROMPT_LENGTH),
  modelId: z.string().max(100).optional(),
  spaceId: z.string().optional(),
});

// GET /api/workers - List workers for current user
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const spaceId = searchParams.get("spaceId") ?? undefined;

    const workers = await prisma.workers.findMany({
      where: {
        userId: session.user.id,
        ...(spaceId ? { spaceId } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ workers });
  } catch (error) {
    const appError = handleApiError(error);
    console.error("Error fetching workers:", error);
    return NextResponse.json(
      { error: getUserFriendlyError(appError) },
      { status: appError.statusCode || 500 }
    );
  }
}

// POST /api/workers - Create worker
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResult = checkRateLimit(session.user.id, "/api/workers");
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: getUserFriendlyError({ code: "RATE_LIMIT_ERROR" } as never),
        },
        {
          status: 429,
          headers: {
            ...getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime),
            "Retry-After": Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const body = await req.json();
    const validation = validateInput(createWorkerSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { name, slug, systemPrompt, modelId, spaceId } = validation.data;

    const existing = await prisma.workers.findUnique({
      where: {
        userId_slug: { userId: session.user.id, slug },
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A worker with this slug already exists" },
        { status: 409 }
      );
    }

    const worker = await prisma.workers.create({
      data: {
        userId: session.user.id,
        spaceId: spaceId ?? null,
        name,
        slug,
        systemPrompt,
        modelId: modelId ?? null,
      },
    });

    const res = NextResponse.json({ worker });
    Object.entries(getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime)).forEach(
      ([k, v]) => res.headers.set(k, v)
    );
    return res;
  } catch (error) {
    const appError = handleApiError(error);
    console.error("Error creating worker:", error);
    return NextResponse.json(
      { error: getUserFriendlyError(appError) },
      { status: appError.statusCode || 500 }
    );
  }
}
