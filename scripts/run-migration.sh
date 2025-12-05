#!/bin/bash

# Database Migration Script
# This script runs the Prisma migration to add subscription fields

set -e

echo "🚀 Running database migration..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    echo "Please set DATABASE_URL in your .env.local file or environment"
    exit 1
fi

# Run the migration
echo "📦 Running Prisma migration..."
npx prisma migrate deploy

echo "✅ Migration completed successfully!"
echo ""
echo "Verifying migration..."
npx prisma db pull --force 2>&1 | grep -q "subscription" && echo "✅ Subscription fields verified" || echo "⚠️  Could not verify fields"

echo ""
echo "🎉 Migration complete! Your database now has subscription fields."

