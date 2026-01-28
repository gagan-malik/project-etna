# Surfer Waveform Viewer Integration

This directory is reserved for self-hosted Surfer WASM builds.

## Current Status

The integration currently uses **hosted mode** (iframe to app.surfer-project.org).
This works immediately with no additional setup.

## Self-Hosted WASM Setup (Optional)

For better performance and offline support, you can host Surfer WASM locally:

### 1. Build Surfer WASM

```bash
# Clone Surfer repository
git clone https://gitlab.com/surfer-project/surfer.git
cd surfer

# Install Rust and wasm-pack
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install wasm-pack

# Build WASM version
cd surfer
wasm-pack build --target web --out-dir ../pkg
```

### 2. Copy WASM Files

Copy the built files to this directory:
- `surfer_bg.wasm`
- `surfer.js`
- `index.html` (from surfer/assets/)

### 3. Update Component

In `components/waveform/surfer-viewer.tsx`, set `selfHosted={true}`:

```tsx
<SurferViewer
  waveformUrl={url}
  selfHosted={true}  // Enable self-hosted mode
/>
```

## API Reference

### postMessage Commands

Control the embedded Surfer viewer via postMessage:

```javascript
// Load a waveform from URL
iframe.contentWindow.postMessage({
  command: "LoadUrl",
  url: "https://example.com/waveform.vcd"
}, "*");

// Toggle menu visibility
iframe.contentWindow.postMessage({
  command: "ToggleMenu"
}, "*");

// Inject raw Surfer message (unstable API)
iframe.contentWindow.postMessage({
  command: "InjectMessage",
  message: JSON.stringify({ /* Surfer message */ })
}, "*");
```

## Resources

- [Surfer Website](https://surfer-project.org/)
- [Surfer GitLab](https://gitlab.com/surfer-project/surfer)
- [Surfer Documentation](https://docs.surfer-project.org/book/)
- [Live Demo](https://app.surfer-project.org/)
