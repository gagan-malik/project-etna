---
layout: default
title: Waveforms
parent: API Reference
nav_order: 6
---

# Waveforms API
{: .no_toc }

Upload and manage waveform files for hardware debugging.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Overview

Project Etna supports waveform file upload and viewing through integration with the Surfer waveform viewer. Upload VCD, FST, or GHW files to visualize signal traces alongside your RTL code.

---

## Upload Waveform

Upload a waveform file to Vercel Blob storage.

```http
POST /api/waveforms/upload
Content-Type: multipart/form-data
```

### Form Data

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `file` | File | Yes | Waveform file (VCD, FST, or GHW) |
| `debugSessionId` | string | No | Link to a debug session |

### Example

```javascript
const formData = new FormData();
formData.append('file', waveformFile);
formData.append('debugSessionId', 'session_123');

const response = await fetch('/api/waveforms/upload', {
  method: 'POST',
  credentials: 'include',
  body: formData
});
```

### Response

```json
{
  "waveform": {
    "id": "wf_123",
    "fileName": "simulation.vcd",
    "blobUrl": "https://xxx.blob.vercel-storage.com/...",
    "fileSize": 1048576,
    "format": "vcd",
    "userId": "user_123",
    "debugSessionId": "session_123",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Limits by Plan

| Plan | Max File Size | Max File Count | Formats |
|:-----|:--------------|:---------------|:--------|
| Free | 25 MB | 5 files | VCD only |
| Pro | 200 MB | 50 files | VCD, FST |
| Team | 500 MB | Unlimited | VCD, FST, GHW |

### Error: File Too Large

```json
{
  "error": "File exceeds maximum size of 25 MB for free plan"
}
```

### Error: Unsupported Format

```json
{
  "error": "Unsupported file format. Allowed: .vcd"
}
```

---

## List Waveforms

Get all waveform files for the authenticated user.

```http
GET /api/waveforms
```

### Query Parameters

| Parameter | Type | Required | Description |
|:----------|:-----|:---------|:------------|
| `debugSessionId` | string | No | Filter by debug session |

### Response

```json
{
  "waveforms": [
    {
      "id": "wf_123",
      "fileName": "simulation.vcd",
      "blobUrl": "https://xxx.blob.vercel-storage.com/...",
      "fileSize": 1048576,
      "format": "vcd",
      "debugSession": {
        "id": "session_123",
        "title": "Counter Debug"
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## Get Waveform

Retrieve a specific waveform file's metadata.

```http
GET /api/waveforms/[id]
```

### Response

```json
{
  "waveform": {
    "id": "wf_123",
    "fileName": "simulation.vcd",
    "blobUrl": "https://xxx.blob.vercel-storage.com/...",
    "fileSize": 1048576,
    "format": "vcd",
    "userId": "user_123",
    "debugSessionId": "session_123",
    "metadata": {
      "signals": 128,
      "timescale": "1ns"
    },
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## Delete Waveform

Delete a waveform file from storage.

```http
DELETE /api/waveforms/[id]
```

### Response

```json
{
  "message": "Waveform deleted"
}
```

{: .warning }
This permanently deletes the file from Vercel Blob storage.

---

## Supported Formats

| Format | Extension | Description |
|:-------|:----------|:------------|
| VCD | `.vcd` | Value Change Dump - standard IEEE format |
| FST | `.fst` | Fast Signal Trace - compressed format from GTKWave |
| GHW | `.ghw` | GHDL Waveform - VHDL simulation output |

---

## Waveform Viewer Integration

Once uploaded, waveforms are viewable through the Surfer integration:

```jsx
<SurferViewer
  url={waveform.blobUrl}
  onSignalSelect={(signal) => console.log(signal)}
/>
```

### PostMessage API

The Surfer viewer supports control via postMessage:

```javascript
// Navigate to specific time
iframe.contentWindow.postMessage({
  type: 'goto_time',
  time: '1000ns'
}, '*');

// Zoom to signal
iframe.contentWindow.postMessage({
  type: 'zoom_to_signal',
  signal: 'clk'
}, '*');
```

{: .note }
See the [Waveform Viewer Guide](/project-etna/waveforms) for detailed integration instructions.
