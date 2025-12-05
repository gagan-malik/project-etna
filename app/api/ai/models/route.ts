import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAvailableModels } from "@/lib/ai";

// GET /api/ai/models - Get available AI models
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const models = getAvailableModels();

    return NextResponse.json({ models });
  } catch (error) {
    console.error("Error fetching AI models:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI models" },
      { status: 500 }
    );
  }
}

