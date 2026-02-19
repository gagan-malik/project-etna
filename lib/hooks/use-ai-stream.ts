/**
 * Hook for streaming AI responses.
 * Supports optional stream event callbacks (onBlock, onToolStart, onToolResult) for richer UX.
 */

import { useState, useCallback } from "react";
import type { SourceType } from "@/components/chat/source-selector";

export interface StreamMessageOptions {
  workerSlug?: string;
  expandedContent?: string;
  additionalSkillIds?: string[];
  onBlock?: (block: { kind: "code" | "waveform" | "text"; content: string | object }) => void;
  onToolStart?: (name: string, id?: string) => void;
  onToolResult?: (id: string, result: unknown) => void;
}

export function useAIStream() {
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamMessage = useCallback(
    async (
      conversationId: string,
      content: string,
      model: string,
      provider: string,
      sources: SourceType[],
      maxMode: boolean,
      useMultipleModels: boolean,
      onChunk: (chunk: string) => void,
      onComplete: (fullContent: string) => void,
      options?: StreamMessageOptions
    ) => {
      try {
        setStreaming(true);
        setError(null);

        const body: Record<string, unknown> = {
          conversationId,
          content,
          model,
          provider,
          sources,
          maxMode,
          useMultipleModels,
        };
        if (options?.workerSlug) body.workerSlug = options.workerSlug;
        if (options?.expandedContent !== undefined) body.expandedContent = options.expandedContent;
        if (options?.additionalSkillIds?.length) body.additionalSkillIds = options.additionalSkillIds;

        const response = await fetch("/api/messages/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          let errorMessage = "Failed to stream message";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
            if (response.status === 401) {
              errorMessage = "Please sign in to use the AI.";
            }
          } catch {
            if (response.status === 401) errorMessage = "Please sign in to use the AI.";
          }
          throw new Error(errorMessage);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        if (!reader) {
          throw new Error("No response stream available");
        }

        let streamDone = false;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6)) as Record<string, unknown>;
                if (data.content) {
                  fullContent += data.content as string;
                  onChunk(data.content as string);
                }
                if (data.type === "block" && data.kind && data.content !== undefined) {
                  options?.onBlock?.({
                    kind: data.kind as "code" | "waveform" | "text",
                    content: data.content as string | object,
                  });
                }
                if (data.type === "tool_start" && typeof data.name === "string") {
                  options?.onToolStart?.(data.name, data.id as string | undefined);
                }
                if (data.type === "tool_result" && typeof data.id === "string") {
                  options?.onToolResult?.(data.id, data.result);
                }
                if (data.done) {
                  streamDone = true;
                  onComplete(fullContent);
                  setStreaming(false);
                  return;
                }
                if (data.error) {
                  setStreaming(false);
                  throw new Error(data.error as string);
                }
              } catch (e) {
                if (e instanceof SyntaxError) {
                  // Skip invalid JSON lines
                  continue;
                }
                setStreaming(false);
                throw e;
              }
            }
          }
        }

        if (!streamDone) {
          setStreaming(false);
          throw new Error("Response ended before completion. Please try again.");
        }
      } catch (err: any) {
        setError(err.message);
        setStreaming(false);
        throw err;
      }
    },
    []
  );

  return {
    streaming,
    error,
    streamMessage,
  };
}

