/**
 * Cron Health Check Route
 * Example cron job that sends a health status alert to Slack
 * 
 * This serves as a template for other cron jobs.
 * Schedule: Configured in vercel.json
 */

import { NextRequest, NextResponse } from "next/server";
import { sendCronAlert } from "@/lib/slack";
import { prisma } from "@/lib/prisma";

/**
 * Verify the request is from Vercel Cron
 */
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // In development, allow requests without secret
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  // If no secret is configured, allow the request (but log a warning)
  if (!cronSecret) {
    console.warn("[Cron] CRON_SECRET not configured - requests are not authenticated");
    return true;
  }

  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const jobName = "Health Check";

  // Verify the request is authorized
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Perform health checks
    const healthChecks: Record<string, string> = {};

    // Check database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      healthChecks["Database"] = "Healthy";
    } catch {
      healthChecks["Database"] = "Unhealthy";
    }

    // Check environment
    healthChecks["Environment"] = process.env.NODE_ENV || "unknown";
    healthChecks["Timestamp"] = new Date().toISOString();

    // Calculate duration
    const duration = Date.now() - startTime;

    // Determine overall status
    const isHealthy = healthChecks["Database"] === "Healthy";

    // Send Slack notification
    await sendCronAlert({
      jobName,
      status: isHealthy ? "completed" : "failed",
      message: isHealthy
        ? "All systems are operational."
        : "Some health checks failed. Please investigate.",
      duration,
      details: healthChecks,
    });

    return NextResponse.json({
      success: true,
      healthy: isHealthy,
      checks: healthChecks,
      duration: `${duration}ms`,
    });
  } catch (error) {
    const duration = Date.now() - startTime;

    // Send failure alert
    await sendCronAlert({
      jobName,
      status: "failed",
      message: error instanceof Error ? error.message : "Unknown error occurred",
      duration,
    });

    console.error("[Cron] Health check failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: `${duration}ms`,
      },
      { status: 500 }
    );
  }
}
