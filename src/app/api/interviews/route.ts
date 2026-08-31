import { NextRequest, NextResponse } from "next/server";
import { generateInterviewQuestions, evaluateInterviewAnswer } from "@/lib/ai-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = req.nextUrl.searchParams.get("action") || "generate";

    if (action === "generate") {
      const { role = "Full Stack Engineer", difficulty = "Medium", type = "Technical" } = body;
      const questions = await generateInterviewQuestions(role, difficulty, type);
      return NextResponse.json({ questions });
    }

    if (action === "evaluate") {
      const { question, answer, category = "General" } = body;
      if (!question || !answer) {
        return NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
      }

      const evaluation = await evaluateInterviewAnswer(question, answer, category);
      return NextResponse.json(evaluation);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Interview service error" }, { status: 500 });
  }
}
