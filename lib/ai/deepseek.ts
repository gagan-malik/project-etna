/**
 * DeepSeek Integration
 * Custom REST API client for DeepSeek models
 */

import axios from "axios";
import type { AIRequest, AIResponse, AIStreamChunk, AIProvider } from "./types";

export class DeepSeekProvider implements AIProvider {
  name = "deepseek";
  private apiKey: string | null = null;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || null;
    this.apiUrl = process.env.DEEPSEEK_API_URL || "https://api.deepseek.com";
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error("DeepSeek API key not set. Set DEEPSEEK_API_KEY in .env.local");
    }

    const model = request.model || "deepseek-chat";
    const url = `${this.apiUrl}/v1/chat/completions`;

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
        throw new Error("No response from DeepSeek");
      }

      return {
        content: choice.message.content,
        model: response.data.model,
        provider: this.name,
        usage: response.data.usage
          ? {
              promptTokens: response.data.usage.prompt_tokens,
              completionTokens: response.data.usage.completion_tokens,
              totalTokens: response.data.usage.total_tokens,
            }
          : undefined,
        metadata: {
          finishReason: choice.finish_reason,
        },
      };
    } catch (error: any) {
      throw new Error(`DeepSeek API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async *stream(request: AIRequest): AsyncGenerator<AIStreamChunk, void, unknown> {
    if (!this.apiKey) {
      throw new Error("DeepSeek API key not set. Set DEEPSEEK_API_KEY in .env.local");
    }

    const model = request.model || "deepseek-chat";
    const url = `${this.apiUrl}/v1/chat/completions`;

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

      // Parse SSE stream
      const stream = response.data;
      let buffer = "";

      for await (const chunk of stream) {
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
                  metadata: {
                    model: parsed.model,
                    finishReason: parsed.choices[0]?.finish_reason,
                  },
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
      throw new Error(`DeepSeek API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

