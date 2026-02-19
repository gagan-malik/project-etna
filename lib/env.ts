/**
 * Environment Variable Validation
 * Validates required environment variables on startup
 */

/**
 * Required environment variables
 */
const requiredEnvVars = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  
  // Auth (Clerk)
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  
  // Optional - AI Providers (use AI_GATEWAY_API_KEY or VERCEL_AI_GATEWAY_API_KEY for Vercel AI Gateway)
  AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_AI_GATEWAY_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
  TOGETHER_API_KEY: process.env.TOGETHER_API_KEY,
  
  // Optional - Storage
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  
  // Optional - OAuth
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  
  // Optional - Slack Integration
  SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
  
  // Optional - Cron Jobs
  CRON_SECRET: process.env.CRON_SECRET,
} as const;

/**
 * Validate required environment variables
 */
export function validateEnv(): { valid: boolean; missing: string[]; warnings: string[] } {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Required variables
  if (!requiredEnvVars.DATABASE_URL) {
    missing.push("DATABASE_URL");
  }

  if (!requiredEnvVars.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    missing.push("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
  }
  if (!requiredEnvVars.CLERK_SECRET_KEY) {
    missing.push("CLERK_SECRET_KEY");
  }

  // Warnings for recommended variables
  if (
    !requiredEnvVars.AI_GATEWAY_API_KEY &&
    !requiredEnvVars.OPENAI_API_KEY &&
    !requiredEnvVars.GOOGLE_GENERATIVE_AI_API_KEY
  ) {
    warnings.push("No AI provider API keys found. Set AI_GATEWAY_API_KEY (Vercel AI Gateway) or provider keys. AI features will not work.");
  }

  if (!requiredEnvVars.BLOB_READ_WRITE_TOKEN) {
    warnings.push("BLOB_READ_WRITE_TOKEN not set. File uploads will not work.");
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  };
}

/**
 * Get environment variable with type safety
 */
export function getEnv(key: keyof typeof requiredEnvVars): string | undefined {
  return requiredEnvVars[key];
}

/**
 * Assert environment variable exists
 */
export function requireEnv(key: keyof typeof requiredEnvVars): string {
  const value = requiredEnvVars[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

/**
 * Check if we're in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Check if we're in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

