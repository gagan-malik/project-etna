# Tier test accounts (dummy credentials)

These users are created in both the database (`npm run db:seed`) and in Clerk (`scripts/create-clerk-tier-users.ts`) for testing each product tier.

| Tier  | Email                        | Display name    | Plan   |
|-------|------------------------------|-----------------|--------|
| Free  | `freeplan-user@example.com`  | freeplan user   | free   |
| Pro   | `prodplan-user@example.com`  | prodplanuser    | pro    |
| Ultra | `ultraplan-user@example.com` | ultraplan user  | ultra  |

**Shared password (all tiers):** `TierDevPassword1!`  
Override with env: `TIER_DEV_PASSWORD`.

## How to use

- **Database**: Run `npm run db:seed` to create or update these users and their default spaces in Prisma.
- **Clerk**: Run `npx tsx scripts/create-clerk-tier-users.ts` to create the same users in your Clerk instance (only needed once, or if you reset Clerk). Then sign in at `/login` with the email and password above.
- **Linking**: On first sign-in, `lib/auth.ts` links the Clerk user to the existing Prisma user by email, so tier plan and data are preserved.

## Reference

- Seed: `prisma/seed.ts`
- Dev profiles: `lib/dev-profiles.ts`
- Create in Clerk: `scripts/create-clerk-tier-users.ts`
