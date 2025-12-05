/**
 * Input Validation Utilities
 * Centralized validation and sanitization
 */

import { z } from "zod";

/**
 * Sanitize string input (remove dangerous characters)
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, ""); // Remove event handlers
}

/**
 * Validate and sanitize email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate file type
 */
export function validateFileType(
  file: File,
  allowedTypes: string[]
): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSizeBytes: number): boolean {
  return file.size <= maxSizeBytes;
}

/**
 * Validation schemas using Zod
 */
export const conversationSchema = z.object({
  title: z.string().max(200).optional(),
  spaceId: z.string().optional(),
});

export const messageSchema = z.object({
  content: z.string().min(1).max(10000),
  conversationId: z.string(),
  model: z.string().optional(),
  provider: z.string().optional(),
});

export const documentSchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().min(1),
  url: z.string().url().optional().nullable(),
  source: z.string().optional(),
  sourceId: z.string().optional(),
  spaceId: z.string().optional(),
});

export const integrationSchema = z.object({
  type: z.enum(["github", "confluence", "microsoft_graph", "custom"]),
  name: z.string().min(1).max(200),
  config: z.record(z.string(), z.any()),
  credentials: z.record(z.string(), z.any()).optional(),
  spaceId: z.string().optional(),
});

/**
 * Validate input against schema
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const data = schema.parse(input);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return {
        success: false,
        error: `${firstError.path.join(".")}: ${firstError.message}`,
      };
    }
    return { success: false, error: "Validation failed" };
  }
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj } as T;

  for (const key in sanitized) {
    if (typeof sanitized[key] === "string") {
      (sanitized as any)[key] = sanitizeString(sanitized[key] as string);
    } else if (typeof sanitized[key] === "object" && sanitized[key] !== null && !Array.isArray(sanitized[key])) {
      (sanitized as any)[key] = sanitizeObject(sanitized[key] as Record<string, any>);
    }
  }

  return sanitized;
}

