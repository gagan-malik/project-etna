-- AlterTable
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "plan" TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS "subscriptionStatus" TEXT,
ADD COLUMN IF NOT EXISTS "subscriptionExpiresAt" TIMESTAMP(3);

-- Update existing users to have 'free' plan if null
UPDATE "users" SET "plan" = 'free' WHERE "plan" IS NULL;

