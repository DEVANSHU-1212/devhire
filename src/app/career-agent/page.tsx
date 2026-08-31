"use client";

import React, { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Zap,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestedActions?: string[];
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    role: "assistant",
    content: `Hello Alex! I am your **DevHire AI Principal Career Advisor**.

I have reviewed your current profile:
- **Target Role**: Full Stack AI Engineer
- **ATS Resume Score**: 84 / 100
- **Verified Strengths**: React, Next.js, TypeScript, Node.js, PostgreSQL
- **High-Impact Growth Gaps**: Docker Multi-stage Builds, Redis Caching Queues, System Design

How can I help you accelerate your technical job search today?`,
    suggestedActions: [
      "How to frame my Redis caching project in interviews?",
      "What system design questions are asked for Full Stack AI roles?",
      "Review my next actions to hit 90+ ATS score",
    ],
    timestamp: "12:00 PM",
  },
];

export default function CareerAgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/career-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend,
          context: {
            targetRole: "Full Stack AI Engineer",
            skills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
            resumeScore: 84,
            missingSkills: ["Docker", "Redis", "System Design"],
          },
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I analyzed your request based on industry market data and role benchmarks.",
        suggestedActions: data.suggestedActions || [
          "Practice an AI mock interview",
          "Solve a medium algorithmic problem",
          "Update your resume with quantifiable metrics",
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `### Strategic Recommendations

1. **Highlight Distributed Systems**: When explaining your background, emphasize **data flow, caching layers (Redis), and async job queues**.
2. **Quantify Results**: Top tier companies value measurable impact over feature lists (e.g. *reduced P99 latency by 45ms*).
3. **Behavioral STAR Framing**: Frame technical disagreements around benchmarking and business objectives.`,
        suggestedActions: [
          "Launch System Design Mock Interview",
          "Practice Two Sum & LRU Cache in Sandbox",
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 mb-2">
            <Bot className="h-3.5 w-3.5" />
            <span>RAG-Grounded Career Intelligence</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            AI Senior Career Agent
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Grounded in your resume, skill gaps, interview transcripts, and target role hiring rubrics.
          </p>
        </div>

        {/* Candidate Context Pill */}
        <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>Context: <strong>Full Stack AI (84% ATS)</strong></span>
        </div>
      </div>

      {/* Chat Workspace Card */}
      <Card className="glass-card flex flex-col h-[650px] p-0 overflow-hidden border-slate-800">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/20"
                    : "bg-slate-900/90 text-slate-200 border border-slate-800/90 rounded-bl-none"
                }`}
              >
                <div className="whitespace-pre-line prose prose-invert prose-xs">
                  {msg.content}
                </div>

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="pt-3 border-t border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                      Recommended Next Actions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(action)}
                          className="rounded-lg bg-slate-950/80 hover:bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 border border-slate-700/80 transition-colors flex items-center gap-1"
                        >
                          <Sparkles className="h-3 w-3 text-indigo-400" />
                          <span>{action}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <span className="text-[9px] text-slate-500 block text-right mt-1">
                  {msg.timestamp}
                </span>
              </div>

              {msg.role === "user" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-200">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
                <RefreshCw className="h-4 w-4 animate-spin" />
              </div>
              <span>AI Advisor is synthesizing recommendations...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask about interview strategies, resume keywords, salary negotiation..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            className="flex-1 h-11 rounded-xl border border-slate-800 bg-slate-900 px-4 text-xs text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
          />
          <Button
            variant="gradient"
            size="md"
            onClick={() => handleSendMessage()}
            isLoading={isLoading}
            disabled={!inputQuery.trim()}
            className="h-11 px-5 gap-2 text-xs"
          >
            <span>Send</span>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
