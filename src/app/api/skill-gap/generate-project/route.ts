import { NextRequest, NextResponse } from "next/server";
import { generateProjectBlueprintAI } from "@/lib/ai-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      targetRole = "Full Stack Developer",
      seniority = "Mid-Level",
      missingSkills = ["Redis", "Docker", "System Design"],
      userInterests = "High-scale real-time systems",
    } = body;

    const blueprint = await generateProjectBlueprintAI(
      targetRole,
      seniority,
      missingSkills,
      userInterests
    );

    return NextResponse.json({
      success: true,
      project: blueprint,
    });
  } catch (error) {
    console.error("Error generating project blueprint:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate project blueprint" },
      { status: 500 }
    );
  }
}
