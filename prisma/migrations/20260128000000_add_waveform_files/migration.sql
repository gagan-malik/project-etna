-- CreateTable
CREATE TABLE IF NOT EXISTS "waveform_files" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "blobUrl" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "spaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "waveform_files_pkey" PRIMARY KEY ("id")
);

-- Add waveformFileId column to debug_sessions
ALTER TABLE "debug_sessions" ADD COLUMN IF NOT EXISTS "waveformFileId" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "waveform_files_spaceId_idx" ON "waveform_files"("spaceId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "waveform_files_userId_idx" ON "waveform_files"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "waveform_files_format_idx" ON "waveform_files"("format");

-- AddForeignKey (only if not exists)
DO $$ BEGIN
    ALTER TABLE "waveform_files" ADD CONSTRAINT "waveform_files_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "waveform_files" ADD CONSTRAINT "waveform_files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "debug_sessions" ADD CONSTRAINT "debug_sessions_waveformFileId_fkey" FOREIGN KEY ("waveformFileId") REFERENCES "waveform_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
