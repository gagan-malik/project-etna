# Quick Start Guide

## 1. Setup Environment Variables

Run the setup script to create `.env.local`:

```bash
npm run setup:env
```

Or manually create `.env.local` and configure:

```bash
# Copy template
cp .env.example .env.local

# Generate NEXTAUTH_SECRET
openssl rand -base64 32
# Add the output to NEXTAUTH_SECRET in .env.local
```

## 2. Configure Database

### Choose one option:

**Option A: Vercel Postgres (Recommended)**
1. Create Postgres database in Vercel dashboard
2. Copy connection string to `DATABASE_URL` in `.env.local`
3. Enable pgvector in SQL Editor: `CREATE EXTENSION IF NOT EXISTS vector;`

**Option B: Local PostgreSQL**
```bash
# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb project_etna
psql project_etna -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Update .env.local
DATABASE_URL="postgresql://$(whoami)@localhost:5432/project_etna?schema=public"
```

**Option C: Neon (Free Cloud PostgreSQL)**
1. Sign up at https://neon.tech
2. Create project (pgvector included)
3. Copy connection string to `DATABASE_URL` in `.env.local`

## 3. Run Migrations

Once `DATABASE_URL` is configured:

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate
```

This creates all database tables and enables pgvector.

## 4. (Optional) Seed Database

```bash
npm run db:seed
```

Creates test user, space, and conversation.

## 5. Verify Setup

```bash
# Open Prisma Studio to view database
npm run db:studio

# Or start development server
npm run dev
```

## Common Issues

### "Can't reach database server"
- Check if PostgreSQL is running
- Verify DATABASE_URL format
- Test connection: `psql $DATABASE_URL`

### "Extension vector does not exist"
- Run: `CREATE EXTENSION IF NOT EXISTS vector;`
- Ensure you have database admin privileges

### "Prisma Client not found"
- Run: `npm run db:generate`

## Next Steps

After database is ready:
1. ✅ Environment configured
2. ✅ Database migrated
3. ⏭️ Configure Auth.js
4. ⏭️ Set up API routes
5. ⏭️ Implement features

