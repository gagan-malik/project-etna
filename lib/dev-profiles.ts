/**
 * Dev-only: tier profile users for testing (free, pro, ultra).
 * Used by the dev profile switcher and auth for dev credential bypass.
 * Must match prisma/seed.ts TIER_PROFILES emails.
 */

export const DEV_TIER_PROFILES = [
  { email: "freeplan-user@example.com", name: "freeplan user", plan: "free" as const },
  { email: "prodplan-user@example.com", name: "prodplanuser", plan: "pro" as const },
  { email: "ultraplan-user@example.com", name: "ultraplan user", plan: "ultra" as const },
] as const;

const DEV_TIER_EMAILS = new Set(DEV_TIER_PROFILES.map((p) => p.email));

export function isDevTierProfileEmail(email: string): boolean {
  return DEV_TIER_EMAILS.has(email);
}
