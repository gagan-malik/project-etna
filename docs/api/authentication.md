---
layout: default
title: Authentication
parent: API Reference
nav_order: 1
---

# Authentication API
{: .no_toc }

User authentication and session management.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Overview

Project Etna uses [Auth.js](https://authjs.dev/) (NextAuth.js v5) for authentication. The API supports:

- Email/password credentials
- Session-based authentication
- Secure cookie management

---

## Sign Up

Create a new user account.

```http
POST /api/auth/signup
```

### Request Body

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `name` | string | Yes | User's display name |
| `email` | string | Yes | Email address |
| `password` | string | Yes | Password (min 8 characters) |

### Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure-password"
}
```

### Response (Success)

```json
{
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Response (Error)

```json
{
  "error": "Email already registered"
}
```

### Validation Rules

- **Email**: Must be a valid email format
- **Password**: Minimum 8 characters
- **Name**: Required, 1-100 characters

---

## Sign In

Authenticate and create a session.

```http
POST /api/auth/callback/credentials
```

### Request Body

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `email` | string | Yes | Email address |
| `password` | string | Yes | Password |

### Example

```javascript
// Using Auth.js client
import { signIn } from 'next-auth/react';

await signIn('credentials', {
  email: 'john@example.com',
  password: 'secure-password',
  redirect: false
});
```

### Response

On success, sets an HTTP-only session cookie and returns:

```json
{
  "url": "/chat"
}
```

---

## Get Session

Retrieve the current user's session.

```http
GET /api/auth/session
```

### Response (Authenticated)

```json
{
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "image": null
  },
  "expires": "2024-02-01T00:00:00Z"
}
```

### Response (Not Authenticated)

```json
{}
```

### Example

```javascript
import { useSession } from 'next-auth/react';

function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') return <p>Not signed in</p>;
  
  return <p>Welcome, {session.user.name}</p>;
}
```

---

## Sign Out

End the current session.

```http
POST /api/auth/signout
```

### Example

```javascript
import { signOut } from 'next-auth/react';

await signOut({ redirect: true, callbackUrl: '/login' });
```

---

## Auth.js Handler

All other authentication routes are handled by Auth.js:

```http
GET /api/auth/[...nextauth]
POST /api/auth/[...nextauth]
```

This includes:

- `/api/auth/signin` - Sign in page
- `/api/auth/signout` - Sign out handler
- `/api/auth/session` - Session data
- `/api/auth/csrf` - CSRF token
- `/api/auth/providers` - Available auth providers

---

## Protecting API Routes

To protect your API routes, check for authentication:

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
  
  // User is authenticated
  const userId = session.user.id;
  // ...
}
```

---

## Security Notes

{: .important }
> - Passwords are hashed using bcrypt before storage
> - Session tokens are HTTP-only cookies (not accessible via JavaScript)
> - CSRF protection is enabled by default
> - Sessions expire after 30 days of inactivity
