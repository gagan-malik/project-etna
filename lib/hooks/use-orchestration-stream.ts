/**
 * Hook for streaming orchestration runs.
 * Parses SSE events: run_start, task_start, chunk, task_end, run_end, error.
 */

import { useState, useCallback } from "react";
import type { SourceType } from "@/components/chat/source-selector";

export interface OrchestrationTaskState {
  taskId: string;
  agentId: string;
  orderIndex: number;
  status: "pending" | "running" | "completed" | "failed";
  output?: string;
}

export interface OrchestrationRunState {
  runId: string | null;
  intent: string;
  agentIds: string[];
  tasks: OrchestrationTaskState[];
  activeAgentId: string | null;
  streamingContent: string;
  finalOutput: string | null;
  status: "idle" | "running" | "completed" | "failed";
}

export interface StreamOrchestrationOptions {
  onRunStart?: (runId: string, intent: string, agentIds: string[]) => void;
  onTaskStart?: (taskId: string, agentId: string, orderIndex: number) => void;
  onChunk?: (content: string) => void;
  onTaskEnd?: (taskId: string, agentId: string, output: string) => void;
  onRunEnd?: (runId: string, status: string, finalOutput: string) => void;
}

export function useOrchestrationStream() {
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [runState, setRunState] = useState<OrchestrationRunState>({
    runId: null,
    intent: "",
    agentIds: [],
    tasks: [],
    activeAgentId: null,
    streamingContent: "",
    finalOutput: null,
    status: "idle",
  });

  const streamOrchestration = useCallback(
    async (
      input: string,
      options: {
        conversationId?: string;
        spaceId?: string;
        sources?: SourceType[];
        model?: string;
      },
      callbacks?: StreamOrchestrationOptions
    ): Promise<{ runId: string; finalOutput: string; status: string }> => {
      try {
        setStreaming(true);
        setError(null);
        setRunState({
          runId: null,
          intent: "",
          agentIds: [],
          tasks: [],
          activeAgentId: null,
          streamingContent: "",
          finalOutput: null,
          status: "running",
        });

        const body = {
          input,
          conversationId: options.conversationId,
          spaceId: options.spaceId,
          sources: options.sources ?? [],
          model: options.model,
        };

        const response = await fetch("/api/orchestration/run/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          let errorMessage = "Failed to stream orchestration";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
            if (response.status === 401) {
              errorMessage = "Please sign in to use orchestration.";
            }
          } catch {
            if (response.status === 401)
              errorMessage = "Please sign in to use orchestration.";
          }
          throw new Error(errorMessage);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) {
          throw new Error("No response stream available");
        }

        let runId = "";
        let finalOutput = "";
        let runStatus = "failed";

        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6)) as Record<string, unknown>;
              const type = data.type as string | undefined;

              switch (type) {
                case "run_start":
                  runId = (data.runId as string) ?? "";
                  setRunState((prev) => ({
                    ...prev,
                    runId,
                    intent: (data.intent as string) ?? "",
                    agentIds: (data.agentIds as string[]) ?? [],
                    tasks: ((data.agentIds as string[]) ?? []).map(
                      (aid, idx) => ({
                        taskId: "",
                        agentId: aid,
                        orderIndex: idx,
                        status: "pending" as const,
                      })
                    ),
                    status: "running",
                  }));
                  callbacks?.onRunStart?.(
                    runId,
                    (data.intent as string) ?? "",
                    (data.agentIds as string[]) ?? []
                  );
                  break;
                case "task_start":
                  setRunState((prev) => {
                    const taskId = (data.taskId as string) ?? "";
                    const agentId = (data.agentId as string) ?? "";
                    const orderIndex = (data.orderIndex as number) ?? 0;
                    const newTasks = prev.tasks.map((t, i) =>
                      i === orderIndex
                        ? {
                            ...t,
                            taskId,
                            status: "running" as const,
                          }
                        : t
                    );
                    if (newTasks.length <= orderIndex) {
                      newTasks.push({
                        taskId,
                        agentId,
                        orderIndex,
                        status: "running",
                      });
                    }
                    return {
                      ...prev,
                      tasks: newTasks,
                      activeAgentId: agentId,
                      streamingContent: "",
                    };
                  });
                  callbacks?.onTaskStart?.(
                    (data.taskId as string) ?? "",
                    (data.agentId as string) ?? "",
                    (data.orderIndex as number) ?? 0
                  );
                  break;
                case "chunk": {
                  const content = (data.content as string) ?? "";
                  setRunState((prev) => ({
                    ...prev,
                    streamingContent: prev.streamingContent + content,
                  }));
                  callbacks?.onChunk?.(content);
                  break;
                }
                case "task_end":
                  setRunState((prev) => {
                    const taskId = (data.taskId as string) ?? "";
                    const agentId = (data.agentId as string) ?? "";
                    const output = (data.output as string) ?? "";
                    const newTasks = prev.tasks.map((t) =>
                      t.agentId === agentId
                        ? { ...t, taskId, status: "completed" as const, output }
                        : t
                    );
                    return {
                      ...prev,
                      tasks: newTasks,
                      activeAgentId: null,
                      streamingContent: "",
                    };
                  });
                  callbacks?.onTaskEnd?.(
                    (data.taskId as string) ?? "",
                    (data.agentId as string) ?? "",
                    (data.output as string) ?? ""
                  );
                  break;
                case "run_end":
                  finalOutput = (data.finalOutput as string) ?? "";
                  runStatus = (data.status as string) ?? "completed";
                  setRunState((prev) => ({
                    ...prev,
                    finalOutput,
                    status: runStatus === "completed" ? "completed" : "failed",
                  }));
                  callbacks?.onRunEnd?.(
                    (data.runId as string) ?? "",
                    runStatus,
                    finalOutput
                  );
                  break;
                case "error":
                  setError((data.error as string) ?? "Unknown error");
                  setRunState((prev) => ({
                    ...prev,
                    status: "failed",
                  }));
                  break;
                default:
                  break;
              }
            } catch (e) {
              if (e instanceof SyntaxError) continue;
              throw e;
            }
          }
        }

        setStreaming(false);
        return { runId, finalOutput, status: runStatus };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        setStreaming(false);
        setRunState((prev) => ({ ...prev, status: "failed" }));
        throw err;
      }
    },
    []
  );

  const resetRunState = useCallback(() => {
    setRunState({
      runId: null,
      intent: "",
      agentIds: [],
      tasks: [],
      activeAgentId: null,
      streamingContent: "",
      finalOutput: null,
      status: "idle",
    });
    setError(null);
  }, []);

  return {
    streaming,
    error,
    runState,
    streamOrchestration,
    resetRunState,
  };
}
