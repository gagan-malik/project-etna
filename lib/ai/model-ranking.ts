/**
 * Model Ranking Utility
 * Handles model quality tiers and query-based model selection
 */

import type { ModelInfo } from "./types";

export type ModelTier = 1 | 2 | 3; // 1 = highest quality, 3 = lowest quality

export interface ModelMetadata extends ModelInfo {
  tier: ModelTier;
  capabilities: {
    code: boolean;
    math: boolean;
    creative: boolean;
    reasoning: boolean;
    rtl_analysis: boolean;      // Verilog/VHDL code analysis
    timing_debug: boolean;       // Timing analysis and debugging
    signal_trace: boolean;       // Signal tracing and waveform analysis
    speed: "fast" | "medium" | "slow";
  };
}

/**
 * Model metadata with quality tiers and capabilities
 */
const MODEL_METADATA: Record<string, ModelMetadata> = {
  "gpt-4-turbo": {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "openai",
    category: "General",
    available: true,
    tier: 1,
    capabilities: {
      code: true,
      math: true,
      creative: true,
      reasoning: true,
      rtl_analysis: true,
      timing_debug: true,
      signal_trace: true,
      speed: "medium",
    },
  },
  "gpt-4": {
    id: "gpt-4",
    name: "GPT-4",
    provider: "openai",
    category: "General",
    available: true,
    tier: 1,
    capabilities: {
      code: true,
      math: true,
      creative: true,
      reasoning: true,
      rtl_analysis: true,
      timing_debug: true,
      signal_trace: true,
      speed: "slow",
    },
  },
  "gpt-3.5-turbo": {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "openai",
    category: "General",
    available: true,
    tier: 2,
    capabilities: {
      code: true,
      math: false,
      creative: true,
      reasoning: false,
      rtl_analysis: true,
      timing_debug: false,
      signal_trace: false,
      speed: "fast",
    },
  },
  "gemini-pro": {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "google",
    category: "General",
    available: true,
    tier: 1,
    capabilities: {
      code: true,
      math: true,
      creative: true,
      reasoning: true,
      rtl_analysis: true,
      timing_debug: true,
      signal_trace: true,
      speed: "medium",
    },
  },
  "deepseek-chat": {
    id: "deepseek-chat",
    name: "DeepSeek Chat",
    provider: "deepseek",
    category: "General",
    available: true,
    tier: 2,
    capabilities: {
      code: true,
      math: true,
      creative: false,
      reasoning: true,
      rtl_analysis: true,
      timing_debug: true,
      signal_trace: false,
      speed: "fast",
    },
  },
  "deepseek-coder": {
    id: "deepseek-coder",
    name: "DeepSeek Coder",
    provider: "deepseek",
    category: "Code",
    available: true,
    tier: 2,
    capabilities: {
      code: true,
      math: false,
      creative: false,
      reasoning: false,
      rtl_analysis: true,
      timing_debug: false,
      signal_trace: false,
      speed: "fast",
    },
  },
  "llama-3-70b": {
    id: "llama-3-70b",
    name: "Llama 3 70B",
    provider: "llama",
    category: "Open Source",
    available: true,
    tier: 2,
    capabilities: {
      code: true,
      math: true,
      creative: true,
      reasoning: true,
      rtl_analysis: true,
      timing_debug: true,
      signal_trace: false,
      speed: "medium",
    },
  },
  "llama-3-8b": {
    id: "llama-3-8b",
    name: "Llama 3 8B",
    provider: "llama",
    category: "Open Source",
    available: true,
    tier: 3,
    capabilities: {
      code: true,
      math: false,
      creative: true,
      reasoning: false,
      rtl_analysis: false,
      timing_debug: false,
      signal_trace: false,
      speed: "fast",
    },
  },
};

/**
 * Get highest quality model (Tier 1)
 */
export function getHighestQualityModel(availableModels: ModelInfo[]): ModelInfo | null {
  const tier1Models = availableModels
    .map((model) => MODEL_METADATA[model.id])
    .filter((meta): meta is ModelMetadata => meta !== undefined && meta.tier === 1);

  if (tier1Models.length === 0) {
    return availableModels[0] || null;
  }

  // Prefer GPT-4 Turbo or Gemini Pro
  const preferred = tier1Models.find(
    (m) => m.id === "gpt-4-turbo" || m.id === "gemini-pro"
  );

  return preferred || tier1Models[0];
}

/**
 * Analyze query to determine best model
 */
