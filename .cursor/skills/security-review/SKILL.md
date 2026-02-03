---
name: security-review
description: Review auth, payments, file upload, webhooks for security. Use when adding or changing auth, payments, file upload, webhooks, or other security-sensitive flows.
---

# Security-Review Skill

When adding or changing auth, payments, file upload, webhooks, or other security-sensitive flows, follow this checklist.

## 1. Input validation

- All user input (body, query, headers, file metadata) validated and sanitized (lib/validation).
- File upload: validate type, size, and content where applicable; store outside web root; use safe filenames.
- Webhooks: verify signature or secret before processing; validate payload shape.

## 2. Auth and authorization

- Protected routes use session/auth; 401 for unauthenticated, 403 for unauthorized.
- No privilege escalation: user can only act on resources they are allowed to access (use session identity, not client-supplied ids).
- Apply the **auth-check** skill for user/session flows.

## 3. Secrets and PII

- No secrets or PII in code, logs, or responses; use env vars; never commit secrets.
- Sensitive data in DB or storage encrypted or access-controlled as per policy.

## 4. Rate limiting and abuse

- Consider rate limiting for auth, signup, and expensive or public endpoints (lib/rate-limit.ts if present).
- No unbounded operations (e.g. list without limit, or expensive work without guardrails).

## 5. Dependencies

- No known vulnerable dependencies (npm audit); upgrade or patch when needed.
- Use the **dependency-upgrade** skill when bumping dependencies.

## Output

- Checklist completed; any gaps fixed (validation, auth, secrets, rate limit, dependencies).
- If implementing, ensure error-handling and auth-check skills are applied in the same flow.
