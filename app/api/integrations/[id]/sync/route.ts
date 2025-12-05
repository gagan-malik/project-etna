import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GitHubClient } from "@/lib/integrations/github";
import { ConfluenceClient } from "@/lib/integrations/confluence";
import { MicrosoftGraphClient } from "@/lib/integrations/microsoft";
import { generateEmbedding } from "@/lib/embeddings";

// POST /api/integrations/[id]/sync - Sync data from an integration
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const integration = await prisma.integration.findFirst({
      where: {
        id,
        userId: session.user.id,
        enabled: true,
      },
    });

    if (!integration) {
      return NextResponse.json(
        { error: "Integration not found or disabled" },
        { status: 404 }
      );
    }

    const { spaceId } = await req.json();
    const targetSpaceId = spaceId || integration.spaceId;

    if (!targetSpaceId) {
      return NextResponse.json(
        { error: "Space ID is required for syncing" },
        { status: 400 }
      );
    }

    // Verify space ownership
    const space = await prisma.space.findFirst({
      where: {
        id: targetSpaceId,
        ownerId: session.user.id,
      },
    });

    if (!space) {
      return NextResponse.json(
        { error: "Space not found" },
        { status: 404 }
      );
    }

    let syncedCount = 0;
    const errors: string[] = [];

    try {
      switch (integration.type) {
        case "github": {
          const config = integration.config as any;
          const credentials = integration.credentials as any;

          if (!credentials?.accessToken || !config?.owner || !config?.repo) {
            throw new Error("GitHub integration missing required credentials");
          }

          const githubClient = new GitHubClient({
            accessToken: credentials.accessToken,
            owner: config.owner,
            repo: config.repo,
          });

          const files = await githubClient.listRepositoryFiles(
            config.path || "",
            config.recursive !== false
          );

          // Index each file
          for (const file of files) {
            try {
              // Generate embedding
              const embeddingResponse = await generateEmbedding(
                file.content,
                "openai"
              );
              const embeddingString = `[${embeddingResponse.embedding.join(",")}]`;

              // Store in database
              await prisma.$queryRawUnsafe(
                `INSERT INTO document_indexes (id, title, content, url, source, source_id, user_id, space_id, metadata, embedding, created_at, updated_at)
                 VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::vector, NOW(), NOW())
                 ON CONFLICT DO NOTHING`,
                file.path,
                file.content,
                `https://github.com/${config.owner}/${config.repo}/blob/main/${file.path}`,
                "github",
                file.sha,
                session.user.id,
                targetSpaceId,
                JSON.stringify({
                  repo: `${config.owner}/${config.repo}`,
                  path: file.path,
                  size: file.size,
                  type: file.type,
                }),
                embeddingString
              );

              syncedCount++;
            } catch (error: any) {
              errors.push(`Error indexing ${file.path}: ${error.message}`);
            }
          }
          break;
        }

        case "confluence": {
          const config = integration.config as any;
          const credentials = integration.credentials as any;

          if (!credentials?.email || !credentials?.apiToken || !config?.baseUrl) {
            throw new Error("Confluence integration missing required credentials");
          }

          const confluenceClient = new ConfluenceClient({
            baseUrl: config.baseUrl,
            email: credentials.email,
            apiToken: credentials.apiToken,
          });

          const pages = await confluenceClient.listPages(
            config.spaceKey,
            config.limit || 100
          );

          // Index each page
          for (const page of pages) {
            try {
              // Generate embedding
              const embeddingResponse = await generateEmbedding(
                page.content,
                "openai"
              );
              const embeddingString = `[${embeddingResponse.embedding.join(",")}]`;

              // Store in database
              await prisma.$queryRawUnsafe(
                `INSERT INTO document_indexes (id, title, content, url, source, source_id, user_id, space_id, metadata, embedding, created_at, updated_at)
                 VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::vector, NOW(), NOW())
                 ON CONFLICT DO NOTHING`,
                page.title,
                page.content,
                page.url,
                "confluence",
                page.id,
                session.user.id,
                targetSpaceId,
                JSON.stringify({
                  spaceKey: page.spaceKey,
                  version: page.version,
                }),
                embeddingString
              );

              syncedCount++;
            } catch (error: any) {
              errors.push(`Error indexing ${page.title}: ${error.message}`);
            }
          }
          break;
        }

        case "microsoft_graph": {
          const credentials = integration.credentials as any;
          const config = integration.config as any;

          if (!credentials?.accessToken) {
            throw new Error("Microsoft Graph integration missing access token");
          }

          const msClient = new MicrosoftGraphClient({
            accessToken: credentials.accessToken,
          });

          const files = await msClient.listOneDriveFiles(
            config?.folderPath || "/"
          );

          // Index each file
          for (const file of files) {
            try {
              // Generate embedding
              const embeddingResponse = await generateEmbedding(
                file.content,
                "openai"
              );
              const embeddingString = `[${embeddingResponse.embedding.join(",")}]`;

              // Store in database
              await prisma.$queryRawUnsafe(
                `INSERT INTO document_indexes (id, title, content, url, source, source_id, user_id, space_id, metadata, embedding, created_at, updated_at)
                 VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::vector, NOW(), NOW())
                 ON CONFLICT DO NOTHING`,
                file.name,
                file.content,
                file.webUrl,
                "microsoft_graph",
                file.id,
                session.user.id,
                targetSpaceId,
                JSON.stringify({
                  mimeType: file.mimeType,
                  size: file.size,
                }),
                embeddingString
              );

              syncedCount++;
            } catch (error: any) {
              errors.push(`Error indexing ${file.name}: ${error.message}`);
            }
          }
          break;
        }

        default:
          return NextResponse.json(
            { error: `Unsupported integration type: ${integration.type}` },
            { status: 400 }
          );
      }

      return NextResponse.json({
        success: true,
        syncedCount,
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Failed to sync integration" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error syncing integration:", error);
    return NextResponse.json(
      { error: "Failed to sync integration" },
      { status: 500 }
    );
  }
}

