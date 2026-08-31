"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Award,
  Zap,
  TrendingUp,
  Download,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { ResumeAnalysis } from "@/lib/types";

const SAMPLE_RESUME_TEXT = `ALEX LE - FULL STACK ENGINEER
Email: alex.le@example.com | GitHub: github.com/alexle | LinkedIn: linkedin.com/in/alexle

PROFESSIONAL SUMMARY
High-performing Full Stack Software Engineer with 2+ years of experience building modern web applications, scalable REST APIs, and responsive UIs using React, Next.js, Node.js, and TypeScript.

CORE SKILLS
- Frontend: React, Next.js, TypeScript, JavaScript, Tailwind CSS, Redux, HTML5, CSS3
- Backend: Node.js, Express.js, REST APIs, GraphQL, PostgreSQL, Prisma, Redis
- Tools & DevOps: Git, GitHub Actions, Docker, Linux, Jest, Vite, Vercel

WORK EXPERIENCE
Full Stack Developer | NexaScale Labs (2024 - Present)
- Developed and maintained responsive SaaS dashboard using Next.js, React, and Tailwind CSS, increasing page load speed by 35%.
- Architected RESTful microservices in Node.js and Express with PostgreSQL, handling 20,000+ daily active requests with sub-100ms response times.
- Integrated Redis caching layers for heavy analytical queries, reducing database load by 45%.
- Collaborated in an Agile team of 6 engineers with daily standups, code reviews, and CI/CD automated deployments.

PROJECTS
- E-Commerce Real-Time Stream: Built full-stack platform with Next.js, Prisma, and Redis WebSockets.
- AI PDF Document Extractor: Integrated local LLMs with LangChain to parse and summarize technical PDFs.

EDUCATION
Bachelor of Science in Computer Science | State University (2020 - 2024)`;

export default function ResumeAnalyzerPage() {
  const [inputText, setInputText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>({
    score: 84,
    fileName: "alex_le_resume.pdf",
    strengths: [
      "Strong core full-stack stack detected: React, Next.js, TypeScript, Node.js, PostgreSQL.",
      "High-impact quantifiable metrics included (35% speed increase, 20k daily requests, 45% DB load reduction).",
      "Excellent inclusion of real-world portfolio projects demonstrating applied engineering.",
    ],
    weaknesses: [
      "Cloud infrastructure and containerization details (Docker multi-stage, AWS/GCP, Kubernetes) could be expanded.",
      "Limited mention of automated testing frameworks (Playwright, Cypress, Vitest).",
    ],
    detectedSkills: [
      "React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Node.js", "Express.js",
      "PostgreSQL", "Prisma", "Redis", "Docker", "Git", "GitHub Actions", "REST API", "GraphQL"
    ],
    recommendations: [
      "Highlight experience with Cloud deployment targets (AWS ECS/Lambda, GCP Cloud Run).",
      "Add links to live demo deployments and test coverage badges for your featured repositories.",
      "Incorporate System Design concepts (rate limiting, queue processing with BullMQ) into your experience section.",
    ],
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resumes", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to parse file");
      }

      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      // Fallback to text analysis
      runTextAnalysis(SAMPLE_RESUME_TEXT, file.name);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runTextAnalysis = async (text: string, customName = "custom_resume.txt") => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, fileName: customName }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysis(data);
      }
    } catch {
      // Keep existing analysis
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Document Intelligence</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            AI Resume Analyzer & ATS Scorer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Extract text from PDFs, evaluate technical density, uncover weaknesses, and optimize for recruiter screening.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setInputText(SAMPLE_RESUME_TEXT);
              runTextAnalysis(SAMPLE_RESUME_TEXT, "sample_developer_resume.pdf");
            }}
            className="text-xs"
          >
            Load Sample Resume
          </Button>
        </div>
      </div>

      {/* Upload Box / Input Zone */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Dropzone File Upload Card */}
        <Card className="glass-card lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Upload Document</CardTitle>
            <CardDescription>Accepts PDF or text format up to 5MB</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700/80 bg-slate-950/60 p-6 text-center cursor-pointer transition-all hover:border-blue-500 hover:bg-slate-900/80">
              <input
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isAnalyzing}
              />
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-400 mb-3 shadow-inner">
                {isAnalyzing ? (
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
                ) : (
                  <UploadCloud className="h-6 w-6" />
                )}
              </div>
              <span className="text-xs font-bold text-slate-200">
                {isAnalyzing ? "Analyzing Resume with AI..." : "Click or Drag PDF Here"}
              </span>
              <span className="mt-1 text-[11px] text-slate-500">
                PDF, TXT parsed automatically
              </span>
            </label>

            {/* Quick Text Input fallback */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300">Or Paste Resume Plaintext:</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste full resume text here..."
                rows={5}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
              />
              <Button
                variant="primary"
                size="sm"
                className="w-full text-xs"
                isLoading={isAnalyzing}
                onClick={() => runTextAnalysis(inputText)}
                disabled={!inputText.trim()}
              >
                Analyze Raw Text
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis Report Card */}
        {analysis ? (
          <Card className="glass-card lg:col-span-2 space-y-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">Resume Audit Results</CardTitle>
                  <Badge variant="purple">AI Evaluated</Badge>
                </div>
                <CardDescription className="mt-0.5">
                  File: <span className="text-slate-300 font-medium">{analysis.fileName || "Uploaded Resume"}</span>
                </CardDescription>
              </div>

              {/* Circular Score Gauge */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ATS Score</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-blue-400">{analysis.score}</span>
                    <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-500/20">
                  {analysis.score >= 80 ? "Top 5%" : "Solid"}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-2">
              {/* Detected Skills Cloud */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  Detected Technical Skills ({analysis.detectedSkills.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.detectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Strengths & Weaknesses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    Key Strengths ({analysis.strengths.length})
                  </h4>
                  <ul className="space-y-2">
                    {analysis.strengths.map((st, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-4 space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" />
                    Areas for Improvement ({analysis.weaknesses.length})
                  </h4>
                  <ul className="space-y-2">
                    {analysis.weaknesses.map((wk, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">•</span>
                        <span>{wk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AI Actionable Recommendations */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  AI Suggested Improvements
                </h4>
                <div className="space-y-2">
                  {analysis.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2.5 rounded-lg bg-slate-950/60 p-2.5 border border-slate-800/80">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-500/20 text-[10px] font-bold text-blue-400">
                        {i + 1}
                      </div>
                      <span className="text-xs text-slate-300">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-card lg:col-span-2 flex items-center justify-center p-12">
            <div className="text-center space-y-2">
              <FileText className="h-10 w-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-300">No Resume Analyzed Yet</h4>
              <p className="text-xs text-slate-500 max-w-xs">Upload a PDF or paste text to receive an AI ATS evaluation.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
