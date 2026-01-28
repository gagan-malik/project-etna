# OpenTitan Integration Opportunities

This document outlines components from the [OpenTitan](https://github.com/lowRISC/opentitan) open-source silicon Root of Trust project that can be adapted to enhance Project Etna's silicon debugging capabilities.

## Overview

OpenTitan is a collaborative open-source silicon project maintained by lowRISC CIC. It provides a wealth of verification infrastructure, tooling, and methodology documentation that can significantly enhance Etna's AI-powered debugging capabilities.

**Key Resources:**
- **Repository**: https://github.com/lowRISC/opentitan
- **Documentation**: https://opentitan.org/book/
- **License**: Apache 2.0 (compatible with Etna)

---

## 1. Register Description Format (reggen/Hjson)

### What OpenTitan Provides

**Location:** `util/reggen/`

OpenTitan uses a comprehensive Hjson (Human JSON) format for describing hardware registers with rich semantic metadata:

```hjson
{
  name: "CTRL",
  desc: "Control register",
  swaccess: "rw",      // Software: read-write
  hwaccess: "hro",     // Hardware: read-only
  resval: "0x0",       // Reset value
  fields: [
    { bits: "0", name: "TX_EN", desc: "Enable transmitter" },
    { bits: "1", name: "RX_EN", desc: "Enable receiver" },
    { bits: "2", name: "DONE", swaccess: "ro", hwaccess: "hwo", desc: "Operation complete" }
  ]
}
```

### Software Access Types

| Key | Description |
|-----|-------------|
| `none` | No access |
| `ro` | Read Only |
| `rc` | Read Only, reading clears |
| `rw` | Read/Write |
| `r0w1c` | Read zero, Write with 1 clears |
| `rw1s` | Read, Write with 1 sets |
| `rw1c` | Read, Write with 1 clears |
| `rw0c` | Read, Write with 0 clears |
| `wo` | Write Only |

### Hardware Access Types

| Key | Description |
|-----|-------------|
| `hro` | Read Only |
| `hrw` | Read/Write |
| `hwo` | Write Only |
| `none` | No Access Needed |

### How This Helps Etna

1. **Rich AI Context**: Parse Hjson register files to give AI understanding of register semantics
2. **Intelligent Debugging**: AI can explain that a `rw1c` field clears on write of 1
3. **Documentation Generation**: Auto-generate register documentation views
4. **Expected Behavior**: AI can predict register behavior based on access types

### Example Enhanced AI Response

With register semantics, Etna's AI could respond:

> "The `DONE` field is `swaccess: ro` (read-only by software) but `hwaccess: hwo` (write-only by hardware). This is a status bit set by the hardware state machine. If you're seeing it stuck at 0, the hardware FSM isn't reaching its completion state. Check the FSM transition conditions."

### Implementation

```typescript
// lib/design-files/hjson-parser.ts
interface RegisterField {
  name: string;
  bits: string;
  swaccess: SwAccessType;
  hwaccess: HwAccessType;
  resval?: string;
  desc: string;
  enum?: Array<{ value: string; name: string; desc: string }>;
}

interface RegisterDefinition {
  name: string;
  desc: string;
  swaccess: SwAccessType;
  hwaccess: HwAccessType;
  resval: string;
  fields: RegisterField[];
  regwen?: string;  // Write-enable register
  shadowed?: boolean;
}
```

---

## 2. DVSim Testplan Format

### What OpenTitan Provides

**Location:** `util/dvsim/doc/testplanner.html`

Hjson-formatted testplans that map test scenarios to coverage goals:

```hjson
{
  name: "uart_smoke",
  desc: "Basic UART transmit and receive test",
  stage: "V1",
  tests: ["uart_smoke"],
  covergroups: ["uart_cg"],
  milestone: "V1"
}
```

### How This Helps Etna

1. **Coverage Tracking**: Import testplans to show which scenarios are covered
2. **Gap Analysis**: AI can identify missing test coverage
3. **Debug Context**: Link debug sessions to specific test failures
4. **Verification Status**: Display V1/V2/V3 milestone progress

### Implementation

```typescript
// lib/testplans/parser.ts
interface TestplanEntry {
  name: string;
  desc: string;
  stage: "V1" | "V2" | "V3";
  tests: string[];
  covergroups?: string[];
  milestone: string;
}
```

---

## 3. UVM Testbench Generation (uvmdvgen)

### What OpenTitan Provides

**Location:** `util/uvmdvgen/`

Python tool that generates complete UVM testbench boilerplate:

- UVM agents (driver, monitor, sequencer)
- Environment with scoreboard
- Base sequences
- Coverage components
- FuseSoC core files

### Generated Structure

```
dv/
├── env/
│   ├── <name>_env.sv
│   ├── <name>_env_cfg.sv
│   ├── <name>_env_cov.sv
│   ├── <name>_scoreboard.sv
│   ├── <name>_virtual_sequencer.sv
│   └── seq_lib/
│       ├── <name>_base_vseq.sv
│       ├── <name>_smoke_vseq.sv
│       └── <name>_vseq_list.sv
├── tb/
│   ├── tb.sv
│   └── <name>_bind.sv
└── tests/
    ├── <name>_base_test.sv
    └── <name>_test_pkg.sv
```

### How This Helps Etna

1. **Template-Based Generation**: Use as templates for AI testbench generation
2. **Structure Guidance**: AI knows the expected file organization
3. **Quality Output**: Generated code follows OpenTitan's proven patterns
4. **Complete Environment**: Not just one file, but full UVM environment

### Implementation

Store templates as prompt context:

```typescript
// lib/ai/prompts/uvm-templates.ts
export const UVM_AGENT_TEMPLATE = `
class ${name}_driver extends dv_base_driver #(.ITEM_T(${name}_item), .CFG_T(${name}_agent_cfg));
  \`uvm_component_utils(${name}_driver)
  
  function new(string name, uvm_component parent);
    super.new(name, parent);
  endfunction
  
  virtual task reset_signals();
    // Reset interface signals
  endtask
  
  virtual task get_and_drive();
    // Get item from sequencer and drive to interface
  endtask
endclass
`;
```

---

## 4. FPV Assertion Generation (fpvgen)

### What OpenTitan Provides

**Location:** `util/fpvgen/`

Generates formal property verification testbench boilerplate:

- Bind files for assertions
- Template assertion modules
- Property declarations
- FuseSoC integration

### How This Helps Etna

1. **Formal Verification Context**: Add FPV awareness to assertion mode
2. **Bind File Generation**: AI can generate proper assertion bindings
3. **Property Patterns**: Common formal verification patterns
4. **Coverage Properties**: `cover` statements for reachability

### Common Assertion Patterns

```systemverilog
// Protocol handshake
property valid_ready_handshake;
  @(posedge clk) disable iff (!rst_n)
  valid && !ready |=> valid;
endproperty

// FIFO never overflows
property fifo_no_overflow;
  @(posedge clk) disable iff (!rst_n)
  (count == DEPTH) |-> !push;
endproperty

// One-hot encoding
property state_onehot;
  @(posedge clk) disable iff (!rst_n)
  $onehot(state);
endproperty
```

---

## 5. CSR Test Methodology

### What OpenTitan Provides

**Location:** `hw/dv/sv/csr_utils/`

Comprehensive CSR test framework with:

- Automatic register testing (hw_reset, rw, bit_bash, aliasing)
- Exclusion tags for known limitations
- Access checking

### Exclusion Tag Format

```systemverilog
tags: ["excl:CsrNonInitTests:CsrExclWrite"]
```

| Test Type | Description |
|-----------|-------------|
| `CsrHwResetTest` | Check reset values |
| `CsrRwTest` | Read-write verification |
| `CsrBitBashTest` | Bit-level testing |
| `CsrAliasingTest` | Address aliasing check |
| `CsrNonInitTests` | All but HwReset |
| `CsrAllTests` | All tests |

| Exclusion Type | Description |
|----------------|-------------|
| `CsrNoExcl` | No exclusions |
| `CsrExclInitCheck` | Exclude from init check |
| `CsrExclWriteCheck` | Exclude from write-read check |
| `CsrExclCheck` | Exclude from init or write-read |
| `CsrExclWrite` | Exclude from write |
| `CsrExclAll` | Exclude from all |

### How This Helps Etna

1. **Test Limitations**: AI understands why certain tests might miss bugs
2. **Smart Suggestions**: Recommend which CSR tests to run
3. **Exclusion Reasoning**: Explain why registers are excluded

---

## 6. DV Methodology Documentation

### What OpenTitan Provides

**Location:** `doc/contributing/dv/methodology/`

Comprehensive verification methodology covering:

- UVM-based verification
- Coverage closure
- Debug techniques
- Code reuse patterns
- Stimulus generation

### How This Helps Etna

1. **RAG Knowledge Base**: Index for semantic search
2. **Expert Responses**: AI draws on proven methodology
3. **Best Practices**: Recommendations backed by real project experience

### Key Topics to Index

- Constrained random testing
- Coverage-driven verification
- Clock domain crossing verification
- Reset testing methodology
- Protocol verification
- Scoreboard design patterns

---

## 7. IP Documentation Structure

### What OpenTitan Provides

Each IP block has standardized documentation:

```
hw/ip/<name>/
├── data/
│   └── <name>.hjson          # Register definitions
├── doc/
│   ├── theory_of_operation.md
│   └── programmers_guide.md
└── dv/
    ├── <name>_sim_cfg.hjson  # Simulation config
    └── env/                   # DV environment
```

### How This Helps Etna

1. **Design Intent**: Parse theory of operation for AI context
2. **Register Semantics**: Hjson provides rich CSR information
3. **DV Configuration**: Understand test infrastructure
4. **Consistent Structure**: Predictable file locations

---

## Implementation Roadmap

### Phase 1: Quick Wins (1-2 weeks)

| Task | Effort | Impact |
|------|--------|--------|
| Add `hjson` npm package | Low | High |
| Parse register access types | Low | High |
| Add access type explanations to AI prompts | Low | High |
| Store UVM templates as prompt context | Low | Medium |

### Phase 2: Medium-Term (2-4 weeks)

| Task | Effort | Impact |
|------|--------|--------|
| Full Hjson register file parser | Medium | High |
| Testplan file support | Medium | Medium |
| Index OpenTitan DV docs for RAG | Medium | High |
| CSR exclusion tag parsing | Medium | Medium |

### Phase 3: Deep Integration (4-8 weeks)

| Task | Effort | Impact |
|------|--------|--------|
| reggen output parsing | High | Medium |
| FPV assertion pattern library | Medium | Medium |
| Full IP documentation indexing | High | High |
| Custom AI training on DV methodology | High | High |

---

## Files to Create

```
lib/
├── design-files/
│   ├── hjson-parser.ts       # Hjson register parsing
│   └── testplan-parser.ts    # Testplan parsing
├── ai/
│   └── prompts/
│       ├── register-semantics.ts  # Access type explanations
│       ├── uvm-templates.ts       # UVM generation templates
│       └── assertion-patterns.ts  # Common SVA patterns
└── knowledge/
    └── dv-methodology/       # Indexed DV docs for RAG
```

---

## Dependencies

```bash
# Hjson parsing
npm install hjson

# Types
npm install -D @types/hjson
```

---

## References

- [OpenTitan Register Tool](https://opentitan.org/book/util/reggen/index.html)
- [OpenTitan DVSim](https://opentitan.org/book/util/dvsim/index.html)
- [OpenTitan uvmdvgen](https://opentitan.org/book/util/uvmdvgen/index.html)
- [OpenTitan fpvgen](https://opentitan.org/book/util/fpvgen/index.html)
- [OpenTitan DV Methodology](https://opentitan.org/book/doc/contributing/dv/methodology/index.html)
