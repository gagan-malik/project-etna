/**
 * Document Indexing Service
 * Handles chunking documents and generating embeddings
 * Includes specialized chunking for RTL design files (Verilog, VHDL, SystemVerilog)
 */

import { prisma } from "@/lib/prisma";
import { generateEmbedding } from "@/lib/embeddings";

export interface Chunk {
  text: string;
  startIndex: number;
  endIndex: number;
  metadata?: {
    type?: "module" | "entity" | "always_block" | "process" | "function" | "task" | "text";
    name?: string;
    lineStart?: number;
    lineEnd?: number;
  };
}

/**
 * Chunk text into smaller pieces for embedding
 * Uses a simple strategy: split by sentences, then group into chunks of max size
 */
export function chunkText(
  text: string,
  maxChunkSize: number = 1000,
  overlap: number = 200
): Chunk[] {
  if (text.length <= maxChunkSize) {
    return [{ text, startIndex: 0, endIndex: text.length }];
  }

  const chunks: Chunk[] = [];
  let startIndex = 0;

  // Split by sentences (simple approach)
  const sentences = text.split(/(?<=[.!?])\s+/);
  let currentChunk = "";

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxChunkSize) {
      currentChunk += sentence + " ";
    } else {
      if (currentChunk) {
        chunks.push({
          text: currentChunk.trim(),
          startIndex,
          endIndex: startIndex + currentChunk.length,
        });
        startIndex += currentChunk.length - overlap; // Overlap for context
        currentChunk = sentence + " ";
      } else {
        // Sentence is too long, split it
        const words = sentence.split(" ");
        let wordChunk = "";
        for (const word of words) {
          if ((wordChunk + word).length <= maxChunkSize) {
            wordChunk += word + " ";
          } else {
            if (wordChunk) {
              chunks.push({
                text: wordChunk.trim(),
                startIndex,
                endIndex: startIndex + wordChunk.length,
              });
              startIndex += wordChunk.length - overlap;
            }
            wordChunk = word + " ";
          }
        }
        currentChunk = wordChunk;
      }
    }
  }

  // Add remaining chunk
  if (currentChunk.trim()) {
    chunks.push({
      text: currentChunk.trim(),
      startIndex,
      endIndex: startIndex + currentChunk.length,
    });
  }

  return chunks;
}

/**
 * Chunk Verilog/SystemVerilog code intelligently
 * Preserves module boundaries and keeps related code together
 */
export function chunkVerilog(
  content: string,
  maxChunkSize: number = 2000,
  overlap: number = 100
): Chunk[] {
  const chunks: Chunk[] = [];
  const lines = content.split("\n");

  // Find all module boundaries
  const moduleRegex = /\bmodule\s+(\w+)/g;
  const endmoduleRegex = /\bendmodule\b/g;

  const modules: Array<{ name: string; startLine: number; endLine: number; content: string }> = [];
  let currentModule: { name: string; startLine: number } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const moduleMatch = /\bmodule\s+(\w+)/.exec(line);
    if (moduleMatch) {
      currentModule = { name: moduleMatch[1], startLine: i };
    }

    if (/\bendmodule\b/.test(line) && currentModule) {
      const moduleContent = lines.slice(currentModule.startLine, i + 1).join("\n");
      modules.push({
        name: currentModule.name,
        startLine: currentModule.startLine,
        endLine: i,
        content: moduleContent,
      });
      currentModule = null;
    }
  }

  // If we found modules, chunk by module
  if (modules.length > 0) {
    for (const module of modules) {
      if (module.content.length <= maxChunkSize) {
        // Entire module fits in one chunk
        const startIndex = lines.slice(0, module.startLine).join("\n").length;
        chunks.push({
          text: module.content,
          startIndex,
          endIndex: startIndex + module.content.length,
          metadata: {
            type: "module",
            name: module.name,
            lineStart: module.startLine + 1,
            lineEnd: module.endLine + 1,
          },
        });
      } else {
        // Module is too large, chunk by always blocks and other constructs
        const moduleChunks = chunkVerilogModule(module.content, module.name, module.startLine, maxChunkSize, overlap);
        chunks.push(...moduleChunks);
      }
    }
  } else {
    // No modules found, fall back to regular chunking
    return chunkText(content, maxChunkSize, overlap);
  }

  return chunks;
}

