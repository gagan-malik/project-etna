import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

// POST /api/files/upload - Upload a file to Vercel Blob and create document
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const spaceId = formData.get("spaceId") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "text/markdown",
      "text/csv",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} not supported` },
        { status: 400 }
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

    // Upload file to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Extract text content from file
    let textContent = "";
    try {
      if (file.type.startsWith("text/")) {
        textContent = await file.text();
      } else if (file.type === "application/pdf") {
        // PDF text extraction using pdf-parse
        try {
          const pdfParse = require("pdf-parse");
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const data = await pdfParse(buffer);
          textContent = data.text || `[PDF file: ${file.name}]`;
        } catch (pdfError) {
          console.error("PDF parsing error:", pdfError);
          textContent = `[PDF file: ${file.name} - text extraction failed]`;
        }
      } else if (file.type.startsWith("image/")) {
        // Image files - we'll store metadata (OCR could be added later)
        textContent = `[Image file: ${file.name}]`;
      } else {
        textContent = `[File: ${file.name}]`;
      }
    } catch (error) {
      console.error("Error extracting text:", error);
      textContent = `[File: ${file.name}]`;
    }

    // Generate embedding for the document
    let embedding: number[] | null = null;
    try {
      const { generateEmbedding } = await import("@/lib/embeddings");
      const embeddingResponse = await generateEmbedding(textContent, "openai");
      embedding = embeddingResponse.embedding;
    } catch (embeddingError) {
      console.error("Error generating embedding:", embeddingError);
      // Continue without embedding - can be generated later
    }

    // Create document in database
    // Note: embedding field is Unsupported in Prisma, so we use raw SQL if embedding exists
    let document;
    if (embedding) {
      const embeddingString = `[${embedding.join(",")}]`;
      const result = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
        `INSERT INTO document_indexes (id, title, content, url, source, source_id, user_id, space_id, metadata, embedding, created_at, updated_at)
         VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::vector, NOW(), NOW())
         RETURNING id`,
        file.name,
        textContent,
        blob.url,
        "upload",
        blob.url,
        session.user.id,
        space.id,
        JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadedAt: new Date().toISOString(),
        }),
        embeddingString
      );
      document = await prisma.document_indexes.findUnique({
        where: { id: result[0].id },
      });
    } else {
      document = await prisma.document_indexes.create({
        data: {
          title: file.name,
          content: textContent,
          url: blob.url,
          source: "upload",
          sourceId: blob.url,
          userId: session.user.id,
          spaceId: space.id,
          metadata: {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            uploadedAt: new Date().toISOString(),
          },
        },
      });
    }

    if (!document) {
      return NextResponse.json(
        { error: "Failed to create document" },
        { status: 500 }
      );
    }

    // Index document chunks if content is long enough
    if (textContent.length > 1000 && embedding) {
      try {
        const { indexDocument } = await import("@/lib/indexing/indexer");
        // Index in background (don't wait for it)
        indexDocument(document.id, textContent, "openai").catch((err) =>
          console.error("Background indexing error:", err)
        );
      } catch (indexError) {
        console.error("Error starting indexing:", indexError);
      }
    }

    return NextResponse.json(
      {
        document,
        blob: {
          url: blob.url,
          pathname: blob.pathname,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}

