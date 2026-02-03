import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { handleApiError, getUserFriendlyError } from "@/lib/error-handler";
import { validateInput } from "@/lib/validation";
import { z } from "zod";

/**
 * Allowed keys for userPreferences (persisted).
 * See docs/product/SETTINGS_PLAN.md for full list.
 */
const userPreferencesSchema = z
  .object({
    theme: z.enum(["light", "dark", "system"]).optional(),
    syncLayouts: z.boolean().optional(),
    systemNotifications: z.boolean().optional(),
    menuBarIcon: z.boolean().optional(),
    completionSound: z.boolean().optional(),
    privacyMode: z.enum(["off", "standard", "strict"]).optional(),
    includeThirdPartyConfig: z.boolean().optional(),
    // Tab (SET-005)
    cursorTab: z.boolean().optional(),
    partialAccepts: z.boolean().optional(),
    suggestionsWhileCommenting: z.boolean().optional(),
    whitespaceOnlySuggestions: z.boolean().optional(),
    imports: z.boolean().optional(),
    autoImportPython: z.boolean().optional(),
    // Models (SET-006) — which model IDs are enabled; API keys never stored here
    enabledModelIds: z.array(z.string()).optional(),
    // Agents (SET-007)
    agentDefaultMode: z.string().optional(),
    agentDefaultLocation: z.string().optional(),
    agentAutoClearChat: z.boolean().optional(),
    agentReviewOnCommit: z.boolean().optional(),
    agentWebSearchTool: z.boolean().optional(),
    agentAutoAcceptOnCommit: z.boolean().optional(),
    agentAutoRunMode: z.string().optional(),
    agentBrowserProtection: z.boolean().optional(),
    agentMcpToolsProtection: z.boolean().optional(),
    agentFileDeletionProtection: z.boolean().optional(),
    agentToolbarOnSelection: z.boolean().optional(),
    agentCommitAttribution: z.boolean().optional(),
    // Network (SET-008)
    httpCompatibilityMode: z.enum(["http1", "http2"]).optional(),
    // Beta (SET-008)
    updateAccess: z.enum(["stable", "early"]).optional(),
    agentAutocomplete: z.boolean().optional(),
    extensionRpcTracer: z.boolean().optional(),
  })
  .strict();

type UserPreferences = z.infer<typeof userPreferencesSchema>;

// GET /api/settings - Get user preferences and plan (for paid-only features)
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: { userPreferences: true, plan: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const preferences = (user.userPreferences as Record<string, unknown>) ?? {};
    return NextResponse.json({
      preferences,
      plan: user.plan ?? "free",
    });
  } catch (error) {
    const appError = handleApiError(error);
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: getUserFriendlyError(appError) },
      { status: appError.statusCode || 500 }
    );
  }
}

// PATCH /api/settings - Update user preferences (privacyMode allowed only for paid plans)
export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const identifier = session.user.id;
    const rateLimitResult = checkRateLimit(identifier, "/api/settings");

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
    const validation = validateInput(userPreferencesSchema, body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: { plan: true, userPreferences: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const plan = user.plan ?? "free";
    const isPaid = plan !== "free";

    // Privacy mode is only for paid plans
    const updates: UserPreferences = { ...validation.data };
    if (!isPaid && updates.privacyMode !== undefined) {
      delete updates.privacyMode;
    }

    const current = (user.userPreferences as Record<string, unknown>) ?? {};
    const merged = { ...current, ...updates };

    await prisma.users.update({
      where: { id: session.user.id },
      data: { userPreferences: merged },
    });

    const response = NextResponse.json({
      preferences: merged,
      plan,
      message: "Settings updated",
    });

    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    const appError = handleApiError(error);
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: getUserFriendlyError(appError) },
      { status: appError.statusCode || 500 }
    );
  }
}