/**
 * Chunk a single large Verilog module by its internal constructs
 */
function chunkVerilogModule(
  content: string,
  moduleName: string,
  baseLineNumber: number,
  maxChunkSize: number,
  overlap: number
): Chunk[] {
  const chunks: Chunk[] = [];
  const lines = content.split("\n");

  // Find always blocks, tasks, functions
  const blockStarts: Array<{ type: string; line: number; name?: string }> = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (/\balways\s*@/.test(line) || /\balways_ff\b/.test(line) || /\balways_comb\b/.test(line)) {
      blockStarts.push({ type: "always_block", line: i });
    } else if (/\btask\s+(\w+)/.test(line)) {
      const match = /\btask\s+(\w+)/.exec(line);
      blockStarts.push({ type: "task", line: i, name: match?.[1] });
    } else if (/\bfunction\s+/.test(line)) {
      const match = /\bfunction\s+\w+\s+(\w+)/.exec(line);
      blockStarts.push({ type: "function", line: i, name: match?.[1] });
    }
  }

  if (blockStarts.length === 0) {
    // No internal blocks, just chunk the whole thing
    const textChunks = chunkText(content, maxChunkSize, overlap);
    return textChunks.map((chunk) => ({
      ...chunk,
      metadata: {
        type: "module" as const,
        name: moduleName,
        lineStart: baseLineNumber + 1,
        lineEnd: baseLineNumber + lines.length,
      },
    }));
  }

  // Create header chunk (ports, signals, parameters before first block)
  if (blockStarts[0].line > 0) {
    const headerContent = lines.slice(0, blockStarts[0].line).join("\n");
    if (headerContent.trim().length > 0) {
      chunks.push({
        text: headerContent,
        startIndex: 0,
        endIndex: headerContent.length,
        metadata: {
          type: "module",
          name: `${moduleName}_header`,
          lineStart: baseLineNumber + 1,
          lineEnd: baseLineNumber + blockStarts[0].line,
        },
      });
    }
  }

  // Chunk each block
  for (let i = 0; i < blockStarts.length; i++) {
    const blockStart = blockStarts[i];
    const blockEnd = i < blockStarts.length - 1 ? blockStarts[i + 1].line : lines.length;
    const blockContent = lines.slice(blockStart.line, blockEnd).join("\n");
    
    const startIndex = lines.slice(0, blockStart.line).join("\n").length;
    
    if (blockContent.length <= maxChunkSize) {
      chunks.push({
        text: blockContent,
        startIndex,
        endIndex: startIndex + blockContent.length,
        metadata: {
          type: blockStart.type as any,
          name: blockStart.name || `${moduleName}_${blockStart.type}_${i}`,
          lineStart: baseLineNumber + blockStart.line + 1,
          lineEnd: baseLineNumber + blockEnd,
        },
      });
    } else {
      // Block is too large, use regular chunking
      const textChunks = chunkText(blockContent, maxChunkSize, overlap);
      chunks.push(
        ...textChunks.map((chunk, idx) => ({
          ...chunk,
          startIndex: startIndex + chunk.startIndex,
          endIndex: startIndex + chunk.endIndex,
          metadata: {
            type: blockStart.type as any,
            name: `${blockStart.name || blockStart.type}_part${idx}`,
            lineStart: baseLineNumber + blockStart.line + 1,
            lineEnd: baseLineNumber + blockEnd,
          },
        }))
      );
    }
  }

  return chunks;
}

