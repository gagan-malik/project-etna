# Technical Spike: Agent Orchestration Layer for Etna

**Status: Implemented (2026-02-19)** — See [docs/api/orchestration.md](../api/orchestration.md) for API docs.

## 1. Objective

Spike a **runtime agent orchestration layer** that receives user intent, classifies it, routes to the right agent(s) (Enterprise or UX), runs multi-step workflows, and persists runs and tasks for observability and replay. Today, the Enterprise Orchestrator is prompt-based; this spike explores a concrete implementation.

**Definition of done:** The spike is complete only when fully implemented end-to-end — API, orchestration logic, and chat UI integration.

## 2. Scope

**In scope**

- API surface for orchestration (create run, stream, get run, list runs)
- Intent classification (rule-based first)
- Routing from intent → agent(s)
- Execution pipeline (single or multi-step)
- Persistence of runs and tasks (Prisma)
- Alignment with enterprise-baseline and api-first rules
- **Chat UI integration** — orchestration mode, run progress, SSE consumer, run history

**Out of scope**

- LLM-based classifier (defer to rule-based)
- Separate job queue / background workers
- Full-Stack Engineer / ci-watcher agents (focus on Enterprise + UX)

## 3. Approach

**Phase 1: Backend**

1. **API sketch** — Define routes and request/response shapes (Zod schemas). Request body: `input`, `conversationId?`, `spaceId?`, `sources?`, `model?`, `stream?`.
2. **Data model** — Add `agent_runs` and `agent_tasks` to Prisma; migration + rollback notes.
3. **Classifier** — Rule-based mapping from user input to `Intent` using WORKERS_ENTERPRISE and WORKERS_UX.
4. **Router** — Map intent → ordered list of `AgentId`; support multi-step (e.g. architect → implement).
5. **Executor** — Use existing `lib/ai` (`streamAIResponse` / `generateAIResponse`); persist task results. When `conversationId` provided, fetch conversation messages (last 20) + RAG/sources context (same pattern as `messages/stream`) and pass to agents.
6. **API implementation** — Implement `POST /api/orchestration/run`, `POST /api/orchestration/run/stream`, `GET /api/orchestration/runs/[id]`, `GET /api/orchestration/runs`; wire classifier → router → executor. Apply auth-check, api-route, error-handling skills.

**Phase 2: UI**

7. **Chat UI integration** — Add orchestration mode toggle; run progress display; SSE consumer for streaming; run history in Activity or sidebar.
8. **Conversation linkage** — When run completes, append assistant message to conversation with final output (or summary + run link) so conversation history is preserved; same pattern as `messages/stream`.

## 4. Key Decisions

| Decision | Options | Recommendation |
|----------|---------|----------------|
| Classifier | Rule-based vs LLM | Rule-based for spike; LLM later if needed |
| Execution model | Sync vs async | Sync for short runs; async/stream for chat |
| Agent definitions | In-code vs DB | In-code (`lib/orchestration/agents.ts`) for spike |
| Chat integration | Same endpoint vs separate | Separate `POST /api/orchestration/run/stream` for chat |
| Rate limiting | Per-user vs per-run | Reuse `lib/rate-limit.ts` per user |

## 5. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Token usage across multi-step runs | Cap pipeline length; track usage per task; apply rate limits |
| Latency for multi-agent runs | Stream responses; show progress per task |
| Intent misclassification | Start with explicit keywords; add LLM classifier if needed |
| Schema evolution | Use JSON for `intentSecondary`, `usage`, `metadata` for flexibility |
| PII in logs | Log only `runId`, `taskId`, `agentId`; never log user input or outputs |
| Agent fails mid-pipeline | Persist partial run; return error + completed tasks to user; log for debugging |
| Long runs / user wants to cancel | Streaming shows progress; optional `POST /runs/[id]/cancel` in future |

## 6. Deliverables

**Backend**

