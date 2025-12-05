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

