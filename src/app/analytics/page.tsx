"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Briefcase,
  FileText,
  Mic,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RESUME_PROGRESSION_DATA = [
  { attempt: "v1.0 (Initial)", score: 52 },
  { attempt: "v1.1 (+Skills)", score: 64 },
  { attempt: "v1.2 (+Projects)", score: 72 },
  { attempt: "v1.3 (+Metrics)", score: 79 },
  { attempt: "v1.4 (Current)", score: 84 },
];

const INTERVIEW_RUBRIC_DATA = [
  { session: "Session 1 (Node.js)", technical: 7.5, communication: 7.0, completeness: 6.5, relevance: 8.0 },
  { session: "Session 2 (React/Next)", technical: 8.5, communication: 8.0, completeness: 8.0, relevance: 8.5 },
  { session: "Session 3 (Sys Design)", technical: 7.0, communication: 8.5, completeness: 7.5, relevance: 7.5 },
  { session: "Session 4 (Full Stack)", technical: 9.0, communication: 8.5, completeness: 8.5, relevance: 9.0 },
];

const APPLICATION_FUNNEL_DATA = [
  { name: "Applied", value: 14, color: "#3b82f6" },
  { name: "OA Link", value: 8, color: "#f59e0b" },
  { name: "Interview", value: 4, color: "#a855f7" },
  { name: "Offer", value: 2, color: "#10b981" },
];

const SKILL_DOMAIN_DATA = [
  { subject: "React & Next.js", score: 92 },
  { subject: "Node & Express", score: 85 },
  { subject: "PostgreSQL & Prisma", score: 80 },
  { subject: "Redis & Caching", score: 75 },
  { subject: "Docker & CI/CD", score: 68 },
  { subject: "System Design", score: 74 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-2">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Quantitative Career Metrics</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Candidate Analytics & Performance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Data-driven tracking of your ATS resume scores, mock interview rubrics, and application conversion funnel.
          </p>
        </div>
      </div>

      {/* Top Analytics KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardContent className="p-5">
            <span className="text-xs font-medium text-slate-400">Current ATS Score</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-blue-400">84 / 100</span>
              <Badge variant="success">+32 pts</Badge>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Top 5% candidate percentile</span>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-5">
            <span className="text-xs font-medium text-slate-400">Avg Interview Rating</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-purple-400">8.2 / 10</span>
              <Badge variant="purple">4 Completed</Badge>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Technical + Behavioral</span>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-5">
            <span className="text-xs font-medium text-slate-400">Interview Conversion</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-400">28.5%</span>
              <Badge variant="success">High</Badge>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Industry benchmark ~12%</span>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-5">
            <span className="text-xs font-medium text-slate-400">Coding Pass Rate</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-400">78%</span>
              <Badge variant="warning">14/18 Solved</Badge>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Medium/Hard algorithms</span>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Resume ATS Score Over Time */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Resume ATS Score Progression</CardTitle>
            <CardDescription>Quantifying impact of added projects, keywords, and metrics</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={RESUME_PROGRESSION_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="attempt" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[40, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#60a5fa", r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Interview Rubric Multi-Bar */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Mock Interview Rubric Trends</CardTitle>
            <CardDescription>Multi-criteria scoring across 4 recent sessions</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={INTERVIEW_RUBRIC_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="session" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="technical" fill="#3b82f6" name="Technical" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="communication" fill="#a855f7" name="Communication" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completeness" fill="#10b981" name="Completeness" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Application Funnel Breakdown */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Application Conversion Funnel</CardTitle>
            <CardDescription>Pipeline stages from initial application to offer</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="h-[220px] w-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={APPLICATION_FUNNEL_DATA}
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {APPLICATION_FUNNEL_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 space-y-2.5 w-full">
              {APPLICATION_FUNNEL_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-100">{item.value} roles</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skill Domain Radar */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Verified Skill Mastery</CardTitle>
            <CardDescription>Benchmarked against Senior Staff criteria</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[220px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={SKILL_DOMAIN_DATA}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                  <PolarRadiusAxis stroke="#475569" angle={30} domain={[0, 100]} />
                  <Radar name="Score" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