1. **docs/spikes/agent-orchestration-spike.md** — This spike document.
2. **docs/api/orchestration.md** — API contract (routes, shapes, errors). Include OpenAPI snippet (openapi-snippet skill).
3. **Prisma migration** — `agent_runs`, `agent_tasks` with indexes. Document rollback.
4. **lib/orchestration/** — `types.ts`, `classifier.ts`, `router.ts`, `executor.ts`, `agents.ts`.
5. **app/api/orchestration/** — `run/route.ts`, `run/stream/route.ts`, `runs/[id]/route.ts`, `runs/route.ts`.
6. **Zod schemas** — In `lib/validation.ts` or `lib/orchestration/schemas.ts`.
7. **Context fetching** — When `conversationId` provided: fetch conversation messages (last 20) + RAG/sources (same pattern as `messages/stream`); pass to executor for agent context.
8. **Observability** — Correlation ID in request/response; structured logging (runId, taskId, agentId); no PII in logs.

**UI**

9. **Orchestration mode toggle** — Chat input can switch to orchestration mode (or `/orchestrate`); calls `POST /api/orchestration/run/stream` with `conversationId`, `spaceId`, `sources`, `model`.
10. **Run progress display** — Show active agent, task list, and streaming output in chat.
11. **SSE consumer** — Handle `run_start`, `task_start`, `chunk`, `task_end`, `run_end` events in chat client.
12. **Run history** — List past runs in Activity or sidebar; link to run detail.
13. **Conversation message on completion** — After orchestration run completes, append assistant message to conversation (final output or summary + run link) so chat history stays coherent.

**Quality (enterprise-baseline)**

- **api-route** skill for new routes; **auth-check** for orchestration (touches users/sessions); **error-handling** for executor; **testing** for lib + API; **observability** for logging.

## 7. Success Criteria

**API**

- [ ] `POST /api/orchestration/run` accepts input, classifies intent, runs one or more agents, persists run and tasks, returns structured response.
- [ ] When `conversationId` provided, executor receives conversation messages + RAG/sources context for agents.
- [ ] `GET /api/orchestration/runs/[id]` returns run with tasks for the owning user.
- [ ] Auth and rate limiting applied on all routes (session required for v1).
- [ ] No PII in logs; responses follow `{ data?, error?, message? }`.
- [ ] Migration applies cleanly; rollback documented.
- [ ] Agent failure mid-pipeline: partial run persisted; error returned to user.

**UI**

- [ ] User can trigger orchestration from chat (mode toggle or `/orchestrate`).
- [ ] User sees agent progress (which agent is running, task list, streaming output).
- [ ] User can view past runs (Activity or sidebar) and open run detail.

**Quality**

- [ ] Unit tests for classifier and router; integration test for API.
- [ ] `npm run lint` passes before merge.

## 8. Time Estimate

**3–5 days** for full implementation (API + data model + classifier + router + executor + chat UI + basic tests).

---

## 9. Persona-Based Orchestration Opportunities

This section maps Etna's personas (from [UX_MASTER_FILE.md](../product/UX_MASTER_FILE.md)) to concrete agent orchestration opportunities. Each persona has distinct workflows, pain points, and goals that orchestration can address.

### Primary Persona: Maya — Professional Verification Engineer

**Profile:** Senior verification engineer, 8 years, time-pressed, values speed over flashy features. Uses Verdi + GTKWave. Pain: 60% of time on debugging; hard to explain bugs to juniors; no AI help for hardware-specific questions.

| Opportunity | User Need | Orchestration Flow | Agents Involved |
|-------------|-----------|--------------------|-----------------|
| **Quick debug during code review** | 5-min task; "Is this safe?" | Single intent → Research or Review | Research |
| **Deep root cause analysis** | 2+ hour task; waveform + RTL | Multi-step: Research → Architect → Implement | Research, Architect, Implement |
| **Explain protocol issue to junior** | 15 min; educational output | Research + Docs (generate shareable doc) | Research, Docs |
| **Generate testbench for new module** | 30 min; agent mode | Architect → Implement (plan + generate) | Architect, Implement |
| **Share findings with team** | "Run in cloud → notify team" | Orchestration run → webhook/email summary | Implement, Docs (when Cloud Agents exist) |

**Voice integration:** Maya's hands-free workflow ("Hey Etna, why is data_valid stuck low at 1500ns?") maps directly to orchestration: voice input → classifier → Debug-mode agent → waveform + RTL tools.

**Cloud Agents (future):** Maya triggers "analyze this repo for common RTL bugs" from CI or Slack. Orchestration layer runs Research → Architect → Implement pipeline async; results delivered to channel or email.

---

### Secondary Persona: Shivam (Alex) — Computer Engineering Student

**Profile:** Senior undergrad, 2 digital design courses. ChatGPT gives generic answers for hardware; cryptic Verilog errors; can't afford professional tools. Needs: paste code, understand what's wrong, learn fast.

| Opportunity | User Need | Orchestration Flow | Agents Involved |
|-------------|-----------|--------------------|-----------------|
| **Debug class assignment at 11pm** | Urgent, 30 min; paste code | Single: Research (explain) or Implement (fix) | Research, Implement |
| **Learn how a FIFO works** | Educational, 1 hour | Ask mode → Research → optional UX Researcher for flow | Research, UX Researcher |
| **Prepare for technical interview** | Prep, 2 hours | Research + Docs (generate study notes) | Research, Docs |
| **Show project to professor** | Demo, 10 min | Research (explain) + Docs (summary) | Research, Docs |

**Guest-first flow:** Shivam's first-time debug (no signup) uses the existing chat flow today. **v1 orchestration requires auth**; guest orchestration (no auth, IP rate limit) is deferred. When implemented, guest flow would be: paste code → classify → Research/Implement → stream response.

**Smart mode suggestion:** "This looks like a debugging task. Switch to Debug mode?" → Orchestration classifier suggests intent; UX Designer/Usability Reviewer can improve the prompt UI.

---

### Tertiary Persona: Sam — FPGA Hobbyist

**Profile:** Software engineer by day, FPGA tinkerer by night. 12 years software, 3 years FPGA. Pain: professional tools expensive; hard to find hardware debugging help; simulation vs synthesis mismatches; wants to verify designs but doesn't know UVM.

| Opportunity | User Need | Orchestration Flow | Agents Involved |
|-------------|-----------|--------------------|-----------------|
| **Debug weekend project** | Hobby, 2 hours | Debug mode: Research → Implement (hypothesis + fix) | Research, Implement |
| **Learn SystemVerilog from Verilog** | Educational, ongoing | Research + Docs (conversion guide) | Research, Docs |
| **Share design on GitHub** | Open-source, 30 min | Implement + Docs (README, API docs) | Implement, Docs |
| **Verify RISC-V core** | Ambitious, weeks | Multi-step: Architect → Implement → Review | Architect, Implement, Review |

**Async workflow:** Sam's evening/weekend pattern fits "Run in cloud" — orchestration runs overnight; results in morning. Cloud Agents (future) + orchestration = "Run analysis overnight" on class repo.

---

### Cross-Persona: Interaction Modes → Orchestration

Etna's 4 modes (Ask, Agent, Debug, Manual) map to orchestration intent:

| Mode | Primary Intent | Orchestration Behavior |
|------|----------------|------------------------|
| **Ask 💬** | Research | Single agent; read-only; no code changes |
| **Agent 🤖** | Implement + Architect | Multi-step: plan → execute; optional Research |
| **Debug 🐛** | Research + Implement | Hypothesis generation → targeted fix; waveform tools |
| **Manual ✏️** | Implement | Single agent; precise, explicit edits only |

**Smart mode detection:** Orchestration classifier can suggest mode before user sends. "Create a testbench for FIFO" → suggest Agent mode; "What does always_comb do?" → suggest Ask.

---

### Cross-Persona: Task Flows → Orchestration

| Task Flow | Persona | Orchestration Opportunity |
|-----------|---------|---------------------------|
| **First-time debug (guest)** | Shivam | v1: uses existing chat; orchestration requires auth. Future: single run, no auth, IP rate limit |
| **Deep debug session** | Maya | Multi-run: Research (hypotheses) → Implement (fix) → Review (assertion); persist run for session summary |
| **Upload and view waveform** | Any | Orchestration not primary; waveform MCP tools; optional "Analyze this waveform" → Research |
| **Generate testbench** | Sam | Architect → Implement; optional UX Researcher for "best testbench structure for this module" |

---

### Cross-Persona: Voice & Accessibility

| Persona | Voice Use Case | Orchestration |
|---------|----------------|---------------|
| **Maya** | Hands-free; "Why is data_valid stuck low at 1500ns?" | Voice → intent → Debug agent → waveform + RTL tools |
| **Shivam** | Rapid-fire questions; "What's the reset value?" | Voice → intent → Research (single agent) |
| **Sam** | Mobile/tablet review; voice on touch device | Voice → intent → Research or Implement |
| **Accessibility** | Motor/RSI; voice-only interaction | Voice → orchestration; TTS for response; full flow without keyboard |

---

### Summary: Persona → Orchestration Priority

| Persona | Priority | Key Orchestration Wins |
|---------|----------|------------------------|
| **Maya** | P0 | Multi-step deep debug; team sharing; Cloud Agents (async); voice hands-free |
| **Shivam** | P0 | Single-step paste-and-debug; guest flow; smart mode suggestion |
| **Sam** | P1 | Multi-step verify (Architect→Implement→Review); async "Run in cloud" |

---

## 10. Competitive Differentiation: Etna vs ChipAgents & Others

This section clarifies how Etna's agent orchestration differs from ChipAgents and other competitors. Source: [COMPETITOR_BENCHMARKING.md](../product/COMPETITOR_BENCHMARKING.md).

### vs. ChipAgents

| Dimension | ChipAgents | Etna Orchestration |
|------------|------------|---------------------|
| **Architecture** | Separate point products (Waveform Agents, CoverAgent, RCA Agent, Design Agents) | **Unified orchestration layer** — single entry point, intent classification, multi-agent pipeline |
| **Entry point** | Agent-specific tools; user picks which agent | **Conversational-first** — one chat; classifier routes to right agent(s) |
| **Workflow** | One agent per task; no cross-agent pipelines | **Multi-step pipelines** — e.g. Research → Architect → Implement in one run |
| **Pricing** | Enterprise only; no free tier; sales-required | **Self-service; free tier**; transparent pricing |
| **AI model** | Locked to their provider | **BYOK; multi-model** (OpenAI, Gemini, DeepSeek, Llama) |
| **Interaction** | No mode system | **4-mode system** (Ask, Agent, Debug, Manual) — Cursor-inspired |
| **Context** | Agent-specific context | **Conversation + RAG + sources** — full chat history, documents, integrations |
| **Observability** | Unclear | **Persisted runs and tasks** — replay, audit, session summary |
| **Target** | Enterprise teams ($5K–50K/user/year) | **Students, hobbyists, startups** — $0–$49/user/month |

**Key insight:** ChipAgents sells *specialized agents* (waveform, coverage, RCA). Etna builds a *platform* that orchestrates general-purpose agents (Research, Architect, Implement, Review, Docs, UX) with silicon-specific context. Etna's orchestration is the "brain" that routes and chains; ChipAgents' agents are standalone products.

### vs. Enterprise EDA (Cadence, Synopsys, Siemens)

| Dimension | Enterprise EDA | Etna Orchestration |
|------------|----------------|---------------------|
| **Orchestration** | None; AI bolted onto legacy tools | **Runtime orchestration** — classify, route, execute, persist |
| **Chat interface** | Limited or none | **Primary interface** — chat-first |
| **Agent model** | Single AI per tool | **Multi-agent** — Research, Architect, Implement, Review, Docs |
| **Streaming** | Batch responses | **Real-time streaming** |
| **Access** | Weeks procurement | **Instant** — sign up, use |

### vs. Cursor (AI Code Editors)

| Dimension | Cursor | Etna Orchestration |
|------------|--------|---------------------|
| **Domain** | General-purpose coding | **Silicon/RTL** — waveform, protocol, testbench |
| **Agents** | General coding agents | **Silicon-aware** — Research, Architect, Implement, Review, Docs + UX |
| **Waveform** | None | **Debug mode + waveform MCP** — correlate signals with RTL |
| **Orchestration** | Implicit (mode-based) | **Explicit** — classifier, router, persisted runs |

### Etna's Unique Position

- **Unified platform** (not point products) with **conversational entry**
- **Multi-agent pipelines** (Research → Architect → Implement) in one run
- **Silicon-specific context** (RTL, waveform, protocol) via MCP
- **Self-service + free tier** — no sales gate
- **BYOK + multi-model** — user choice
- **Persisted orchestration runs** — observability, replay, session summary

---

## Appendix: Architect Design Summary

The Architect proposed:

- **API**: `POST /run`, `POST /run/stream`, `GET /runs/[id]`, `GET /runs`
- **Request body**: `input`, `conversationId?`, `spaceId?`, `sources?`, `model?`, `stream?` — context (messages, RAG) fetched server-side from conversationId
- **Lib**: `classifier.ts`, `router.ts`, `executor.ts`, `types.ts`, `agents.ts`
- **Data**: `agent_runs` (userId, status, intent, input, finalOutput, tasks) and `agent_tasks` (runId, agentId, orderIndex, status, input, output, usage)
- **Agents**: Research, Architect, Implement, Review, Docs, UX Researcher, UX Designer, Usability, Accessibility
- **Rules**: Session required; Zod validation; consistent responses; no PII in logs; correlation id for tracing
- **Chat integration**: Add orchestration mode to chat UI (toggle or `/orchestrate`) that calls `POST /api/orchestration/run/stream` with conversationId, spaceId, sources, model

---

## References

- [UX_MASTER_FILE.md](../product/UX_MASTER_FILE.md) — Personas, modes, task flows, UX metrics
- [VISION.md](../product/VISION.md) — Product mission and target users
- [COMPETITOR_BENCHMARKING.md](../product/COMPETITOR_BENCHMARKING.md) — ChipAgents, enterprise EDA, competitive differentiation
- [BACKLOG.md](../product/BACKLOG.md) — CLD-001 Cloud Agents
- [cloud-agents.md](../api/cloud-agents.md) — Planned Cloud Agents API
- [.cursor/agents/enterprise-orchestrator.md](../../.cursor/agents/enterprise-orchestrator.md) — Current delegation table
