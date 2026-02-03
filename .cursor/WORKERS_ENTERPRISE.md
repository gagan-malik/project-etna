# Enterprise Workers

**Where to see all workers:** [AGENTS.md](../AGENTS.md) at project root lists every role and when to invoke it. Cursor may not show a "Workers" list in the UI—use that file or prompt by name (e.g. "Act as the Research worker").

Use these roles when delegating or structuring work. If your Cursor setup supports workers, assign tasks as below. Otherwise, use this as a checklist for the main agent.

## Research

**Responsibility:** Docs, best practices, compatibility, security advisories.

**Invoke when:**
- "How does X work?"
- "What's the recommended way to…?"
- "Any CVEs or security advisories for…?"
- "Check compatibility with…"

**Output:** Summary with sources; recommendations; compatibility or security notes.

---

## Architect

**Responsibility:** Structure, boundaries, APIs, data model.

**Invoke when:**
- "Design the flow for…"
- "How should we split this service?"
- "API contract for…"
- "Data model for…"

**Output:** Structure, API boundaries, data model; alignment with [.cursor/rules/enterprise-baseline.mdc](.cursor/rules/enterprise-baseline.mdc) and [.cursor/rules/api-first.mdc](.cursor/rules/api-first.mdc).

---

## Implement

**Responsibility:** Code, tests, migrations, config.

**Invoke when:**
- "Implement…"
- "Add endpoint…"
- "Fix…"
- "Refactor…"

**Output:** Code and tests; apply **api-route**, **error-handling**, **testing**, **auth-check** (if applicable) skills. Follow [.cursor/rules/enterprise-baseline.mdc](.cursor/rules/enterprise-baseline.mdc), [.cursor/rules/api-first.mdc](.cursor/rules/api-first.mdc), [.cursor/rules/lib-conventions.mdc](.cursor/rules/lib-conventions.mdc), [.cursor/rules/frontend.mdc](.cursor/rules/frontend.mdc) as relevant.

---

## Review

**Responsibility:** Security, performance, correctness, style.

**Invoke when:**
- "Review this for security"
- "Is this ready for production?"
- "Suggest improvements"
- Before merging sensitive or high-impact changes

**Output:** Checklist from **security-review** and **auth-check** where applicable; correctness and style notes; concrete suggestions.

---

## Docs

**Responsibility:** README, API docs, runbooks, comments.

**Invoke when:**
- "Document this API"
- "Update README"
- "Add runbook for…"
- When APIs or ops procedures change

**Output:** Updated docs (docs/api/, README, runbooks); **openapi-snippet** skill when adding/changing public API.

---

## Orchestration (main agent)

| User intent | Delegate to |
|-------------|-------------|
| "How does X work?" / "Best practice for…" | Research |
| "Design the flow/API for…" | Architect |
| "Implement…" / "Add…" / "Fix…" | Implement (and Review for sensitive changes) |
| "Review for security" / "Ready for production?" | Review |
| "Document…" | Docs |

When implementing: combine Implement with api-route, error-handling, testing, auth-check (if auth), and security-review (if auth/payments/upload/webhooks). When documenting APIs: use Docs + openapi-snippet.
