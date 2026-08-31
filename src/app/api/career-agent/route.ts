import { NextRequest, NextResponse } from "next/server";
import { askCareerAgent } from "@/lib/ai-engine";

export async function POST(req: NextRequest) {
  try {
    const { query, context = {} } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const response = await askCareerAgent(query, context);
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Career agent error" }, { status: 500 });
  }
}
