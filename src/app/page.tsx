"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  FileText,
  Mic,
  Code2,
  Briefcase,
  Bot,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Compass,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { SAMPLE_JOBS, CODING_PROBLEMS } from "@/lib/mock-data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const READINESS_DATA = [
  { week: "W1", score: 45, interviews: 50 },
  { week: "W2", score: 58, interviews: 62 },
  { week: "W3", score: 67, interviews: 70 },
  { week: "W4", score: 74, interviews: 78 },
  { week: "W5", score: 81, interviews: 82 },
  { week: "W6", score: 88, interviews: 86 },
];

const SKILL_RADAR_DATA = [
  { subject: "Frontend (React/Next)", A: 92, fullMark: 100 },
  { subject: "Backend (Node/Express)", A: 85, fullMark: 100 },
  { subject: "Databases (SQL/Redis)", A: 78, fullMark: 100 },
  { subject: "Cloud & Docker", A: 68, fullMark: 100 },
  { subject: "Algorithms & DSA", A: 82, fullMark: 100 },
  { subject: "System Design", A: 75, fullMark: 100 },
];

export default function DashboardPage() {
  const [targetRole] = useState("Full Stack AI Engineer");

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-950/70 via-indigo-950/50 to-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-blue-400" />
              <span>Target Role: {targetRole}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Welcome back, <span className="gradient-text">Alex!</span>
            </h1>
            <p className="text-sm text-slate-300">
              Your overall candidate readiness is at <span className="font-bold text-emerald-400">86%</span>.
              You are ready for mid/senior technical screenings. 2 high-match jobs added today!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/resume">
              <Button variant="primary" size="md" className="gap-2">
                <FileText className="h-4 w-4" />
                <span>Upload New Resume</span>
              </Button>
            </Link>
            <Link href="/interview">
              <Button variant="secondary" size="md" className="gap-2">
                <Mic className="h-4 w-4" />
                <span>Launch Mock Interview</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <Card className="glass-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">AI Resume Score</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-100">84</span>
              <span className="text-xs text-slate-400">/ 100</span>
              <span className="ml-auto text-[11px] font-semibold text-emerald-400 flex items-center">
                +12% <TrendingUp className="h-3 w-3 ml-0.5" />
              </span>
            </div>
            <div className="mt-3">
              <ProgressBar value={84} indicatorClassName="bg-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="glass-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Interview Rating</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <Mic className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-100">88%</span>
              <span className="ml-auto text-[11px] font-semibold text-purple-400">
                4 Sessions Completed
              </span>
            </div>
            <div className="mt-3">
              <ProgressBar value={88} indicatorClassName="bg-purple-500" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="glass-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Coding Challenges</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <Code2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-100">14 / 18</span>
              <span className="ml-auto text-[11px] font-semibold text-emerald-400">
                78% Pass Rate
              </span>
            </div>
            <div className="mt-3">
              <ProgressBar value={78} indicatorClassName="bg-emerald-500" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="glass-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Active Applications</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <Briefcase className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-100">6 Roles</span>
              <span className="ml-auto text-[11px] font-semibold text-amber-400">
                2 Next Round
              </span>
            </div>
            <div className="mt-3">
              <ProgressBar value={65} indicatorClassName="bg-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts & Visualizations Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Readiness Progression Curve */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Skill & Interview Growth Velocity</CardTitle>
              <CardDescription>6-week trajectory across technical & behavioral evaluations</CardDescription>
            </div>
            <Badge variant="purple">Velocity +32%</Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={READINESS_DATA}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.5rem",
                      color: "#f8fafc",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    name="Resume & Skills"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                  <Area
                    type="monotone"
                    dataKey="interviews"
                    name="Mock Interview Avg"
                    stroke="#a855f7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorInterviews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Skill Proficiency Radar */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Skill Domain Mastery</CardTitle>
            <CardDescription>Evaluated vs Senior Staff benchmarks</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[240px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={SKILL_RADAR_DATA}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                  <PolarRadiusAxis stroke="#475569" angle={30} domain={[0, 100]} />
                  <Radar
                    name="Proficiency"
                    dataKey="A"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Jobs & Quick Problem Challenge */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Matched Opportunities */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Top Matching Positions</CardTitle>
              <CardDescription>Tailored to your verified technical skill stack</CardDescription>
            </div>
            <Link href="/jobs" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center">
              View All <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {SAMPLE_JOBS.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 transition-colors hover:border-slate-700"
              >
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-100">{job.title}</h4>
                  <p className="text-[11px] text-slate-400">{job.company} • {job.location}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {job.requiredSkills.slice(0, 3).map((s) => (
                      <span key={s} className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="success" size="sm">
                    92% Match
                  </Badge>
                  <Link href="/jobs">
                    <Button variant="outline" size="sm" className="h-7 text-[11px] px-2.5">
                      Apply
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Daily Coding Problem & AI Mentor Assistant */}
        <div className="space-y-6">
          {/* Daily Problem Card */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Daily Coding Challenge</CardTitle>
                <CardDescription>Sharpen your algorithmic problem solving</CardDescription>
              </div>
              <Badge variant="warning">{CODING_PROBLEMS[0].difficulty}</Badge>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="rounded-xl bg-slate-950/60 p-3.5 border border-slate-800/80">
                <h4 className="text-xs font-bold text-slate-200">{CODING_PROBLEMS[0].title}</h4>
                <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                  {CODING_PROBLEMS[0].description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Est. 15 mins
                  </span>
                  <Link href="/coding">
                    <Button variant="primary" size="sm" className="h-7 text-[11px]">
                      Open Editor
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Mentor Callout */}
          <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 to-purple-950/60 p-4 backdrop-blur-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">Need personalized career advice?</h4>
                <p className="text-[11px] text-slate-300">Ask the RAG-grounded AI Career Advisor anytime.</p>
              </div>
            </div>
            <Link href="/career-agent">
              <Button variant="gradient" size="sm" className="text-xs shrink-0">
                Ask Agent
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
