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

## Production (Vercel) – fixing "Internal Server Error" on `__clerk_handshake`

If you see **Internal Server Error** when opening a URL like `https://your-app.vercel.app/?__clerk_handshake=...` (after sign-in redirect), fix the following:

1. **Clerk keys on Vercel**  
   In Vercel → Project → **Settings** → **Environment Variables**, add (for **Production**):
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`  
   For production, use your **production** keys from Clerk Dashboard (e.g. `pk_live_...` and `sk_live_...`). If you use **development** keys (`pk_test_...` / `sk_test_...`) on the live site, the handshake can fail or behave oddly.

2. **Redirect URLs for production**  
   In Vercel env (Production), set your **production** origin, for example:
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=https://etna-delta.vercel.app/chat`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=https://etna-delta.vercel.app/chat`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=https://etna-delta.vercel.app/chat`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=https://etna-delta.vercel.app/chat`  
   Replace `etna-delta.vercel.app` with your actual Vercel domain.

3. **Clerk Dashboard – allow your Vercel domain**  
   In [Clerk Dashboard](https://dashboard.clerk.com) → your app (Development or Production) → **Paths** (or **Configure** → **Domains** / **Redirect URLs**), add:
   - `https://etna-delta.vercel.app`
   - `https://etna-delta.vercel.app/chat`  
   (Use your real Vercel domain.) If this domain is not allowed, Clerk will not work on that URL and you may see **"This application does not have Clerk implemented"** or handshake 500s. The app code uses `authorizedParties` in middleware so the request origin is allowed; the Dashboard must also list the domain.

4. **See the real error**  
   In Vercel → Project → **Deployments** → open the latest deployment → **Functions** (or **Logs**). Reproduce the handshake request and check the server/function log for the actual exception (e.g. missing env, invalid key, or DB error from `getSession()`).

5. **Redeploy** after changing env vars so the new values are applied.

6. **Production alias (optional but recommended)**  
   If your app is served at a custom URL (e.g. `https://etna-delta.vercel.app`) that differs from the deployment hostname, set in Vercel (Production):
   - `NEXT_PUBLIC_APP_URL=https://etna-delta.vercel.app`  
   This is passed to Clerk’s `authorizedParties` so the alias origin is allowed. Without it, sign-in may fail when users open the alias URL.

7. **If you see “Clerk is not configured”**  
   The app shows this when `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is missing at build time. Fix: add the key in Vercel → Settings → Environment Variables for **Production**, then trigger a new deployment (env vars are baked in at build).

## Migrating existing users

Users created with NextAuth (email/password or OAuth) do not have a `clerkId`. Options:

1. **Fresh start**: Use Clerk only for new sign-ins; existing users can be invited to sign up again with Clerk.
2. **Link by email**: When a user signs in with Clerk and their email already exists in `users`, `lib/auth.ts` updates that row with `clerkId` and uses it. So existing users who sign in with the same email in Clerk will be linked automatically.
