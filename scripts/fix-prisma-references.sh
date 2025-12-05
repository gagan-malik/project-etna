#!/bin/bash

# Script to fix Prisma model references to match schema (lowercase plural)

cd "$(dirname "$0")/.."

echo "Fixing Prisma model references..."

# Fix common Prisma model references
find app/api -name "*.ts" -type f -exec sed -i '' \
  -e 's/prisma\.user\./prisma.users./g' \
  -e 's/prisma\.space\./prisma.spaces./g' \
  -e 's/prisma\.conversation\./prisma.conversations./g' \
  -e 's/prisma\.message\./prisma.messages./g' \
  -e 's/prisma\.documentIndex\./prisma.document_indexes./g' \
  -e 's/prisma\.integration\./prisma.integrations./g' \
  -e 's/prisma\.account\./prisma.accounts./g' \
  -e 's/prisma\.session\./prisma.sessions./g' \
  {} \;

find lib -name "*.ts" -type f -exec sed -i '' \
  -e 's/prisma\.user\./prisma.users./g' \
  -e 's/prisma\.space\./prisma.spaces./g' \
  -e 's/prisma\.conversation\./prisma.conversations./g' \
  -e 's/prisma\.message\./prisma.messages./g' \
  -e 's/prisma\.documentIndex\./prisma.document_indexes./g' \
  -e 's/prisma\.integration\./prisma.integrations./g' \
  -e 's/prisma\.account\./prisma.accounts./g' \
  -e 's/prisma\.session\./prisma.sessions./g' \
  {} \;

find auth.ts prisma/seed.ts -name "*.ts" -type f -exec sed -i '' \
  -e 's/prisma\.user\./prisma.users./g' \
  -e 's/prisma\.space\./prisma.spaces./g' \
  -e 's/prisma\.conversation\./prisma.conversations./g' \
  -e 's/prisma\.message\./prisma.messages./g' \
  -e 's/prisma\.documentIndex\./prisma.document_indexes./g' \
  -e 's/prisma\.integration\./prisma.integrations./g' \
  -e 's/prisma\.account\./prisma.accounts./g' \
  -e 's/prisma\.session\./prisma.sessions./g' \
  {} \;

echo "✅ Prisma references fixed!"

