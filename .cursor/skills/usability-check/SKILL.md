---
name: usability-check
description: Check usability of forms, errors, and feedback. Use when adding or changing forms, validation, error states, loading states, or user feedback (toasts, inline messages).
---

# Usability Check Skill

When the user asks for a usability check, or when you are adding/changing forms, errors, or feedback, follow this checklist.

## 1. Forms

- **Labels**: Every control has a visible label or `aria-label`; required fields are indicated (e.g. asterisk + “Required” in legend or title).
- **Placeholders**: Placeholders are hints, not the only label; no critical info only in placeholder.
- **Validation**: Inline validation where appropriate (e.g. on blur or submit); errors appear near the field with clear, actionable text.
- **Submit**: Primary submit button is obvious; loading state on submit (e.g. disabled + “Saving…”); no double submit.
- **Success**: Clear success state (e.g. toast or inline “Saved”) and next step if relevant.

## 2. Errors

- **Message**: User-facing message explains what went wrong in plain language (no raw stack traces or codes unless needed).
- **Recovery**: Offer a clear next action (Retry, Edit, Contact support, etc.).
- **Placement**: Error near the relevant control or at top of form with links to fields.
- **Persistence**: Error remains visible until user addresses it or dismisses (and dismiss is accessible).

## 3. Loading & feedback

- **Loading**: Use skeletons or inline “Loading…” instead of full-page spinner where possible.
- **Optimistic UI**: For fast actions (e.g. toggle, add to list), consider optimistic update with rollback on error.
- **Toasts**: Use for non-blocking feedback (success, info, warning, error) per UX_MASTER_FILE; include action button when relevant (e.g. “Undo”, “View”).

## 4. Touch & targets

- Tap targets at least 44×44px; spacing between tappable elements so no accidental taps.
- No hover-only behavior for critical actions on touch devices; provide tap equivalent.

## 5. Output

- List what’s good and what to fix; suggest concrete copy or component changes.
- When implementing, apply [.cursor/rules/ux-usability-accessibility.mdc](.cursor/rules/ux-usability-accessibility.mdc) and the accessibility skill for focus, labels, and ARIA.
