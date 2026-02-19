# Spike: Python-Based Debugging & Silicon Verification Infrastructure

> **Status:** Assessment complete  
> **Date:** February 2026  
> **Authors:** Gagan Malik  
> **References:** [COMPETITOR_BENCHMARKING.md](../product/COMPETITOR_BENCHMARKING.md), [UX_MASTER_FILE.md](../product/UX_MASTER_FILE.md), [pdb docs](https://docs.python.org/3/library/pdb.html)

---

## 1. Executive Summary

**Objective:** Assess feasibility of integrating Python-based debugging (pdb/debugpy) and silicon verification tooling (uvmdvgen, regression runners, Surfer translators) into Etna.

**Key Finding:** Etna has **no Python execution today**. Planned MCP servers (etna-rtl, etna-waveform, etna-sim) are specified to use **sv-parser/tree-sitter, Surfer WASM, Verilator WASM** — implementable in TypeScript/Node without Python. Python debugging is most relevant for **external verification workflows** (uvmdvgen, cocotb, regression runners) that users run outside Etna. Integration options: (a) post-mortem crash analysis, (b) local debug adapter (Cursor-style), (c) verification tool wrappers (subprocess).

---

## 2. Business Case: Python-Native Framework (Executive Perspective)

*"The most important thing we can do is build the platform that the industry will standardize on. Not the tool. The platform."* — Executive lens on Python-native silicon verification infrastructure.

### 2.1 The Inflection Point

Silicon verification is at an inflection point. For decades, EDA was dominated by TCL, Perl, and proprietary scripting. Today, **Python has become the language of accelerated computing** — PyTorch, TensorFlow, CUDA toolchains, cocotb, OpenTitan's DVSim and uvmdvgen. The same paradigm that made Python the default for AI development is now reaching verification: **the ecosystem matters more than the tool**.

The question is not "Should we use Python?" The question is: **"Who will own the Python-native verification platform before the industry consolidates around one?"**

### 2.2 Case FOR a Python-Native Framework

| Argument | Rationale |
|----------|-----------|
| **Ecosystem alignment** | cocotb, DVSim, uvmdvgen, reggen, riscv-dv — the entire open-source verification stack is Python. Etna that speaks Python natively plugs into this ecosystem without translation layers. |
| **AI-native by design** | PyTorch, JAX, Hugging Face — AI tooling is Python-first. A Python-native verification framework is the natural bridge between LLMs and RTL. "AI for silicon" and "Python for silicon" are converging. |
| **Talent pipeline** | Students learn Python. Hobbyists know Python. Verification engineers increasingly use Python for automation. A Python-native platform lowers the barrier to entry and captures the next generation. |
| **Platform economics** | NVIDIA did not win by selling the best chip. NVIDIA won by building CUDA — the platform developers standardize on. A Python-native verification framework could become the CUDA of silicon debug: the more the ecosystem adopts it, the more valuable it becomes. |
| **Blue ocean positioning** | No one owns "Python-first silicon verification" today. Cadence, Synopsys, Siemens are legacy TCL/Perl. ChipAgents is AI agents on top of existing tools. The gap is a **platform** — not a feature. |
| **Open source leverage** | OpenTitan, RISC-V, CHIPS Alliance — the open silicon movement runs on Python. A Python-native Etna aligns with this trend and can ride the wave of open verification adoption. |

### 2.3 Case AGAINST a Python-Native Framework

| Argument | Rationale |
|----------|-----------|
| **Vercel/serverless constraint** | Python requires persistent processes. Etna's current architecture (Next.js on Vercel) cannot host long-lived Python. Going Python-native means Fly.io, Railway, or local-only — architectural debt. |
| **Dual-stack complexity** | Etna is TypeScript/Node. Adding Python means two runtimes, two dependency trees, two deployment paths. Maintenance cost doubles. |
| **WASM is "good enough"** | Verilator WASM, Surfer WASM — the MVP path uses WebAssembly. Python adds value for advanced workflows (regression, uvmdvgen) but not for core paste-and-debug. |
| **MCP can abstract** | MCP servers can be Python; Etna's client stays TypeScript. We get Python tooling without making Etna itself Python-native. |
| **Execution model unclear** | Local vs cloud? User's machine vs Etna's? Until we decide, investing in Python-native infrastructure is premature. |
| **Competitor moats** | Big 3 have 40 years of integration. Python-native does not, by itself, beat their deep EDA flow. It's a different game — platform vs. product. |

### 2.4 Verdict: Blue Ocean or Red Ocean?

**Blue Ocean** = Create uncontested market space. **Red Ocean** = Compete in existing market.

| Dimension | Red Ocean (Current EDA) | Blue Ocean (Python-Native Platform) |
|-----------|-------------------------|-------------------------------------|
| **Competition** | Cadence, Synopsys, Siemens, ChipAgents | No direct "Python-native silicon debug platform" competitor |
| **Value proposition** | "Better debug tool" | "The platform verification engineers build on" |
| **Customer** | Enterprise procurement | Developers, students, hobbyists, startups |
| **Pricing** | $50K+/year | Freemium, usage-based |
| **Differentiation** | Feature parity race | Ecosystem lock-in, developer adoption |

**Assessment:** A **Python-native framework** is a blue ocean opportunity **if** we define it as a **platform** — the infrastructure layer that verification engineers and tool builders standardize on — not just "Etna written in Python." The blue ocean is **"Python-native silicon verification infrastructure"** — the CUDA of debug. The red ocean is "another AI debug tool."

**Recommendation:** Do not rewrite Etna in Python. Instead, **build Python as a first-class execution target**: Python MCP servers, Python subprocess orchestration, Python debug adapter (debugpy), Python verification tool wrappers (uvmdvgen, cocotb, DVSim). Etna becomes the **orchestrator** of the Python verification ecosystem — the platform that makes Python tooling accessible, debuggable, and AI-augmented. That is the blue ocean.

---

## 3. Persona-Based Python Infrastructure Opportunities

This section maps Etna's personas (from [UX_MASTER_FILE.md](../product/UX_MASTER_FILE.md)) to Python-based infrastructure opportunities that improve their lives and workflows. Each persona has distinct pain points, goals, and task flows that Python tooling can address.

### 3.1 Primary Persona: Maya — Professional Verification Engineer

**Profile:** Senior verification engineer, 8 years, time-pressed. Uses Verdi + GTKWave. Pain: 60% of time on debugging; Verdi takes 5 min to load; hard to explain bugs to juniors; no AI help for hardware-specific questions.

**Key Scenarios:** Quick debug (5 min), Deep RCA (2+ hr), Generate testbench (30 min), Explain protocol (15 min)

| Pain Point / Workflow | Python Infrastructure Opportunity | Etna Integration |
|-----------------------|-----------------------------------|-------------------|
| **"60% of time on debugging"** | **DVSim** (OpenTitan) — Python regression runner. Parse failure logs, extract traceback, feed to AI for root cause. | `POST /api/verification/post-mortem` — Submit DVSim/cocotb failure output; AI analyzes traceback + test context |
| **"Generate testbench for new module"** | **uvmdvgen** (OpenTitan) — Python CLI generates full UVM env (agents, env, sequences). | `POST /api/verification/uvmdvgen` — Invoke uvmdvgen; return generated paths; on failure, post-mortem with friendly error |
| **"Hard to explain bugs to junior"** | **reggen** (OpenTitan) — Python generates register docs. Hjson → human-readable semantics. | Parse reggen output; AI uses register semantics to explain "rw1c clears on write of 1" in plain language |
| **"Verdi takes 5 min to load"** | **Surfer Python API** — Custom translators for protocol decoding. Run lightweight analysis without full waveform load. | etna-waveform MCP: optional Python backend for custom signal decoders (RISC-V, AXI) when WASM insufficient |
| **CI / nightly regression** | **DVSim, cocotb** — Python-based. "Analyze repo for common RTL bugs" from CI. | Cloud Agents (future): Trigger Python regression; capture failures; AI summarizes for Slack/email |
| **Deep RCA (2+ hr)** | **pdb.post_mortem** — When Python testbench crashes, enter post-mortem; capture stack, locals; feed to AI. | Debug mode: "Run simulation" → if cocotb/DVSim fails → auto-capture traceback → AI suggests fix |

**Maya's Python Wins:**
- uvmdvgen wrapper: "Generate UVM testbench" → instant, no manual OpenTitan setup
- Regression failure → traceback → AI root cause in chat
- Register semantics (reggen/Hjson) → AI explains hardware behavior to juniors

---

### 3.2 Secondary Persona: Shivam (Alex) — Computer Engineering Student

**Profile:** Senior undergrad, 2 digital design courses. Pain: "Error messages in Verilog are cryptic"; "ChatGPT gives generic answers for hardware"; "Can't afford professional tools."

**Key Scenarios:** Debug at 11pm (30 min), Learn FIFO (1 hr), Interview prep (2 hr), Show project (10 min)

| Pain Point / Workflow | Python Infrastructure Opportunity | Etna Integration |
|-----------------------|-----------------------------------|-------------------|
| **"Error messages in Verilog are cryptic"** | **iverilog/verilator** — Often invoked via Python (e.g., py Digital, cocotb). Parse stderr; map to line numbers; generate friendly explanations. | Python wrapper: run sim → capture errors → AI maps "syntax error at line X" to "You're missing a semicolon here" with learning tip |
| **"ChatGPT gives generic answers for hardware"** | **cocotb** — Python testbench framework. Students use it in courses. Etna can run cocotb tests, capture output. | "Run this cocotb test" → Python subprocess → friendly pass/fail + AI explanation of what failed |
| **Debug at 11pm (urgent)** | **pdb.post_mortem** — If student's Python script (cocotb, custom) crashes, capture traceback; AI explains in student-friendly language. | Guest flow: paste code + "Run" → if Python error → show traceback + "Here's what went wrong and how to fix it" |
| **Learn how a FIFO works** | **cocotb examples** — Open-source cocotb FIFO testbenches. Etna could suggest or run them. | "Try this cocotb FIFO example" → run → show waveform + AI walkthrough |
| **Prepare for technical interview** | **UVM/cocotb concepts** — Python-based DV methodology docs (OpenTitan). RAG over methodology. | AI draws on indexed OpenTitan DV docs for "Explain constrained random" in interview prep |

**Shivam's Python Wins:**
- Cryptic Verilog errors → Python parser + AI → friendly, educational explanations
- cocotb test run from Etna → instant feedback without local setup
- Post-mortem on student scripts → "You have a typo in `always` on line 12"

---

### 3.3 Tertiary Persona: Sam — FPGA Hobbyist

**Profile:** Software engineer by day, FPGA tinkerer by night. Pain: "Professional tools cost more than my car"; "Want to verify designs but don't know UVM"; "Simulation vs synthesis mismatches confuse me."

**Key Scenarios:** Debug weekend project (2 hr), Learn SystemVerilog (ongoing), Share on GitHub (30 min), Verify RISC-V core (weeks)

| Pain Point / Workflow | Python Infrastructure Opportunity | Etna Integration |
|-----------------------|-----------------------------------|-------------------|
| **"Want to verify but don't know UVM"** | **cocotb** — Lightweight Python alternative to UVM. No UVM learning curve. | "Generate cocotb testbench" → simpler than UVM; Etna suggests cocotb for hobbyists, UVM for pros |
| **"Simulation vs synthesis mismatches"** | **Yosys + Python** — Yosys has Python bindings. Compare sim vs synth behavior. | Future: Python script compares Verilator sim output vs Yosys netlist behavior; AI explains mismatch |
| **Verify RISC-V core (weeks)** | **DVSim, riscv-dv** — Python-based. OpenTitan uses them. | "Run RISC-V compliance" → Python regression → AI summarizes failures; link to debug session |
| **Share design on GitHub** | **GitHub Actions + Python** — CI runs cocotb/DVSim. Etna could consume CI logs. | "Analyze this repo" → fetch CI logs → AI summarizes test status, suggests fixes |
| **Evening/weekend async** | **Cloud Agents** — "Run in cloud" = Python regression runs async. | Sam triggers "Run cocotb tests on my fork" → result via webhook/in-app next morning |

**Sam's Python Wins:**
- cocotb as "UVM lite" — Etna generates cocotb, not UVM, for hobbyist tier
- RISC-V verification via Python toolchain → AI-assisted compliance debugging
- Async "Run in cloud" → Python regression fits evening workflow

---

### 3.4 Cross-Persona: Debug Stages & Python

From [COMPETITOR_BENCHMARKING.md](../product/COMPETITOR_BENCHMARKING.md) — Debug stages: **Triage → Analyze → Debug → Resolve**

| Stage | Python Opportunity |
|-------|--------------------|
| **Triage** | Parse regression logs (DVSim, cocotb); auto-categorize failures (syntax, FSM, protocol); AI suggests "Start with FSM Debug template" |
| **Analyze** | pdb.post_mortem on crashed Python testbench; extract stack, locals; AI narrows root cause |
| **Debug** | Run simulation (Verilator/cocotb) under pdb; step through Python testbench; correlate with waveform |
| **Resolve** | uvmdvgen/fpvgen regenerate; AI suggests assertion from observed behavior |

---

### 3.5 Cross-Persona: Task Flows → Python

| Task Flow (UX_MASTER_FILE) | Persona | Python Opportunity |
|----------------------------|---------|--------------------|
| **First-time debug (guest)** | Shivam | Run iverilog/Verilator via Python wrapper; friendly error mapping |
| **Deep debug session** | Maya | DVSim failure → traceback → AI; uvmdvgen for testbench |
| **Upload and view waveform** | Any | Surfer Python API for custom decoders (if WASM insufficient) |
| **Generate testbench** | Sam, Maya | uvmdvgen (UVM) or cocotb (simple); Python CLI invocation |
| **Run in cloud** | Sam, Maya | Python regression (DVSim, cocotb) async; results to webhook |

---

### 3.6 Summary: Persona → Python Priority

| Persona | Priority | Key Python Wins |
|----------|----------|-----------------|
| **Maya** | P0 | uvmdvgen wrapper; DVSim/cocotb post-mortem; reggen semantics; CI integration |
| **Shivam** | P0 | Friendly error mapping (Python parser); cocotb run from Etna; post-mortem for student scripts |
| **Sam** | P1 | cocotb as UVM alternative; RISC-V Python toolchain; async "Run in cloud" |

---

## 4. Scope (Architect)

| Scope Item | In Scope | Out of Scope |
|------------|----------|--------------|
| Python debug for MCP servers | Only if MCP servers are Python | etna-rtl/waveform/sim planned as TS + WASM |
| User-uploaded Python scripts | Post-mortem crash analysis | Full interactive debug |
| uvmdvgen, cocotb, regression | Invocation wrappers, error capture | Running in Etna cloud |
| Surfer Python API | Document if used | Surfer MVP: WASM only |

---

## 5. Current State (Full-Stack Engineer)

### 5.1 Codebase Exploration

| Area | Finding |
|------|---------|
| **Python execution** | None. No `subprocess`, `exec`, or Python invocations in `app/`, `lib/`, or scripts. |
| **package.json** | No Python runtime. No `debugpy`, `child_process` usage. `execa` present (transitive via shadcn). |
| **MCP config** | `.cursor/mcp.json` only has `shadcn` MCP. `etna-rtl`, `etna-waveform`, `etna-sim` not implemented. |
| **Scripts** | `scripts/` are shell + Node (tsx). No Python. |
| **Settings** | `autoImportPython` is a Cursor IDE preference; not Etna running Python. |

### 5.2 Planned MCP Implementation (from COMPETITOR_BENCHMARKING.md)

| Server | Implementation | Language |
|--------|----------------|----------|
| etna-rtl | sv-parser / tree-sitter | Rust/TS bindings |
| etna-waveform | Surfer WASM | Rust (WASM) |
| etna-sim | Verilator WASM | C++ (WASM) |

**Conclusion:** MCP servers can be built in TypeScript/Node without Python. Python debug is **not required** for MCP unless a future server is Python-based.

### 5.3 Silicon Verification Tools

| Tool | Language | Etna Usage |
|------|----------|------------|
| **uvmdvgen** (OpenTitan) | Python | CLI; referenced in OPENTITAN_INTEGRATION.md; not invoked |
| **DVSim** (OpenTitan) | Python | Regression runner; not in Etna |
| **cocotb** | Python | Not in Etna today |
| **reggen** (OpenTitan) | Python | Register generation; not in Etna |
| **Surfer** | Rust (WASM) + optional Python API | MVP: Option B (WASM) — no Python |
| **Verilator** | C++ | WASM build for browser |

---

## 6. Architecture (Architect)

### 6.1 Where Python Runs (Today / Planned)

| Context | Location | Etna Control | Debug Relevance |
|---------|----------|--------------|-----------------|
| MCP servers | External; stdio/HTTP | Etna spawns/connects | Low (TS/WASM planned) |
| uvmdvgen | User machine / CI | Etna invokes as subprocess | **Medium** — user scripts may fail |
| DVSim, cocotb | User machine / CI | Etna invokes or consumes logs | **High** — regression, testbenches |
| Surfer translators | Surfer process | Surfer-hosted; Etna embeds | Low (WASM MVP) |
| Regression runners | User machine / CI | Not in Etna | **Medium** — future "run regression" |
| User Python scripts | Not in Etna | N/A | **TBD** — clarify scope |

### 6.2 Proposed Component Layers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ETNA PYTHON DEBUG ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  ETNA APP (Next.js/TS) → MCP client, Debug UI, API routes                   │
│      │                              │                                        │
│      │ MCP (stdio/HTTP)             │ REST / WebSocket                       │
│      ▼                              ▼                                        │
│  PYTHON DEBUG LAYER              VERIFICATION INFRASTRUCTURE LAYER           │
│  • debugpy adapter               • uvmdvgen wrapper (subprocess/API)         │
│  • pdb post_mortem               • DVSim / cocotb interface                  │
│  • session manager               • Surfer translator API (if exposed)        │
│      │                              │                                        │
│      ▼                              ▼                                        │
│  PYTHON EXECUTION CONTEXTS                                                    │
│  • MCP servers (if Python) • Spawned scripts • Surfer translator processes  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 API Contract (Proposed)

**Path A: debugpy (DAP) — Rich UI**

| Endpoint | Purpose |
|----------|---------|
| `POST /api/debug/python/sessions` | Create debug session; returns `sessionId`, `debugpyPort` |
| `GET /api/debug/python/sessions/:id` | Get session state (breakpoints, stack, variables) |
| `POST /api/debug/python/sessions/:id/continue` | Resume execution |
| `POST /api/debug/python/sessions/:id/step` | Step over/into/out |
| `POST /api/debug/python/sessions/:id/evaluate` | Evaluate expression in frame |
| `DELETE /api/debug/python/sessions/:id` | End session |

**Path B: pdb post_mortem — Crash Analysis**

| Endpoint | Purpose |
|----------|---------|
| `POST /api/debug/python/post-mortem` | Submit traceback (from crashed script); returns structured analysis. No Python subprocess — parse in TS, call AI. |
| `POST /api/debug/friendly-error` | Submit simulator stderr (iverilog/Verilator); returns parsed error + AI explanation. User pastes; no server-side sim. |

**Verification Infrastructure**

| Endpoint | Purpose |
|----------|---------|
| `POST /api/verification/uvmdvgen` | Invoke uvmdvgen (subprocess); validate input; return generated paths or errors |
| `GET /api/verification/uvmdvgen/schema` | Return expected input schema |
| `POST /api/verification/regression/run` | (Future) Trigger regression; return job ID |
| `GET /api/verification/regression/:jobId` | (Future) Poll status, failures, logs |

---

## 7. Feasibility Assessment

### 7.1 Path A: Subprocess + pdb CLI

| Aspect | Assessment |
|--------|-------------|
| **Effort** | S (1–2 days) |
| **Approach** | `child_process.spawn('python', ['-m', 'pdb', scriptPath])`, stream stdin/stdout |
| **Limitation** | Vercel serverless: no long-lived processes. Requires Fly.io/Railway or local-only. |
| **Use case** | Local dev agent; "run in terminal" from Etna UI |

### 7.2 Path B: pdb.post_mortem on Crashes

| Aspect | Assessment |
|--------|-------------|
| **Effort** | S (1–2 days) |
| **Approach** | Wrap subprocess in try/catch; on exception, parse traceback; optionally run `pdb.pm()` in subprocess and capture output |
| **Limitation** | Vercel: subprocess timeout. Better: local or dedicated backend. |
| **Use case** | "Run uvmdvgen" → capture failure → show traceback + AI analysis in chat |

### 7.3 Path C: debugpy (DAP)

| Aspect | Assessment |
|--------|-------------|
| **Effort** | L (2–4 weeks) |
| **Approach** | Etna UI as DAP client; connect to debugpy over TCP. Requires persistent backend. |
| **Limitation** | Vercel cannot host long-lived debug sessions. Need Fly.io/Railway or local-only. |
| **Use case** | Full VS Code-style debugger for user Python scripts |

### 7.4 uvmdvgen Integration

| Aspect | Assessment |
|--------|-------------|
| **Effort** | M (3–5 days) |
| **Approach** | Subprocess to `uvmdvgen` CLI; validate args (Zod); capture stdout/stderr; return paths or error |
| **Limitation** | uvmdvgen must be installed on host. Vercel: not possible. Local or dedicated backend. |
| **Use case** | "Generate UVM testbench for module X" from Etna UI |

### 7.5 Build/CI Impact

| Area | Impact |
|------|--------|
| **npm/Next.js** | No change if Python runs externally. |
| **CI** | Add Python to CI only if running uvmdvgen or tests. |
| **Dependencies** | `debugpy` optional; only if Python debug path chosen. |

---

## 8. Data Model (Architect)

### 8.1 Proposed Prisma Additions

```prisma
model python_debug_sessions {
  id             String   @id @default(cuid())
  debugSessionId String   // FK to debug_sessions
  processPid     Int?
  debugpyPort    Int?
  status         String   // "attached" | "running" | "paused" | "terminated"
  lastFrame      Json?    // Current stack frame snapshot
  userId         String
  spaceId        String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  // relations...
}
```

### 8.2 What to Store

| Data | Store? | Rationale |
|------|--------|-----------|
| Traceback text | Yes | AI analysis, replay |
| Local variables | Optional, sanitized | Security: no secrets/PII |
| Source code snippets | Yes | Context for AI |
| Process PID, port | Yes (ephemeral) | Session management |
| Full env vars | No | Security |

---

## 9. Rules Alignment

- **Enterprise baseline:** No secrets/PII in logs; auth/session; Prisma for DB; observability with correlation IDs.
- **API-first:** Zod validation; `{ data?, error?, message? }`; 200/201/400/401/404/500; no stack traces in responses.

---

## 10. Open Questions (Require User Input)

### 10.1 Scope Clarification

1. **MCP server language:** Will etna-rtl, etna-waveform, etna-sim be Python or TypeScript/Node? Benchmarking doc suggests sv-parser, Surfer WASM, Verilator WASM — these can be wrapped in either. **If TypeScript:** Python debug is irrelevant for MCP.

2. **Python debug scope:** Is the goal to debug (a) MCP servers only, (b) user-provided Python scripts (cocotb, uvmdvgen, custom analyzers), or (c) both?

3. **Execution model:** Local-only (user runs Python on their machine, Etna connects) vs. cloud (Etna runs Python in its infrastructure)? Vercel serverless cannot host long-lived debug sessions.

### 10.2 Technical (Spike Answered)

| Question | Answer |
|----------|--------|
| Can debugpy run in Vercel serverless? | No — needs persistent process. |
| uvmdvgen: CLI vs Python API? | OpenTitan uses CLI. Prefer subprocess to CLI. |
| Surfer Python API surface? | Surfer MVP uses WASM; Python API optional for custom translators. |
| cocotb / DVSim integration depth? | Phase 2+; spike documents interfaces only. |

---

## 11. Recommendations

| Priority | Recommendation | Effort |
|----------|----------------|--------|
| **P1** | Implement **post-mortem crash analysis** for uvmdvgen/verification subprocess calls. Capture traceback, store in debug session, feed to AI. | S |
| **P2** | Add **uvmdvgen wrapper API** (`POST /api/verification/uvmdvgen`) for local or dedicated backend. | M |
| **P3** | **Friendly error mapping** for iverilog/Verilator (Shivam persona). Python wrapper parses stderr → AI explains. | M |
| **P4** | If user Python debug is required: **local-only debugpy adapter** (Cursor-style). Document Vercel limitation. | L |
| **P5** | Defer full interactive Python debug (debugpy) until execution model clarified. | — |

---

## 12. Full Implementation Plan (Including UI)

This section adds everything required for end-to-end implementation: UI components, user flows, chat integration, and tests. Integrates with existing `components/debug/debug-session-panel.tsx`, `app/chat/page.tsx`, and Shadcn UI.

### 12.1 UI Components

| Component | Location | Purpose |
|-----------|----------|---------|
| **PostMortemTracebackViewer** | `components/debug/post-mortem-traceback-viewer.tsx` | Display traceback with expandable frames, line numbers, source snippets; "Ask AI about this" button |
| **PostMortemSubmitForm** | `components/debug/post-mortem-submit-form.tsx` | Textarea for pasting traceback; optional context (script name, args); Submit → API → AI analysis |
| **UvmdvgenForm** | `components/verification/uvmdvgen-form.tsx` | Form: IP name, output path, options (Zod-validated); Generate button; loading/success/error states |
| **UvmdvgenResult** | `components/verification/uvmdvgen-result.tsx` | Display generated paths, file tree; Download/Copy/Add to project actions |
| **FriendlyErrorDisplay** | `components/debug/friendly-error-display.tsx` | Show simulator stderr with AI-explained mapping: "Line 12: You're missing a semicolon" + learning tip |
| **PythonDebugSessionPanel** | `components/debug/python-debug-session-panel.tsx` | Stack view, variables panel, step/continue/stop controls (for debugpy path); collapsible in debug layout |
| **RegressionJobList** | `components/verification/regression-job-list.tsx` | List of regression runs: status, duration, failure count; [View] [Logs] actions |
| **RegressionJobDetail** | `components/verification/regression-job-detail.tsx` | Job status, failed tests, traceback excerpts; "Analyze with AI" button |

### 12.2 Pages & Routes

| Page/Route | Purpose |
|------------|---------|
| **`/chat`** (existing) | Chat integration: post-mortem analysis appears as AI message; "Paste traceback" quick action |
| **`/chat`** (existing) | Friendly error: after "Run simulation" fails, inline error block with [Explain with AI] |
| **`/sessions/[id]`** or debug panel | Add **Post-mortem** tab: submit traceback, view AI analysis |
| **`/sessions/[id]`** or debug panel | Add **Generate Testbench** (uvmdvgen) in Quick Debug Actions |
| **`/verification`** (new, optional) | Dedicated page: uvmdvgen form, regression job list; or embed in debug session |

### 12.3 User Flows

#### Flow 1: Post-Mortem Crash Analysis (P1)

```
User runs uvmdvgen/cocotb externally → Script crashes
    → User copies traceback
    → In Etna: Debug Session → "Post-mortem" tab → Paste traceback → Submit
    → API: POST /api/debug/python/post-mortem
    → AI analyzes traceback + returns structured explanation
    → UI: PostMortemTracebackViewer + AI response in chat panel
    → User: "Ask follow-up" in chat
```

#### Flow 2: uvmdvgen Generate Testbench (P2)

```
User has RTL file in debug session
    → Quick action: "Generate UVM testbench"
    → Modal/drawer: UvmdvgenForm (IP name, options)
    → Submit → API: POST /api/verification/uvmdvgen
    → Success: UvmdvgenResult (paths, file tree, Download)
    → Failure: PostMortemTracebackViewer + "Analyze with AI"
```

#### Flow 3: Friendly Error Mapping (P3, Shivam)

```
User pastes Verilog in chat → Clicks "Run simulation"
    → Option A (MVP): Verilator WASM runs in browser — no server Python
    → Option B: User runs iverilog locally → pastes stderr into Etna
    → API: POST /api/debug/friendly-error (body: { stderr, sourceFile? })
    → API parses stderr (regex for line numbers, error type); AI generates explanation
    → UI: FriendlyErrorDisplay inline in chat
    → "Line 12: You're missing a semicolon after `end`"
    → Note: Server-side iverilog/Verilator requires dedicated backend (not Vercel)
```

#### Flow 4: Python Debug Session (P4, debugpy)

```
User: "Debug this Python script" (local-only)
    → Etna spawns debugpy; user connects from local
    → PythonDebugSessionPanel: stack, variables, step/continue
    → Requires: Fly.io/Railway or local agent; not Vercel
```

#### Flow 5: Regression Run (Future)

```
User: "Run regression on this repo"
    → API: POST /api/verification/regression/run
    → Job created; polling or webhook
    → RegressionJobList shows status
    → On failure: RegressionJobDetail → "Analyze with AI" → post-mortem flow
```

### 12.4 Chat Integration

| Integration Point | Implementation |
|-------------------|----------------|
| **Quick prompt** | Add "Paste traceback for analysis" to `QUICK_PROMPTS` in `lib/ai/prompts/silicon-debug.ts` |
| **Context injection** | When user submits post-mortem, inject traceback + parsed frames into AI context |
| **Inline error block** | After simulation fails, render `FriendlyErrorDisplay` as a message block (user + assistant) |
| **Slash command** | `/postmortem` or `/traceback` — opens post-mortem form in sidebar or modal |
| **Mode-specific** | Debug mode: show "Post-mortem" and "Generate testbench" in Quick Debug Actions (extend `DebugSessionPanel`) |

### 12.5 Component Specs (Wireframes)

#### PostMortemTracebackViewer

```
┌─────────────────────────────────────────────────────────────────┐
│ Traceback (most recent call last):                               │
│   File "uvmdvgen.py", line 42, in main                           │
│     gen.generate()                                                │
│   File "uvmdvgen.py", line 108, in generate                     │
│     raise ValueError("IP not found")                             │
│ ValueError: IP not found                                         │
├─────────────────────────────────────────────────────────────────┤
│ Frame 1: uvmdvgen.py:42  main()          [Expand] [View source]  │
│ Frame 2: uvmdvgen.py:108 generate()     [Expand] [View source]  │
├─────────────────────────────────────────────────────────────────┤
│ [Ask AI about this traceback]                                    │
└─────────────────────────────────────────────────────────────────┘
```

#### UvmdvgenForm

```
┌─────────────────────────────────────────────────────────────────┐
│ Generate UVM Testbench                                           │
├─────────────────────────────────────────────────────────────────┤
│ IP name *        [uart                    ]                      │
│ Output path      [./dv/uart               ]  (optional)          │
│ [ ] Include coverage    [ ] Include scoreboard                   │
├─────────────────────────────────────────────────────────────────┤
│ [Generate]                                    [Cancel]           │
└─────────────────────────────────────────────────────────────────┘
```

#### FriendlyErrorDisplay

```
┌─────────────────────────────────────────────────────────────────┐
│ Simulation failed                                                │
├─────────────────────────────────────────────────────────────────┤
│ iverilog: error: fifo.v:12: syntax error                        │
│                                                                  │
│ AI: You're missing a semicolon after `end` on line 12.          │
│ In Verilog, every statement must end with `;`.                   │
│ [Jump to line 12]  [Explain more]                                │
└─────────────────────────────────────────────────────────────────┘
```

### 12.6 API → UI Mapping

| API | UI Consumer |
|-----|-------------|
| `POST /api/debug/python/post-mortem` | PostMortemSubmitForm → response → PostMortemTracebackViewer + chat message |
| `POST /api/debug/friendly-error` | FriendlyErrorDisplay (user pastes stderr) → parsed error + AI explanation |
| `GET /api/debug/python/sessions/:id` | PythonDebugSessionPanel (stack, variables) |
| `POST /api/debug/python/sessions/:id/continue` | PythonDebugSessionPanel Continue button |
| `POST /api/verification/uvmdvgen` | UvmdvgenForm → UvmdvgenResult |
| `GET /api/verification/uvmdvgen/schema` | UvmdvgenForm (dynamic fields) |
| `POST /api/verification/regression/run` | RegressionJobList (new job) |
| `GET /api/verification/regression/:jobId` | RegressionJobDetail |

### 12.7 Test Plan

| Area | Test Type | Scope |
|------|-----------|-------|
| **API routes** | Jest + supertest | POST/GET for post-mortem, uvmdvgen; validation (Zod); error responses |
| **Traceback parsing** | Unit | `lib/verification/traceback-parser.ts` — parse Python traceback string → structured frames |
| **Error mapping** | Unit | `lib/verification/error-mapper.ts` — iverilog/Verilator stderr → line + message |
| **Uvmdvgen subprocess** | Integration | Mock subprocess; assert args, capture stdout/stderr |
| **PostMortemTracebackViewer** | React Testing Library | Render traceback; expand frame; "Ask AI" click |
| **UvmdvgenForm** | React Testing Library | Submit with valid/invalid input; loading, success, error states |
| **FriendlyErrorDisplay** | React Testing Library | Render error + AI explanation; a11y (labels, focus) |
| **E2E** | Playwright | Paste traceback → submit → AI response visible (smoke) |

### 12.8 Implementation Order

| Phase | Deliverables | Effort | Hosting |
|-------|--------------|--------|---------|
| **Phase 1** | API: post-mortem (no Python — parse traceback in TS, call AI); traceback parser; UI: PostMortemSubmitForm, PostMortemTracebackViewer; Chat: quick prompt, context injection | 1–2 weeks | Vercel ✅ |
| **Phase 2** | API: uvmdvgen (requires dedicated backend or local-only); UI: UvmdvgenForm, UvmdvgenResult; Debug panel: "Generate testbench" action. MVP: user pastes uvmdvgen output. | 1 week | Fly.io or local |
| **Phase 3** | Friendly error: stderr parser (TS), error mapper, `POST /api/debug/friendly-error`; FriendlyErrorDisplay. User pastes iverilog stderr. Verilator WASM = browser-only. | 1–2 weeks | Vercel ✅ |
| **Phase 4** | debugpy adapter, PythonDebugSessionPanel (local-only); regression API + UI (future) | 2–4 weeks | Fly.io or local |

### 12.9 Accessibility & UX (per UX_MASTER_FILE)

- **Labels**: All form inputs have visible labels; `htmlFor`/`id` association
- **Feedback**: Toasts for submit success/failure; loading skeletons; error inline with recovery actions
- **Keyboard**: Tab order, Esc closes modals; "Ask AI" focusable
- **Screen readers**: `aria-live` for AI streaming; `aria-label` on icon buttons
- **Responsive**: Forms stack on mobile; panels collapsible

---

## 12.10 Gaps & Mitigations (Full-Stack Engineer + Enterprise Orchestrator Review)

This section documents gaps identified in the end-to-end plan and required mitigations. Aligns with [enterprise-baseline](.cursor/rules/enterprise-baseline.mdc) and [api-first](.cursor/rules/api-first.mdc).

### 12.10.1 Execution Model & Hosting (Critical)

| Gap | Issue | Mitigation |
|-----|-------|------------|
| **Vercel cannot run Python** | Post-mortem, uvmdvgen, friendly error (iverilog/Verilator) all require subprocess. Vercel serverless has ~10s timeout; no persistent processes. | **Phase 1 (post-mortem)**: Parse traceback **client-side or in API** (traceback is text — no Python needed). AI analysis = existing chat API. No subprocess. **Phase 2 (uvmdvgen)**: Requires dedicated backend (Fly.io, Railway) or **local-only** (user runs uvmdvgen; Etna consumes output via paste/upload). **Phase 3 (friendly error)**: Verilator WASM runs in browser — no server Python. For iverilog: same as uvmdvgen — dedicated backend or local. |
| **P3 flow contradiction** | "Run simulation" via Python wrapper implies server-side iverilog/Verilator. Vercel cannot do this. | Clarify: (a) **Verilator WASM** (browser) = no Python; (b) **iverilog** = user runs locally, pastes stderr; or dedicated backend. Update Flow 3 to: "User runs iverilog locally → pastes stderr → Etna parses + AI explains" (no server subprocess). |
| **uvmdvgen "host"** | "uvmdvgen must be installed on host" — whose host? | Document: **Option A** (MVP): User runs uvmdvgen locally; pastes output or uploads generated files. **Option B**: Dedicated backend (Fly.io) with Python + OpenTitan toolchain. Phase 2 implements Option A first. |

### 12.10.2 Auth, Rate Limiting & Security

| Gap | Issue | Mitigation |
|-----|-------|------------|
| **Auth on new APIs** | Post-mortem, uvmdvgen must enforce session. | Use `getSession()` from `lib/auth.ts`; return 401 if unauthenticated. Guest flow (Shivam): post-mortem **allowed for guests** with strict rate limit (e.g. 3/day by IP); store in ephemeral session only. |
| **Rate limiting** | Post-mortem and uvmdvgen can be abused (costly AI, subprocess DoS). | Add to `lib/rate-limit.ts`: `/api/debug/python/post-mortem` — 10/min per user (or 3/day for guests); `/api/verification/uvmdvgen` — 5/min. Reuse `checkRateLimit()`. |
| **Subprocess security** | uvmdvgen, iverilog, Verilator = arbitrary command execution if args not validated. | **Strict Zod validation** on all inputs. Whitelist: IP name (alphanumeric + underscore), output path (no `..`, no absolute). Never pass user input directly to shell. Prefer `execFile` with args array over `exec`. |
| **Traceback sanitization** | Tracebacks may contain secrets (env vars, paths, tokens in locals). | Before storing or sending to AI: strip `os.environ`, `password`, `token`, `secret` from displayed locals. Log only `postMortemId`, never full traceback. |
| **Security review** | Subprocess + AI = high-risk surface. | Apply **security-review** skill before shipping. Checklist: input validation, auth, rate limit, no secrets in logs. |

### 12.10.3 Data Model & Migration

| Gap | Issue | Mitigation |
|-----|-------|------------|
| **Prisma relation** | `python_debug_sessions.debugSessionId` → `debug_sessions.id` not defined. | Add `@@map("python_debug_sessions")`; relation: `debugSession debug_sessions @relation(...)`. Migration: create table, FK, index on `userId`. |
| **Rollback** | No rollback documented. | Add `docs/migrations/ROLLBACK_python_debug_sessions.md`: `DROP TABLE python_debug_sessions`; remove FK from debug_sessions if added. |
| **Standalone post-mortem** | User may paste traceback without a debug session. | Allow `debugSessionId` optional. Create ephemeral "session" or attach to current conversation. Schema: `debugSessionId String?` (nullable). |
| **spaceId** | `python_debug_sessions.spaceId` — spaces model exists? | Verify `spaces` table; if not, make `spaceId String?` optional. Defer if spaces not in use. |

### 12.10.4 API Contract & Validation

| Gap | Issue | Mitigation |
|-----|-------|------------|
| **Zod schemas** | "Zod-validated" mentioned but schemas not specified. | Add to implementation: `lib/validation/post-mortem.ts` — `traceback: z.string().min(10).max(50000)`, `context?: z.object({ script, args })`; `lib/validation/uvmdvgen.ts` — `ipName: z.string().regex(/^[a-zA-Z0-9_]+$/)`, `outputPath?: z.string()`. |
| **Error response shape** | Consistent `{ data?, error?, message? }` required. | All new routes return `{ data }` on 200/201; `{ error, message }` on 4xx/5xx. No stack traces. |
| **API docs** | New endpoints need docs. | Create `docs/api/python-debug.md` and `docs/api/verification.md`; include request/response examples, error codes. Apply **openapi-snippet** for public endpoints. |
| **Versioning** | Public/partner API versioning. | Post-mortem and uvmdvgen are internal (Etna app only) for now. No version prefix. If exposed later: `/api/v1/debug/python/post-mortem`. |

### 12.10.5 Observability & Error Handling

| Gap | Issue | Mitigation |
|-----|-------|------------|
| **Correlation IDs** | Tracing for multi-step flows. | Add `x-request-id` or `x-correlation-id` header support; log in each route. Use `lib/observability` if exists, or `console` with structured `{ route, requestId, error }`. |
| **Structured logging** | Errors must have context. | `logger.error('Post-mortem failed', { postMortemId, userId, error: e.message })` — never log PII or full traceback. |
| **Error handling skill** | New services need try/catch, context. | Apply **error-handling** skill: wrap subprocess calls; map Python/uvmdvgen errors to user-facing messages; rethrow with context. |

### 12.10.6 Skills & Worker Routing

| Phase | Skills to Apply | Workers |
|-------|-----------------|---------|
| **Phase 1** | api-route, auth-check, error-handling, testing, observability | Implement + Review (post-mortem touches AI + storage) |
| **Phase 2** | api-route, auth-check, security-review (subprocess), error-handling, testing | Implement + Review |
| **Phase 3** | Same as Phase 2; usability-check (FriendlyErrorDisplay) | Implement + Review + Usability Reviewer |
| **Phase 4** | Same; accessibility (PythonDebugSessionPanel) | Implement + Review + Accessibility Reviewer |

### 12.10.7 Test Plan Additions

| Gap | Mitigation |
|-----|------------|
| **Auth tests** | Test 401 when unauthenticated; 200 when session valid. |
| **Rate limit tests** | Test 429 when over limit; headers `X-RateLimit-Remaining`, `Retry-After`. |
| **Validation tests** | Test 400 for invalid traceback (empty, too long, invalid chars); invalid uvmdvgen args (path traversal). |
| **Security tests** | Test injection in ipName (e.g. `; rm -rf`); assert no shell execution. |

### 12.10.8 Summary: Gaps Addressed

| Category | Count | Status |
|----------|-------|--------|
| Execution model / hosting | 3 | Documented; Phase 1 no subprocess |
| Auth, rate limit, security | 5 | Mitigations specified |
| Data model & migration | 4 | Schema + rollback + optional session |
| API contract & validation | 4 | Zod, error shape, docs, versioning |
| Observability | 2 | Correlation ID, structured logging |
| Skills & workers | 1 | Routing table added |
| Test plan | 4 | Auth, rate limit, validation, security |

---

## 13. Spike Deliverables

| Deliverable | Status |
|-------------|--------|
| Python execution map | ✅ Complete |
| Persona-based Python opportunities | ✅ Complete |
| Business case (for/against, blue ocean) | ✅ Complete |
| MCP server language decision | ⏳ Pending user input |
| debugpy feasibility | ✅ Documented (local/cloud constraint) |
| uvmdvgen integration spec | ✅ CLI subprocess; API proposed |
| Data model | ✅ Prisma schema proposed |
| Open questions log | ✅ Resolved vs deferred |
| **Full implementation plan** | ✅ Complete (UI components, flows, chat integration, tests) |
| **Gaps & mitigations** | ✅ Complete (execution model, auth, security, migration, observability) |

---

## 14. References

- [COMPETITOR_BENCHMARKING.md](../product/COMPETITOR_BENCHMARKING.md) — MCP architecture, tool set, etna-rtl/waveform/sim
- [UX_MASTER_FILE.md](../product/UX_MASTER_FILE.md) — Personas, task flows, user journeys
- [OPENTITAN_INTEGRATION.md](../product/OPENTITAN_INTEGRATION.md) — uvmdvgen, reggen, DVSim, FPV
- [WAVEFORM_INTEGRATION.md](../product/WAVEFORM_INTEGRATION.md) — Surfer WASM vs Python API
- [pdb — The Python Debugger](https://docs.python.org/3/library/pdb.html)
- [debugpy](https://github.com/microsoft/debugpy) — DAP implementation for Python
