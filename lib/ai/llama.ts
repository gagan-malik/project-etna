/**
 * Llama Integration
 * Supports Llama models via Replicate or Together AI
 */

import axios from "axios";
import type { AIRequest, AIResponse, AIStreamChunk, AIProvider } from "./types";

export class LlamaProvider implements AIProvider {
  name = "llama";
  private provider: "replicate" | "together" | null = null;
  private apiKey: string | null = null;

  constructor() {
    // Check which provider is available
    if (process.env.REPLICATE_API_TOKEN) {
      this.provider = "replicate";
      this.apiKey = process.env.REPLICATE_API_TOKEN;
    } else if (process.env.TOGETHER_API_KEY) {
      this.provider = "together";
      this.apiKey = process.env.TOGETHER_API_KEY;
    }
  }

  isAvailable(): boolean {
    return !!this.provider && !!this.apiKey;
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    if (!this.provider || !this.apiKey) {
      throw new Error("Llama provider not configured. Set REPLICATE_API_TOKEN or TOGETHER_API_KEY in .env.local");
    }

    if (this.provider === "together") {
      return this.generateTogether(request);
    } else {
      return this.generateReplicate(request);
    }
  }

  async *stream(request: AIRequest): AsyncGenerator<AIStreamChunk, void, unknown> {
    if (!this.provider || !this.apiKey) {
      throw new Error("Llama provider not configured. Set REPLICATE_API_TOKEN or TOGETHER_API_KEY in .env.local");
    }

    if (this.provider === "together") {
      yield* this.streamTogether(request);
    } else {
      yield* this.streamReplicate(request);
    }
  }

  private async generateTogether(request: AIRequest): Promise<AIResponse> {
    const model = request.model || "meta-llama/Llama-3-70b-chat-hf";
    const url = "https://api.together.xyz/v1/chat/completions";

    try {
      const response = await axios.post(
        url,
        {
          model,
          messages: request.messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      const choice = response.data.choices[0];
      if (!choice?.message?.content) {
        throw new Error("No response from Together AI");
      }

      return {
        content: choice.message.content,
        model: response.data.model,
        provider: "together",
        usage: response.data.usage
          ? {
              promptTokens: response.data.usage.prompt_tokens,
              completionTokens: response.data.usage.completion_tokens,
              totalTokens: response.data.usage.total_tokens,
            }
          : undefined,
      };
    } catch (error: any) {
      throw new Error(`Together AI error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  private async *streamTogether(request: AIRequest): AsyncGenerator<AIStreamChunk, void, unknown> {
    const model = request.model || "meta-llama/Llama-3-70b-chat-hf";
    const url = "https://api.together.xyz/v1/chat/completions";

    try {
      const response = await axios.post(
        url,
        {
          model,
          messages: request.messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens,
          stream: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          responseType: "stream",
        }
      );

      let buffer = "";
      for await (const chunk of response.data) {
        buffer += chunk.toString();
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              yield { content: "", done: true };
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices[0]?.delta?.content;
              if (delta) {
                yield {
                  content: delta,
                  done: false,
                  metadata: { model: parsed.model },
                };
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      yield { content: "", done: true };
    } catch (error: any) {
      throw new Error(`Together AI error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  private async generateReplicate(request: AIRequest): Promise<AIResponse> {
    // Replicate implementation would go here
    // For now, throw an error suggesting Together AI
    throw new Error("Replicate integration not yet implemented. Please use Together AI (set TOGETHER_API_KEY)");
  }

  private async *streamReplicate(request: AIRequest): AsyncGenerator<AIStreamChunk, void, unknown> {
    throw new Error("Replicate integration not yet implemented. Please use Together AI (set TOGETHER_API_KEY)");
  }
}

