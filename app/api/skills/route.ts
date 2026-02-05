import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { handleApiError, getUserFriendlyError } from "@/lib/error-handler";
import { validateInput } from "@/lib/validation";
import { z } from "zod";

const MAX_FRAGMENT_LENGTH = 8_000;

const createSkillSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  systemPromptFragment: z.string().min(1).max(MAX_FRAGMENT_LENGTH),
});

// GET /api/skills - List built-in + user's custom skills; return enabledSkillIds from preferences
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [skills, user] = await Promise.all([
      prisma.skills.findMany({
        where: {
          OR: [{ userId: null }, { userId: session.user.id }],
        },
        orderBy: [{ isBuiltIn: "desc" }, { createdAt: "desc" }],
      }),
      prisma.users.findUnique({
        where: { id: session.user.id },
        select: { userPreferences: true },
      }),
    ]);

    const prefs = (user?.userPreferences as Record<string, unknown> | null) ?? {};
    const enabledSkillIds = (prefs.enabledSkillIds as string[] | undefined) ?? [];

    return NextResponse.json({
      skills: skills.map((s) => ({
        id: s.id,
        userId: s.userId,
        name: s.name,
        description: s.description,
        systemPromptFragment: s.systemPromptFragment,
        isBuiltIn: s.isBuiltIn,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
      enabledSkillIds,
    });
  } catch (error) {
    const appError = handleApiError(error);
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: getUserFriendlyError(appError) },
      { status: appError.statusCode || 500 }
    );
  }
}

// POST /api/skills - Create custom skill
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResult = checkRateLimit(session.user.id, "/api/skills");
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
    const validation = validateInput(createSkillSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const skill = await prisma.skills.create({
      data: {
        userId: session.user.id,
        name: validation.data.name,
        description: validation.data.description ?? null,
        systemPromptFragment: validation.data.systemPromptFragment,
        isBuiltIn: false,
      },
    });

    const res = NextResponse.json({ skill });
    Object.entries(getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime)).forEach(
      ([k, v]) => res.headers.set(k, v)
    );
    return res;
  } catch (error) {
    const appError = handleApiError(error);
    console.error("Error creating skill:", error);
    return NextResponse.json(
      { error: getUserFriendlyError(appError) },
      { status: appError.statusCode || 500 }
    );
  }
}
