import { NextRequest, NextResponse } from "next/server";
import { analyzeResumeText } from "@/lib/ai-engine";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let rawText = "";
    let fileName = "resume.pdf";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      }

      fileName = file.name;
      const buffer = Buffer.from(await file.arrayBuffer());

      if (file.type === "application/pdf" || fileName.endsWith(".pdf")) {
        const parsed = await pdfParse(buffer);
        rawText = parsed.text;
      } else {
        rawText = buffer.toString("utf-8");
      }
    } else {
      const body = await req.json();
      rawText = body.text || "";
      fileName = body.fileName || "manual_input.txt";
    }

    if (!rawText || rawText.trim().length < 20) {
      return NextResponse.json(
        { error: "Insufficient resume text extracted. Please ensure the document contains readable text." },
        { status: 400 }
      );
    }

    const analysis = await analyzeResumeText(rawText, fileName);
    return NextResponse.json(analysis);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
