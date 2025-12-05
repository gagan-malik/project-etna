import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/spaces/[id] - Get a specific space
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

    const space = await prisma.space.findFirst({
      where: {
        id,
        ownerId: session.user.id,
      },
      include: {
        conversations: {
          orderBy: {
            updatedAt: "desc",
          },
          take: 10,
        },
        _count: {
          select: {
            conversations: true,
          },
        },
      },
    });

    if (!space) {
      return NextResponse.json({ error: "Space not found" }, { status: 404 });
    }

    return NextResponse.json({ space });
  } catch (error) {
    console.error("Error fetching space:", error);
    return NextResponse.json(
      { error: "Failed to fetch space" },
      { status: 500 }
    );
  }
}

// PATCH /api/spaces/[id] - Update a space
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
    const { name, slug } = body;

    // Verify ownership
    const existing = await prisma.space.findFirst({
      where: {
        id,
        ownerId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Space not found" }, { status: 404 });
    }

    // Check slug uniqueness if provided
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.space.findFirst({
        where: {
          slug,
          ownerId: session.user.id,
          id: { not: id },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "A space with this slug already exists" },
          { status: 409 }
        );
      }
    }

    const space = await prisma.space.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
      },
    });

    return NextResponse.json({ space });
  } catch (error) {
    console.error("Error updating space:", error);
    return NextResponse.json(
      { error: "Failed to update space" },
      { status: 500 }
    );
  }
}

// DELETE /api/spaces/[id] - Delete a space
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
    const existing = await prisma.space.findFirst({
      where: {
        id,
        ownerId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Space not found" }, { status: 404 });
    }

    // Delete space (conversations will be cascade deleted)
    await prisma.space.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting space:", error);
    return NextResponse.json(
      { error: "Failed to delete space" },
      { status: 500 }
    );
  }
}

