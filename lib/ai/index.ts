/**
 * Unified AI Service
 * Provides a single interface to all AI providers
 */

import { OpenAIProvider } from "./openai";
import { GeminiProvider } from "./gemini";
import { DeepSeekProvider } from "./deepseek";
import { LlamaProvider } from "./llama";
import type { AIRequest, AIResponse, AIStreamChunk, AIProvider, ModelInfo } from "./types";

// Initialize providers
const providers: AIProvider[] = [
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
 * Get provider for a specific model
 */
export function getProviderForModel(modelId: string): AIProvider | null {
  // Map model IDs to providers
  const modelToProvider: Record<string, string> = {
    // OpenAI models
    "gpt-4-turbo": "openai",
    "gpt-4": "openai",
    "gpt-3.5-turbo": "openai",
    "gpt-4-turbo-preview": "openai",
    
    // Gemini models
    "gemini-pro": "google",
    "gemini-pro-vision": "google",
    
    // DeepSeek models
    "deepseek-chat": "deepseek",
    "deepseek-coder": "deepseek",
    
    // Llama models (Together AI)
    "llama-3-70b": "llama",
    "llama-3-8b": "llama",
    "meta-llama/Llama-3-70b-chat-hf": "llama",
    "meta-llama/Llama-3-8b-chat-hf": "llama",
  };

  const providerName = modelToProvider[modelId];
  if (!providerName) {
    // Default to OpenAI if unknown
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
 * Get available models
 * Always returns all models, but marks availability based on configured providers
 */
export function getAvailableModels(): ModelInfo[] {
  const models: ModelInfo[] = [];

  // Always include OpenAI models (mark availability based on provider)
  const openaiAvailable = getProvider("openai")?.isAvailable() ?? false;
  models.push(
    { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "openai", category: "General", available: openaiAvailable },
    { id: "gpt-4", name: "GPT-4", provider: "openai", category: "General", available: openaiAvailable },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "openai", category: "General", available: openaiAvailable }
  );

  // Always include Gemini models
  const googleAvailable = getProvider("google")?.isAvailable() ?? false;
  models.push(
    { id: "gemini-pro", name: "Gemini Pro", provider: "google", category: "General", available: googleAvailable }
  );

  // Always include DeepSeek models
  const deepseekAvailable = getProvider("deepseek")?.isAvailable() ?? false;
  models.push(
    { id: "deepseek-chat", name: "DeepSeek Chat", provider: "deepseek", category: "General", available: deepseekAvailable },
    { id: "deepseek-coder", name: "DeepSeek Coder", provider: "deepseek", category: "Code", available: deepseekAvailable }
  );

  // Always include Llama models
  const llamaAvailable = getProvider("llama")?.isAvailable() ?? false;
  models.push(
    { id: "llama-3-70b", name: "Llama 3 70B", provider: "llama", category: "Open Source", available: llamaAvailable },
    { id: "llama-3-8b", name: "Llama 3 8B", provider: "llama", category: "Open Source", available: llamaAvailable }
  );

  return models;
}

// Export types
export type { AIRequest, AIResponse, AIStreamChunk, AIProvider, ModelInfo } from "./types";

