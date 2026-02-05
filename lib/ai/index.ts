/**
 * Unified AI Service
 * Provides a single interface to all AI providers.
 * When AI_GATEWAY_API_KEY is set, Vercel AI Gateway is used for all models (one key).
 */

import { GatewayProvider } from "./gateway";
import { OpenAIProvider } from "./openai";
import { GeminiProvider } from "./gemini";
import { DeepSeekProvider } from "./deepseek";
import { LlamaProvider } from "./llama";
import type { AIRequest, AIResponse, AIStreamChunk, AIProvider, ModelInfo } from "./types";

// Gateway first so when configured it is preferred (one key for all models)
const providers: AIProvider[] = [
  new GatewayProvider(),
  new OpenAIProvider(),
  new GeminiProvider(),
  new DeepSeekProvider(),
  new LlamaProvider(),
];

/**
 * Get available providers
 */
export function getAvailableProviders(): AIProvider[] {
  return providers.filter((p) => p.isAvailable());
}

/**
 * Get provider by name
 */
export function getProvider(name: string): AIProvider | null {
  return providers.find((p) => p.name === name && p.isAvailable()) || null;
}

/**
 * Get provider for a specific model.
 * When Vercel AI Gateway is configured (AI_GATEWAY_API_KEY), it is used for all models.
 */
export function getProviderForModel(modelId: string): AIProvider | null {
  const gateway = getProvider("gateway");
  if (gateway) {
    return gateway;
  }

  const modelToProvider: Record<string, string> = {
    "gpt-4-turbo": "openai",
    "gpt-4": "openai",
    "gpt-3.5-turbo": "openai",
    "gpt-4-turbo-preview": "openai",
    "gemini-pro": "google",
    "gemini-pro-vision": "google",
    "deepseek-chat": "deepseek",
    "deepseek-coder": "deepseek",
    "llama-3-70b": "llama",
    "llama-3-8b": "llama",
    "meta-llama/Llama-3-70b-chat-hf": "llama",
    "meta-llama/Llama-3-8b-chat-hf": "llama",
  };

  const providerName = modelToProvider[modelId];
  if (!providerName) {
    return getProvider("openai");
  }

  return getProvider(providerName);
}

/**
 * Generate AI response
 */
export async function generateAIResponse(
  request: AIRequest,
  modelId?: string
): Promise<AIResponse> {
  const provider = modelId ? getProviderForModel(modelId) : getProvider("openai");

  if (!provider) {
    throw new Error(
      `No available AI provider for model ${modelId || "default"}. Please configure API keys in .env.local`
    );
  }

  return provider.generate(request);
}

/**
 * Stream AI response
 */
export async function* streamAIResponse(
  request: AIRequest,
  modelId?: string
): AsyncGenerator<AIStreamChunk, void, unknown> {
  const provider = modelId ? getProviderForModel(modelId) : getProvider("openai");

  if (!provider) {
    throw new Error(
      `No available AI provider for model ${modelId || "default"}. Please configure API keys in .env.local`
    );
  }

  yield* provider.stream(request);
}

/**
 * Default model list for chat when unauthenticated (guests).
 * Matches the shape returned by getAvailableModels(); availability is false for guests.
 */
export const DEFAULT_CHAT_MODELS: ModelInfo[] = [
  { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "openai", category: "General", available: false },
  { id: "gpt-4", name: "GPT-4", provider: "openai", category: "General", available: false },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "openai", category: "General", available: false },
  { id: "gemini-pro", name: "Gemini Pro", provider: "google", category: "General", available: false },
  { id: "deepseek-chat", name: "DeepSeek Chat", provider: "deepseek", category: "General", available: false },
  { id: "deepseek-coder", name: "DeepSeek Coder", provider: "deepseek", category: "Code", available: false },
  { id: "llama-3-70b", name: "Llama 3 70B", provider: "llama", category: "Open Source", available: false },
  { id: "llama-3-8b", name: "Llama 3 8B", provider: "llama", category: "Open Source", available: false },
];

/**
 * Get available models.
 * When AI Gateway is configured, all models are available through it.
 */
export function getAvailableModels(): ModelInfo[] {
  const gatewayAvailable = getProvider("gateway")?.isAvailable() ?? false;
  const openaiAvailable = getProvider("openai")?.isAvailable() ?? false;
  const googleAvailable = getProvider("google")?.isAvailable() ?? false;
  const deepseekAvailable = getProvider("deepseek")?.isAvailable() ?? false;
  const llamaAvailable = getProvider("llama")?.isAvailable() ?? false;

  const models: ModelInfo[] = [];

  models.push(
    { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "openai", category: "General", available: gatewayAvailable || openaiAvailable },
    { id: "gpt-4", name: "GPT-4", provider: "openai", category: "General", available: gatewayAvailable || openaiAvailable },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "openai", category: "General", available: gatewayAvailable || openaiAvailable }
  );

  models.push(
    { id: "gemini-pro", name: "Gemini Pro", provider: "google", category: "General", available: gatewayAvailable || googleAvailable }
  );

  models.push(
    { id: "deepseek-chat", name: "DeepSeek Chat", provider: "deepseek", category: "General", available: gatewayAvailable || deepseekAvailable },
    { id: "deepseek-coder", name: "DeepSeek Coder", provider: "deepseek", category: "Code", available: gatewayAvailable || deepseekAvailable }
  );

  models.push(
    { id: "llama-3-70b", name: "Llama 3 70B", provider: "llama", category: "Open Source", available: gatewayAvailable || llamaAvailable },
    { id: "llama-3-8b", name: "Llama 3 8B", provider: "llama", category: "Open Source", available: gatewayAvailable || llamaAvailable }
  );

  return models;
}

// Export types
export type { AIRequest, AIResponse, AIStreamChunk, AIProvider, ModelInfo } from "./types";

