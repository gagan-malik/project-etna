# Waveform Viewer Integration Plan

## Overview

Integrate waveform viewing capabilities into Project Etna to complete the silicon debugging workflow: **RTL Code + Waveforms + AI Analysis**.

## Recommended Solution: Surfer

### Why Surfer?

[Surfer](https://surfer-project.org/) is the ideal waveform viewer for Etna:

| Feature | Benefit for Etna |
|---------|------------------|
| **WebAssembly Build** | Embeds directly in web app |
| **postMessage API** | Programmatic control from JavaScript |
| **Modern Architecture** | Built in Rust with egui, designed for embedding |
| **Active Development** | 144 stars, regular commits, bi-weekly dev meetings |
| **VS Code Extension** | Proven IDE integration patterns |
| **Multiple Formats** | VCD, FST, GHW support |

### Supported File Formats

- **VCD** - Value Change Dump (standard Verilog simulation output)
- **FST** - Fast Signal Trace (compressed, ~10-20x smaller than VCD)
- **GHW** - GHDL waveform format (VHDL)
- **FTR** - Memory transaction format

### Surfer's Translator Features

Built-in bit-vector decoding:
- Hex, Binary, Unsigned, Signed, Octal, ASCII
- IEEE 754 floating point (half, single, double, quad)
- RISC-V instruction decoding (RV32I, M, A, F, D, RV64)
- ARM, MIPS, LoongArch64 instruction decoding
- Custom translators via Python API or WASM API

## Integration Architecture

### Option A: Embed via iframe (MVP - Simplest)

```tsx
// components/waveform/surfer-viewer.tsx
export function SurferViewer({ fileUrl }: { fileUrl: string }) {
  return (
    <iframe 
      src={`https://app.surfer-project.org/?url=${encodeURIComponent(fileUrl)}`}
      className="w-full h-[600px] border-0"
    />
  );
}
```

**Pros:** Zero backend changes, works immediately
**Cons:** Limited integration with AI analysis

### Option B: Host WASM + Vercel Blob (Recommended for MVP)

```
User uploads VCD → Vercel Blob → Generate signed URL → 
Surfer WASM loads from Blob URL → Renders in browser
```

1. Download Surfer's pre-compiled WASM from GitLab artifacts
2. Host in `/public/surfer/` directory
3. Store waveform files in Vercel Blob
4. Surfer WASM fetches files client-side

**Pros:** Full control, better UX, works on Vercel
**Cons:** ~10-15MB WASM bundle, file size limits

### Option C: Surfer Server Mode (Future - Requires Infrastructure)

```bash
# Requires non-Vercel infrastructure (Fly.io, Railway, etc.)
surfer server --file waveform.vcd
```

**Pros:** Streaming for large files, full feature set
**Cons:** Additional infrastructure, cost

## Vercel Compatibility

| Integration Method | Vercel Compatible? | Notes |
|--------------------|-------------------|-------|
| iframe to app.surfer-project.org | ✅ Yes | Relies on external service |
| Host Surfer WASM in `/public` | ✅ Yes | ~10-15MB bundle |
| Surfer Server Mode | ❌ No | Needs persistent process |

### Vercel Blob Limits

| Plan | Max File Size | Total Storage |
|------|---------------|---------------|
| Hobby | 500 MB | 1 GB |
| Pro | 500 MB | 100 GB |

## Alternative/Fallback: JavaScript VCD Parser

For lighter-weight preview or as fallback:

```bash
npm install vcd-stream wavedrom
```

- [wavedrom/vcd](https://github.com/wavedrom/vcd) - VCD parser (npm: `vcd-stream`)
- [wavedrom/vcdrom](https://github.com/wavedrom/vcdrom) - Simple VCD viewer
- [wavedrom/wavedrom](https://github.com/wavedrom/wavedrom) - Timing diagram generation

## Implementation Phases

### Phase 1: MVP (iframe Integration)
- [ ] Add iframe component pointing to app.surfer-project.org
- [ ] File upload to Vercel Blob
- [ ] Basic waveform file management UI
- [ ] Link waveforms to debug sessions

### Phase 2: Embedded WASM
- [ ] Download and host Surfer WASM
- [ ] Implement postMessage communication
- [ ] Signal selection synced with RTL viewer
- [ ] AI can reference specific signals/times

### Phase 3: Full Integration
- [ ] AI-powered signal correlation (RTL ↔ waveform)
- [ ] Automatic signal highlighting based on AI analysis
- [ ] Custom translators for common protocols
- [ ] Annotation and collaboration features

## Open Source Projects Reference

### Waveform Viewing
| Project | Language | URL |
|---------|----------|-----|
| Surfer | Rust/WASM | [gitlab.com/surfer-project/surfer](https://gitlab.com/surfer-project/surfer) |
| vcdrom | JavaScript | [github.com/wavedrom/vcdrom](https://github.com/wavedrom/vcdrom) |
| HTMLWave | HTML5/JS | [github.com/civol/htmlwave](https://github.com/civol/htmlwave) |
| JSwave | TypeScript | [github.com/kwf37/JSwave](https://github.com/kwf37/JSwave) |

### VCD Parsing
| Project | Language | npm Package |
|---------|----------|-------------|
| wavedrom/vcd | TypeScript | `vcd-stream` |
| wellen | Rust | (WASM possible) |

### RTL Analysis
| Project | Description |
|---------|-------------|
| Verible | SystemVerilog parser/linter (CHIPS Alliance) |
| sv-parser | Rust SV parser (IEEE 1800-2017) |
| Verilator | SV simulator & lint |

### AI Chip Debugging (Research)
| Project | Description |
|---------|-------------|
| hagent | Hardware Agent - agentic AI for hardware |
| VeriDebug | LLM-based Verilog debugging |
| ChipAgents | Autonomous root cause analysis |
