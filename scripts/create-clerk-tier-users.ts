/**
 * Create tier test users (free, pro, ultra) in Clerk.
 * Run: npx tsx scripts/create-clerk-tier-users.ts
 * Requires: CLERK_SECRET_KEY and .env.local (or TIER_DEV_PASSWORD optional).
 */

import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { createClerkClient } from "@clerk/backend";
import { DEV_TIER_PROFILES } from "../lib/dev-profiles";

expand(config({ path: ".env.local" }));
expand(config({ path: ".env" }));

const secretKey = process.env.CLERK_SECRET_KEY;
if (!secretKey) {
  console.error("CLERK_SECRET_KEY is required. Set it in .env.local");
  process.exit(1);
}

const DEV_PASSWORD = process.env.TIER_DEV_PASSWORD ?? "TierDevPassword1!";

function nameToFirstLast(name: string): { firstName: string; lastName: string } {
  const trimmed = name.trim();
  const space = trimmed.indexOf(" ");
  if (space === -1) return { firstName: trimmed, lastName: "" };
  return {
    firstName: trimmed.slice(0, space),
    lastName: trimmed.slice(space + 1),
  };
}

async function main() {
  const clerk = createClerkClient({ secretKey });

  for (const profile of DEV_TIER_PROFILES) {
    const { firstName, lastName } = nameToFirstLast(profile.name);
    try {
      const user = await clerk.users.createUser({
        emailAddress: [profile.email],
        password: DEV_PASSWORD,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        skipPasswordChecks: true,
      });
      console.log(`✅ Created Clerk user [${profile.plan}]:`, profile.email, "→", user.id);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("already exists") || message.includes("identifier")) {
        console.log(`⏭️  User already exists [${profile.plan}]:`, profile.email);
      } else {
        console.error(`❌ Failed [${profile.plan}]`, profile.email, message);
      }
    }
  }

  console.log("\n🎉 Done. Tier users can sign in at /login with:");
  console.log("   Password (all tiers):", DEV_PASSWORD);
  console.log("   Emails: see docs/TIER_TEST_ACCOUNTS.md");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
