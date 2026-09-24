import { NextRequest, NextResponse } from "next/server";
import { generateSkillGap } from "@/lib/job-matcher";
import { INITIAL_SKILLS } from "@/lib/mock-data";
import { SeniorityLevel } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetRole = "Full Stack Developer", seniority = "Mid-Level", userSkills } = body;

    const skillsToEvaluate = userSkills && Array.isArray(userSkills) ? userSkills : INITIAL_SKILLS;
    const analysis = generateSkillGap(targetRole, skillsToEvaluate, seniority as SeniorityLevel);

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("Error analyzing skill gap:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze skill gap" },
      { status: 500 }
    );
  }
}