export function getBestModelForQuery(
  query: string,
  availableModels: ModelInfo[]
): ModelInfo | null {
  const queryLower = query.toLowerCase();

  // Check for RTL/hardware debugging keywords
  const rtlKeywords = [
    "verilog",
    "vhdl",
    "systemverilog",
    "module",
    "wire",
    "reg",
    "logic",
    "always",
    "posedge",
    "negedge",
    "assign",
    "rtl",
    "synthesis",
    "testbench",
    "uvm",
    "assertion",
    "sva",
    "coverage",
    "fsm",
    "state machine",
    "register",
    "flip-flop",
    "latch",
  ];
  const isRtlQuery = rtlKeywords.some((keyword) => queryLower.includes(keyword));

  // Check for timing analysis keywords
  const timingKeywords = [
    "timing",
    "setup",
    "hold",
    "clock",
    "frequency",
    "period",
    "skew",
    "jitter",
    "metastability",
    "cdc",
    "clock domain",
    "synchronizer",
    "async",
    "critical path",
    "slack",
  ];
  const isTimingQuery = timingKeywords.some((keyword) => queryLower.includes(keyword));

  // Check for signal/waveform keywords
  const signalKeywords = [
    "signal",
    "waveform",
    "trace",
    "transition",
    "glitch",
    "spike",
    "x-propagation",
    "unknown",
    "high-z",
    "simulation",
    "race condition",
    "hazard",
  ];
  const isSignalQuery = signalKeywords.some((keyword) => queryLower.includes(keyword));

  // Check for code-related keywords
  const codeKeywords = [
    "code",
    "function",
    "class",
    "api",
    "bug",
    "error",
    "programming",
    "javascript",
    "python",
    "react",
    "sql",
  ];
  const isCodeQuery = codeKeywords.some((keyword) => queryLower.includes(keyword));

  // Check for math-related keywords
  const mathKeywords = [
    "calculate",
    "solve",
    "equation",
    "formula",
    "math",
    "statistics",
    "probability",
  ];
  const isMathQuery = mathKeywords.some((keyword) => queryLower.includes(keyword));

  // Check for creative keywords
  const creativeKeywords = [
    "write",
    "story",
    "poem",
    "creative",
    "imagine",
    "describe",
    "brainstorm",
  ];
  const isCreativeQuery = creativeKeywords.some((keyword) => queryLower.includes(keyword));

  // Get model metadata
  const modelsWithMetadata = availableModels
    .map((model) => MODEL_METADATA[model.id])
    .filter((meta): meta is ModelMetadata => meta !== undefined);

  if (modelsWithMetadata.length === 0) {
    return availableModels[0] || null;
  }

  // Prioritize hardware debugging queries - these need highest tier models
  if (isRtlQuery || isTimingQuery || isSignalQuery) {
    // For RTL analysis, prefer models with rtl_analysis capability
    if (isRtlQuery) {
      const rtlModels = modelsWithMetadata
        .filter((m) => m.capabilities.rtl_analysis)
        .sort((a, b) => a.tier - b.tier);
      if (rtlModels.length > 0) return rtlModels[0];
    }

    // For timing analysis, prefer models with timing_debug capability
    if (isTimingQuery) {
      const timingModels = modelsWithMetadata
        .filter((m) => m.capabilities.timing_debug)
        .sort((a, b) => a.tier - b.tier);
      if (timingModels.length > 0) return timingModels[0];
    }

    // For signal tracing, prefer models with signal_trace capability
    if (isSignalQuery) {
      const signalModels = modelsWithMetadata
        .filter((m) => m.capabilities.signal_trace)
        .sort((a, b) => a.tier - b.tier);
      if (signalModels.length > 0) return signalModels[0];
    }

    // Fall back to highest tier for any hardware debugging
    return getHighestQualityModel(availableModels);
  }

  // Prioritize based on query type
  if (isCodeQuery) {
    // Prefer code-specialized models
    const codeModel = modelsWithMetadata.find(
      (m) => m.capabilities.code && m.id.includes("coder")
    );
    if (codeModel) return codeModel;

    // Fall back to any model with code capability
    const codeCapable = modelsWithMetadata.find((m) => m.capabilities.code);
    if (codeCapable) return codeCapable;
  }

  if (isMathQuery) {
    // Prefer models with math capability
    const mathModel = modelsWithMetadata.find((m) => m.capabilities.math);
    if (mathModel) return mathModel;
  }

  if (isCreativeQuery) {
    // Prefer models with creative capability
    const creativeModel = modelsWithMetadata.find((m) => m.capabilities.creative);
    if (creativeModel) return creativeModel;
  }

  // Default: return highest tier model
  return getHighestQualityModel(availableModels);
}

/**
 * Check if query is hardware/silicon debugging related
 */
export function isHardwareDebugQuery(query: string): boolean {
  const queryLower = query.toLowerCase();
  
  const hardwareKeywords = [
    "verilog", "vhdl", "systemverilog", "rtl", "module", "wire", "reg", "logic",
    "always", "posedge", "negedge", "clock", "reset", "fsm", "state machine",
    "timing", "setup", "hold", "cdc", "metastability", "synthesis", "testbench",
    "assertion", "coverage", "simulation", "waveform", "signal", "debug",
  ];
  
  return hardwareKeywords.some((keyword) => queryLower.includes(keyword));
}

/**
 * Get model metadata
 */
export function getModelMetadata(modelId: string): ModelMetadata | null {
  return MODEL_METADATA[modelId] || null;
}

/**
 * Get all models sorted by tier
 */
export function getModelsByTier(availableModels: ModelInfo[]): {
  tier1: ModelInfo[];
  tier2: ModelInfo[];
  tier3: ModelInfo[];
} {
  const tier1: ModelInfo[] = [];
  const tier2: ModelInfo[] = [];
  const tier3: ModelInfo[] = [];

  availableModels.forEach((model) => {
    const metadata = MODEL_METADATA[model.id];
    if (!metadata) {
      tier3.push(model);
      return;
    }

    switch (metadata.tier) {
      case 1:
        tier1.push(model);
        break;
      case 2:
        tier2.push(model);
        break;
      case 3:
        tier3.push(model);
        break;
    }
  });

  return { tier1, tier2, tier3 };
}

