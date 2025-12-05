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
      onComplete: (fullContent: string) => void
    ) => {
      try {
        setStreaming(true);
        setError(null);

        const response = await fetch("/api/messages/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            conversationId,
            content,
            model,
            provider,
            sources,
            maxMode,
            useMultipleModels,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to stream message");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        if (!reader) {
          throw new Error("No response stream available");
        }

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
                  onComplete(fullContent);
                  setStreaming(false);
                  return;
                }
                if (data.error) {
                  throw new Error(data.error);
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
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