/**
 * Chunk VHDL code intelligently
 * Preserves entity/architecture boundaries
 */
export function chunkVHDL(
  content: string,
  maxChunkSize: number = 2000,
  overlap: number = 100
): Chunk[] {
  const chunks: Chunk[] = [];
  const lines = content.split("\n");

  // Find all entity/architecture pairs
  const entities: Array<{ name: string; startLine: number; endLine: number; content: string }> = [];
  
  let currentEntity: { name: string; startLine: number } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();

    const entityMatch = /\bentity\s+(\w+)\s+is/i.exec(lines[i]);
    if (entityMatch) {
      currentEntity = { name: entityMatch[1], startLine: i };
    }

    // Find end of architecture (which ends the entity)
    if (/\bend\s+(?:architecture\s+)?(\w+)?;/i.test(lines[i]) && currentEntity) {
      // Look back for architecture end or entity end
      if (line.includes("architecture") || line.includes(currentEntity.name.toLowerCase())) {
        const entityContent = lines.slice(currentEntity.startLine, i + 1).join("\n");
        entities.push({
          name: currentEntity.name,
          startLine: currentEntity.startLine,
          endLine: i,
          content: entityContent,
        });
        currentEntity = null;
      }
    }
  }

  // If we found entities, chunk by entity
  if (entities.length > 0) {
    for (const entity of entities) {
      if (entity.content.length <= maxChunkSize) {
        const startIndex = lines.slice(0, entity.startLine).join("\n").length;
        chunks.push({
          text: entity.content,
          startIndex,
          endIndex: startIndex + entity.content.length,
          metadata: {
            type: "entity",
            name: entity.name,
            lineStart: entity.startLine + 1,
            lineEnd: entity.endLine + 1,
          },
        });
      } else {
        // Entity is too large, chunk by processes
        const entityChunks = chunkVHDLEntity(entity.content, entity.name, entity.startLine, maxChunkSize, overlap);
        chunks.push(...entityChunks);
      }
    }
  } else {
    // No entities found, fall back to regular chunking
    return chunkText(content, maxChunkSize, overlap);
  }

  return chunks;
}

/**
 * Chunk a large VHDL entity by its internal processes
 */
function chunkVHDLEntity(
  content: string,
  entityName: string,
  baseLineNumber: number,
  maxChunkSize: number,
  overlap: number
): Chunk[] {
  const chunks: Chunk[] = [];
  const lines = content.split("\n");

  // Find processes
  const processStarts: Array<{ line: number; name?: string }> = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const processMatch = /(\w+)\s*:\s*process/i.exec(line) || /\bprocess\s*\(/i.exec(line);
    if (processMatch) {
      processStarts.push({ line: i, name: processMatch[1] || undefined });
    }
  }

  if (processStarts.length === 0) {
    // No processes, just chunk the whole thing
    const textChunks = chunkText(content, maxChunkSize, overlap);
    return textChunks.map((chunk) => ({
      ...chunk,
      metadata: {
        type: "entity" as const,
        name: entityName,
        lineStart: baseLineNumber + 1,
        lineEnd: baseLineNumber + lines.length,
      },
    }));
  }

  // Create header chunk
  if (processStarts[0].line > 0) {
    const headerContent = lines.slice(0, processStarts[0].line).join("\n");
    if (headerContent.trim().length > 0) {
      chunks.push({
        text: headerContent,
        startIndex: 0,
        endIndex: headerContent.length,
        metadata: {
          type: "entity",
          name: `${entityName}_header`,
          lineStart: baseLineNumber + 1,
          lineEnd: baseLineNumber + processStarts[0].line,
        },
      });
    }
  }

  // Chunk each process
  for (let i = 0; i < processStarts.length; i++) {
    const processStart = processStarts[i];
    const processEnd = i < processStarts.length - 1 ? processStarts[i + 1].line : lines.length;
    const processContent = lines.slice(processStart.line, processEnd).join("\n");
    
    const startIndex = lines.slice(0, processStart.line).join("\n").length;
    
    if (processContent.length <= maxChunkSize) {
      chunks.push({
        text: processContent,
        startIndex,
        endIndex: startIndex + processContent.length,
        metadata: {
          type: "process",
          name: processStart.name || `${entityName}_process_${i}`,
          lineStart: baseLineNumber + processStart.line + 1,
          lineEnd: baseLineNumber + processEnd,
        },
      });
    } else {
      const textChunks = chunkText(processContent, maxChunkSize, overlap);
      chunks.push(
        ...textChunks.map((chunk, idx) => ({
          ...chunk,
          startIndex: startIndex + chunk.startIndex,
          endIndex: startIndex + chunk.endIndex,
          metadata: {
            type: "process" as const,
            name: `${processStart.name || "process"}_part${idx}`,
            lineStart: baseLineNumber + processStart.line + 1,
            lineEnd: baseLineNumber + processEnd,
          },
        }))
      );
    }
  }

  return chunks;
}

