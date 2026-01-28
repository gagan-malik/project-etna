import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/debug-sessions/[id] - Get a specific debug session
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const debugSession = await prisma.debug_sessions.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        design_files: true,
        spaces: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!debugSession) {
      return NextResponse.json(
        { error: "Debug session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ debugSession });
  } catch (error) {
    console.error("Error fetching debug session:", error);
    return NextResponse.json(
      { error: "Failed to fetch debug session" },
      { status: 500 }
    );
  }
}

// PATCH /api/debug-sessions/[id] - Update a debug session
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
    const body = await req.json();
    const { name, description, status, designFileId, config, findings } = body;

    // Verify ownership
    const existing = await prisma.debug_sessions.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Debug session not found" },
        { status: 404 }
      );
    }

    // Verify design file ownership if changing
    if (designFileId && designFileId !== existing.designFileId) {
      const designFile = await prisma.design_files.findFirst({
        where: {
          id: designFileId,
          userId: session.user.id,
        },
      });

      if (!designFile) {
        return NextResponse.json(
          { error: "Design file not found" },
          { status: 404 }
        );
      }
    }

    const debugSession = await prisma.debug_sessions.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(designFileId !== undefined && { designFileId }),
        ...(config !== undefined && { config }),
        ...(findings !== undefined && { findings }),
      },
      include: {
        design_files: {
          select: {
            id: true,
            name: true,
            type: true,
            format: true,
          },
        },
      },
    });

    return NextResponse.json({ debugSession });
  } catch (error) {
    console.error("Error updating debug session:", error);
    return NextResponse.json(
      { error: "Failed to update debug session" },
      { status: 500 }
    );
  }
}

// DELETE /api/debug-sessions/[id] - Delete a debug session
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const existing = await prisma.debug_sessions.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Debug session not found" },
        { status: 404 }
      );
    }

    await prisma.debug_sessions.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting debug session:", error);
    return NextResponse.json(
      { error: "Failed to delete debug session" },
      { status: 500 }
    );
  }
}
