import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// POST /api/onboarding/complete - Mark onboarding as completed (auth required)
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: { userPreferences: true },
    });

    const current = (user?.userPreferences as Record<string, unknown>) ?? {};
    const merged = { ...current, onboardingCompleted: true };

    await prisma.users.update({
      where: { id: session.user.id },
      data: { userPreferences: merged },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
