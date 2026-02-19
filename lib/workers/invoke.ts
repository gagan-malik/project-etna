/**
 * Run a worker with the given input and return the full AI response text.
 * Used for worker-to-worker invocation or programmatic worker calls.
 */

import { prisma } from "@/lib/prisma";
import { streamAIResponse } from "@/lib/ai";

export interface RunWorkerInvocationOptions {
  userId: string;
  spaceId?: string | null;
  workerSlug: string;
  input: string;
}

/**
 * Load the worker, run the AI with the worker's system prompt and the given input,
 * accumulate the streamed response, and return the full text.
 */
export async function runWorkerInvocation(
  options: RunWorkerInvocationOptions
): Promise<string> {
  const { userId, spaceId, workerSlug, input } = options;

  const worker = await prisma.workers.findFirst({
    where: {
      slug: workerSlug.trim(),
      userId,
      ...(spaceId ? { spaceId } : { spaceId: null }),
    },
    select: { id: true, systemPrompt: true, modelId: true },
  });

  if (!worker) {
    throw new Error(`Worker not found: ${workerSlug}`);
  }

  const messages = [
    { role: "system" as const, content: worker.systemPrompt },
    { role: "user" as const, content: input.trim() || "Please proceed." },
  ];

  const modelId = worker.modelId ?? undefined;
  let fullResponse = "";

  const stream = streamAIResponse(
    {
      messages,
      model: modelId,
      temperature: 0.7,
      maxTokens: 2000,
    },
    modelId
  );

  for await (const chunk of stream) {
    if (chunk.content) {
      fullResponse += chunk.content;
    }
    if (chunk.done) {
      break;
    }
  }

  return fullResponse;
}
