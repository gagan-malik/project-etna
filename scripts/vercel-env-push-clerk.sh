#!/usr/bin/env bash
# Push Clerk (and related) env vars from .env.local to the linked Vercel project.
# Run from repo root: ./scripts/vercel-env-push-clerk.sh
# Requires: .env.local with NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY set.

set -e
cd "$(dirname "$0")/.."

ENV_FILE="${ENV_FILE:-.env.local}"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE. Create it with NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY (see docs/CLERK_SETUP.md)."
  exit 1
fi

# Read a single var value from .env.local (handles KEY=value and KEY="value")
get_var() {
  grep -E "^${1}=" "$ENV_FILE" 2>/dev/null | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//" | tr -d '\n'
}

add_to_vercel() {
  local name="$1"
  local value="$2"
  local sensitive="${3:-}"
  if [[ -z "$value" ]]; then
    echo "Skip $name (empty in $ENV_FILE)"
    return 0
  fi
  local opts="-y --force"
  [[ -n "$sensitive" ]] && opts="$opts --sensitive"
  for env in production preview development; do
    echo -n "$value" | vercel env add "$name" "$env" $opts 2>/dev/null && echo "Added $name to $env" || true
  done
}

echo "Pushing Clerk env vars from $ENV_FILE to Vercel (production, preview, development)..."

PK=$(get_var "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY")
SK=$(get_var "CLERK_SECRET_KEY")
add_to_vercel "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" "$PK"
add_to_vercel "CLERK_SECRET_KEY" "$SK" "sensitive"

# Optional: redirect URLs for production (use your real domain)
for key in \
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL \
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL \
  NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL \
  NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL; do
  val=$(get_var "$key")
  if [[ -n "$val" ]]; then
    add_to_vercel "$key" "$val"
  fi
done

echo "Done. Redeploy with: vercel --prod"
