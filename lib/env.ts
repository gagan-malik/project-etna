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
  
  // Auth
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  
  // Optional - AI Providers
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

  if (!requiredEnvVars.NEXTAUTH_SECRET) {
    missing.push("NEXTAUTH_SECRET");
  }

  // Warnings for recommended variables
  if (!requiredEnvVars.OPENAI_API_KEY && !requiredEnvVars.GOOGLE_GENERATIVE_AI_API_KEY) {
    warnings.push("No AI provider API keys found. AI features will not work.");
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

