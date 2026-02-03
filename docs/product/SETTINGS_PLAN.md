# Cursor-like Settings — Plan and Wireframes

> **Status:** Complete (P0–P3); SET-001–SET-010 implemented  
> **Backlog:** [BACKLOG.md](./BACKLOG.md) SET-001–SET-010  
> **Roadmap:** [ROADMAP.md](./ROADMAP.md) Phase 2

## Overview

Single settings experience (dialog + full page `/settings`) with full information architecture: General, Agents, Tab, Models, Cloud Agents, Tools & MCP, Rules/Skills/Workers, Hooks, Indexing & Docs, Network, Beta, Docs. Privacy Mode is **paid plans only**. P1 scope: layout, General, Rules/Skills/Workers, Hooks.

## Priorities (locked)

| Item | Decision |
|------|----------|
| Entry point | Both dialog + full page `/settings`; same IA; URL `?section=...` |
| Persistence | `userPreferences` (JSON on `users`) + GET/PATCH `/api/settings`; server-side for theme, notifications, privacyMode, etc.; client-only for "Reset Don't Ask Again" |
| User block | Avatar + email + plan at top of settings left column |
| Search | "Search settings ⌘F" in v1; client-side filter |
| Manage Account / Docs | Manage Account → `/account`; Docs → external or `/docs` |
| Privacy Mode | Only for paid plans; free = hide or "Upgrade to enable" |
| Full IA | All sections; placeholders where not yet implemented |
| P1 sections | General, **Rules/Skills/Workers**, **Hooks** (same priority as layout + General) |

## Implementation Phases

| Phase | Deliverable |
|-------|-------------|
| **P0** | Schema + GET/PATCH `/api/settings`; auth; persisted keys |
| **P1** | Layout (user block, search ⌘F, nav) + General + Rules/Skills/Workers + Hooks + persistence + entry (dialog + page) |
| **P2** | Tab, Models, Agents panels |
| **P3** | Cloud Agents, Tools & MCP, Indexing & Docs, Network, Beta |

---

