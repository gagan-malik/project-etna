---
name: auth-check
description: Ensure auth and session are used correctly; no privilege escalation or PII exposure. Use when adding or changing features that touch users, sessions, or protected resources.
---

# Auth-Check Skill

When the feature touches users, sessions, or protected resources, follow these steps.

## 1. Session / auth usage

- Use existing auth (auth.ts) and session helpers (e.g. getSession) for protected routes and server components.
- Do not bypass auth for "convenience"; assume least privilege for new features.
- For API routes: return 401 when unauthenticated, 403 when the user lacks permission for the resource.

## 2. Privilege

- Verify the acting user is allowed to perform the action (e.g. same user, or role check).
- Do not allow one user to access or modify another user's data without an explicit permission model.
- When adding new roles or scopes, document them and enforce in one place.

## 3. PII and secrets

- Never log or expose PII (emails, names, tokens) in responses or logs.
- Do not return sensitive fields (e.g. password hash, internal IDs) in API responses unless required and documented.
- Use env vars for secrets; never commit or log them.

## 4. Input

- Validate and sanitize all user input (lib/validation); treat session/headers as untrusted where they affect behavior.
- Do not trust client-supplied user IDs for authorization; use session identity.

## Output

- Confirm auth is used, privilege is checked, and PII/secrets are not exposed.
- If implementing, apply the **security-review** skill for auth, payments, or file upload flows.
