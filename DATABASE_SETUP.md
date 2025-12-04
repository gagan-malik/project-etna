# Database Setup Guide

## Quick Start

### Option 1: Vercel Postgres (Recommended for Production)

1. **Create Vercel Postgres Database:**
   - Go to your Vercel dashboard
   - Navigate to Storage → Create Database → Postgres
   - Copy the connection string

2. **Update `.env.local`:**
   ```bash
   DATABASE_URL="postgres://default:password@ep-xxx.region.aws.neon.tech:5432/verceldb?sslmode=require"
   ```

3. **Enable pgvector extension:**
   - In Vercel dashboard, go to your database
   - Open the SQL Editor
   - Run: `CREATE EXTENSION IF NOT EXISTS vector;`

4. **Run migrations:**
   ```bash
   npm run db:migrate
   ```

### Option 2: Local PostgreSQL

1. **Install PostgreSQL:**
   ```bash
   # macOS
   brew install postgresql@15
   brew services start postgresql@15

   # Or use Docker
   docker run --name postgres-etna -e POSTGRES_PASSWORD=password -e POSTGRES_DB=project_etna -p 5432:5432 -d postgres:15
   ```

2. **Create database:**
   ```bash
   psql -U postgres
   CREATE DATABASE project_etna;
   \c project_etna
   CREATE EXTENSION IF NOT EXISTS vector;
   \q
   ```

3. **Update `.env.local`:**
   ```bash
   DATABASE_URL="postgresql://postgres:password@localhost:5432/project_etna?schema=public"
   ```

4. **Run migrations:**
   ```bash
   npm run db:migrate
   ```

### Option 3: Neon (Free PostgreSQL with pgvector)

1. **Sign up at** https://neon.tech
2. **Create a new project**
3. **Copy the connection string** (includes pgvector support)
4. **Update `.env.local`** with the connection string
5. **Run migrations:**
   ```bash
   npm run db:migrate
   ```

## Running Migrations

Once your `DATABASE_URL` is configured:

```bash
# Generate Prisma Client (if not already done)
npm run db:generate

# Create and apply migrations
npm run db:migrate

# This will:
# 1. Create all database tables
# 2. Enable pgvector extension
# 3. Set up indexes and constraints
```

## Verify Setup

1. **Check database connection:**
   ```bash
   npm run db:studio
   ```
   This opens Prisma Studio where you can view your database.

2. **Or use a SQL client:**
   ```bash
   psql $DATABASE_URL
   ```

3. **Verify tables exist:**
   ```sql
   \dt
   ```

4. **Verify pgvector extension:**
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'vector';
   ```

## Seed Database (Optional)

After migrations, you can seed with test data:

```bash
npm run db:seed
```

This creates:
- A test user (test@example.com)
- A test space
- A test conversation with messages

## Troubleshooting

### Connection Refused
- Check if PostgreSQL is running
- Verify DATABASE_URL format
- Check firewall/network settings

### Extension Not Found
- Run: `CREATE EXTENSION IF NOT EXISTS vector;`
- Ensure you have superuser privileges

### Migration Errors
- Check Prisma schema is valid: `npx prisma validate`
- Reset database (⚠️ deletes all data): `npm run db:reset`

### Prisma Client Not Found
- Regenerate: `npm run db:generate`

## Next Steps

After database is set up:
1. ✅ Database configured
2. ⏭️ Set up Auth.js configuration
3. ⏭️ Create API routes
4. ⏭️ Implement authentication

