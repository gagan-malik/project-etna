import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, getUserFriendlyError } from "@/lib/error-handler";
import { validateInput } from "@/lib/validation";
import { z } from "zod";

const slugRegex = /^[a-z0-9-]+$/;
const MAX_PROMPT_LENGTH = 16_000;

const updateCommandSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(100).refine((s) => slugRegex.test(s), {
    message: "Slug must be lowercase letters, numbers, and hyphens only",
  }).optional(),
  promptTemplate: z.string().min(1).max(MAX_PROMPT_LENGTH).optional(),
  showAsQuickAction: z.boolean().optional(),
  spaceId: z.string().nullable().optional(),
});

// PATCH /api/commands/[id] - Update command
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
    const existing = await prisma.user_commands.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Command not found" }, { status: 404 });
    }

    const body = await req.json();
    const validation = validateInput(updateCommandSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (validation.data.slug !== undefined && validation.data.slug !== existing.slug) {
      const duplicate = await prisma.user_commands.findUnique({
        where: {
          userId_slug: { userId: session.user.id, slug: validation.data.slug },
        },
      });
      if (duplicate) {
        return NextResponse.json(
          { error: "A command with this slug already exists" },
          { status: 409 }
        );
      }
    }

    const command = await prisma.user_commands.update({
      where: { id },
      data: {
        ...(validation.data.name !== undefined && { name: validation.data.name }),
        ...(validation.data.slug !== undefined && { slug: validation.data.slug }),
        ...(validation.data.promptTemplate !== undefined && { promptTemplate: validation.data.promptTemplate }),
        ...(validation.data.showAsQuickAction !== undefined && { showAsQuickAction: validation.data.showAsQuickAction }),
        ...(validation.data.spaceId !== undefined && { spaceId: validation.data.spaceId }),
      },
    });

    return NextResponse.json({ command });
  } catch (error) {
    const appError = handleApiError(error);
    console.error("Error updating command:", error);
    return NextResponse.json(
      { error: getUserFriendlyError(appError) },
      { status: appError.statusCode || 500 }
    );
  }
}

// DELETE /api/commands/[id] - Delete command
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
    const existing = await prisma.user_commands.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Command not found" }, { status: 404 });
    }

    await prisma.user_commands.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const appError = handleApiError(error);
    console.error("Error deleting command:", error);
    return NextResponse.json(
      { error: getUserFriendlyError(appError) },
      { status: appError.statusCode || 500 }
    );
  }
}
