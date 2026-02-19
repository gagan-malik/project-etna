import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateInput } from "@/lib/validation";
import { z } from "zod";

const installSkillSchema = z.object({
  skillId: z.string().min(1),
});

// POST /api/skills/install - Copy a built-in skill into the user's account (curated install)
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = validateInput(installSkillSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { skillId } = validation.data;

    const source = await prisma.skills.findUnique({
      where: { id: skillId },
    });

    if (!source) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }

    if (source.userId !== null || !source.isBuiltIn) {
      return NextResponse.json(
        { error: "Only built-in skills can be installed. This skill is not a built-in skill." },
        { status: 400 }
      );
    }

    const skill = await prisma.skills.create({
      data: {
        userId: session.user.id,
        name: source.name,
        description: source.description,
        systemPromptFragment: source.systemPromptFragment,
        isBuiltIn: false,
      },
    });

    return NextResponse.json({
      skill: {
        id: skill.id,
        userId: skill.userId,
        name: skill.name,
        description: skill.description,
        systemPromptFragment: skill.systemPromptFragment,
        isBuiltIn: skill.isBuiltIn,
        createdAt: skill.createdAt,
        updatedAt: skill.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error installing skill:", error);
    return NextResponse.json(
      { error: "Failed to install skill" },
      { status: 500 }
    );
  }
}
