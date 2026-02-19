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
| `POST /api/debug/python/post-mortem` | Submit traceback (from crashed script); returns structured analysis |

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

## 12. Spike Deliverables

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

---

## 13. References

- [COMPETITOR_BENCHMARKING.md](../product/COMPETITOR_BENCHMARKING.md) — MCP architecture, tool set, etna-rtl/waveform/sim
- [UX_MASTER_FILE.md](../product/UX_MASTER_FILE.md) — Personas, task flows, user journeys
- [OPENTITAN_INTEGRATION.md](../product/OPENTITAN_INTEGRATION.md) — uvmdvgen, reggen, DVSim, FPV
- [WAVEFORM_INTEGRATION.md](../product/WAVEFORM_INTEGRATION.md) — Surfer WASM vs Python API
- [pdb — The Python Debugger](https://docs.python.org/3/library/pdb.html)
- [debugpy](https://github.com/microsoft/debugpy) — DAP implementation for Python
