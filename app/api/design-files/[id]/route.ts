import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseDesignFile } from "@/lib/design-files";

// GET /api/design-files/[id] - Get a specific design file
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

    const designFile = await prisma.design_files.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!designFile) {
      return NextResponse.json(
        { error: "Design file not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ designFile });
  } catch (error) {
    console.error("Error fetching design file:", error);
    return NextResponse.json(
      { error: "Failed to fetch design file" },
      { status: 500 }
    );
  }
}

// PATCH /api/design-files/[id] - Update a design file
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
    const { name, content, type, format } = body;

    // Verify ownership
    const existing = await prisma.design_files.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Design file not found" },
        { status: 404 }
      );
    }

    // Re-parse if content changed
    let metadata: Record<string, unknown> | null = existing.metadata as Record<string, unknown> | null;
    let newFormat = format || existing.format;
    let newType = type || existing.type;

    if (content && content !== existing.content) {
      const parseResult = parseDesignFile(content, name || existing.name);
      newFormat = parseResult.format;
      newType = parseResult.fileType;
      metadata = {
        modules: parseResult.modules.map((m) => ({
          name: m.name,
          ports: m.ports.map((p) => ({
            name: p.name,
            direction: p.direction,
            type: p.type,
            width: p.width,
          })),
          signals: m.signals.length,
          parameters: Object.fromEntries(Object.entries(m.parameters)),
          instances: m.instances.map((i) => i.moduleName),
          lineStart: m.lineStart,
          lineEnd: m.lineEnd,
        })),
        topModule: parseResult.topModule,
        errors: parseResult.errors,
        warnings: parseResult.warnings,
      };
    }

    const designFile = await prisma.design_files.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(content && { content }),
        format: newFormat,
        type: newType,
        metadata: metadata as any,
      },
    });

    return NextResponse.json({ designFile });
  } catch (error) {
    console.error("Error updating design file:", error);
    return NextResponse.json(
      { error: "Failed to update design file" },
      { status: 500 }
    );
  }
}

// DELETE /api/design-files/[id] - Delete a design file
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
    const existing = await prisma.design_files.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Design file not found" },
        { status: 404 }
      );
    }

    await prisma.design_files.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting design file:", error);
    return NextResponse.json(
      { error: "Failed to delete design file" },
      { status: 500 }
    );
  }
}
