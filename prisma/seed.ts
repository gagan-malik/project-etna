import { config } from 'dotenv'
import { expand } from 'dotenv-expand'

// Load .env.local then .env (same as prisma.config.ts)
expand(config({ path: '.env.local' }))
expand(config({ path: '.env' }))

import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is required to run the seed')
}
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

/** Tier profile users: one per product plan with canonical display names */
const TIER_PROFILES = [
  { email: 'freeplan-user@example.com', name: 'freeplan user', plan: 'free' as const },
  { email: 'prodplan-user@example.com', name: 'prodplanuser', plan: 'pro' as const },
  { email: 'ultraplan-user@example.com', name: 'ultraplan user', plan: 'ultra' as const },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Create tier profile users (free, pro, ultra) and a default space for each
  for (const profile of TIER_PROFILES) {
    const tierUser = await prisma.users.upsert({
      where: { email: profile.email },
      update: { name: profile.name, plan: profile.plan },
      create: {
        email: profile.email,
        name: profile.name,
        plan: profile.plan,
        emailVerified: new Date(),
      },
    })
    const spaceSlug = `workspace-${tierUser.id}`
    await prisma.spaces.upsert({
      where: { slug: spaceSlug },
      update: {},
      create: {
        name: `${profile.name}'s Workspace`,
        slug: spaceSlug,
        ownerId: tierUser.id,
      },
    })
    console.log(`✅ Tier profile [${profile.plan}]:`, tierUser.email, '→', tierUser.name)
  }

  // Create a test user
  const user = await prisma.users.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      emailVerified: new Date(),
    },
  })

  console.log('✅ Created test user:', user.email)

  // Create a test space
  const space = await prisma.spaces.upsert({
    where: { slug: 'test-space' },
    update: {},
    create: {
      name: 'Test Space',
      description: 'A test workspace',
      slug: 'test-space',
      ownerId: user.id,
    },
  })

  console.log('✅ Created test space:', space.name)

  // Create a test conversation
  const conversation = await prisma.conversations.create({
    data: {
      title: 'Welcome Conversation',
      userId: user.id,
      spaceId: space.id,
      messages: {
        create: [
          {
            role: 'user',
            content: 'Hello! This is a test message.',
            model: 'gpt-4',
            provider: 'openai',
          },
          {
            role: 'assistant',
            content: 'Hello! I\'m here to help. How can I assist you today?',
            model: 'gpt-4',
            provider: 'openai',
          },
        ],
      },
    },
  })

  console.log('✅ Created test conversation:', conversation.id)

  console.log('🎉 Seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

