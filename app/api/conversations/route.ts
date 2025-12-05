import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/conversations - List all conversations for the current user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
        space: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Create a new conversation
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, spaceId } = body;

    // Get user's default space if no spaceId provided
    let space = null;
    if (spaceId) {
      space = await prisma.space.findFirst({
        where: {
          id: spaceId,
          ownerId: session.user.id,
        },
      });
    } else {
      space = await prisma.space.findFirst({
        where: {
          ownerId: session.user.id,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    }

    if (!space) {
      return NextResponse.json(
        { error: "No space found. Please create a space first." },
        { status: 404 }
      );
    }

    const conversation = await prisma.conversation.create({
      data: {
        title: title || "New Conversation",
        userId: session.user.id,
        spaceId: space.id,
      },
      include: {
        space: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}

