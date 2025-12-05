import { NextResponse } from "next/server";
import { validateEnv } from "@/lib/env";
import { checkDatabaseConnection } from "@/lib/db";

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
    };

    // Determine overall status
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

