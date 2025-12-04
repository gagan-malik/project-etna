/**
 * Database utilities and helpers
 */

import { prisma } from './prisma'

/**
 * Vector similarity search using pgvector
 * @param embedding - The embedding vector to search for (1536 dimensions for OpenAI)
 * @param limit - Maximum number of results to return
 * @param threshold - Similarity threshold (0-1, higher = more similar)
 * @param spaceId - Optional space ID to filter results
 */
export async function findSimilarDocuments(
  embedding: number[],
  limit: number = 10,
  threshold: number = 0.7,
  spaceId?: string
) {
  const embeddingString = `[${embedding.join(',')}]`
  
  const whereClause = spaceId 
    ? `WHERE space_id = '${spaceId}' AND 1 - (embedding <=> '${embeddingString}'::vector) > ${threshold}`
    : `WHERE 1 - (embedding <=> '${embeddingString}'::vector) > ${threshold}`

  const results = await prisma.$queryRawUnsafe<Array<{
    id: string
    title: string
    content: string
    url: string | null
    source: string | null
    similarity: number
  }>>(`
    SELECT 
      id,
      title,
      content,
      url,
      source,
      1 - (embedding <=> '${embeddingString}'::vector) as similarity
    FROM document_indexes
    ${whereClause}
    ORDER BY embedding <=> '${embeddingString}'::vector
    LIMIT ${limit}
  `)

  return results
}

/**
 * Health check for database connection
 */
export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { connected: true, error: null }
  } catch (error) {
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Get database statistics
 */
export async function getDatabaseStats() {
  const [userCount, spaceCount, conversationCount, messageCount, documentCount] = await Promise.all([
    prisma.user.count(),
    prisma.space.count(),
    prisma.conversation.count(),
    prisma.message.count(),
    prisma.documentIndex.count(),
  ])

  return {
    users: userCount,
    spaces: spaceCount,
    conversations: conversationCount,
    messages: messageCount,
    documents: documentCount,
  }
}

export { prisma }

