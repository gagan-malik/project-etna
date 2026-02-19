# Project Etna - Feature Backlog

This document contains the prioritized backlog of features and improvements for Project Etna.

## Priority Levels

| Priority | Description | Timeline |
|----------|-------------|----------|
| P0 | Critical - blocks core functionality | Immediate |
| P1 | High - important for next release | 1-2 weeks |
| P2 | Medium - enhances product value | 2-4 weeks |
| P3 | Low - nice to have | 4+ weeks |

---

## Backlog Items

### OpenTitan Integration

#### OT-001: Hjson Register File Parsing
**Priority:** P1  
**Effort:** Medium  
**Impact:** High

Parse OpenTitan-style Hjson register description files to provide rich context to AI.

**Tasks:**
- [ ] Add `hjson` npm package
- [ ] Create `lib/design-files/hjson-parser.ts`
- [ ] Define TypeScript interfaces for register definitions
- [ ] Parse `swaccess` (software access) types: ro, rw, rw1c, rw1s, wo, etc.
- [ ] Parse `hwaccess` (hardware access) types: hro, hrw, hwo, none
- [ ] Extract field definitions with bit ranges
- [ ] Handle reset values and enumerations
- [ ] Add Hjson file type detection in design file upload

**Acceptance Criteria:**
- Can upload `.hjson` register description files
- Parser extracts all register fields and access types
- Parsed data is stored in database with design files

