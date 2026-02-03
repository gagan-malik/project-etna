-- AlterTable
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "userPreferences" JSONB;
