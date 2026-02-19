import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/onboarding/status - First-run onboarding status (auth required)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: { userPreferences: true },
    });

    const prefs = (user?.userPreferences as Record<string, unknown>) ?? {};
    const completed = prefs.onboardingCompleted === true;

    const [spaceCount, conversationCount] = completed
      ? [0, 0]
      : await Promise.all([
          prisma.spaces.count({ where: { ownerId: session.user.id } }),
          prisma.conversations.count({ where: { userId: session.user.id } }),
        ]);

    return NextResponse.json({
      completed,
      steps: {
        hasSpace: spaceCount > 0,
        hasConversation: conversationCount > 0,
      },
    });
  } catch (error) {
    console.error("Error fetching onboarding status:", error);
    return NextResponse.json(
      { error: "Failed to fetch onboarding status" },
      { status: 500 }
    );
  }
}
