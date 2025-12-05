import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/integrations - List all integrations for the current user
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const spaceId = searchParams.get("spaceId");

    const integrations = await prisma.integrations.findMany({
      where: {
        userId: session.user.id,
        ...(type && { type }),
        ...(spaceId && { spaceId }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Don't return credentials in the response
    const safeIntegrations = integrations.map((integration: {
      id: string;
      type: string;
      name: string;
      enabled: boolean;
      createdAt: Date;
      updatedAt: Date;
      config: any;
      credentials?: any;
      spaceId?: string | null;
      userId: string;
    }) => ({
      ...integration,
      credentials: undefined,
    }));

    return NextResponse.json({ integrations: safeIntegrations });
  } catch (error) {
    console.error("Error fetching integrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch integrations" },
      { status: 500 }
    );
  }
}

// POST /api/integrations - Create a new integration
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, name, config, credentials, spaceId } = body;

    if (!type || !name || !config) {
      return NextResponse.json(
        { error: "Type, name, and config are required" },
        { status: 400 }
      );
    }

    // Validate integration type
    const validTypes = ["github", "confluence", "microsoft_graph", "custom"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid integration type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Verify space ownership if spaceId provided
    if (spaceId) {
      const space = await prisma.spaces.findFirst({
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

    const integration = await prisma.integrations.create({
      data: {
        type,
        name,
        config,
        credentials: credentials || null,
        userId: session.user.id,
        spaceId: spaceId || null,
        enabled: true,
      },
    });

    // Don't return credentials
    const { credentials: _, ...safeIntegration } = integration;

    return NextResponse.json({ integration: safeIntegration }, { status: 201 });
  } catch (error) {
    console.error("Error creating integration:", error);
    return NextResponse.json(
      { error: "Failed to create integration" },
      { status: 500 }
    );
  }
}