## Global Layout (all sections)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  SETTINGS                                                                        │
├──────────────────────┬──────────────────────────────────────────────────────────┤
│ ┌────┐                │                                                          │
│ │ G  │  user@email.io │  [Section title, e.g. "General"]                         │
│ └────┘  Pro+ Plan     │                                                          │
│ ───────────────────  │  ─── Manage Account ───                                  │
│ Search settings ⌘F   │  Manage your account and billing          [Open ↗]        │
│ ┌────────────────┐   │                                                          │
│ │                │   │  ─── Preferences ───                                     │
│ └────────────────┘   │  Sync layouts...                          [====ON]       │
│ ⚙️ General           │  Editor Settings                           [Open]        │
│ ∞ Agents             │  ...                                                      │
│ → Tab                │                                                          │
│ 📦 Models             │  ─── Notifications ───                                   │
│ ─────────────────     │  System Notifications                    [====ON]       │
│ ☁️ Cloud Agents       │  ...                                                      │
│ 🛠️ Tools & MCP       │                                                          │
│ ─────────────────     │  ─── Privacy ─── (paid only)                             │
│ 📄 Rules, Skills, Workers      │  🔒 Privacy Mode                          [Mode ▼]       │
│ 🔗 Hooks              │                                                          │
│ 📚 Indexing & Docs    │  [ Log Out ]                                              │
│ 🌐 Network            │                                                          │
│ ▶️ Beta               │                                                          │
│ ─────────────────     │                                                          │
│ 📖 Docs ↗             │                                                          │
└──────────────────────┴──────────────────────────────────────────────────────────┘
```

---

## Wireframe 1: General

- **Manage Account:** description + [Open ↗] → `/account`
- **Preferences:** Sync layouts (toggle), Editor Settings (Open), Keyboard Shortcuts (Open), Import VS Code (Import), Reset "Don't Ask Again" (Show)
- **Notifications:** System Notifications, Menu Bar Icon, Completion Sound (toggles)
- **Privacy:** Privacy Mode (lock icon) — dropdown, **paid only**
- **Log Out** at bottom

---

## Wireframe 2: Rules, Skills, Workers

- Context filters: [All] [User] [project-etna]
- "Include third-party skills, workers, and other configs" (toggle)
- **Rules:** description + list (.cursorrules, soul-doc, file-path rules) + [+ New]
- **Skills:** description + empty state + [New Skill]
- **Workers:** description + empty state + [New Worker]
- **Commands:** description + empty state + [New Command]

---

## Wireframe 3: Hooks

- **Configured Hooks (0):** collapsible; empty state "No hooks configured"
- **Execution Log:** [Clear log]; empty state "No hook executions yet"

---

## Wireframes 4–12 (later phases)

- **Tab:** Cursor Tab, Partial Accepts, Suggestions While Commenting, Whitespace-Only, Imports, Auto Import Python (BETA) — toggles
- **Models:** Add/search + model list toggles + API Keys (OpenAI, Anthropic, Google, Azure, AWS)
- **Agents:** General agent, Agent Review, Context, Applying Changes, Auto-Run, Protection, Inline & Terminal, Voice, Attribution
- **Cloud Agents:** Manage Settings, Connect Slack, Workspace Config, Personal Configuration (Sharing, Pricing, GitHub, Base Env, Runtime, Secrets)
- **Tools & MCP:** Browser automation, Show localhost links, Installed MCP servers + Add custom
- **Indexing & Docs:** Codebase indexing (progress, Sync, Delete), Index new folders, .cursorignore; Docs empty state + Add Doc
- **Network:** HTTP Compatibility Mode dropdown, Run Diagnostic button
- **Beta:** Update Access dropdown, Agent Autocomplete, Extension RPC Tracer toggles
- **Docs:** nav link only (external)

---

## Unauthenticated (guest) experience

Users can try the app without signing in. Settings support both modes:

| Mode | Source | Write |
|------|--------|--------|
| **Signed in** | `GET /api/settings` (server) | `PATCH /api/settings` then refetch |
| **Guest** | `localStorage` key `etna_guest_preferences` | Merge into localStorage + in-memory state |

- **UserSettingsProvider** (`components/user-settings-provider.tsx`) decides: if `session?.user` exists, use API; otherwise load/save from localStorage with the same preference shape.
- **updatePreferences(updates)** from `useUserSettings()` does the right thing: API when authenticated, localStorage when guest. Panels (e.g. Beta) call this so toggles never 401.
- **Chat** and other consumers read `useUserSettings().preferences` so Agent Autocomplete and Early access work for guests (stored in localStorage).
- When guest, the settings layout shows a banner: **"Sign in to sync these settings across devices"** with a Sign in link. Optional future: on first login, merge guest preferences into server once.

---

## Persisted Keys (API)

Stored in `users.userPreferences` (JSON), validated on PATCH:

- `theme`: "light" | "dark" | "system" — **wired:** ThemeProvider + General panel + user menu; syncs app theme.
- `syncLayouts`: boolean — **reserved:** No multi-window layout in app yet; wire when feature exists.
- `systemNotifications`: boolean — **reserved:** Wire when "notify when stream completes" (or similar) exists.
- `menuBarIcon`: boolean — **reserved:** No menu bar in app yet; wire when feature exists.
- `completionSound`: boolean — **reserved:** Wire when completion sound feature exists.
- `privacyMode`: "off" | "standard" | "strict" (paid only; reject for free) — **reserved:** Document semantics (e.g. data sharing / telemetry); wire when that feature exists.
- `includeThirdPartyConfig`: boolean (Rules/Skills) — persisted; **wire when** rules/skills list can include third-party config.
- Tab, Agents, Models, Beta keys — see below.

Client-only (e.g. localStorage or in-memory): "Reset Don't Ask Again" cleared state.

### Extension RPC Tracer (Beta)

When **Early access** is on and **Extension RPC Tracer** is on, and `NODE_ENV === "development"`, the app logs one short line per streaming request (e.g. `POST /api/messages/stream` + timestamp). Logs are PII-free and off in production unless explicitly enabled later.

### Tab, Agents, Rules — wire when features exist

- **Tab** (`cursorTab`, `partialAccepts`, `suggestionsWhileCommenting`, etc.): No Cursor-style tab or completion UI yet. When a completion/suggestion feature is added, read the corresponding preference from `useUserSettings().preferences` and gate or configure the behavior.
- **Agents** (`agentDefaultMode`, `agentAutoRunMode`, protections, etc.): When an explicit "agent mode" or "auto-run" control exists in chat (or elsewhere), read these from preferences as defaults.
- **Rules** (`includeThirdPartyConfig`): When the rules/skills list can include third-party config, filter or include based on `preferences.includeThirdPartyConfig`.

### Placeholder features (show “Upgrade” badge)

These controls have no backend or flow yet; they show an **“Upgrade”** badge instead of a button so it’s clear the feature is not yet available.

| Panel | Button / control | File |
|-------|------------------|------|
| **General** | Keyboard Shortcuts “Open” | general-settings-panel.tsx |
| **General** | Import Settings from VS Code “Import” | general-settings-panel.tsx |
| **Rules** | Context: All, User, project-etna | rules-panel.tsx |
| **Rules** | Rules “+ New” | rules-panel.tsx |
| **Rules** | Commands “+ New”, “New Command” | rules-panel.tsx |
| **Rules, Skills, Workers** | Context: All, User, project-etna | rules-skills-subagents-panel.tsx |
| **Rules, Skills, Workers** | Rules “+ New” | rules-skills-subagents-panel.tsx |
| **Rules, Skills, Workers** | Skills “+ New”, “New Skill” | rules-skills-subagents-panel.tsx |
| **Rules, Skills, Workers** | Workers “+ New”, “New Worker” | rules-skills-subagents-panel.tsx |
| **Rules, Skills, Workers** | Commands “+ New”, “New Command” | rules-skills-subagents-panel.tsx |
| **Skills** (standalone) | “+ New”, “New Skill” | skills-panel.tsx |
| **Workers** (standalone) | “+ New”, “New Worker” | workers-panel.tsx |
| **Tools & MCP** | “+ Add a Custom MCP Server” | tools-mcp-panel.tsx |
| **Indexing & Docs** | Sync, Delete Index | indexing-docs-panel.tsx |
| **Indexing & Docs** | View included files, Edit (.cursorignore) | indexing-docs-panel.tsx |
| **Indexing & Docs** | “+ Add Doc” | indexing-docs-panel.tsx |
| **Hooks** | Clear log | hooks-panel.tsx |
| **Cloud Agents** | Connect Slack “Connect ↗” | cloud-agents-panel.tsx |

---

## References

- [BACKLOG.md](./BACKLOG.md) — SET-001–SET-008
- [ROADMAP.md](./ROADMAP.md) — Phase 2
- [UX_MASTER_FILE.md](./UX_MASTER_FILE.md) — Settings IA (Profile, AI Models, Preferences, Integrations, API Keys)
- [WORKERS_UX.md](../../.cursor/WORKERS_UX.md) — Workers UX
