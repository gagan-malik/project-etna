import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, getUserFriendlyError } from "@/lib/error-handler";
import { validateInput } from "@/lib/validation";
import { z } from "zod";

const MAX_FRAGMENT_LENGTH = 8_000;

const updateSkillSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(500).nullable().optional(),
  systemPromptFragment: z.string().min(1).max(MAX_FRAGMENT_LENGTH).optional(),
});

// PATCH /api/skills/[id] - Update custom skill (user-owned only)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.skills.findFirst({
      where: { id, userId: session.user.id, isBuiltIn: false },
    });
    if (!existing) {
      return NextResponse.json({ error: "Skill not found or cannot be edited" }, { status: 404 });
    }

    const body = await req.json();
    const validation = validateInput(updateSkillSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const skill = await prisma.skills.update({
      where: { id },
      data: {
        ...(validation.data.name !== undefined && { name: validation.data.name }),
        ...(validation.data.description !== undefined && { description: validation.data.description }),
        ...(validation.data.systemPromptFragment !== undefined && {
          systemPromptFragment: validation.data.systemPromptFragment,
        }),
      },
    });

    return NextResponse.json({ skill });
  } catch (error) {
    const appError = handleApiError(error);
    console.error("Error updating skill:", error);
    return NextResponse.json(
      { error: getUserFriendlyError(appError) },
      { status: appError.statusCode || 500 }
    );
  }
}

// DELETE /api/skills/[id] - Delete custom skill (user-owned only)
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.skills.findFirst({
      where: { id, userId: session.user.id, isBuiltIn: false },
    });
    if (!existing) {
      return NextResponse.json({ error: "Skill not found or cannot be deleted" }, { status: 404 });
    }

    await prisma.skills.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const appError = handleApiError(error);
    console.error("Error deleting skill:", error);
    return NextResponse.json(
      { error: getUserFriendlyError(appError) },
      { status: appError.statusCode || 500 }
    );
  }
}
