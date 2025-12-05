import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { handleApiError, getUserFriendlyError } from "@/lib/error-handler";
import { validateInput, sanitizeString } from "@/lib/validation";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().max(200).optional(),
  bio: z.string().max(500).optional(),
});

// PATCH /api/account/profile - Update user profile
export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const identifier = session.user.id;
    const rateLimitResult = checkRateLimit(identifier, "/api/account/profile");

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
    const { name, bio } = body;

    // Validate input
    const validation = validateInput(profileSchema, {
      name: name ? sanitizeString(name) : undefined,
      bio: bio ? sanitizeString(bio) : undefined,
    });

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validation.data.name || undefined,
        // Note: bio is not in the User model, you may need to add it or use a separate table
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    const response = NextResponse.json({
      user: updatedUser,
      message: "Profile updated successfully",
    });

    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    const appError = handleApiError(error);
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: getUserFriendlyError(appError) },
      { status: appError.statusCode || 500 }
    );
  }
}

