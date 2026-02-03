# UX, Usability & Accessibility Workers

**Where to see all workers:** [AGENTS.md](../AGENTS.md) at project root lists every role and when to invoke it. Cursor may not show a "Workers" list in the UI—use that file or prompt by name (e.g. "Act as the Accessibility Reviewer").

Use these roles when delegating or structuring work. If your Cursor setup supports workers, assign UX-related tasks as below. Otherwise, use this as a checklist for the main agent.

## UX Researcher

**Responsibility:** User needs, personas, flows, and alignment with product goals.

**Invoke when:**
- "What should the flow be for…?"
- "Who is this for and what do they need?"
- "Does this match our UX principles?"
- "Review this flow against UX_MASTER_FILE"

**Output:** User goals, task flow, consistency with [docs/product/UX_MASTER_FILE.md](docs/product/UX_MASTER_FILE.md) (personas, task flows, principles).

---

## UX Designer / Information Architect

**Responsibility:** Layout, hierarchy, navigation, and visual consistency.

**Invoke when:**
- "Improve the layout of…"
- "Design the structure for this feature"
- "Is the hierarchy clear?"
- "Review IA and navigation"

**Output:** Structure, component placement, breakpoints, consistency with design system (Visual Design System, Responsive Behavior in UX_MASTER_FILE).

---

## Usability Reviewer

**Responsibility:** Forms, feedback, errors, and clarity of actions.

**Invoke when:**
- "Check this form for usability"
- "Improve error messages"
- "Add loading/success feedback"
- "Review feedback patterns"

**Output:** Checklist from [.cursor/skills/usability-check/SKILL.md](.cursor/skills/usability-check/SKILL.md); concrete copy and component suggestions.

---

## Accessibility Reviewer

**Responsibility:** WCAG 2.1 AA, keyboard, screen readers, focus, ARIA.

**Invoke when:**
- "Make this accessible"
- "Add keyboard support"
- "Review for a11y"
- "Add screen reader support"
- After adding/changing interactive UI (buttons, links, forms, modals, toasts, live regions)

**Output:** Checklist from [.cursor/skills/accessibility/SKILL.md](.cursor/skills/accessibility/SKILL.md); code changes for focus, labels, ARIA, contrast.

---

## Orchestration (main agent)

| User intent | Delegate to |
|-------------|-------------|
| "Design the flow for X" | UX Researcher → UX Designer |
| "Build the UI for X" | UX Designer (structure) + Implement (code) |
| "Review this page" | Usability Reviewer + Accessibility Reviewer |
| "Add a form that does X" | Implement + Usability Reviewer + Accessibility Reviewer |
| "Is this accessible?" | Accessibility Reviewer |

When implementing UI, the main agent should apply [.cursor/rules/ux-usability-accessibility.mdc](.cursor/rules/ux-usability-accessibility.mdc) and the **accessibility** and **usability-check** skills as part of the same pass.
