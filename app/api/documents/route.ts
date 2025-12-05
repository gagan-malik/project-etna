import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/documents - List all documents for the current user
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const spaceId = searchParams.get("spaceId");

    const documents = await prisma.documentIndex.findMany({
      where: {
        userId: session.user.id,
        ...(spaceId && { spaceId }),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100, // Limit to 100 documents
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

// POST /api/documents - Create a new document
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, url, source, sourceId, spaceId, metadata } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Verify space ownership if spaceId provided
    if (spaceId) {
      const space = await prisma.space.findFirst({
        where: {
          id: spaceId,
          ownerId: session.user.id,
        },
      });

      if (!space) {
        return NextResponse.json(
          { error: "Space not found" },
          { status: 404 }
        );
      }
    }

    const document = await prisma.documentIndex.create({
      data: {
        title,
        content,
        url: url || null,
        source: source || null,
        sourceId: sourceId || null,
        userId: session.user.id,
        spaceId: spaceId || null,
        metadata: metadata || {},
        // Note: embedding will be generated separately via indexing service
      },
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}

