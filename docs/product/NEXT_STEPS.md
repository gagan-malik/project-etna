# Project Etna - Next Steps

> **Last Updated:** January 2026  
> **Purpose:** Prioritized, actionable next steps derived from UX Master File, Competitor Benchmarking, and Roadmap

---

## Immediate (Next 2 Weeks)

**Goal:** Ship foundations that unblock everything else.

| # | Step | Owner | Reference |
|---|------|-------|-----------|
| 1 | **OpenRouter integration** | Eng | [PRICING.md](./PRICING.md) – MVP model stack |
| 2 | **Basic tool-calling framework** | Eng | [COMPETITOR_BENCHMARKING.md](./COMPETITOR_BENCHMARKING.md) – MCP |
| 3 | **Wire up Filesystem MCP** (read_file, search_files) | Eng | Use existing MCP server |
| 4 | **Mode switcher UI** (⌘.) | Eng | [UX_MASTER_FILE.md](./UX_MASTER_FILE.md) – Interaction Modes |
| 5 | **Ask mode** (read-only path) | Eng | Same – Mode 1 |
| 6 | **Skeleton loading states** | Eng | UX polish |
| 7 | **Share links with state** (e.g. `/try?code=...`) | Eng | [UX_MASTER_FILE.md](./UX_MASTER_FILE.md) – Unauthenticated |

**Outcome:** Users can switch modes, use Ask safely, and AI can call file tools via MCP.

---

## Short-Term (Weeks 3–6)

**Goal:** Differentiated AI behavior and Pro value.

| # | Step | Owner | Reference |
|---|------|-------|-----------|
| 8 | **BYOK settings UI** | Eng | [PRICING.md](./PRICING.md) – BYOK |
| 9 | **Command palette** (⌘K) | Eng | [COMPETITOR_BENCHMARKING.md](./COMPETITOR_BENCHMARKING.md) – Feature Set 1 |
| 10 | **Keyboard shortcuts** | Eng | [UX_MASTER_FILE.md](./UX_MASTER_FILE.md) – Shortcuts |
| 11 | **etna-rtl MCP server** (parse_rtl, trace_signal_source) | Eng | [COMPETITOR_BENCHMARKING.md](./COMPETITOR_BENCHMARKING.md) – Feature Set 10 |
| 12 | **etna-waveform MCP server** (analyze_waveform, find_signal_edge) | Eng | Surfer WASM + MCP SDK |
| 13 | **Agent mode** (write_file, multi-step execution) | Eng | [UX_MASTER_FILE.md](./UX_MASTER_FILE.md) – Mode 2 |
| 14 | **Debug templates** | Product | Quick-start flows |

**Outcome:** Pro BYOK, RTL + waveform tools, and Agent mode working.

---

## Medium-Term (Weeks 7–12)

**Goal:** Full mode set and simulation.

| # | Step | Owner | Reference |
|---|------|-------|-----------|
| 15 | **Verilator WASM** (run_simulation) | Eng | [UX_MASTER_FILE.md](./UX_MASTER_FILE.md) – Simulation |
| 16 | **Debug mode** (hypothesis + instrumentation flow) | Eng | [UX_MASTER_FILE.md](./UX_MASTER_FILE.md) – Mode 3 |
| 17 | **Manual mode** (explicit-edit path) | Eng | [UX_MASTER_FILE.md](./UX_MASTER_FILE.md) – Mode 4 |
| 18 | **Model recommendations per mode** | Eng | [PRICING.md](./PRICING.md) – BYOK |
| 19 | **Signal–RTL correlation** | Eng | [ROADMAP.md](./ROADMAP.md) – Phase 2.2 |
| 20 | **AI waveform awareness** (time ranges, signal refs) | Eng | [ROADMAP.md](./ROADMAP.md) – Phase 2.3 |
| 21 | **Unauthenticated /try flow** (value before signup) | Eng | [UX_MASTER_FILE.md](./UX_MASTER_FILE.md) – Unauthenticated |

**Outcome:** All four modes, WASM sim, and guest try experience live.

---

## Later (Backlog)

| Area | Steps | Reference |
|------|--------|-----------|
| **Voice** | STT/TTS, ⌘⇧V, voice commands | [UX_MASTER_FILE.md](./UX_MASTER_FILE.md) – Voice Experience |
| **Collaboration** | Shared sessions, annotations | [ROADMAP.md](./ROADMAP.md) – Phase 3.2 |
| **Enterprise** | SSO, server mode, audit logs | [ROADMAP.md](./ROADMAP.md) – Phase 4 |
| **Integrations** | GitHub/Jira/Confluence MCP | [COMPETITOR_BENCHMARKING.md](./COMPETITOR_BENCHMARKING.md) – MCP |

---

## Decision Checklist Before Building

- [ ] **OpenRouter:** API key and default model (e.g. DeepSeek V3) confirmed.
- [ ] **MCP:** Stdio vs HTTP transport chosen for Vercel (e.g. edge/serverless MCP client).
- [ ] **BYOK:** Where keys are stored (env, DB, encrypted) and how they’re passed to OpenRouter.
- [ ] **Modes:** Backend representation of “current mode” (session metadata or per-request).
- [ ] **Guest /try:** Rate limits and localStorage schema for unauthenticated users.

---

## Doc Map

| Doc | Use When |
|-----|----------|
| [UX_MASTER_FILE.md](./UX_MASTER_FILE.md) | Designing UI, flows, modes, BYOK UX, MCP UX |
| [COMPETITOR_BENCHMARKING.md](./COMPETITOR_BENCHMARKING.md) | Prioritizing features, differentiation, implementation order |
| [PRICING.md](./PRICING.md) | Tiers, BYOK, AI model strategy, margins |
| [ROADMAP.md](./ROADMAP.md) | Phase 2–4 waveform/RTL/OpenTitan/enterprise work |
| **NEXT_STEPS.md** (this file) | What to do next, in order |

---

*Update this document as steps are completed or priorities change.*
