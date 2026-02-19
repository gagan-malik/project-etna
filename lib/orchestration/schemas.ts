/**
 * Zod schemas for orchestration API
 */

import { z } from "zod";

export const runCreateSchema = z.object({
  input: z.string().min(1, "Input is required").max(50000),
  conversationId: z.string().cuid().optional(),
  spaceId: z.string().cuid().optional(),
  sources: z.array(z.string()).optional().default([]),
  model: z.string().optional(),
  stream: z.boolean().optional().default(false),
});

export type RunCreateSchema = z.infer<typeof runCreateSchema>;

export const runsListQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  cursor: z.string().optional(),
});

export type RunsListQuerySchema = z.infer<typeof runsListQuerySchema>;
