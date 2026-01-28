import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

// Waveform file size limits by plan
const FILE_SIZE_LIMITS: Record<string, number> = {
  free: 25 * 1024 * 1024,      // 25 MB
  pro: 200 * 1024 * 1024,      // 200 MB
  team: 500 * 1024 * 1024,     // 500 MB
  enterprise: 500 * 1024 * 1024, // 500 MB (server mode for larger)
};

// Allowed waveform formats
const ALLOWED_FORMATS = ["vcd", "fst", "ghw"];

// Detect format from filename
function detectFormat(filename: string): string | null {
  const ext = filename.toLowerCase().split(".").pop();
  if (ext && ALLOWED_FORMATS.includes(ext)) {
    return ext;
  }
  return null;
}

// POST /api/waveforms/upload - Upload a waveform file to Vercel Blob
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const spaceId = formData.get("spaceId") as string | null;
    const sessionId = formData.get("sessionId") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Get user's plan for file size limit
    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    });
    const userPlan = user?.plan || "free";
    const maxSize = FILE_SIZE_LIMITS[userPlan] || FILE_SIZE_LIMITS.free;

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json(
        { 
          error: `File size exceeds ${maxSizeMB}MB limit for ${userPlan} plan. Upgrade to upload larger files.`,
          code: "FILE_TOO_LARGE",
          maxSize,
          fileSize: file.size,
        },
        { status: 400 }
      );
    }

    // Validate file format
    const format = detectFormat(file.name);
    if (!format) {
      return NextResponse.json(
        { 
          error: `Invalid file format. Allowed formats: ${ALLOWED_FORMATS.join(", ")}`,
          code: "INVALID_FORMAT",
        },
        { status: 400 }
      );
    }

    // FST format requires Pro or higher
    if (format === "fst" && userPlan === "free") {
      return NextResponse.json(
        { 
          error: "FST format requires Pro plan or higher. Upgrade to use compressed waveform formats.",
          code: "PLAN_REQUIRED",
        },
        { status: 403 }
      );
    }

    // Get user's default space if no spaceId provided
    let space = null;
    if (spaceId) {
      space = await prisma.spaces.findFirst({
        where: {
          id: spaceId,
          ownerId: session.user.id,
        },
      });
    } else {
      space = await prisma.spaces.findFirst({
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

    // Check waveform file count for free tier
    if (userPlan === "free") {
      const existingCount = await prisma.waveform_files.count({
        where: { userId: session.user.id },
      });
      if (existingCount >= 5) {
        return NextResponse.json(
          { 
            error: "Free plan limited to 5 waveform files. Delete existing files or upgrade to Pro.",
            code: "FILE_LIMIT_REACHED",
          },
          { status: 403 }
        );
      }
    }

    // Upload file to Vercel Blob
    const blob = await put(`waveforms/${session.user.id}/${Date.now()}-${file.name}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Create waveform file record in database
    const waveformFile = await prisma.waveform_files.create({
      data: {
        name: file.name,
        blobUrl: blob.url,
        format: format,
        fileSize: file.size,
        spaceId: space.id,
        userId: session.user.id,
        metadata: {
          uploadedAt: new Date().toISOString(),
          contentType: file.type,
          pathname: blob.pathname,
        },
      },
    });

    // If a debug session was specified, link the waveform to it
    if (sessionId) {
      await prisma.debug_sessions.update({
        where: { 
          id: sessionId,
          userId: session.user.id, // Ensure user owns the session
        },
        data: {
          waveformFileId: waveformFile.id,
        },
      }).catch(() => {
        // Session might not exist or user doesn't own it - ignore
        console.warn(`Could not link waveform to session ${sessionId}`);
      });
    }

    return NextResponse.json(
      {
        id: waveformFile.id,
        name: waveformFile.name,
        url: waveformFile.blobUrl,
        format: waveformFile.format,
        size: waveformFile.fileSize,
        createdAt: waveformFile.createdAt,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error uploading waveform:", error);
    const message = error instanceof Error ? error.message : "Failed to upload waveform";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
