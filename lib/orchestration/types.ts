/**
 * Agent orchestration types
 */

export type Intent =
  | "research"
  | "architect"
  | "implement"
  | "review"
  | "docs"
  | "ux_researcher"
  | "ux_designer"
  | "usability"
  | "accessibility"
  | "general";

export type AgentId =
  | "research"
  | "architect"
  | "implement"
  | "review"
  | "docs"
  | "ux_researcher"
  | "ux_designer"
  | "usability"
  | "accessibility";

export type RunStatus = "pending" | "running" | "completed" | "failed";

export type TaskStatus = "pending" | "running" | "completed" | "failed";

export interface OrchestrationContext {
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  sourceContext: string;
  spaceInstructions: string;
}

export interface RunCreateInput {
  input: string;
  conversationId?: string;
  spaceId?: string;
  sources?: string[];
  model?: string;
  stream?: boolean;
}

export interface AgentTaskResult {
  taskId: string;
  agentId: AgentId;
  orderIndex: number;
  status: TaskStatus;
  output: string;
  usage?: Record<string, unknown>;
}

export interface RunResult {
  runId: string;
  status: RunStatus;
  intent: Intent;
  input: string;
  finalOutput: string;
  tasks: AgentTaskResult[];
  model?: string;
}

export type OrchestrationSSEEvent =
  | { type: "run_start"; runId: string; intent: string; agentIds: string[] }
  | { type: "task_start"; taskId: string; agentId: string; orderIndex: number }
  | { type: "chunk"; content: string }
  | { type: "task_end"; taskId: string; agentId: string; output: string }
  | { type: "run_end"; runId: string; status: string; finalOutput: string }
  | { type: "error"; error: string };
