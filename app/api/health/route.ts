import { NextResponse } from "next/server";
import { validateEnv } from "@/lib/env";
import { checkDatabaseConnection } from "@/lib/db";

function isAIConfigured(): boolean {
  return !!(
    process.env.AI_GATEWAY_API_KEY ||
    process.env.VERCEL_AI_GATEWAY_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.DEEPSEEK_API_KEY ||
    process.env.TOGETHER_API_KEY
  );
}

// GET /api/health - Health check endpoint
export async function GET() {
  try {
    const envCheck = validateEnv();
    const dbCheck = await checkDatabaseConnection();

    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: {
        valid: envCheck.valid,
        missing: envCheck.missing,
        warnings: envCheck.warnings,
      },
      database: {
        connected: dbCheck.connected,
        error: dbCheck.error,
      },
      ai: {
        configured: isAIConfigured(),
      },
    };

    // Determine overall status (env + DB only; AI is optional)
    const isHealthy = envCheck.valid && dbCheck.connected;

    return NextResponse.json(health, {
      status: isHealthy ? 200 : 503,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}

