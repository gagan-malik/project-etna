---
name: ux-review
description: Run a UX review on flows, layouts, or screens. Use when adding or changing a user flow, page layout, navigation, or set of related screens.
---

# UX Review Skill

When the user asks for a UX review, or when you are adding/changing a flow, layout, or set of screens, follow this checklist. Align with [docs/product/UX_MASTER_FILE.md](docs/product/UX_MASTER_FILE.md).

## 1. Alignment with Etna principles

- **Conversation first**: Is chat/primary action prominent? Are key actions not buried in menus?
- **Zero friction**: Can the user reach value with minimal steps? Any unnecessary signup or config gates?
- **Keyboard native**: Can power users complete the flow with keyboard (Tab, Enter, Esc, shortcuts)?
- **Progressive disclosure**: Is the default view simple? Are advanced options available but not overwhelming?
- **Delightful speed**: Are there blocking spinners that could be replaced with skeletons, streaming, or optimistic UI?

## 2. Information architecture & hierarchy

- Is the primary goal and primary action obvious?
- Are headings and sections in a logical order (e.g. H1 → H2 → H3)?
- Is secondary/tertiary content visually de-emphasized?
- Does the flow match the user’s mental model (see personas and task flows in UX_MASTER_FILE)?

## 3. Consistency

- Do patterns match existing app (e.g. toasts, modals, command palette)?
- Are labels, button copy, and error messages consistent in tone and placement?
- Do breakpoints and layout (sidebar, bottom nav, panels) match the responsive spec?

## 4. Feedback & errors

- Is there clear feedback for success, loading, and error?
- Are error messages actionable (what went wrong, what to do next)?
- Are toasts used for non-blocking feedback per UX_MASTER_FILE patterns?

## 5. Output

- Summarize: what’s strong, what to improve, and concrete changes (e.g. “Move primary CTA above the fold”, “Add skip-to-content for keyboard”).
- If implementing, apply the rule [.cursor/rules/ux-usability-accessibility.mdc](.cursor/rules/ux-usability-accessibility.mdc) and the accessibility skill when editing UI.
