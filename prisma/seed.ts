import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create a test user
  const user = await prisma.user.upsert({
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
  const space = await prisma.space.upsert({
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
  const conversation = await prisma.conversation.create({
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

