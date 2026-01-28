import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseDesignFile } from "@/lib/design-files";

// GET /api/design-files - List all design files for the current user
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const spaceId = searchParams.get("spaceId");
    const type = searchParams.get("type"); // rtl, testbench, constraint, netlist
    const format = searchParams.get("format"); // verilog, vhdl, systemverilog

    const designFiles = await prisma.design_files.findMany({
      where: {
        userId: session.user.id,
        ...(spaceId && { spaceId }),
        ...(type && { type }),
        ...(format && { format }),
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 100,
    });

    return NextResponse.json({ designFiles });
  } catch (error) {
    console.error("Error fetching design files:", error);
    return NextResponse.json(
      { error: "Failed to fetch design files" },
      { status: 500 }
    );
  }
}

// POST /api/design-files - Upload a new design file
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, path, content, spaceId, type: providedType, format: providedFormat } = body;

    if (!name || !content || !spaceId) {
      return NextResponse.json(
        { error: "Name, content, and spaceId are required" },
        { status: 400 }
      );
    }

    // Validate filename extension
    const validExtensions = [".v", ".vh", ".sv", ".svh", ".vhd", ".vhdl"];
    const ext = name.toLowerCase().slice(name.lastIndexOf("."));
    if (!validExtensions.includes(ext)) {
      return NextResponse.json(
        {
          error: `Invalid file extension. Supported formats: ${validExtensions.join(", ")}`,
        },
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

    // Parse the design file to extract metadata
    const parseResult = parseDesignFile(content, name);

    // Serialize metadata in a JSON-compatible format
    const metadata = {
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

    const designFile = await prisma.design_files.create({
      data: {
        name,
        path: path || `/${name}`,
        content,
        type: providedType || parseResult.fileType,
        format: providedFormat || parseResult.format,
        userId: session.user.id,
        spaceId,
        metadata: metadata as any,
      },
    });

    return NextResponse.json(
      {
        designFile,
        parseResult: {
          format: parseResult.format,
          fileType: parseResult.fileType,
          moduleCount: parseResult.modules.length,
          topModule: parseResult.topModule,
          errors: parseResult.errors,
          warnings: parseResult.warnings,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating design file:", error);
    return NextResponse.json(
      { error: "Failed to create design file" },
      { status: 500 }
    );
  }
}
