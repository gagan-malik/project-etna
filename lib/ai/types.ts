/**
 * AI Service Types
 * Unified types for all AI providers
 */

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIRequest {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface AIResponse {
  content: string;
  model: string;
  provider: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  metadata?: Record<string, any>;
}

export interface AIStreamChunk {
  content: string;
  done: boolean;
  metadata?: Record<string, any>;
}

export interface AIProvider {
  name: string;
  generate(request: AIRequest): Promise<AIResponse>;
  stream(request: AIRequest): AsyncGenerator<AIStreamChunk, void, unknown>;
  isAvailable(): boolean;
}

export type ModelInfo = {
  id: string;
  name: string;
  provider: string;
  category: string;
  available: boolean;
};

