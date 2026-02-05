/**
 * Hook for streaming AI responses
 */

import { useState, useCallback } from "react";
import type { SourceType } from "@/components/chat/source-selector";

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
      options?: { workerSlug?: string; expandedContent?: string; additionalSkillIds?: string[] }
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
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  fullContent += data.content;
                  onChunk(data.content);
                }
                if (data.done) {
                  streamDone = true;
                  onComplete(fullContent);
                  setStreaming(false);
                  return;
                }
                if (data.error) {
                  setStreaming(false);
                  throw new Error(data.error);
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

