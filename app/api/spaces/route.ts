import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/spaces - List all spaces for the current user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const spaces = await prisma.space.findMany({
      where: {
        ownerId: session.user.id,
      },
      include: {
        _count: {
          select: {
            conversations: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ spaces });
  } catch (error) {
    console.error("Error fetching spaces:", error);
    return NextResponse.json(
      { error: "Failed to fetch spaces" },
      { status: 500 }
    );
  }
}

// POST /api/spaces - Create a new space
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const spaceSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    // Check if slug already exists
    const existing = await prisma.space.findFirst({
      where: {
        slug: spaceSlug,
        ownerId: session.user.id,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A space with this slug already exists" },
        { status: 409 }
      );
    }

    const space = await prisma.space.create({
      data: {
        name,
        slug: spaceSlug,
        ownerId: session.user.id,
      },
    });

    return NextResponse.json({ space }, { status: 201 });
  } catch (error) {
    console.error("Error creating space:", error);
    return NextResponse.json(
      { error: "Failed to create space" },
      { status: 500 }
    );
  }
}