**Reference:** [OpenTitan reggen](https://opentitan.org/book/util/reggen/index.html)

---

#### OT-002: Register Semantics in AI Prompts
**Priority:** P1  
**Effort:** Low  
**Impact:** High

Enhance AI prompts with register access type understanding.

**Tasks:**
- [ ] Create `lib/ai/prompts/register-semantics.ts`
- [ ] Document all `swaccess` types with explanations
- [ ] Document all `hwaccess` types with explanations
- [ ] Add register context builder function
- [ ] Include register semantics when design file is attached
- [ ] Add quick prompts for register-related debugging

**Example AI Enhancement:**
```typescript
// Before: "The DONE bit is in the STATUS register"
// After: "The DONE field is swaccess: ro (read-only by software) and hwaccess: hwo 
//         (write-only by hardware). This is a status bit set by the hardware FSM."
```

**Acceptance Criteria:**
- AI responses include access type explanations when relevant
- AI can explain why a register behaves a certain way based on access type

---

#### OT-003: UVM Testbench Templates
**Priority:** P2  
**Effort:** Low  
**Impact:** Medium

Store UVM testbench templates for improved AI-generated testbenches.

**Tasks:**
- [ ] Create `lib/ai/prompts/uvm-templates.ts`
- [ ] Add UVM agent template (driver, monitor, sequencer)
- [ ] Add UVM environment template
- [ ] Add UVM base sequence template
- [ ] Add scoreboard template
- [ ] Include templates in "Generate Testbench" prompt context
- [ ] Add template selection in UI (basic vs UVM)

**Templates to Include:**
- `*_agent.sv` - UVM agent with driver/monitor
- `*_env.sv` - UVM environment
- `*_scoreboard.sv` - Reference model checking
- `*_base_seq.sv` - Base sequence class
- `*_vseq.sv` - Virtual sequence

**Reference:** [OpenTitan uvmdvgen](https://opentitan.org/book/util/uvmdvgen/index.html)

---

#### OT-004: SVA Assertion Pattern Library
**Priority:** P2  
**Effort:** Medium  
**Impact:** Medium

Create a library of common SystemVerilog assertion patterns.

**Tasks:**
- [ ] Create `lib/ai/prompts/assertion-patterns.ts`
- [ ] Add handshake protocol assertions (valid/ready)
- [ ] Add FIFO assertions (overflow, underflow)
- [ ] Add FSM assertions (one-hot, no deadlock)
- [ ] Add reset assertions (proper initialization)
- [ ] Add clock domain crossing assertions
- [ ] Include patterns in assertion generation mode

**Pattern Categories:**
1. Protocol compliance (AXI, APB, Wishbone)
2. Data integrity
3. State machine properties
4. Timing properties
5. Reset behavior

**Reference:** [OpenTitan fpvgen](https://opentitan.org/book/util/fpvgen/index.html)

---

#### OT-005: Testplan File Support
**Priority:** P2  
**Effort:** Medium  
**Impact:** Medium

Parse DVSim-style testplan files for coverage tracking.

**Tasks:**
- [ ] Create `lib/testplans/parser.ts`
- [ ] Define testplan entry interfaces
- [ ] Parse milestone/stage information (V1, V2, V3)
- [ ] Extract test names and coverage groups
- [ ] Add testplan file upload endpoint
- [ ] Display testplan in debug session UI
- [ ] Link debug sessions to testplan entries

**Schema:**
```typescript
interface TestplanEntry {
  name: string;
  desc: string;
  stage: "V1" | "V2" | "V3";
  tests: string[];
  covergroups?: string[];
  milestone: string;
}
```

**Reference:** [OpenTitan Testplanner](https://opentitan.org/book/util/dvsim/doc/testplanner.html)

---

#### OT-006: CSR Test Exclusion Tags
**Priority:** P3  
**Effort:** Medium  
**Impact:** Medium

Parse and display CSR test exclusion tags.

**Tasks:**
- [ ] Parse exclusion tags from Hjson files
- [ ] Define exclusion type enums
- [ ] Display exclusions in register view
- [ ] Include exclusion context in AI prompts
- [ ] AI can explain why tests might miss certain bugs

**Exclusion Types:**
```typescript
enum CsrTestType {
  CsrHwResetTest = "hw_reset",
  CsrRwTest = "rw",
  CsrBitBashTest = "bit_bash",
  CsrAliasingTest = "aliasing"
}

enum CsrExclType {
  CsrExclInitCheck = "init_check",
  CsrExclWriteCheck = "write_check",
  CsrExclWrite = "write",
  CsrExclAll = "all"
}
```

---

#### OT-007: DV Methodology RAG Index
**Priority:** P2  
**Effort:** High  
**Impact:** High

Index OpenTitan DV methodology documentation for AI context.

**Tasks:**
- [ ] Download/scrape OpenTitan DV methodology docs
- [ ] Convert Markdown to embeddings
- [ ] Store in vector database (pgvector)
- [ ] Implement RAG retrieval for DV questions
- [ ] Add methodology citations in AI responses

**Topics to Index:**
- Constrained random testing
- Coverage-driven verification
- UVM best practices
- Scoreboard design patterns
- Clock domain crossing verification
- Reset testing methodology

**Reference:** [OpenTitan DV Methodology](https://opentitan.org/book/doc/contributing/dv/methodology/index.html)

---

#### OT-008: Shadow Register Support
**Priority:** P3  
**Effort:** Medium  
**Impact:** Low

Add understanding of shadow registers for security-critical designs.

**Tasks:**
- [ ] Parse `shadowed: true` flag in Hjson
- [ ] Document shadow register behavior
- [ ] Explain two-phase write protocol
- [ ] Include update_err_alert and storage_err_alert
- [ ] AI can explain shadow register debugging

**Shadow Register Behavior:**
1. First write → staged register
2. Second write (matching) → committed register
3. Mismatch → update error alert
4. Storage corruption → storage error alert

---

### Cursor-like Settings

#### SET-001: Settings persistence (P0) ✅
**Priority:** P0  
**Effort:** Medium  
**Impact:** High

Add schema and API for user preferences so settings survive refresh and can sync across devices.

**Tasks:**
- [x] Add `userPreferences Json?` to `users` in Prisma schema
- [x] Create migration for user preferences
- [x] Create GET `/api/settings` (return user preferences + plan for paid-only features)
- [x] Create PATCH `/api/settings` with Zod validation for allowed keys
- [x] Document persisted keys (theme, notifications, privacyMode, etc.) vs client-only

**Acceptance Criteria:**
- Authenticated user can GET/PATCH preferences; free users cannot set privacyMode
- Invalid keys are rejected with 400

---

#### SET-002: Settings layout and General panel (P1) ✅
**Priority:** P1  
**Effort:** Medium  
**Impact:** High

Single settings shell: left nav (user block, search ⌘F, all sections, Docs link), right content; General section with Manage Account, Preferences, Notifications, Privacy (paid only), Log Out.

**Tasks:**
- [x] Create shared settings layout component (two-column, user block at top left)
- [x] Add "Search settings ⌘F" input; client-side filter over section names
- [x] Implement General panel: Manage Account (Open), Sync layouts, Editor Settings, Keyboard Shortcuts, Import VS Code, Reset dialogs, System/Menu Bar/Completion Sound toggles, Privacy Mode dropdown (paid only), Log Out
- [x] Support both full page `/settings` and dialog (same IA); URL `?section=general`
- [x] Wire General controls to `/api/settings` where persisted

**Acceptance Criteria:**
- Settings open from sidebar (dialog) or `/settings` (page); same nav and content
- Privacy Mode only shown for paid plan; free users see upgrade or hidden
- ⌘F focuses search and filters nav

**Reference:** [SETTINGS_PLAN.md](./SETTINGS_PLAN.md)

---

#### SET-003: Rules, Skills, Workers panel (P1) ✅
**Priority:** P1  
**Effort:** Medium  
**Impact:** High

Settings panel for Rules, Skills, Workers, and Commands (Cursor-like).

**Tasks:**
- [x] Add "Rules, Skills, Workers" section to settings nav
- [x] Context filters: All, User, project (pills)
- [x] "Include third-party skills, workers, and other configs" toggle
- [x] Rules: list (.cursorrules, soul-doc, file-path rules) + "+ New"
- [x] Skills: empty state + "New Skill" button
- [x] Workers: empty state + "New Worker" button
- [x] Commands: empty state + "New Command" button
- [x] Persist include-third-party and rule metadata via `/api/settings` where applicable

**Acceptance Criteria:**
- Panel matches wireframe in SETTINGS_PLAN.md; placeholders for create flows

**Reference:** [SETTINGS_PLAN.md](./SETTINGS_PLAN.md), [WORKERS_UX.md](../../.cursor/WORKERS_UX.md)

---

#### SET-004: Hooks panel (P1) ✅
**Priority:** P1  
**Effort:** Small  
**Impact:** Medium

Settings panel for configured hooks and execution log.

**Tasks:**
- [x] Add "Hooks" section to settings nav
- [x] "Configured Hooks (0)" collapsible + empty state "No hooks configured"
- [x] "Execution Log" with "Clear log" button + empty state "No hook executions yet"
- [x] Optional: persist "Clear log" preference or keep client-only

**Acceptance Criteria:**
- Panel matches wireframe; ready for future hooks backend

**Reference:** [SETTINGS_PLAN.md](./SETTINGS_PLAN.md)

---

#### SET-005: Tab panel (P2) ✅
**Priority:** P2  
**Effort:** Small  
**Impact:** Medium

Tab settings: Cursor Tab, Partial Accepts, Suggestions While Commenting, Whitespace-Only Suggestions, Imports, Auto Import for Python (BETA).

**Tasks:**
- [x] Add "Tab" section to settings nav
- [x] Six rows with toggles; wire to preferences API (cursorTab, partialAccepts, etc.)
- [x] BETA badge on Auto Import for Python

**Reference:** [SETTINGS_PLAN.md](./SETTINGS_PLAN.md)

---

#### SET-006: Models panel (P2) ✅
**Priority:** P2  
**Effort:** Medium  
**Impact:** High

Models list (search + toggles) and API Keys (BYOK): OpenAI, Anthropic, Google, Azure, AWS Bedrock.

**Tasks:**
- [x] Add "Models" section to settings nav
- [x] Add/search model input + model list with toggles (enabledModelIds persisted)
- [x] API Keys expandable: OpenAI, Anthropic, Google (placeholders; keys not stored in preferences)
- [x] Persist enabled model IDs via preferences; API keys never stored in userPreferences

**Reference:** [SETTINGS_PLAN.md](./SETTINGS_PLAN.md), [UX_MASTER_FILE.md](./UX_MASTER_FILE.md) BYOK

---

#### SET-007: Agents panel (P2) ✅
**Priority:** P2  
**Effort:** Large  
**Impact:** High

Full Agents settings: General agent, Agent Review, Context, Applying Changes, Auto-Run, Protection, Inline & Terminal, Attribution.

**Tasks:**
- [x] Add "Agents" section to settings nav
- [x] Implement sub-sections: General, Agent Review, Context, Applying Changes, Auto-Run, Protection, Inline & Terminal, Attribution; persist via `/api/settings`
- [x] Persist agent-related preferences (agentDefaultMode, agentAutoRunMode, protections, etc.)

**Reference:** [SETTINGS_PLAN.md](./SETTINGS_PLAN.md)

---

#### SET-008: Tools & MCP, Indexing & Docs, Beta (P2–P3) ✅ | Cloud Agents deferred
**Priority:** P2–P3  
**Effort:** Medium each  
**Impact:** Medium

Remaining panels: Tools & MCP, Indexing & Docs, Beta. Docs is nav-only (external link). Network tab removed from UI; see SET-009. **Cloud Agents** removed from Settings UI Feb 2026; see [CLD-001](#cld-001-cloud-agents-full-scope-deferred) for full backlog.

**Tasks:**
- [x] Tools & MCP: Browser automation dropdown, Show localhost links toggle, Installed MCP servers list + Add custom
- [x] Indexing & Docs: Codebase indexing (progress, Sync, Delete), Index new folders toggle, .cursorignore; Docs empty state + Add Doc
- [x] Beta: Update Access (Stable/Early), Agent Autocomplete, Extension RPC Tracer — persisted via `/api/settings`
- [x] Docs: left nav link only (external)
- [ ] Cloud Agents: **Deferred** — panel and nav removed; full scope in CLD-001

**Reference:** [SETTINGS_PLAN.md](./SETTINGS_PLAN.md)

---

#### SET-009: Network settings tab (backlog)
**Priority:** P3  
**Effort:** Small  
**Impact:** Low

Re-add Network access tab and settings. Removed from UI 2025-02; deferred to backlog.

**Tasks:**
- [ ] Add "Network" section back to settings nav (icon: Globe)
- [ ] Network panel: HTTP Compatibility Mode (HTTP/1.1, HTTP/2) with persistence via `/api/settings`
- [ ] "Run Diagnostic" button: check network connectivity to backend AI services (toast + optional Slack/alert)
- [ ] Wire panel to settings dialog and `/settings` page

**Reference:** Previous implementation in `components/settings/panels/network-panel.tsx` (deleted); [SETTINGS_PLAN.md](./SETTINGS_PLAN.md)

---

#### SET-010: Guest settings (try before signup) ✅
**Priority:** P2  
**Effort:** Small  
**Impact:** High

Support unauthenticated users: settings toggles work without 401; preferences stored in localStorage for guests.

**Tasks:**
- [x] UserSettingsProvider: when unauthenticated, load/save preferences from localStorage (`etna_guest_preferences`); same shape as API
- [x] Expose `updatePreferences(updates)` that uses API when signed in, localStorage when guest
- [x] Beta panel (and other panels) use `updatePreferences` so toggles never call PATCH when guest
- [x] Chat page uses `useUserSettings().preferences` for agentAutocomplete (works for guest from localStorage)
- [x] Settings layout: show "Sign in to sync these settings across devices" banner when guest, with Sign in link
- [x] Document guest experience in SETTINGS_PLAN.md

**Acceptance Criteria:**
- Guest can open settings and toggle Beta (Early access, Agent Autocomplete) without error; preferences persist in localStorage for the session
- Signed-in users continue to use API; no behavior change

**Reference:** [SETTINGS_PLAN.md](./SETTINGS_PLAN.md) — Unauthenticated (guest) experience

---

### Agent Orchestration

#### OR-001: Agent Orchestration Layer (Spike Complete) ✅
**Priority:** P1  
**Effort:** Medium (3–5 days)  
**Impact:** High

Runtime agent orchestration: classify user intent, route to Enterprise/UX agents, execute single or multi-step pipelines, persist runs and tasks.

**Tasks:**
- [x] Prisma: `agent_runs`, `agent_tasks` models + migration
- [x] `lib/orchestration`: types, agents, schemas, classifier, router, context, executor
- [x] API: `POST /run`, `POST /run/stream`, `GET /runs`, `GET /runs/[id]` (auth, rate limit)
- [x] Chat UI: orchestration mode toggle, `/orchestrate` slash, run progress, SSE consumer
- [x] Activity: Orchestration Runs tab; run detail at `/orchestration/runs/[id]`
- [x] Conversation message appended on completion
- [x] Unit tests (classifier, router); API docs with OpenAPI snippet

**Reference:** [docs/spikes/agent-orchestration-spike.md](../../spikes/agent-orchestration-spike.md), [docs/api/orchestration.md](../../api/orchestration.md)

---

### Cloud Agents (Deferred)

Cloud Agents are **removed from the product UI** as of Feb 2026. Current focus is **in-app only** (conversation-first, streaming responses). This section backlogs the full scope for when Cloud Agents are re-enabled. See [UX_MASTER_FILE.md](./UX_MASTER_FILE.md) — "Future: Cloud Agents (North Star)" for persona-led use cases.

---

#### CLD-001: Cloud Agents — full scope (deferred)
**Priority:** P3 (backlog)  
**Effort:** Large  
**Impact:** High (Pro/Team differentiation when shipped)

**Summary:** Run Etna-style silicon-debug agents in the cloud: same RTL/waveform-aware capabilities as in-app, triggerable via API, Slack, or "Run in cloud" from chat/session; results delivered async (notification, PR, webhook). Pro+ only.

**Persona alignment (north star):**
- **Maya:** Run RTL analysis on PR/branch from Slack or API; team sees summary without opening Etna. CI trigger for "analyze repo for common RTL bugs."
- **Shivam:** Optional overnight run on class repo; in-app remains primary.
- **Sam:** "Run in cloud" from app or API for testbench/RTL review; result via webhook or in-app.

**Product / UX (when implemented):**
- **Settings:** Re-add "Cloud Agents" to settings nav. Panel: Manage Settings (→ /integrations), Connect Slack (Pro, OAuth), Workspace configuration (env/secrets), Personal configuration (sharing, pricing visibility, GitHub, base env, runtime, secrets) — all persisted, no placeholders.
- **Discovery and run:** "Run in cloud" CTA from chat/session when context is repo/PR or RTL; ⌘K "New cloud agent" / "Cloud agents." Simple form: prompt, repo/PR, [Run], "Advanced options…" (branch, auto-PR, webhook).
- **Monitoring:** List view (Activity or /agents): name, repo/PR, status, summary, [View] [Stop]. Detail: status, summary, conversation, PR link. Toasts: agent started, progress, finished, error (with [View] [Cancel]).
- **Principles (from UX_MASTER_FILE):** Conversation first (trigger from chat); progressive disclosure (advanced options collapsed); keyboard (⌘K); delightful speed (toasts, no blocking spinners); accessibility (labels, aria-live, focus).

**Backend / API:**
- Implement or proxy **`/v0/agents`** (or equivalent): list, create, status, conversation, follow-up, stop, delete, recommended models. Contract documented in [docs/api/cloud-agents.md](../api/cloud-agents.md).
- **Silicon-aware runs:** New agents get Etna system context (RTL/silicon debug, testbench, protocol awareness); repo/PR as context. Optional templates: "Analyze repo for RTL bugs," "Generate testbench for module X," "Review PR for protocol/FSM."
- **Webhooks:** Optional webhook URL + secret on create; call on status change for CI/notifications.
- **Slack:** OAuth "Connect Slack"; slash command or app action to create agent with same silicon context.

**Tasks (high level):**
- [ ] Re-add Cloud Agents to `SETTINGS_SECTIONS` and settings dialog; restore `CloudAgentsPanel` export and route.
- [ ] Replace placeholder content in Cloud Agents panel with real controls and persistence (Slack connect, workspace config, personal config).
- [ ] Implement or proxy `/v0/agents` API (auth, validation, silicon context injection).
- [ ] Add "Run in cloud" entry point from chat/session (CTA + simple form); ⌘K commands for new agent and list.
- [ ] Implement agent list and detail views; toasts for start/progress/done/error.
- [ ] Slack OAuth and "Run from Slack" flow.
- [ ] Webhook delivery on agent status change.
- [ ] Document in UX_MASTER_FILE as Task Flow 5 (Run cloud agent), Task Flow 6 (Configure cloud agents); update IA and persona scenarios.

**Acceptance criteria (when shipped):**
- Pro user can connect Slack and run an Etna-style RTL analysis from Slack or from "Run in cloud" in app; result visible to team or via webhook.
- Agent runs use silicon-aware prompts/context; not generic "run any agent on repo."
- Settings panel has no placeholder-only sections; all toggles and links functional.

**Reference:** [UX_MASTER_FILE.md](./UX_MASTER_FILE.md) (Future: Cloud Agents, Design Philosophy), [SETTINGS_PLAN.md](./SETTINGS_PLAN.md), [docs/api/cloud-agents.md](../api/cloud-agents.md). Panel code: `components/settings/panels/cloud-agents-panel.tsx` (retained, not in nav).

---

### Waveform Integration

#### WF-001: Basic VCD Upload
**Priority:** P0  
**Effort:** Medium  
**Impact:** High

Enable VCD file upload and storage.

**Tasks:**
- [ ] Add waveform file upload API endpoint
- [ ] Configure Vercel Blob storage
- [ ] Validate VCD/FST file formats
- [ ] Implement file size limits (25MB free, 200MB pro)
- [ ] Store metadata in database
- [ ] Associate with debug sessions

---

#### WF-002: Surfer iframe Integration
**Priority:** P0  
**Effort:** Low  
**Impact:** High

Embed Surfer waveform viewer.

**Tasks:**
- [ ] Add iframe component for Surfer
- [ ] Pass Blob URLs to Surfer
- [ ] Add waveform panel to debug UI
- [ ] File selection dropdown

---

#### WF-003: Signal-RTL Correlation
**Priority:** P1  
**Effort:** High  
**Impact:** High

Link waveform signals to RTL definitions.

**Tasks:**
- [ ] Extract signal hierarchy from VCD
- [ ] Match to RTL module/port definitions
- [ ] Highlight correlated signals
- [ ] "Jump to signal" navigation

---

### AI Enhancements

#### AI-001: Quick Prompt Expansion
**Priority:** P2  
**Effort:** Low  
**Impact:** Medium

Add more silicon-specific quick prompts.

**New Prompts:**
- [ ] "Analyze CDC paths" - Clock domain crossing
- [ ] "Check reset tree" - Reset synchronization
- [ ] "Find X-propagation" - Unknown value issues
- [ ] "Verify protocol compliance" - Interface checks
- [ ] "Suggest coverage points" - Functional coverage

---

#### AI-002: Multi-File Context
**Priority:** P2  
**Effort:** Medium  
**Impact:** High

Allow AI to reference multiple design files.

**Tasks:**
- [ ] Select multiple files for AI context
- [ ] Summarize file relationships
- [ ] Cross-file signal tracing
- [ ] Module hierarchy context

---

### Infrastructure

#### INF-001: Vector Embedding for Design Files
**Priority:** P2  
**Effort:** High  
**Impact:** High

Enable semantic search over design files.

**Tasks:**
- [ ] Embed design file content
- [ ] Store in pgvector
- [ ] Implement semantic search API
- [ ] "Find similar code" feature

---

## Completed Items

*Move items here when completed with date*

- **OR-001: Agent Orchestration Layer** (2026-02-19) — Full implementation per spike: API, lib, chat UI, Activity tab, run detail, tests.

---

## Icebox

*Low priority items for future consideration*

- [ ] VCD signal timeline annotations
- [ ] Design rule checking integration
- [ ] Linting integration (Verilator, Verible)
- [ ] Power analysis hints
- [ ] Physical design awareness

---

## Notes

### OpenTitan License Compatibility

OpenTitan is Apache 2.0 licensed, which is compatible with Etna. We can:
- Reference their documentation
- Adapt their file formats (Hjson)
- Use their methodology patterns
- Cite their documentation

We should NOT:
- Copy large code blocks verbatim without attribution
- Claim OpenTitan features as Etna-original

### External Dependencies

| Dependency | License | Purpose |
|------------|---------|---------|
| hjson | MIT | Hjson parsing |
| vcd-stream | MIT | VCD parsing |
| wavedrom | MIT | Timing diagrams |
