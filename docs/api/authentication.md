---
title: Authentication API
description: User authentication and session management
---

# Authentication API

---

## Overview

Project Etna uses [Clerk](https://clerk.com) for authentication. NextAuth has been removed.

- **Sign-in**: `/login` (Clerk `<SignIn />` component)
- **Sign-up**: `/signup` (Clerk `<SignUp />` component)
- **Session**: Cookie-based; Prisma user is linked via `clerkId` and created on first sign-in
- **API**: Routes use `auth()` from `@/auth`, which returns a session with `session.user.id` = Prisma user id

For environment setup and redirect URLs, see [Clerk Setup](/CLERK_SETUP).

---

## Sign In & Sign Out (Clerk)

Sign-in and sign-up are handled by Clerk’s hosted UI at `/login` and `/signup`. There is no custom credentials API; configure Email/Password or OAuth in the [Clerk Dashboard](https://dashboard.clerk.com).

### Client: check auth and sign out

```javascript
import { useAuth, useUser, useClerk } from '@clerk/nextjs';

function MyComponent() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) return <p>Loading…</p>;
  if (!isSignedIn) return <p>Not signed in</p>;

  return (
    <>
      <p>Welcome, {user?.fullName ?? user?.primaryEmailAddress?.emailAddress}</p>
      <button onClick={() => signOut({ redirectUrl: '/login' })}>Sign out</button>
    </>
  );
}
```

### Redirects

- After sign-in: `afterSignInUrl="/chat"` (configured in `ClerkProvider` and env).
- After sign-up: `afterSignUpUrl="/chat"`.
- Sign-out: use `signOut({ redirectUrl: '/login' })` to send users to `/login`.

---

## Session (server-side)

Session is provided by `auth()` from `@/auth` (which uses Clerk + Prisma under the hood). Use it in API routes and server components.

### Get current session

```typescript
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const userId = session.user.id;  // Prisma user id
  const email = session.user.email;
  // ...
}
```

### Session shape

- `session.user.id` — Prisma user id (use this for DB relations)
- `session.user.email` — string
- `session.user.name` — string | null
- `session.user.image` — string | null
- `session.user.plan` — string (e.g. `"free"`)

---

## Protecting API Routes

Use the same pattern for any protected route:

```typescript
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const userId = session.user.id;
  // ...
}
```

---

## Optional: Programmatic sign-up API

`POST /api/auth/signup` still exists for creating users with email/password without Clerk (e.g. headless or migration). For normal app flows, users sign up via Clerk at `/signup`; Prisma users are then created on first sign-in in `lib/auth.ts`. If you rely on Clerk only, you can ignore this endpoint.

---

## Security notes

- Clerk manages session cookies and CSRF; do not expose `CLERK_SECRET_KEY` or publishable key misuse.
- Passwords (if using the optional signup API) are hashed with bcrypt.
- All protected API routes must call `auth()` and check `session?.user`; do not trust client-supplied user ids.
