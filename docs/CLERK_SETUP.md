# Auth with Clerk

This project uses [Clerk](https://clerk.com) for authentication. NextAuth has been removed.

## Setup

1. **Create a Clerk application** at [dashboard.clerk.com](https://dashboard.clerk.com).

2. **Add environment variables** to `.env.local`:

   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

   **Required for redirect after sign-in** (otherwise you may see the sign-in page again after logging in):

   ```bash
   # Use your actual app origin (change 3000 to 3001 if you use that port)
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=http://localhost:3000/chat
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=http://localhost:3000/chat
   # Force redirect (full URL recommended to avoid redirect loops)
   NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=http://localhost:3000/chat
   NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=http://localhost:3000/chat
   ```

   Optional (custom sign-in/sign-up paths):

   ```bash
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
   ```

3. **Clerk Dashboard – Allowed redirect URLs**  
   In [Clerk Dashboard](https://dashboard.clerk.com) → your application → **Paths** (or **Settings** → **Redirect URLs**), add:
   - `http://localhost:3000`
   - `http://localhost:3000/chat`
   (Use port 3001 if that’s where your app runs.)

4. **Run the database migration** to add the `clerkId` column to `users`:

   ```bash
   npm run db:migrate
   ```

   Or deploy migrations:

   ```bash
   npm run db:migrate:deploy
   ```

5. **Configure sign-in options** in the Clerk Dashboard (e.g. Email/Password, Google, GitHub) as needed.

### If Clerk asks for a one-time code instead of password

Clerk can be set to use **email + one-time code (OTP)** by default. To use **email + password** for the demo tier users (and avoid the code step):

- In Clerk Dashboard → **User & authentication** (or **Configure** → **Email, Phone, Username**), under **Email** enable **Sign-up with email** and **Sign-in with email**, then in the **Password** section enable **Sign-up with password** (and require password at sign-up if desired). Save. Sign-in will then use email + password instead of a one-time code.

## How it works

- **Clerk** handles sign-in, sign-up, sessions, and OAuth. Users sign in at `/login` and sign up at `/signup` (Clerk components).
- **Prisma** still stores your app’s users. On first sign-in, `lib/auth.ts` finds or creates a row in `users` linked via `clerkId` and creates a default space.
- **API routes** keep using `import { auth } from "@/auth"`. `auth()` returns a session with `session.user.id` = your Prisma user id, so existing APIs do not need to change.

## Migrating existing users

Users created with NextAuth (email/password or OAuth) do not have a `clerkId`. Options:

1. **Fresh start**: Use Clerk only for new sign-ins; existing users can be invited to sign up again with Clerk.
2. **Link by email**: When a user signs in with Clerk and their email already exists in `users`, `lib/auth.ts` updates that row with `clerkId` and uses it. So existing users who sign in with the same email in Clerk will be linked automatically.
