import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/debug-sessions - List all debug sessions for the current user
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const spaceId = searchParams.get("spaceId");
    const status = searchParams.get("status");

    const debugSessions = await prisma.debug_sessions.findMany({
      where: {
        userId: session.user.id,
        ...(spaceId && { spaceId }),
        ...(status && { status }),
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
      orderBy: {
        updatedAt: "desc",
      },
      take: 50,
    });

    return NextResponse.json({ debugSessions });
  } catch (error) {
    console.error("Error fetching debug sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch debug sessions" },
      { status: 500 }
    );
  }
}

// POST /api/debug-sessions - Create a new debug session
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, spaceId, designFileId, config } = body;

    if (!name || !spaceId) {
      return NextResponse.json(
        { error: "Name and spaceId are required" },
        { status: 400 }
      );
    }

    // Verify space ownership
    const space = await prisma.spaces.findFirst({
      where: {
        id: spaceId,
        ownerId: session.user.id,
      },
    });

    if (!space) {
      return NextResponse.json({ error: "Space not found" }, { status: 404 });
    }

    // Verify design file ownership if provided
    if (designFileId) {
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

    const debugSession = await prisma.debug_sessions.create({
      data: {
        name,
        description: description || null,
        status: "active",
        spaceId,
        userId: session.user.id,
        designFileId: designFileId || null,
        config: config || {},
        findings: [],
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

    return NextResponse.json({ debugSession }, { status: 201 });
  } catch (error) {
    console.error("Error creating debug session:", error);
    return NextResponse.json(
      { error: "Failed to create debug session" },
      { status: 500 }
    );
  }
}
