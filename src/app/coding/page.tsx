"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  Code2,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  Terminal,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CODING_PROBLEMS } from "@/lib/mock-data";
import { CodingProblem, CodingSubmissionResult } from "@/lib/types";
import confetti from "canvas-confetti";

// Dynamically load Monaco Editor without SSR
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function CodingInterviewPage() {
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem>(CODING_PROBLEMS[0]);
  const [code, setCode] = useState(selectedProblem.starterCode.javascript);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"testcases" | "console">("testcases");
  const [result, setResult] = useState<CodingSubmissionResult | null>(null);

  const handleSelectProblem = (p: CodingProblem) => {
    setSelectedProblem(p);
    setCode(p.starterCode.javascript);
    setResult(null);
  };

  const handleResetCode = () => {
    setCode(selectedProblem.starterCode.javascript);
    setResult(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const res = await fetch("/api/coding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: selectedProblem.id,
          code,
          language: "javascript",
        }),
      });

      const data: CodingSubmissionResult = await res.json();
      setResult(data);

      if (data.status === "Passed") {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } catch {
      // Fallback
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-2">
            <Code2 className="h-3.5 w-3.5" />
            <span>Monaco Coding Sandbox</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Live Coding Interview Room
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Solve algorithmic and system problems in Monaco Editor with sandboxed execution and test assertions.
          </p>
        </div>

        {/* Problem Selector Bar */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          {CODING_PROBLEMS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectProblem(p)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedProblem.id === p.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {p.title.split(".")[1] || p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Problem Split Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Problem Description Pane */}
        <Card className="glass-card lg:col-span-5 flex flex-col justify-between max-h-[720px] overflow-y-auto space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100">{selectedProblem.title}</h3>
                <span className="text-[11px] text-slate-400">{selectedProblem.category}</span>
              </div>
              <Badge
                variant={
                  selectedProblem.difficulty === "Easy"
                    ? "success"
                    : selectedProblem.difficulty === "Medium"
                    ? "warning"
                    : "danger"
                }
              >
                {selectedProblem.difficulty}
              </Badge>
            </div>

            {/* Problem Description Body */}
            <div className="prose prose-invert prose-xs text-xs text-slate-300 space-y-3 leading-relaxed">
              <p className="whitespace-pre-line">{selectedProblem.description}</p>
            </div>

            {/* Examples */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Examples:</h4>
              {selectedProblem.examples.map((ex, i) => (
                <div key={i} className="rounded-xl bg-slate-950/80 p-3 border border-slate-800/80 space-y-1 font-mono text-[11px]">
                  <p className="text-slate-300"><span className="text-blue-400 font-bold">Input:</span> {ex.input}</p>
                  <p className="text-slate-300"><span className="text-emerald-400 font-bold">Output:</span> {ex.output}</p>
                  {ex.explanation && (
                    <p className="text-slate-500 text-[10px]"><span className="text-slate-400">Explanation:</span> {ex.explanation}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Constraints:</h4>
              <ul className="list-disc pl-4 space-y-1 text-xs text-slate-400">
                {selectedProblem.constraints.map((c, i) => (
                  <li key={i} className="font-mono text-[11px]">{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Right Monaco Editor & Results Workspace */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Monaco Editor Container */}
          <Card className="glass-card flex-1 flex flex-col p-0 overflow-hidden border-slate-800">
            {/* Editor Action Bar */}
            <div className="flex items-center justify-between bg-slate-950 px-4 py-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300">JavaScript (Node.js)</span>
                <span className="text-[10px] text-slate-500">• Sandboxed V8</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleResetCode} className="h-7 text-xs gap-1 text-slate-400">
                  <RotateCcw className="h-3 w-3" /> Reset
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={handleRunCode}
                  isLoading={isRunning}
                  className="h-7 text-xs gap-1.5 shadow-sm"
                >
                  <Play className="h-3 w-3" /> Run & Test
                </Button>
              </div>
            </div>

            {/* Monaco Code Editor */}
            <div className="h-[420px] w-full bg-[#1e1e1e]">
              <MonacoEditor
                height="100%"
                language="javascript"
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                }}
              />
            </div>
          </Card>

          {/* Test Results & Console Drawer */}
          <Card className="glass-card p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("testcases")}
                  className={`flex items-center gap-1.5 pb-1 border-b-2 transition-colors ${
                    activeTab === "testcases"
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Test Cases</span>
                </button>
                <button
                  onClick={() => setActiveTab("console")}
                  className={`flex items-center gap-1.5 pb-1 border-b-2 transition-colors ${
                    activeTab === "console"
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Console Logs</span>
                </button>
              </div>

              {result && (
                <div className="flex items-center gap-2">
                  <Badge variant={result.status === "Passed" ? "success" : "danger"}>
                    {result.status} ({result.passedTests}/{result.totalTests} passed)
                  </Badge>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {result.executionTimeMs}ms
                  </span>
                </div>
              )}
            </div>

            {/* Test Details List */}
            {activeTab === "testcases" && (
              <div className="space-y-2">
                {result ? (
                  result.testDetails.map((td) => (
                    <div
                      key={td.testIndex}
                      className={`flex items-center justify-between rounded-xl p-2.5 border text-xs font-mono ${
                        td.passed
                          ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-300"
                          : "bg-rose-950/20 border-rose-500/20 text-rose-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {td.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-400" />
                        )}
                        <span>Case {td.testIndex}: Input = {td.input}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px]">
                        <span>Expected: {td.expected}</span>
                        <span>Actual: {td.actual}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-3 text-center font-mono">
                    Click "Run & Test" to execute your solution in the sandbox.
                  </p>
                )}
              </div>
            )}

            {/* Console Output Tab */}
            {activeTab === "console" && (
              <div className="rounded-xl bg-slate-950/90 p-3 font-mono text-xs text-slate-300 min-h-[80px] border border-slate-800">
                {result?.output ? (
                  <pre className="whitespace-pre-wrap">{result.output}</pre>
                ) : (
                  <span className="text-slate-600">Standard output is empty.</span>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
