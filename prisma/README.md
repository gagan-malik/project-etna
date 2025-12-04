# Prisma Schema Setup

## Database Models

This schema defines the following models:

### User & Authentication
- **User** - User accounts with email authentication
- **Account** - OAuth provider accounts (GitHub, Google, etc.)
- **Session** - User sessions for Auth.js
- **VerificationToken** - Email verification tokens

### Core Application Models
- **Space** - Workspaces/organizations for grouping conversations and documents
- **Conversation** - Chat conversations between users and AI
- **Message** - Individual messages in conversations with AI model tracking
- **Integration** - Third-party integrations (GitHub, Confluence, Microsoft Graph)
- **DocumentIndex** - Vector embeddings for document search with pgvector

## Setup Instructions

### 1. Configure Database URL

Create a `.env.local` file (copy from `.env.example`) and set your `DATABASE_URL`:

```bash
# For local PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/project_etna?schema=public"

# For Vercel Postgres (get from Vercel dashboard)
DATABASE_URL="postgres://default:password@ep-xxx.region.aws.neon.tech:5432/verceldb?sslmode=require"
```

### 2. Enable pgvector Extension

Before running migrations, enable the pgvector extension in your PostgreSQL database:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Run Migrations

```bash
# Create initial migration
npx prisma migrate dev --name init

# Or apply migrations to production
npx prisma migrate deploy
```

### 5. (Optional) Seed Database

Create `prisma/seed.ts` and run:

```bash
npx prisma db seed
```

## Vector Embeddings

The `DocumentIndex` model uses pgvector for semantic search. The embedding field is defined as:

```prisma
embedding   Unsupported("vector(1536)")? // pgvector embedding (1536 dimensions for OpenAI)
```

To query similar documents, use Prisma's raw SQL queries with pgvector functions:

```typescript
// Example: Find similar documents
const similarDocs = await prisma.$queryRaw`
  SELECT id, title, content, 
         1 - (embedding <=> ${embedding}::vector) as similarity
  FROM document_indexes
  WHERE 1 - (embedding <=> ${embedding}::vector) > 0.7
  ORDER BY embedding <=> ${embedding}::vector
  LIMIT 10
`;
```

## Next Steps

1. Set up your database connection
2. Run migrations to create tables
3. Configure Auth.js with Prisma adapter
4. Implement vector search functionality

