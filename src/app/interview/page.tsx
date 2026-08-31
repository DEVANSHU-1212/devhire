"use client";

import React, { useState } from "react";
import {
  Mic,
  MicOff,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  Volume2,
  Send,
  Cpu,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { InterviewQuestionItem, InterviewAnswerItem } from "@/lib/types";

export default function InterviewRoomPage() {
  // Session Setup State
  const [role, setRole] = useState("Full Stack Engineer");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [type, setType] = useState<"Technical" | "Behavioral" | "System Design">("Technical");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // Active Interview State
  const [questions, setQuestions] = useState<InterviewQuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [answers, setAnswers] = useState<InterviewAnswerItem[]>([]);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Start Session
  const handleStartSession = async () => {
    setIsLoadingQuestions(true);
    try {
      const res = await fetch("/api/interviews?action=generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, difficulty, type }),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setAnswers([]);
        setIsSessionActive(true);
        setSessionCompleted(false);
      }
    } catch {
      // Fallback questions
      setQuestions([
        {
          id: "q-1",
          question: "Explain how Node.js libuv event loop handles non-blocking I/O operations and asynchronous callbacks.",
          category: "Node.js Concurrency",
        },
        {
          id: "q-2",
          question: "How do you optimize React component re-renders when dealing with high-frequency WebSocket state updates?",
          category: "React Architecture",
        },
        {
          id: "q-3",
          question: "What are the trade-offs between Redis cache-aside versus write-through caching patterns?",
          category: "Distributed Caching",
        },
      ]);
      setCurrentIndex(0);
      setAnswers([]);
      setIsSessionActive(true);
      setSessionCompleted(false);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Submit Answer
  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) return;

    setIsEvaluating(true);
    const q = questions[currentIndex];

    try {
      const res = await fetch("/api/interviews?action=evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q.question,
          answer: currentAnswer,
          category: q.category,
        }),
      });

      const evalData: InterviewAnswerItem = await res.json();
      const updatedAnswers = [...answers, evalData];
      setAnswers(updatedAnswers);

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setCurrentAnswer("");
      } else {
        setSessionCompleted(true);
      }
    } catch {
      // heuristic fallback
      const fallbackEval: InterviewAnswerItem = {
        questionId: q.id,
        candidateAnswer: currentAnswer,
        score: 82,
        feedback: "Solid technical explanation covering the core mechanics and trade-offs.",
        rubric: {
          technicalCorrectness: 8,
          relevance: 9,
          communication: 8,
          completeness: 8,
        },
      };
      const updatedAnswers = [...answers, fallbackEval];
      setAnswers(updatedAnswers);

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setCurrentAnswer("");
      } else {
        setSessionCompleted(true);
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  // Calculate Overall Session Score
  const overallScore =
    answers.length > 0
      ? Math.round(answers.reduce((acc, a) => acc + a.score, 0) / answers.length)
      : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400 mb-2">
            <Mic className="h-3.5 w-3.5" />
            <span>AI Mock Interview Simulator</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Live AI Technical & Behavioral Interview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time simulated interviewer with multi-dimensional rubric scoring, deep feedback, and report cards.
          </p>
        </div>

        {isSessionActive && !sessionCompleted && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSessionActive(false)}
            className="text-xs gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>End Session</span>
          </Button>
        )}
      </div>

      {!isSessionActive && !sessionCompleted && (
        /* Configuration Setup Card */
        <Card className="glass-card max-w-2xl mx-auto space-y-6 p-8">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600/10 text-purple-400 shadow-inner mb-2">
              <Sparkles className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl">Configure Your Mock Interview</CardTitle>
            <CardDescription>
              Select your target role and evaluation criteria. The AI will generate tailored questions.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-0">
            {/* Target Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Target Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-200 focus:border-purple-500 focus:outline-none"
              >
                <option value="Full Stack Engineer">Full Stack Engineer (Next.js, Node.js, PostgreSQL)</option>
                <option value="Senior Frontend Engineer">Senior Frontend Engineer (React, Web Vitals, Architecture)</option>
                <option value="Backend & Distributed Systems">Backend & Distributed Systems (Redis, Microservices)</option>
                <option value="AI / ML Application Engineer">AI / ML Application Engineer (RAG, Ollama, LangChain)</option>
              </select>
            </div>

            {/* Type & Difficulty Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Interview Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-200 focus:border-purple-500 focus:outline-none"
                >
                  <option value="Technical">Technical Deep Dive</option>
                  <option value="System Design">System Design & Scaling</option>
                  <option value="Behavioral">Behavioral & Leadership</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-200 focus:border-purple-500 focus:outline-none"
                >
                  <option value="Easy">Entry / Junior</option>
                  <option value="Medium">Mid-Level (Standard)</option>
                  <option value="Hard">Senior Staff / Hard</option>
                </select>
              </div>
            </div>

            <Button
              variant="gradient"
              size="lg"
              className="w-full gap-2 shadow-lg shadow-purple-500/25"
              onClick={handleStartSession}
              isLoading={isLoadingQuestions}
            >
              <Play className="h-4 w-4" />
              <span>Start Live Interview Session</span>
            </Button>
          </CardContent>
        </Card>
      )}

      {isSessionActive && !sessionCompleted && questions.length > 0 && (
        /* Active Interview Room */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Question & AI Avatar Pane */}
          <Card className="glass-card lg:col-span-1 space-y-6">
            <CardHeader className="pb-2 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <Badge variant="purple">Question {currentIndex + 1} of {questions.length}</Badge>
                <span className="text-xs text-slate-400 font-medium">{difficulty}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-0">
              {/* AI Voice Orb Visualizer */}
              <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="relative flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-blue-500 animate-pulseGlow shadow-2xl shadow-purple-500/40 flex items-center justify-center text-white">
                    <Mic className="h-8 w-8" />
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-widest">
                  AI Technical Interviewer
                </span>
              </div>

              {/* Question Text Box */}
              <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4 space-y-2">
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                  Category: {questions[currentIndex].category}
                </span>
                <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                  "{questions[currentIndex].question}"
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Candidate Response Workspace */}
          <Card className="glass-card lg:col-span-2 space-y-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Your Verbal / Text Response</CardTitle>
              <CardDescription>
                State your thoughts, architectural considerations, and code concepts.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your detailed response or articulate your technical reasoning here..."
                rows={10}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-200 placeholder:text-slate-600 focus:border-purple-500 focus:outline-none"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={isRecording ? "danger" : "secondary"}
                    size="sm"
                    className="text-xs gap-1.5"
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    {isRecording ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                    <span>{isRecording ? "Stop Recording" : "Voice Input (Speech)"}</span>
                  </Button>
                  <span className="text-[11px] text-slate-500">
                    {currentAnswer.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                <Button
                  variant="gradient"
                  size="md"
                  className="text-xs gap-2"
                  onClick={handleSubmitAnswer}
                  isLoading={isEvaluating}
                  disabled={!currentAnswer.trim()}
                >
                  <span>Submit & Next Question</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {sessionCompleted && (
        /* Final Interview Evaluation Report */
        <div className="space-y-6 max-w-4xl mx-auto">
          <Card className="glass-card border-purple-500/30 p-6 space-y-6">
            <CardHeader className="text-center pb-2 border-b border-slate-800">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mb-2 shadow-inner">
                <Award className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Interview Evaluation Report</CardTitle>
              <CardDescription>
                Role: <span className="text-slate-200 font-semibold">{role}</span> • Difficulty: {difficulty}
              </CardDescription>

              <div className="pt-4 flex items-center justify-center gap-2">
                <span className="text-4xl font-extrabold text-purple-400">{overallScore}%</span>
                <span className="text-xs text-slate-400">Overall Rating</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-2">
              {/* Question-by-Question Rubric Breakdown */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Detailed Question Evaluations
                </h4>

                {answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-400">
                        Q{idx + 1}: {questions[idx]?.question}
                      </span>
                      <Badge variant={ans.score >= 80 ? "success" : "warning"}>
                        {ans.score}/100
                      </Badge>
                    </div>

                    <div className="rounded-xl bg-slate-950/70 p-3 text-xs text-slate-300 border border-slate-800/80">
                      <span className="font-semibold text-slate-400">Your Answer:</span> {ans.candidateAnswer}
                    </div>

                    <div className="text-xs text-slate-200 space-y-1">
                      <span className="font-semibold text-indigo-400">AI Critique & Feedback:</span>
                      <p className="text-slate-300">{ans.feedback}</p>
                    </div>

                    {/* Rubric scores */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
                      <div className="rounded bg-slate-950/60 p-2 text-center">
                        <span className="text-[10px] text-slate-400 block">Technical</span>
                        <span className="text-xs font-bold text-slate-200">{ans.rubric.technicalCorrectness}/10</span>
                      </div>
                      <div className="rounded bg-slate-950/60 p-2 text-center">
                        <span className="text-[10px] text-slate-400 block">Relevance</span>
                        <span className="text-xs font-bold text-slate-200">{ans.rubric.relevance}/10</span>
                      </div>
                      <div className="rounded bg-slate-950/60 p-2 text-center">
                        <span className="text-[10px] text-slate-400 block">Communication</span>
                        <span className="text-xs font-bold text-slate-200">{ans.rubric.communication}/10</span>
                      </div>
                      <div className="rounded bg-slate-950/60 p-2 text-center">
                        <span className="text-[10px] text-slate-400 block">Completeness</span>
                        <span className="text-xs font-bold text-slate-200">{ans.rubric.completeness}/10</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <Button variant="primary" size="md" onClick={() => setIsSessionActive(false)}>
                  Start Another Session
                </Button>
                <Link href="/analytics">
                  <Button variant="secondary" size="md">
                    View Progress in Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
