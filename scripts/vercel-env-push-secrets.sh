#!/usr/bin/env bash
# Push AI_GATEWAY_API_KEY, OPENAI_API_KEY, BLOB_READ_WRITE_TOKEN, CRON_SECRET from .env.local to Vercel.
# Usage: from repo root, ./scripts/vercel-env-push-secrets.sh
# Ensure .env.local has the keys set; they are not committed.

set -e
cd "$(dirname "$0")/.."
ENV_FILE=".env.local"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "No $ENV_FILE found. Create it and add AI_GATEWAY_API_KEY, OPENAI_API_KEY, BLOB_READ_WRITE_TOKEN, CRON_SECRET."
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE" 2>/dev/null || true

for env in production preview; do
  # Support both AI_GATEWAY_API_KEY and VERCEL_AI_GATEWAY_API_KEY (Vercel dashboard name)
  GATEWAY_KEY="${AI_GATEWAY_API_KEY:-$VERCEL_AI_GATEWAY_API_KEY}"
  if [[ -n "$GATEWAY_KEY" ]]; then
    echo "Pushing AI_GATEWAY_API_KEY to $env..."
    echo -n "$GATEWAY_KEY" | vercel env add AI_GATEWAY_API_KEY "$env" -y --sensitive --force
  fi
  if [[ -n "$OPENAI_API_KEY" ]]; then
    echo "Pushing OPENAI_API_KEY to $env..."
    echo -n "$OPENAI_API_KEY" | vercel env add OPENAI_API_KEY "$env" -y --sensitive --force
  fi
  if [[ -n "$BLOB_READ_WRITE_TOKEN" ]]; then
    echo "Pushing BLOB_READ_WRITE_TOKEN to $env..."
    echo -n "$BLOB_READ_WRITE_TOKEN" | vercel env add BLOB_READ_WRITE_TOKEN "$env" -y --sensitive --force
  fi
  if [[ -n "$CRON_SECRET" ]]; then
    echo "Pushing CRON_SECRET to $env..."
    echo -n "$CRON_SECRET" | vercel env add CRON_SECRET "$env" -y --sensitive --force
  fi
done

echo "Done. Run 'vercel env ls' to confirm."
