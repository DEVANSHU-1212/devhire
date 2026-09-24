import { NextRequest, NextResponse } from "next/server";
import { explainMilestoneAI } from "@/lib/ai-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { milestoneTitle, category = "General", context = "" } = body;

    if (!milestoneTitle) {
      return NextResponse.json(
        { success: false, error: "Milestone title is required" },
        { status: 400 }
      );
    }

    const explanation = await explainMilestoneAI(milestoneTitle, category, context);

    return NextResponse.json({
      success: true,
      data: explanation,
    });
  } catch (error) {
    console.error("Error explaining milestone:", error);
    return NextResponse.json(
      { success: false, error: "Failed to explain milestone" },
      { status: 500 }
    );
  }
}
