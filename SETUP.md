# Project Etna - Setup Guide

## Prerequisites

- Node.js 20+ installed
- PostgreSQL database (local or Vercel Postgres)
- npm or yarn package manager

## Step 1: Environment Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure your environment variables in `.env.local`:**
   - Set `DATABASE_URL` with your PostgreSQL connection string
   - Add API keys for services you'll use (OpenAI, Gemini, etc.)
   - Generate `NEXTAUTH_SECRET`:
     ```bash
     openssl rand -base64 32
     ```

## Step 2: Database Setup

### Option A: Local PostgreSQL

1. **Install PostgreSQL** (if not already installed)
2. **Create database:**
   ```sql
   CREATE DATABASE project_etna;
   ```
3. **Enable pgvector extension:**
   ```sql
   \c project_etna
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
4. **Update `.env.local`:**
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/project_etna?schema=public"
   ```

### Option B: Vercel Postgres

1. **Create Vercel Postgres database** in your Vercel dashboard
2. **Copy the connection string** to `.env.local` as `DATABASE_URL`
3. **Enable pgvector** via Vercel dashboard or SQL:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

## Step 3: Run Database Migrations

1. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

2. **Run migrations:**
   ```bash
   npm run db:migrate
   ```
   This will:
   - Create all database tables
   - Enable pgvector extension
   - Set up indexes and constraints

3. **(Optional) Seed the database:**
   ```bash
   npm run db:seed
   ```

## Step 4: Verify Setup

1. **Check database connection:**
   ```bash
   npm run db:studio
   ```
   This opens Prisma Studio where you can view and edit your database.

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Visit** `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database (dev only)
- `npm run db:migrate` - Create and apply migrations
- `npm run db:migrate:deploy` - Apply migrations (production)
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with test data
- `npm run db:reset` - Reset database (⚠️ deletes all data)

## Database Schema

The database includes the following models:

- **User** - User accounts and authentication
- **Space** - Workspaces/organizations
- **Conversation** - Chat conversations
- **Message** - Individual messages with AI tracking
- **Integration** - Third-party integrations
- **DocumentIndex** - Vector embeddings for semantic search

See `prisma/schema.prisma` for full schema details.

## Troubleshooting

### Database Connection Issues

1. **Check DATABASE_URL format:**
   - PostgreSQL: `postgresql://user:password@host:port/database?schema=public`
   - Vercel Postgres: `postgres://user:password@host:port/database?sslmode=require`

2. **Verify database is running:**
   ```bash
   psql -h localhost -U your_user -d project_etna
   ```

3. **Check pgvector extension:**
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'vector';
   ```

### Migration Issues

1. **Reset database (⚠️ deletes all data):**
   ```bash
   npm run db:reset
   ```

2. **Manually enable pgvector:**
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

### Prisma Client Issues

1. **Regenerate Prisma Client:**
   ```bash
   npm run db:generate
   ```

2. **Clear node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## Next Steps

1. ✅ Database setup complete
2. ⏭️ Configure Auth.js (NextAuth)
3. ⏭️ Set up API routes
4. ⏭️ Implement AI model integrations
5. ⏭️ Build UI components

