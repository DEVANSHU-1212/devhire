"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { INITIAL_SKILLS } from "@/lib/mock-data";
import { generateSkillGap } from "@/lib/job-matcher";
import { RoadmapMilestone } from "@/lib/types";

export default function SkillGapPage() {
  const [selectedRole, setSelectedRole] = useState("Full Stack Developer");
  const [skillGap, setSkillGap] = useState(() => generateSkillGap("Full Stack Developer", INITIAL_SKILLS));
  const [milestones, setMilestones] = useState<RoadmapMilestone[]>(skillGap.milestones);
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>("m-1");

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    const newGap = generateSkillGap(role, INITIAL_SKILLS);
    setSkillGap(newGap);
    setMilestones(newGap.milestones);
  };

  const toggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPercent = Math.round((completedCount / Math.max(milestones.length, 1)) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-2">
            <Compass className="h-3.5 w-3.5" />
            <span>Target Role Intelligence</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Skill Gap Engine & Learning Roadmap
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Analyze delta between your verified skills and high-paying target roles, with curated milestone roadmaps.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          {["Full Stack Developer", "Frontend Engineer", "Backend / Systems Engineer", "AI / ML Application Engineer"].map(
            (role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedRole === role
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {role}
              </button>
            )
          )}
        </div>
      </div>

      {/* Overview Readiness & Skill Delta Summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Role Readiness Score */}
        <Card className="glass-card lg:col-span-1 space-y-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Readiness Score</CardTitle>
            <CardDescription>Evaluated for {selectedRole}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-extrabold text-blue-400">{skillGap.readinessScore}%</span>
              <Badge variant={skillGap.readinessScore >= 75 ? "success" : "warning"}>
                {skillGap.readinessScore >= 75 ? "Interview Ready" : "Skill Gap Identified"}
              </Badge>
            </div>
            <ProgressBar value={skillGap.readinessScore} indicatorClassName="bg-blue-500" />

            <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Matched Core Skills:</span>
                <span className="font-semibold text-emerald-400">{skillGap.matchedSkills.length}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Missing Key Skills:</span>
                <span className="font-semibold text-amber-400">{skillGap.missingSkills.length}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Roadmap Progress:</span>
                <span className="font-semibold text-blue-400">{progressPercent}%</span>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/coding">
                <Button variant="gradient" size="sm" className="w-full text-xs gap-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Practice Target Coding Problems</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Prioritized Missing Skills Matrix */}
        <Card className="glass-card lg:col-span-2 space-y-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Prioritized Skill Gap Matrix</CardTitle>
            <CardDescription>Ranked by market hiring demand for this archetype</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skillGap.missingSkills.map((gap, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-200">{gap.name}</span>
                    <p className="text-[10px] text-slate-400">{gap.category} • ~{gap.estimatedWeeks} week learning time</p>
                  </div>
                  <Badge
                    variant={gap.priority === "High" ? "danger" : gap.priority === "Medium" ? "warning" : "default"}
                  >
                    {gap.priority} Priority
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Milestone Learning Roadmap */}
      <Card className="glass-card space-y-4">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <CardTitle className="text-lg">Dynamic Action Roadmap</CardTitle>
            <CardDescription>Step-by-step verified curriculum with hands-on documentation & projects</CardDescription>
          </div>
          <Badge variant="purple">{completedCount} of {milestones.length} Milestones Done</Badge>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          {milestones.map((m) => {
            const isExpanded = expandedMilestone === m.id;
            return (
              <div
                key={m.id}
                className={`rounded-2xl border transition-all ${
                  m.completed
                    ? "border-emerald-500/30 bg-emerald-950/10"
                    : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                }`}
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => setExpandedMilestone(isExpanded ? null : m.id)}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMilestone(m.id);
                      }}
                      className="text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      {m.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-600" />
                      )}
                    </button>
                    <div>
                      <h4
                        className={`text-sm font-bold ${
                          m.completed ? "text-emerald-300 line-through" : "text-slate-100"
                        }`}
                      >
                        {m.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{m.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{m.category}</Badge>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details & Resources */}
                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-slate-800/60 space-y-3 mt-2">
                    <h5 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-blue-400" /> Curated Resources & Practice
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {m.resources.map((res, idx) => (
                        <a
                          key={idx}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between rounded-xl bg-slate-950/70 p-2.5 border border-slate-800/80 hover:border-blue-500/40 transition-colors group"
                        >
                          <span className="text-xs text-slate-300 group-hover:text-blue-400 font-medium">
                            {res.title}
                          </span>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-blue-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
