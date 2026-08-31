import { NextRequest, NextResponse } from "next/server";
import { CODING_PROBLEMS } from "@/lib/mock-data";
import { executeCodeSolution } from "@/lib/code-runner";

export async function POST(req: NextRequest) {
  try {
    const { problemId, code, language = "javascript" } = await req.json();

    const problem = CODING_PROBLEMS.find((p) => p.id === problemId);
    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const result = await executeCodeSolution(problem, code, language);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Code execution failed" }, { status: 500 });
  }
}
