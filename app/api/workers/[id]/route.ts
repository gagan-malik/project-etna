import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, getUserFriendlyError } from "@/lib/error-handler";
import { validateInput } from "@/lib/validation";
import { z } from "zod";

const slugRegex = /^[a-z0-9-]+$/;
const MAX_SYSTEM_PROMPT_LENGTH = 16_000;

const updateWorkerSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(100).refine((s) => slugRegex.test(s), {
    message: "Slug must be lowercase letters, numbers, and hyphens only",
  }).optional(),
  systemPrompt: z.string().min(1).max(MAX_SYSTEM_PROMPT_LENGTH).optional(),
  modelId: z.string().max(100).nullable().optional(),
  spaceId: z.string().nullable().optional(),
});

// PATCH /api/workers/[id] - Update worker
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
    const existing = await prisma.workers.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    }

    const body = await req.json();
    const validation = validateInput(updateWorkerSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (validation.data.slug !== undefined && validation.data.slug !== existing.slug) {
      const duplicate = await prisma.workers.findUnique({
        where: {
          userId_slug: { userId: session.user.id, slug: validation.data.slug },
        },
      });
      if (duplicate) {
        return NextResponse.json(
          { error: "A worker with this slug already exists" },
          { status: 409 }
        );
      }
    }

    const worker = await prisma.workers.update({
      where: { id },
      data: {
        ...(validation.data.name !== undefined && { name: validation.data.name }),
        ...(validation.data.slug !== undefined && { slug: validation.data.slug }),
        ...(validation.data.systemPrompt !== undefined && { systemPrompt: validation.data.systemPrompt }),
        ...(validation.data.modelId !== undefined && { modelId: validation.data.modelId }),
        ...(validation.data.spaceId !== undefined && { spaceId: validation.data.spaceId }),
      },
    });

    return NextResponse.json({ worker });
  } catch (error) {
    const appError = handleApiError(error);
    console.error("Error updating worker:", error);
    return NextResponse.json(
      { error: getUserFriendlyError(appError) },
      { status: appError.statusCode || 500 }
    );
  }
}

// DELETE /api/workers/[id] - Delete worker
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
    const existing = await prisma.workers.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    }

    await prisma.workers.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const appError = handleApiError(error);
    console.error("Error deleting worker:", error);
    return NextResponse.json(
      { error: getUserFriendlyError(appError) },
      { status: appError.statusCode || 500 }
    );
  }
}
