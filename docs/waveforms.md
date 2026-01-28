---
layout: default
title: Waveform Viewer
nav_order: 7
description: "Guide to using the waveform viewer in Project Etna"
---

# Waveform Viewer
{: .no_toc }

View and analyze simulation waveforms.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Overview

Project Etna integrates with the [Surfer](https://surfer-project.org/) waveform viewer to provide VCD, FST, and GHW file viewing directly in your browser.

{: .highlight }
No software installation required - waveforms render entirely in your browser.

---

## Supported Formats

| Format | Extension | Description | Support |
|:-------|:----------|:------------|:--------|
| VCD | `.vcd` | IEEE standard Value Change Dump | All plans |
| FST | `.fst` | Fast Signal Trace (GTKWave format) | Pro+ |
| GHW | `.ghw` | GHDL waveform output | Team |

---

## Uploading Waveforms

### Via Web Interface

1. Navigate to **Waveforms** in the sidebar
2. Click **Upload Waveform** or drag-and-drop a file
3. Select a debug session to link (optional)
4. Click **Upload**

### Via API

```javascript
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/waveforms/upload', {
  method: 'POST',
  credentials: 'include',
  body: formData
});

const { waveform } = await response.json();
console.log('Uploaded:', waveform.blobUrl);
```

---

## File Size Limits

| Plan | Maximum Size | File Count |
|:-----|:-------------|:-----------|
| Free | 25 MB | 5 files |
| Pro | 200 MB | 50 files |
| Team | 500 MB | Unlimited |

{: .note }
Need larger files? [Contact us](mailto:support@example.com) about enterprise options with no file size limits.

---

## Using the Viewer

### Navigation

| Action | Keyboard | Mouse |
|:-------|:---------|:------|
| Zoom in | `+` or `=` | Scroll up |
| Zoom out | `-` | Scroll down |
| Pan left | `←` or `a` | Click + drag |
| Pan right | `→` or `d` | Click + drag |
| Fit all | `f` | Double-click |
| Go to start | `Home` | - |
| Go to end | `End` | - |

### Signal Management

- **Add signals** - Click the + button in the signal list
- **Remove signals** - Right-click signal → Remove
- **Reorder signals** - Drag signals in the list
- **Group signals** - Create groups for organization

### Markers

Add markers to annotate important times:

1. Click on the timeline where you want a marker
2. Press `m` to add a marker
3. Double-click marker to add a label

---

## Viewer Components

### SurferViewer

The main viewer component:

```tsx
import { SurferViewer } from '@/components/waveform';

<SurferViewer
  url="https://blob.vercel-storage.com/..."
  height={400}
  onSignalSelect={(signal) => {
    console.log('Selected:', signal);
  }}
/>
```

### WaveformPanel

Collapsible panel for debug workflows:

```tsx
import { WaveformPanel } from '@/components/waveform';

<WaveformPanel
  waveformUrl={waveform?.blobUrl}
  defaultCollapsed={false}
/>
```

### WaveformUploader

Drag-and-drop upload component:

```tsx
import { WaveformUploader } from '@/components/waveform';

<WaveformUploader
  onUpload={(waveform) => {
    console.log('Uploaded:', waveform);
  }}
  maxSizeMB={25}
  acceptedFormats={['.vcd']}
/>
```

---

## PostMessage API

Control the Surfer viewer programmatically:

### Go to Time

```javascript
// Navigate to specific simulation time
iframe.contentWindow.postMessage({
  type: 'goto_time',
  time: '1000ns'
}, '*');
```

### Zoom to Signal

```javascript
// Focus on a specific signal
iframe.contentWindow.postMessage({
  type: 'zoom_to_signal',
  signal: 'top.dut.clk'
}, '*');
```

### Set Time Range

```javascript
// Set visible time range
iframe.contentWindow.postMessage({
  type: 'set_time_range',
  start: '0ns',
  end: '1000ns'
}, '*');
```

### Add Marker

```javascript
// Add a marker at specific time
iframe.contentWindow.postMessage({
  type: 'add_marker',
  time: '500ns',
  label: 'Bug occurs here'
}, '*');
```

---

## Debug Session Integration

### Linking Waveforms

Link waveforms to debug sessions for organized debugging:

```javascript
// Upload with session link
const formData = new FormData();
formData.append('file', file);
formData.append('debugSessionId', sessionId);

await fetch('/api/waveforms/upload', {
  method: 'POST',
  body: formData
});
```

### Viewing in Debug Flow

When viewing a debug session:

1. RTL code displays in the main panel
2. Waveform viewer shows in collapsible bottom panel
3. AI chat provides analysis context

---

## Generating Waveforms

### Icarus Verilog

```bash
# Compile with VCD generation
iverilog -o sim testbench.v design.v
vvp sim

# In testbench.v:
# initial begin
#   $dumpfile("output.vcd");
#   $dumpvars(0, testbench);
# end
```

### Verilator

```bash
# Compile with trace support
verilator --trace -cc design.v --exe testbench.cpp
make -C obj_dir -f Vdesign.mk

# Generates output.vcd
```

### GHDL

```bash
# Compile and run
ghdl -a design.vhd testbench.vhd
ghdl -e testbench
ghdl -r testbench --wave=output.ghw
```

### Questa/ModelSim

```tcl
# In simulation
vcd file output.vcd
vcd add -r /*
run -all
vcd flush
```

---

## Troubleshooting

### File Won't Upload

{: .warning }
**Error:** "File exceeds maximum size"

**Solution:** 
- Free plan: Max 25 MB
- Upgrade to Pro (200 MB) or Team (500 MB)
- Compress VCD to FST format: `vcd2fst input.vcd output.fst`

### Viewer Won't Load

{: .warning }
**Error:** "Failed to load waveform"

**Solutions:**
1. Check file format is valid
2. Ensure file isn't corrupted
3. Try uploading again
4. Check browser console for errors

### Signals Not Showing

{: .warning }
**Issue:** Waveform loads but no signals visible

**Solutions:**
1. Click "Add Signal" to select signals
2. Check that signals were dumped during simulation
3. Verify `$dumpvars` scope in your testbench

---

## Coming Soon

Features in development:

- **Signal-RTL correlation** - Click signal → jump to RTL definition
- **AI waveform queries** - "Show me when data_valid goes high"
- **Waveform comparison** - Golden vs. actual diffs
- **Protocol decode** - Automatic AXI, APB annotations
