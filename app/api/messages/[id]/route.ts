import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/messages/[id] - Get a specific message
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const message = await prisma.message.findFirst({
      where: {
        id,
        conversation: {
          userId: session.user.id,
        },
      },
      include: {
        conversation: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error fetching message:", error);
    return NextResponse.json(
      { error: "Failed to fetch message" },
      { status: 500 }
    );
  }
}

// PATCH /api/messages/[id] - Update a message
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content, metadata } = body;

    // Verify ownership
    const existing = await prisma.message.findFirst({
      where: {
        id,
        conversation: {
          userId: session.user.id,
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    const message = await prisma.message.update({
      where: { id },
      data: {
        ...(content && { content }),
        ...(metadata && { metadata }),
      },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}

// DELETE /api/messages/[id] - Delete a message
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const existing = await prisma.message.findFirst({
      where: {
        id,
        conversation: {
          userId: session.user.id,
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    await prisma.message.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}

