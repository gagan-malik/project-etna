---
title: Chat input – @-mentions and slash commands
description: Reference docs, past chats, and files with @; invoke Skills, Subagents, and Actions with /
---

# Chat input: @-mentions and slash commands

The chat input supports two Cursor-style features: **@-mentions** for referencing context and **slash commands** for Skills, Subagents, and Actions.

---

## @-mentions (reference context)

Typing **`@`** in the chat input opens a menu to reference:

- **Docs** – Markdown files under the project’s `docs/` directory (e.g. `api/messages.md`, `soul-doc.md`).
- **Past Chats** – Your previous conversations (by title or “Untitled chat”).
- **Files & Folders** – Indexed documents from your account (from **Settings** or integrations).

### How to use

1. Type **`@`** in the input.
2. Optionally type more to filter (e.g. `@mes` to find `messages.md` or chats containing “mes”).
3. Use **Arrow keys** to move, **Enter** or **Tab** to select.
4. The chosen item is inserted as a reference token, for example:
   - `@doc:api/messages.md`
   - `@chat:<conversationId>`
   - `@file:<documentId>`

The inserted text is part of your message. The model sees it as context; future backend support may resolve these references and inject content into the prompt.

### Data sources

| Section         | Source                         | Auth    |
|:----------------|:-------------------------------|:--------|
| Docs            | `GET /api/docs/list`           | None    |
| Past Chats      | Current user’s conversations   | Required|
| Files & Folders | `GET /api/documents`           | Required|

---

## Slash commands (Skills, Subagents, Actions)

Typing **`/`** in the chat input opens a categorized menu:

- **Skills** – System-prompt fragments (built-in or custom). Selecting a skill adds it for **this message only**; it does not insert text.
- **Subagents** – Workers with their own system prompt (and optional model). Selecting one inserts `/{worker-slug} ` so you can type the rest and send.
- **Actions** – User-defined commands with a prompt template (and optional `{{user_input}}`). Selecting one inserts `/{command-slug} ` so you can add context and send.

### How to use

1. Type **`/`** in the input.
2. Optionally type more to filter (e.g. `/acc` for “accessibility” or “api-route”).
3. Use **Arrow keys** to move, **Enter** or **Tab** to select.
4. **Skills**: The skill is added for the next send; a chip appears above the input. Remove a skill with the chip’s **X**. Skills are cleared after the message is sent.
5. **Subagents** or **Actions**: The input is set to `/{slug} `; type any extra context (e.g. `/worker-cdc check this design`) and send.

### Categories

| Category   | Source                    | Effect on send |
|:-----------|:--------------------------|:----------------|
| Skills     | `GET /api/skills`         | Sent as `additionalSkillIds`; fragments appended to system message for that turn. |
| Subagents  | `GET /api/workers`        | Sent as `workerSlug`; worker’s system prompt (and optional model) used for that turn. |
| Actions    | `GET /api/commands`       | Client expands template (e.g. with `{{user_input}}`); sent as `expandedContent`. |

### Managing Skills, Workers, and Commands

- **Settings → Rules**: Create and edit **Commands** (Actions) and toggle “Show as quick action” for the chat input bar.
- **Settings → Skills**: Enable/disable **built-in skills** and create **custom skills**.
- **Settings → Workers**: Create and edit **Workers** (Subagents).

---

## Keyboard summary

| Trigger | Keys           | Action                    |
|:--------|:---------------|:--------------------------|
| `@`     | ↑/↓, Enter/Tab | Choose reference; insert. |
| `@`     | Escape         | Close menu.               |
| `/`     | ↑/↓, Enter/Tab | Choose Skill / Subagent / Action. |
| `/`     | Escape         | Clear input.               |

---

## API impact

- **Stream** `POST /api/messages/stream` accepts:
  - `expandedContent` – when the client resolved a command.
  - `workerSlug` – when the user invoked a worker.
  - `additionalSkillIds` – when the user added skills from the `/` menu for this message.

See [Messages API – Stream AI Response](/api/messages#stream-ai-response) for the full request body.
