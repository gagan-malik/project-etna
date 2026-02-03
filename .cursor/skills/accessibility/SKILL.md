---
name: accessibility
description: Ensure accessibility (WCAG 2.1 AA). Use when adding or changing interactive UI—buttons, links, forms, modals, toasts, live regions, or focus flow.
---

# Accessibility Skill

When the user asks for accessibility review, or when you add/change interactive UI, follow this checklist. Target: WCAG 2.1 AA. Reference: [docs/product/UX_MASTER_FILE.md § Accessibility Guidelines](docs/product/UX_MASTER_FILE.md).

## 1. Keyboard

- **Focusable**: Every interactive element (button, link, input, select, custom control) is focusable (no `tabIndex={-1}` unless for trap/managed focus).
- **Visible focus**: Focus indicator is visible (e.g. `focus-visible:ring-2`); never remove outline without a visible replacement.
- **Tab order**: Order follows visual/logical order; no `tabindex` > 0 unless required for focus trap.
- **Traps**: Modals/dialogs trap focus and restore focus on close; Esc closes.
- **Shortcuts**: Document and support key shortcuts (e.g. ⌘K, Esc) and ensure no conflicts with screen readers.

## 2. Labels & semantics

- **Buttons/links**: Use visible text or `aria-label`; icon-only buttons must have `aria-label`.
- **Forms**: Every input/select has a `<Label>` with `htmlFor`/`id` or `aria-labelledby`; errors linked with `aria-describedby` when appropriate.
- **Landmarks**: Use semantic HTML (`<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, headings); one H1 per page.
- **Lists**: Use `<ul>`/`<ol>` for lists; use `<button>` or `<a>` for actions, not divs without roles.

## 3. ARIA (only when HTML isn’t enough)

- **Live regions**: For streaming or dynamic updates (e.g. AI response, toasts), use `aria-live="polite"` or `assertive` for errors; announce “AI is typing…” / “Response complete” when appropriate.
- **Expanded/collapsed**: Use `aria-expanded` on controls that open/close content.
- **Current**: Use `aria-current` for current nav item/page.
- **Modals**: Use `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` (and optionally `aria-describedby`); avoid redundant roles on Shadcn/Radix if already set.

## 4. Color & contrast

- Text: 4.5:1 minimum (3:1 for large text); don’t convey information by color alone (use icon or text too).
- Focus and error states: Not only color; use border/outline/icon.

## 5. Motion & zoom

- Respect `prefers-reduced-motion: reduce` (disable or reduce animations); no autoplay.
- Layout works at 200% zoom; avoid fixed widths that cause horizontal scroll.

## 6. Focus order & skip

- Skip-to-content link (hidden until focused) when there is repeated nav.
- Tab order: skip → logo → primary nav → main → chat input (match UX_MASTER_FILE focus order).

## 7. Output

- For new/changed UI: list what you checked and any fixes applied (e.g. “Added aria-label to icon button”, “Wrapped input with Label”).
- Recommend manual test: keyboard-only navigation and at least one screen reader (e.g. VoiceOver) for critical flows.
