/**
 * OpenAI Integration
 * Supports GPT-4, GPT-3.5, and other OpenAI models
 */

import OpenAI from "openai";
import type { AIRequest, AIResponse, AIStreamChunk, AIProvider } from "./types";

export class OpenAIProvider implements AIProvider {
  name = "openai";
  private client: OpenAI | null = null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.client = new OpenAI({ apiKey });
    }
  }

  isAvailable(): boolean {
    return !!this.client && !!process.env.OPENAI_API_KEY;
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    if (!this.client) {
      throw new Error("OpenAI client not initialized. Set OPENAI_API_KEY in .env.local");
    }

    const model = request.model || "gpt-4-turbo-preview";
    const response = await this.client.chat.completions.create({
      model,
      messages: request.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens,
    });

    const choice = response.choices[0];
    if (!choice?.message?.content) {
      throw new Error("No response from OpenAI");
    }

    return {
      content: choice.message.content,
      model: response.model,
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
      throw new Error("OpenAI client not initialized. Set OPENAI_API_KEY in .env.local");
    }

    const model = request.model || "gpt-4-turbo-preview";
    const stream = await this.client.chat.completions.create({
      model,
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

