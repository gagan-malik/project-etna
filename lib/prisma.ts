import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create PostgreSQL connection pool for Prisma 7 adapter
const connectionString = process.env.DATABASE_URL
let adapter: PrismaPg | undefined

if (connectionString) {
  try {
    const pool = new Pool({ connectionString })
    adapter = new PrismaPg(pool)
  } catch (error) {
    console.warn('Failed to create Prisma adapter, will use default connection')
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

