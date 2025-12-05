/**
 * Google Gemini Integration
 * Supports Gemini Pro and other Gemini models
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIRequest, AIResponse, AIStreamChunk, AIProvider } from "./types";

export class GeminiProvider implements AIProvider {
  name = "google";
  private client: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (apiKey) {
      this.client = new GoogleGenerativeAI(apiKey);
    }
  }

  isAvailable(): boolean {
    return !!this.client && !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    if (!this.client) {
      throw new Error("Gemini client not initialized. Set GOOGLE_GENERATIVE_AI_API_KEY in .env.local");
    }

    const modelName = request.model || "gemini-pro";
    const model = this.client.getGenerativeModel({ model: modelName });

    // Convert messages to Gemini format
    const prompt = this.formatMessages(request.messages);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      content: text,
      model: modelName,
      provider: this.name,
      metadata: {
        finishReason: response.candidates?.[0]?.finishReason,
      },
    };
  }

  async *stream(request: AIRequest): AsyncGenerator<AIStreamChunk, void, unknown> {
    if (!this.client) {
      throw new Error("Gemini client not initialized. Set GOOGLE_GENERATIVE_AI_API_KEY in .env.local");
    }

    const modelName = request.model || "gemini-pro";
    const model = this.client.getGenerativeModel({ model: modelName });

    // Convert messages to Gemini format
    const prompt = this.formatMessages(request.messages);

    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        yield {
          content: text,
          done: false,
          metadata: {
            model: modelName,
          },
        };
      }
    }

    yield { content: "", done: true };
  }

  private formatMessages(messages: AIRequest["messages"]): string {
    // Gemini doesn't support system messages the same way, so we combine them
    let prompt = "";
    
    for (const msg of messages) {
      if (msg.role === "system") {
        prompt += `System: ${msg.content}\n\n`;
      } else if (msg.role === "user") {
        prompt += `User: ${msg.content}\n\n`;
      } else if (msg.role === "assistant") {
        prompt += `Assistant: ${msg.content}\n\n`;
      }
    }
    
    prompt += "Assistant:";
    return prompt;
  }
}

