import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { handleApiError, getUserFriendlyError } from "@/lib/error-handler";
import { verifyPassword, hashPassword } from "@/lib/auth-helpers";
import { z } from "zod";

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

// PATCH /api/account/password - Change password
export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const identifier = session.user.id;
    const rateLimitResult = checkRateLimit(identifier, "/api/account/password");

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
    const { currentPassword, newPassword } = body;

    // Validate input
    const validation = passwordSchema.safeParse({ currentPassword, newPassword });
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input. Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    // Get user with password
    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Password authentication not available for this account" },
        { status: 400 }
      );
    }

    // Verify current password
    const isValid = await verifyPassword(validation.data.currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    // Hash new password
    const hashedPassword = await hashPassword(validation.data.newPassword);

    // Update password
    await prisma.users.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    const response = NextResponse.json({
      message: "Password changed successfully",
    });

    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    const appError = handleApiError(error);
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: getUserFriendlyError(appError) },
      { status: appError.statusCode || 500 }
    );
  }
}

