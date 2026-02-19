/**
 * Orchestration executor: runs agent pipeline, persists tasks, handles streaming.
 */

import { prisma } from "@/lib/prisma";
import { generateAIResponse, streamAIResponse } from "@/lib/ai";
import { getAgent } from "./agents";
import type {
  AgentId,
  OrchestrationContext,
  RunStatus,
  TaskStatus,
  OrchestrationSSEEvent,
} from "./types";

export interface ExecuteRunOptions {
  runId: string;
  userId: string;
  input: string;
  intent: string;
  agentIds: AgentId[];
  context: OrchestrationContext;
  model?: string;
  conversationId?: string;
  spaceId?: string;
}

export interface StreamEmit {
  (event: OrchestrationSSEEvent): void;
}

/**
 * Execute run synchronously (for POST /run).
 */
export async function executeRunSync(
  options: ExecuteRunOptions
): Promise<{ finalOutput: string; status: RunStatus }> {
  const { runId, userId, input, intent, agentIds, context, model } = options;

  await prisma.agent_runs.update({
    where: { id: runId },
    data: { status: "running" },
  });

  let accumulatedOutput = "";
  let runStatus: RunStatus = "completed";

  for (let i = 0; i < agentIds.length; i++) {
    const agentId = agentIds[i];
    const agent = getAgent(agentId);

    const taskInput =
      i === 0 ? input : `Previous output:\n${accumulatedOutput}\n\nOriginal request: ${input}`;

    const task = await prisma.agent_tasks.create({
      data: {
        runId,
        agentId,
        orderIndex: i,
        status: "running",
        input: taskInput,
      },
    });

    try {
      const messages = buildAgentMessages(agent, context, taskInput);

      const response = await generateAIResponse(
        { messages, model, temperature: 0.7, maxTokens: 2000 },
        model
      );

      accumulatedOutput = response.content;

      await prisma.agent_tasks.update({
        where: { id: task.id },
        data: {
          status: "completed",
          output: response.content,
          usage: response.usage ? (response.usage as object) : undefined,
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      await prisma.agent_tasks.update({
        where: { id: task.id },
        data: {
          status: "failed",
          output: `Error: ${errorMessage}`,
          metadata: { error: errorMessage },
        },
      });
      runStatus = "failed";
      break;
    }
  }

  await prisma.agent_runs.update({
    where: { id: runId },
    data: {
      status: runStatus,
      finalOutput: accumulatedOutput,
    },
  });

  return { finalOutput: accumulatedOutput, status: runStatus };
}

/**
 * Execute run with streaming (for POST /run/stream).
 * Calls emit for each SSE event.
 */
export async function executeRunStreaming(
  options: ExecuteRunOptions,
  emit: StreamEmit
): Promise<void> {
  const { runId, userId, input, intent, agentIds, context, model } = options;

  emit({
    type: "run_start",
    runId,
    intent,
    agentIds: agentIds as string[],
  });

  await prisma.agent_runs.update({
    where: { id: runId },
    data: { status: "running" },
  });

  let accumulatedOutput = "";
  let runStatus: RunStatus = "completed";

  for (let i = 0; i < agentIds.length; i++) {
    const agentId = agentIds[i];
    const agent = getAgent(agentId);

    const taskInput =
      i === 0 ? input : `Previous output:\n${accumulatedOutput}\n\nOriginal request: ${input}`;

    const task = await prisma.agent_tasks.create({
      data: {
        runId,
        agentId,
        orderIndex: i,
        status: "running",
        input: taskInput,
      },
    });

    emit({
      type: "task_start",
      taskId: task.id,
      agentId,
      orderIndex: i,
    });

    try {
      const messages = buildAgentMessages(agent, context, taskInput);

      let taskOutput = "";
      const stream = streamAIResponse(
        { messages, model, temperature: 0.7, maxTokens: 2000 },
        model
      );

      for await (const chunk of stream) {
        if (chunk.content) {
          taskOutput += chunk.content;
          accumulatedOutput = taskOutput;
          emit({ type: "chunk", content: chunk.content });
        }
        if (chunk.done) break;
      }

      await prisma.agent_tasks.update({
        where: { id: task.id },
        data: {
          status: "completed",
          output: taskOutput,
        },
      });

      emit({
        type: "task_end",
        taskId: task.id,
        agentId,
        output: taskOutput,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      await prisma.agent_tasks.update({
        where: { id: task.id },
        data: {
          status: "failed",
          output: `Error: ${errorMessage}`,
          metadata: { error: errorMessage },
        },
      });
      runStatus = "failed";
      emit({ type: "error", error: errorMessage });
      break;
    }
  }

  await prisma.agent_runs.update({
    where: { id: runId },
    data: {
      status: runStatus,
      finalOutput: accumulatedOutput,
    },
  });

  emit({
    type: "run_end",
    runId,
    status: runStatus,
    finalOutput: accumulatedOutput,
  });
}

function buildAgentMessages(
  agent: { systemPromptFragment: string },
  context: OrchestrationContext,
  taskInput: string
): Array<{ role: "user" | "assistant" | "system"; content: string }> {
  const baseSystem =
    `You are an AI assistant with a specialized role.\n\n${agent.systemPromptFragment}` +
    (context.sourceContext ? `\n\n${context.sourceContext}` : "");

  const systemContent = context.spaceInstructions + baseSystem;

  const messages: Array<{ role: "user" | "assistant" | "system"; content: string }> = [
    { role: "system", content: systemContent },
  ];

  if (context.messages.length > 0) {
    messages.push(
      ...context.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }))
    );
  }

  messages.push({ role: "user", content: taskInput });

  return messages;
}
