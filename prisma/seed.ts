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

  // Built-in skills (silicon-focused system-prompt fragments)
  const builtInSkills = [
    {
      id: 'skill-rtl-uninitialized',
      name: 'RTL uninitialized check',
      description: 'Always flag uninitialized registers and latches in RTL',
      systemPromptFragment:
        'When reviewing RTL or Verilog/SystemVerilog code, always check for and flag: uninitialized registers, inferred latches, and signals that may be undefined at reset or in simulation.',
      isBuiltIn: true,
    },
    {
      id: 'skill-cdc-awareness',
      name: 'Clock domain crossing awareness',
      description: 'Highlight CDC issues and synchronization requirements',
      systemPromptFragment:
        'When analyzing RTL with multiple clocks, identify clock domain crossings and comment on proper synchronization (e.g. synchronizers, handshakes). Flag potential metastability and timing issues.',
      isBuiltIn: true,
    },
    {
      id: 'skill-assertion-suggestions',
      name: 'Assertion suggestions',
      description: 'Suggest SVA or assertions for verification coverage',
      systemPromptFragment:
        'When reviewing RTL or testbenches, suggest SystemVerilog assertions (SVA) or checks that would improve verification coverage: protocol compliance, data integrity, FSM transitions, and reset behavior.',
      isBuiltIn: true,
    },
  ]
  for (const s of builtInSkills) {
    await prisma.skills.upsert({
      where: { id: s.id },
      update: { name: s.name, description: s.description ?? undefined, systemPromptFragment: s.systemPromptFragment, isBuiltIn: true },
      create: {
        id: s.id,
        userId: null,
        name: s.name,
        description: s.description ?? undefined,
        systemPromptFragment: s.systemPromptFragment,
        isBuiltIn: true,
      },
    })
  }
  console.log('✅ Seeded built-in skills:', builtInSkills.length)

  // Dummy user commands for test user (try in chat: /debug-rtl, /review-code, /explain)
  const testCommands = [
    {
      slug: 'debug-rtl',
      name: 'Debug RTL',
      promptTemplate: 'Analyze this RTL for bugs, timing issues, and best practices. Focus on: {{user_input}}',
      showAsQuickAction: true,
    },
    {
      slug: 'review-code',
      name: 'Review code',
      promptTemplate: 'Review the following code for correctness, style, and potential bugs. Context: {{user_input}}',
      showAsQuickAction: false,
    },
    {
      slug: 'explain',
      name: 'Explain',
      promptTemplate: 'Explain the following in simple terms, step by step: {{user_input}}',
      showAsQuickAction: true,
    },
  ]
  for (const c of testCommands) {
    await prisma.user_commands.upsert({
      where: { userId_slug: { userId: user.id, slug: c.slug } },
      update: { name: c.name, promptTemplate: c.promptTemplate, showAsQuickAction: c.showAsQuickAction },
      create: {
        userId: user.id,
        name: c.name,
        slug: c.slug,
        promptTemplate: c.promptTemplate,
        showAsQuickAction: c.showAsQuickAction,
      },
    })
  }
  console.log('✅ Seeded test commands:', testCommands.length)

  // Dummy workers for test user (try in chat: /worker-cdc, /worker-summarize or "Run worker" dropdown)
  const testWorkers = [
    {
      slug: 'worker-cdc',
      name: 'CDC checker',
      systemPrompt:
        'You are a clock domain crossing (CDC) verification expert. Analyze the design or code the user provides for CDC issues: unsynchronized signals crossing clock domains, missing synchronizers, metastability risks, and recommend fixes. Be concise and list issues by severity.',
      modelId: null as string | null,
    },
    {
      slug: 'worker-summarize',
      name: 'Summarizer',
      systemPrompt:
        'You are a summarization assistant. Summarize the user\'s input clearly and concisely. Use bullet points for long content. Preserve key facts and decisions.',
      modelId: null as string | null,
    },
  ]
  for (const w of testWorkers) {
    await prisma.workers.upsert({
      where: { userId_slug: { userId: user.id, slug: w.slug } },
      update: { name: w.name, systemPrompt: w.systemPrompt, modelId: w.modelId },
      create: {
        userId: user.id,
        slug: w.slug,
        name: w.name,
        systemPrompt: w.systemPrompt,
        modelId: w.modelId,
      },
    })
  }
  console.log('✅ Seeded test workers:', testWorkers.length)

  // Same dummies for free-tier profile user (freeplan-user@example.com)
  const freeUser = await prisma.users.findUnique({ where: { email: 'freeplan-user@example.com' } })
  if (freeUser) {
    for (const c of testCommands) {
      await prisma.user_commands.upsert({
        where: { userId_slug: { userId: freeUser.id, slug: c.slug } },
        update: { name: c.name, promptTemplate: c.promptTemplate, showAsQuickAction: c.showAsQuickAction },
        create: {
          userId: freeUser.id,
          name: c.name,
          slug: c.slug,
          promptTemplate: c.promptTemplate,
          showAsQuickAction: c.showAsQuickAction,
        },
      })
    }
    for (const w of testWorkers) {
      await prisma.workers.upsert({
        where: { userId_slug: { userId: freeUser.id, slug: w.slug } },
        update: { name: w.name, systemPrompt: w.systemPrompt, modelId: w.modelId },
        create: {
          userId: freeUser.id,
          slug: w.slug,
          name: w.name,
          systemPrompt: w.systemPrompt,
          modelId: w.modelId,
        },
      })
    }
    console.log('✅ Seeded commands & workers for freeplan-user')
  }

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

