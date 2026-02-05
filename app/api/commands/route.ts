import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { handleApiError, getUserFriendlyError } from "@/lib/error-handler";
import { validateInput } from "@/lib/validation";
import { z } from "zod";

const slugRegex = /^[a-z0-9-]+$/;
const MAX_PROMPT_LENGTH = 16_000;

const createCommandSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).refine((s) => slugRegex.test(s), {
    message: "Slug must be lowercase letters, numbers, and hyphens only",
  }),
  promptTemplate: z.string().min(1).max(MAX_PROMPT_LENGTH),
  showAsQuickAction: z.boolean().optional().default(false),
  spaceId: z.string().optional(),
});

// GET /api/commands - List commands for current user
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const spaceId = searchParams.get("spaceId") ?? undefined;

    const commands = await prisma.user_commands.findMany({
      where: {
        userId: session.user.id,
        ...(spaceId ? { spaceId } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ commands });
  } catch (error) {
    const appError = handleApiError(error);
    console.error("Error fetching commands:", error);
    return NextResponse.json(
      { error: getUserFriendlyError(appError) },
      { status: appError.statusCode || 500 }
    );
  }
}

// POST /api/commands - Create command
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResult = checkRateLimit(session.user.id, "/api/commands");
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
    const validation = validateInput(createCommandSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { name, slug, promptTemplate, showAsQuickAction, spaceId } = validation.data;

    const existing = await prisma.user_commands.findUnique({
      where: {
        userId_slug: { userId: session.user.id, slug },
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A command with this slug already exists" },
        { status: 409 }
      );
    }

    const command = await prisma.user_commands.create({
      data: {
        userId: session.user.id,
        spaceId: spaceId ?? null,
        name,
        slug,
        promptTemplate,
        showAsQuickAction: showAsQuickAction ?? false,
      },
    });

    const res = NextResponse.json({ command });
    Object.entries(getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime)).forEach(
      ([k, v]) => res.headers.set(k, v)
    );
    return res;
  } catch (error) {
    const appError = handleApiError(error);
    console.error("Error creating command:", error);
    return NextResponse.json(
      { error: getUserFriendlyError(appError) },
      { status: appError.statusCode || 500 }
    );
  }
}
