import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { del } from "@vercel/blob";

// GET /api/waveforms - List all waveform files for the current user
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const spaceId = searchParams.get("spaceId");
    const format = searchParams.get("format");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: Record<string, unknown> = {
      userId: session.user.id,
    };

    if (spaceId) {
      where.spaceId = spaceId;
    }

    if (format) {
      where.format = format;
    }

    const [waveforms, total] = await Promise.all([
      prisma.waveform_files.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          debug_sessions: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.waveform_files.count({ where }),
    ]);

    return NextResponse.json({
      waveforms: waveforms.map((w) => ({
        id: w.id,
        name: w.name,
        url: w.blobUrl,
        format: w.format,
        size: w.fileSize,
        spaceId: w.spaceId,
        createdAt: w.createdAt,
        updatedAt: w.updatedAt,
        metadata: w.metadata,
        linkedSessions: w.debug_sessions,
      })),
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching waveforms:", error);
    return NextResponse.json(
      { error: "Failed to fetch waveforms" },
      { status: 500 }
    );
  }
}

// DELETE /api/waveforms - Delete a waveform file
export async function DELETE(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Waveform ID required" },
        { status: 400 }
      );
    }

    // Find the waveform and verify ownership
    const waveform = await prisma.waveform_files.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!waveform) {
      return NextResponse.json(
        { error: "Waveform not found" },
        { status: 404 }
      );
    }

    // Delete from Vercel Blob
    try {
      await del(waveform.blobUrl, {
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
    } catch (blobError) {
      console.error("Error deleting blob:", blobError);
      // Continue with database deletion even if blob deletion fails
    }

    // Unlink from any debug sessions first
    await prisma.debug_sessions.updateMany({
      where: {
        waveformFileId: waveform.id,
      },
      data: {
        waveformFileId: null,
      },
    });

    // Delete from database
    await prisma.waveform_files.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting waveform:", error);
    return NextResponse.json(
      { error: "Failed to delete waveform" },
      { status: 500 }
    );
  }
}
