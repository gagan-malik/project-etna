/**
 * Vercel AI Gateway Integration
 * Single API key, OpenAI-compatible endpoint: https://ai-gateway.vercel.sh/v1
 * Model IDs use format: provider/model-name (e.g. openai/gpt-4-turbo)
 */

import OpenAI from "openai";
import type { AIRequest, AIResponse, AIStreamChunk, AIProvider } from "./types";

const GATEWAY_BASE_URL = "https://ai-gateway.vercel.sh/v1";

/** Map our internal model IDs to Vercel AI Gateway model IDs (provider/name) */
const MODEL_TO_GATEWAY: Record<string, string> = {
  "gpt-4-turbo": "openai/gpt-4-turbo",
  "gpt-4-turbo-preview": "openai/gpt-4-turbo",
  "gpt-4": "openai/gpt-4",
  "gpt-3.5-turbo": "openai/gpt-3.5-turbo",
  "gemini-pro": "google/gemini-2.0-flash",
  "deepseek-chat": "deepseek/deepseek-chat",
  "deepseek-coder": "deepseek/deepseek-coder",
  "llama-3-70b": "meta-llama/llama-3-70b-instruct",
  "llama-3-8b": "meta-llama/llama-3-8b-instruct",
  "meta-llama/Llama-3-70b-chat-hf": "meta-llama/llama-3-70b-instruct",
  "meta-llama/Llama-3-8b-chat-hf": "meta-llama/llama-3-8b-instruct",
};

function toGatewayModel(modelId: string | undefined): string {
  if (!modelId) return "openai/gpt-4-turbo";
  return MODEL_TO_GATEWAY[modelId] ?? `openai/${modelId}`;
}

export class GatewayProvider implements AIProvider {
  name = "gateway";
  private client: OpenAI | null = null;

  constructor() {
    const apiKey = process.env.AI_GATEWAY_API_KEY;
    if (apiKey) {
      this.client = new OpenAI({
        apiKey,
        baseURL: GATEWAY_BASE_URL,
      });
    }
  }

  isAvailable(): boolean {
    return !!this.client && !!process.env.AI_GATEWAY_API_KEY;
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    if (!this.client) {
      throw new Error(
        "AI Gateway client not initialized. Set AI_GATEWAY_API_KEY in .env.local (create one at Vercel Dashboard → AI Gateway → API Keys)."
      );
    }

    const gatewayModel = toGatewayModel(request.model);
    const response = await this.client.chat.completions.create({
      model: gatewayModel,
      messages: request.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens,
    });

    const choice = response.choices[0];
    if (!choice?.message?.content) {
      throw new Error("No response from AI Gateway");
    }

    return {
      content: choice.message.content,
      model: response.model ?? gatewayModel,
      provider: this.name,
      usage: response.usage
        ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          }
        : undefined,
      metadata: {
        finishReason: choice.finish_reason,
      },
    };
  }

  async *stream(request: AIRequest): AsyncGenerator<AIStreamChunk, void, unknown> {
    if (!this.client) {
      throw new Error(
        "AI Gateway client not initialized. Set AI_GATEWAY_API_KEY in .env.local (create one at Vercel Dashboard → AI Gateway → API Keys)."
      );
    }

    const gatewayModel = toGatewayModel(request.model);
    const stream = await this.client.chat.completions.create({
      model: gatewayModel,
      messages: request.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        yield {
          content: delta,
          done: false,
          metadata: {
            model: chunk.model,
            finishReason: chunk.choices[0]?.finish_reason,
          },
        };
      }
    }

    yield { content: "", done: true };
  }
}
