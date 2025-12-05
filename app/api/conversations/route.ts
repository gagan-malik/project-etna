import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { handleApiError, getUserFriendlyError } from "@/lib/error-handler";
import { trackApiCall } from "@/lib/analytics";
import { cached, cacheKeys } from "@/lib/cache";

// GET /api/conversations - List all conversations for the current user
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const identifier = session.user.id;
    const rateLimitResult = checkRateLimit(identifier, "/api/conversations");
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: getUserFriendlyError({ code: "RATE_LIMIT_ERROR" } as any),
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

    const startTime = Date.now();
    
    // Use cache for conversations list
    const conversations = await cached(
      cacheKeys.conversations(session.user.id),
      async () => {
        return await prisma.conversation.findMany({
          where: {
            userId: session.user.id,
          },
          include: {
            messages: {
              take: 1,
              orderBy: {
                createdAt: "desc",
              },
            },
            space: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      },
      30000 // 30 second cache
    );

    const duration = Date.now() - startTime;
    trackApiCall("/api/conversations", "GET", duration, 200, session.user.id);

    const response = NextResponse.json({ conversations });
    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  } catch (error) {
    const appError = handleApiError(error);
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: getUserFriendlyError(appError) },
      { status: appError.statusCode || 500 }
    );
  }
}

// POST /api/conversations - Create a new conversation
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const identifier = session.user.id;
    const rateLimitResult = checkRateLimit(identifier, "/api/conversations");
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: getUserFriendlyError({ code: "RATE_LIMIT_ERROR" } as any),
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
    const { title, spaceId } = body;

    // Input validation
    const { validateInput, conversationSchema, sanitizeString } = await import("@/lib/validation");
    const validation = validateInput(conversationSchema, {
      title: title ? sanitizeString(title) : undefined,
      spaceId,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Get user's default space if no spaceId provided
    let space = null;
    if (spaceId) {
      space = await prisma.space.findFirst({
        where: {
          id: spaceId,
          ownerId: session.user.id,
        },
      });
    } else {
      space = await prisma.space.findFirst({
        where: {
          ownerId: session.user.id,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    }

    if (!space) {
      return NextResponse.json(
        { error: "No space found. Please create a space first." },
        { status: 404 }
      );
    }

    const conversation = await prisma.conversation.create({
      data: {
        title: validation.data.title || "New Conversation",
        userId: session.user.id,
        spaceId: space.id,
      },
      include: {
        space: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    const response = NextResponse.json({ conversation }, { status: 201 });
    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  } catch (error) {
    const appError = handleApiError(error);
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: getUserFriendlyError(appError) },
      { status: appError.statusCode || 500 }
    );
  }
}