/**
 * Smart chunking that detects file type and uses appropriate strategy
 */
export function chunkDesignFile(
  content: string,
  format: "verilog" | "vhdl" | "systemverilog" | "text",
  maxChunkSize: number = 2000,
  overlap: number = 100
): Chunk[] {
  switch (format) {
    case "verilog":
    case "systemverilog":
      return chunkVerilog(content, maxChunkSize, overlap);
    case "vhdl":
      return chunkVHDL(content, maxChunkSize, overlap);
    default:
      return chunkText(content, maxChunkSize, overlap);
  }
}

/**
 * Index a document: chunk it and generate embeddings
 */
export async function indexDocument(
  documentId: string,
  text: string,
  provider: "openai" | "gemini" = "openai"
): Promise<void> {
  // Chunk the document
  const chunks = chunkText(text);

  // Get parent document info
  const parentDoc = await prisma.document_indexes.findUnique({
    where: { id: documentId },
    select: { userId: true, spaceId: true },
  });

  if (!parentDoc) {
    throw new Error("Parent document not found");
  }

  // Generate embeddings for each chunk
  for (const chunk of chunks) {
    try {
      const embeddingResponse = await generateEmbedding(chunk.text, provider);
      const embeddingString = `[${embeddingResponse.embedding.join(",")}]`;
      
      // Store chunk in DocumentIndex using raw SQL (embedding is Unsupported in Prisma)
      const result = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
        `INSERT INTO document_indexes (id, title, content, url, source, source_id, user_id, space_id, metadata, embedding, created_at, updated_at)
         VALUES (gen_random_uuid()::text, $1, $2, NULL, $3, $4, $5, $6, $7::jsonb, $8::vector, NOW(), NOW())
         RETURNING id`,
        `Chunk from document ${documentId}`,
        chunk.text,
        "chunk",
        documentId,
        parentDoc.userId,
        parentDoc.spaceId,
        JSON.stringify({
          chunkIndex: chunks.indexOf(chunk),
          startIndex: chunk.startIndex,
          endIndex: chunk.endIndex,
          parentDocumentId: documentId,
        }),
        embeddingString
      );
    } catch (error) {
      console.error(`Error indexing chunk ${chunks.indexOf(chunk)}:`, error);
      // Continue with other chunks
    }
  }
}

/**
 * Update document embedding (re-index)
 */
export async function reindexDocument(
  documentId: string,
  provider: "openai" | "gemini" = "openai"
): Promise<void> {
  const document = await prisma.document_indexes.findUnique({
    where: { id: documentId },
  });

  if (!document) {
    throw new Error("Document not found");
  }

  // Delete existing chunks
  await prisma.document_indexes.deleteMany({
    where: {
      source: "chunk",
      sourceId: documentId,
    },
  });

  // Re-index
  await indexDocument(documentId, document.content, provider);
}

