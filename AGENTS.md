# Project agents (worker roles)

**Why Settings → Workers is blank:** Cursor does not read project files (e.g. this file or WORKERS_*.md). Workers are created **in Cursor Settings**: click **New Worker**, set name and instructions. **To fill Settings:** use the copy-paste instructions in [.cursor/WORKERS_FOR_SETTINGS.md](.cursor/WORKERS_FOR_SETTINGS.md)—one block per worker to paste into the New Worker form.

These roles are also **reference checklists**. To use them without creating workers in Settings: **prompt by name** (e.g. "Act as the Research worker") or open the linked doc for full instructions.

---

## Enterprise workers

| Role | When to invoke | Full doc |
|------|----------------|----------|
| **Research** | "How does X work?", "Best practice for…?", "Any CVEs for…?" | [.cursor/WORKERS_ENTERPRISE.md#research](.cursor/WORKERS_ENTERPRISE.md) |
| **Architect** | "Design the flow/API for…", "API contract for…", "Data model for…" | [.cursor/WORKERS_ENTERPRISE.md#architect](.cursor/WORKERS_ENTERPRISE.md) |
| **Implement** | "Implement…", "Add endpoint…", "Fix…", "Refactor…" | [.cursor/WORKERS_ENTERPRISE.md#implement](.cursor/WORKERS_ENTERPRISE.md) |
| **Review** | "Review for security", "Ready for production?", "Suggest improvements" | [.cursor/WORKERS_ENTERPRISE.md#review](.cursor/WORKERS_ENTERPRISE.md) |
| **Docs** | "Document this API", "Update README", "Add runbook for…" | [.cursor/WORKERS_ENTERPRISE.md#docs](.cursor/WORKERS_ENTERPRISE.md) |
| **Enterprise Orchestrator** | Route by intent: "How does X work?", design, implement, review, document | [.cursor/agents/enterprise-orchestrator.md](.cursor/agents/enterprise-orchestrator.md) |
| **Full-Stack Engineer** | Fix CI, resolve merge conflicts, ship PRs, run smoke tests, deslop code, summarize work | [.cursor/agents/full-stack-engineer.md](.cursor/agents/full-stack-engineer.md) |

Full orchestration: [.cursor/WORKERS_ENTERPRISE.md](.cursor/WORKERS_ENTERPRISE.md)

---

## UX workers

| Role | When to invoke | Full doc |
|------|----------------|----------|
| **UX Researcher** | "What should the flow be for…?", "Who is this for?", "Review flow against UX_MASTER_FILE" | [.cursor/WORKERS_UX.md](.cursor/WORKERS_UX.md) |
| **UX Designer / IA** | "Improve the layout of…", "Design structure for this feature", "Review IA and navigation" | [.cursor/WORKERS_UX.md](.cursor/WORKERS_UX.md) |
| **Usability Reviewer** | "Check this form for usability", "Improve error messages", "Review feedback patterns" | [.cursor/WORKERS_UX.md](.cursor/WORKERS_UX.md) |
| **Accessibility Reviewer** | "Make this accessible", "Add keyboard support", "Review for a11y" | [.cursor/WORKERS_UX.md](.cursor/WORKERS_UX.md) |

Full orchestration: [.cursor/WORKERS_UX.md](.cursor/WORKERS_UX.md)

---

## How to use

- **In chat:** e.g. "Act as the Research worker and find best practices for…" or "Follow the Review checklist from WORKERS_ENTERPRISE."
- **For the AI:** The main agent should delegate to these roles per the orchestration tables in the docs above when your request matches the "When to invoke" column.
