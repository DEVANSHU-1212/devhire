"use client";

import React, { useState, useEffect } from "react";
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
  TrendingUp,
  DollarSign,
  Award,
  Code,
  FolderGit2,
  Copy,
  Check,
  Bot,
  RotateCcw,
  Plus,
  X,
  FileText,
  Flame,
  HelpCircle,
  Play,
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from "recharts";
import confetti from "canvas-confetti";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import { INITIAL_SKILLS } from "@/lib/mock-data";
import { generateSkillGap } from "@/lib/job-matcher";
import {
  RoadmapMilestone,
  SeniorityLevel,
  ProjectBlueprint,
  SkillGapAnalysis,
} from "@/lib/types";

const ROLE_OPTIONS = [
  "Full Stack Developer",
  "Frontend Engineer",
  "Backend / Systems Engineer",
  "AI / ML Application Engineer",
  "Cloud / DevOps Platform Engineer",
];

const SENIORITY_OPTIONS: SeniorityLevel[] = [
  "Junior",
  "Mid-Level",
  "Senior",
  "Staff / Lead",
  "Principal",
];

export default function SkillGapPage() {
  const [selectedRole, setSelectedRole] = useState("Full Stack Developer");
  const [selectedSeniority, setSelectedSeniority] = useState<SeniorityLevel>("Mid-Level");
  const [candidateSkills, setCandidateSkills] = useState<string[]>(
    INITIAL_SKILLS.map((s) => s.name)
  );
  const [newSkillInput, setNewSkillInput] = useState("");
  const [activeGapFilter, setActiveGapFilter] = useState<"ALL" | "CORE" | "ACCELERATOR" | "BONUS">("ALL");

  const [skillGap, setSkillGap] = useState<SkillGapAnalysis>(() =>
    generateSkillGap("Full Stack Developer", INITIAL_SKILLS.map((s) => s.name), "Mid-Level")
  );
  const [milestones, setMilestones] = useState<RoadmapMilestone[]>(skillGap.milestones);
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>("m-1");
  const [projectBlueprint, setProjectBlueprint] = useState<ProjectBlueprint>(skillGap.suggestedProject);

  // AI Project Generation State
  const [isGeneratingProject, setIsGeneratingProject] = useState(false);
  const [blueprintCopied, setBlueprintCopied] = useState(false);
  const [activeProjectTab, setActiveProjectTab] = useState<"OVERVIEW" | "PHASES" | "TECH" | "PRD">("OVERVIEW");

  // AI Milestone Coach Modal State
  const [coachModalOpen, setCoachModalOpen] = useState(false);
  const [coachLoading, setCoachLoading] = useState(false);
  const [selectedCoachMilestone, setSelectedCoachMilestone] = useState<RoadmapMilestone | null>(null);
  const [coachResponse, setCoachResponse] = useState<{
    explanation: string;
    keyTakeaways: string[];
    sampleCode: string;
    exercise: string;
  } | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Recalculate gap when role, seniority, or skills change
  useEffect(() => {
    const newGap = generateSkillGap(selectedRole, candidateSkills, selectedSeniority);
    setSkillGap(newGap);
    setMilestones(newGap.milestones);
    setProjectBlueprint(newGap.suggestedProject);
  }, [selectedRole, selectedSeniority, candidateSkills]);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };

  const handleSeniorityChange = (seniority: SeniorityLevel) => {
    setSelectedSeniority(seniority);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    const trimmed = newSkillInput.trim();
    if (!candidateSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setCandidateSkills((prev) => [...prev, trimmed]);
    }
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCandidateSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleResetSkills = () => {
    setCandidateSkills(INITIAL_SKILLS.map((s) => s.name));
  };

  const toggleMilestone = (id: string) => {
    setMilestones((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m));
      const newlyCompleted = updated.find((m) => m.id === id)?.completed;
      if (newlyCompleted) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#3b82f6", "#10b981", "#a855f7", "#60a5fa"],
        });
      }
      return updated;
    });
  };

  // Generate Custom AI Project Blueprint
  const handleGenerateAIProject = async () => {
    setIsGeneratingProject(true);
    try {
      const res = await fetch("/api/skill-gap/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: selectedRole,
          seniority: selectedSeniority,
          missingSkills: skillGap.missingSkills.map((s) => s.name),
        }),
      });
      const data = await res.json();
      if (data.success && data.project) {
        setProjectBlueprint(data.project);
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
        });
      }
    } catch (err) {
      console.error("Failed to generate AI project:", err);
    } finally {
      setIsGeneratingProject(false);
    }
  };

  // Copy PRD / Blueprint Markdown
  const handleCopyPRD = () => {
    navigator.clipboard.writeText(projectBlueprint.prdMarkdown || projectBlueprint.architectureSummary);
    setBlueprintCopied(true);
    setTimeout(() => setBlueprintCopied(false), 2000);
  };

  // Open AI Milestone Coach
  const handleOpenCoach = async (milestone: RoadmapMilestone) => {
    setSelectedCoachMilestone(milestone);
    setCoachModalOpen(true);
    setCoachLoading(true);
    setCoachResponse(null);

    try {
      const res = await fetch("/api/skill-gap/explain-milestone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          milestoneTitle: milestone.title,
          category: milestone.category,
          context: `Target Role: ${selectedRole} (${selectedSeniority})`,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCoachResponse(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch coach response:", err);
    } finally {
      setCoachLoading(false);
    }
  };

  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPercent = Math.round((completedCount / Math.max(milestones.length, 1)) * 100);
  const earnedXP = completedCount * 150 + skillGap.matchedSkills.length * 25;

  const filteredMissingSkills = skillGap.missingSkills.filter((s) => {
    if (activeGapFilter === "CORE") return s.priority === "High";
    if (activeGapFilter === "ACCELERATOR") return s.priority === "Medium";
    if (activeGapFilter === "BONUS") return s.priority === "Low";
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 mb-2">
              <Compass className="h-3.5 w-3.5 animate-spin-slow" />
              <span>Day 4: Dynamic Skill Gap Engine & Project Roadmaps</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Skill Gap Matrix & Project Blueprints
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Benchmark your verified technical competencies against industry roles, estimate salary ROI, and generate custom portfolio project blueprints to bridge every gap.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-3">
            <Link href="/interview">
              <Button variant="outline" size="sm" className="text-xs gap-1.5 border-slate-700 hover:border-blue-500">
                <Bot className="h-3.5 w-3.5 text-blue-400" />
                <span>AI Mock Interview</span>
              </Button>
            </Link>
            <Link href="/coding">
              <Button variant="gradient" size="sm" className="text-xs gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                <span>Coding Sandbox</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Role Archetype & Seniority Selector Shell */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 space-y-4">
          {/* Target Role Selector */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
              1. Select Target Role Archetype
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {ROLE_OPTIONS.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                    selectedRole === role
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400"
                      : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Seniority Selector */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
              2. Target Seniority Level
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {SENIORITY_OPTIONS.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleSeniorityChange(lvl)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedSeniority === lvl
                      ? "bg-purple-600 text-white shadow-md shadow-purple-500/25 border border-purple-400"
                      : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Skill Sandbox: Add / Remove Skills Live */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5 text-blue-400" />
                <span>3. Your Active Skills Sandbox (Add/Remove to simulate readiness live)</span>
              </label>
              <button
                onClick={handleResetSkills}
                className="text-[11px] text-slate-400 hover:text-blue-400 inline-flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="h-3 w-3" /> Reset to Profile Defaults
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              {candidateSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 text-xs text-slate-200"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddSkill} className="flex items-center gap-2 max-w-md">
              <input
                type="text"
                placeholder="Type a skill (e.g. Redis, Kafka, Kubernetes)..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                className="flex-1 rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <Button type="submit" size="sm" variant="outline" className="text-xs gap-1 border-slate-700">
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* KPI Overview Metrics (3 Cards) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Readiness Index */}
        <Card className="glass-card space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-1.5">
                <Award className="h-4 w-4 text-blue-400" />
                <span>Role Readiness Index</span>
              </CardTitle>
              <Badge variant={skillGap.readinessScore >= 75 ? "success" : skillGap.readinessScore >= 50 ? "warning" : "danger"}>
                {skillGap.readinessScore >= 75 ? "Interview Ready" : skillGap.readinessScore >= 50 ? "Bridgeable" : "Action Needed"}
              </Badge>
            </div>
            <CardDescription>{selectedSeniority} {selectedRole}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-extrabold text-blue-400 tracking-tight">
                {skillGap.readinessScore}%
              </span>
              <span className="text-xs text-slate-400">
                Target Threshold: <strong className="text-white">80%</strong>
              </span>
            </div>
            <ProgressBar
              value={skillGap.readinessScore}
              indicatorClassName={
                skillGap.readinessScore >= 75 ? "bg-emerald-500" : skillGap.readinessScore >= 50 ? "bg-blue-500" : "bg-amber-500"
              }
            />

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <div className="rounded-xl bg-slate-900/60 p-2 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Verified Core</span>
                <span className="font-bold text-emerald-400 text-sm">{skillGap.matchedSkills.length} Skills</span>
              </div>
              <div className="rounded-xl bg-slate-900/60 p-2 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Missing Delta</span>
                <span className="font-bold text-amber-400 text-sm">{skillGap.missingSkills.length} Skills</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Salary ROI & Compensation Boost */}
        <Card className="glass-card space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span>Market Salary ROI</span>
              </CardTitle>
              <Badge variant="success">High Impact</Badge>
            </div>
            <CardDescription>Projected Compensation Delta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-extrabold text-emerald-400 tracking-tight">
                +${(skillGap.totalProjectedSalaryBoost / 1000).toFixed(0)}k
              </span>
              <span className="text-xs text-slate-400">/ year avg bump</span>
            </div>
            <p className="text-xs text-slate-300">
              Closing your top <strong className="text-emerald-300">{Math.min(skillGap.salaryImpacts.length, 3)} skill gaps</strong> unlocks higher compensation bands for {selectedRole} positions.
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {skillGap.salaryImpacts.slice(0, 3).map((item) => (
                <span
                  key={item.skill}
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 text-[11px] text-emerald-300 font-medium"
                >
                  <span>{item.skill}</span>
                  <span className="text-emerald-400 font-bold">+${(item.salaryBoostAvg / 1000).toFixed(0)}k</span>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Roadmap Progression & XP Level */}
        <Card className="glass-card space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-amber-400" />
                <span>Roadmap & Mastery Level</span>
              </CardTitle>
              <Badge variant="purple">Lvl {Math.max(1, Math.floor(earnedXP / 300))}</Badge>
            </div>
            <CardDescription>Curriculum Progress & XP</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-extrabold text-purple-400 tracking-tight">
                {earnedXP} <span className="text-xs font-semibold text-slate-400">XP</span>
              </span>
              <span className="text-xs text-slate-400">
                <strong>{completedCount}</strong> of <strong>{milestones.length}</strong> Done ({progressPercent}%)
              </span>
            </div>
            <ProgressBar value={progressPercent} indicatorClassName="bg-purple-500" />

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-amber-300 font-medium">
                <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> 4-Day Learning Streak
              </span>
              <button
                onClick={() => setExpandedMilestone(milestones.find((m) => !m.completed)?.id || "m-1")}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Continue Next &rarr;
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Radar Skill Benchmark & Prioritized Gap Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Multi-Dimensional Radar Benchmark (5 Cols) */}
        <Card className="glass-card lg:col-span-5 space-y-4 flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-blue-400" />
              <span>Competency Radar Benchmark</span>
            </CardTitle>
            <CardDescription>
              Your verified skills vs. Market 90th percentile for {selectedSeniority} {selectedRole}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 flex-1 flex flex-col items-center justify-center">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillGap.benchmarks}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="category" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                  <Radar
                    name="Your Depth"
                    dataKey="candidateScore"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.45}
                  />
                  <Radar
                    name="Market Standard"
                    dataKey="marketBenchmark"
                    stroke="#a855f7"
                    fill="#a855f7"
                    fillOpacity={0.15}
                    strokeDasharray="3 3"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      color: "#fff",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Prioritized Missing Skills Matrix (7 Cols) */}
        <Card className="glass-card lg:col-span-7 space-y-4">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-base">Prioritized Skill Gap Matrix</CardTitle>
                <CardDescription>Ranked by market hiring velocity and salary impact</CardDescription>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px]">
                {(["ALL", "CORE", "ACCELERATOR", "BONUS"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveGapFilter(tab)}
                    className={`rounded-md px-2.5 py-1 font-semibold transition-all ${
                      activeGapFilter === tab
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tab === "ALL" ? "All" : tab === "CORE" ? "Critical" : tab === "ACCELERATOR" ? "Accelerators" : "Bonus"}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {filteredMissingSkills.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No missing skills in this category! You are fully aligned.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
                {filteredMissingSkills.map((gap, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-slate-900/60 p-3 hover:border-blue-500/30 transition-all group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200 group-hover:text-blue-300 transition-colors">
                          {gap.name}
                        </span>
                        <Badge
                          variant={
                            gap.priority === "High" ? "danger" : gap.priority === "Medium" ? "warning" : "default"
                          }
                        >
                          {gap.priority}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{gap.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-500" /> ~{gap.estimatedWeeks}w study
                      </span>
                      <span className="font-semibold text-emerald-400">Demand: {gap.impactScore * 10}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Personalized Portfolio Project Blueprint Builder */}
      <Card className="glass-card space-y-5 border-blue-500/20 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-blue-950/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <CardHeader className="pb-3 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-blue-400 mb-1.5">
              <Sparkles className="h-3 w-3" />
              <span>AI Portfolio Project Blueprint</span>
            </div>
            <CardTitle className="text-lg sm:text-xl text-white">
              {projectBlueprint.title}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {projectBlueprint.tagline}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleGenerateAIProject}
              disabled={isGeneratingProject}
              variant="gradient"
              size="sm"
              className="text-xs gap-1.5"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isGeneratingProject ? "animate-spin" : ""}`} />
              <span>{isGeneratingProject ? "Architecting..." : "Regenerate AI Blueprint"}</span>
            </Button>
            <Button
              onClick={handleCopyPRD}
              variant="outline"
              size="sm"
              className="text-xs gap-1.5 border-slate-700 hover:border-blue-500"
            >
              {blueprintCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{blueprintCopied ? "PRD Copied!" : "Export PRD"}</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-0">
          {/* Blueprint Quick Badges & Target Skills */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Target Skill Gaps Addressed:</span>
              {projectBlueprint.targetSkills.map((skill) => (
                <Badge key={skill} variant="purple" className="text-[11px]">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span>
                Difficulty: <strong className="text-amber-400">{projectBlueprint.difficulty}</strong>
              </span>
              <span>
                Estimated Duration: <strong className="text-blue-400">~{projectBlueprint.estimatedWeeks} Weeks</strong>
              </span>
            </div>
          </div>

          {/* Project Blueprint Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
            {(
              [
                { id: "OVERVIEW", label: "Architecture Overview" },
                { id: "PHASES", label: "4-Phase Milestones" },
                { id: "TECH", label: "Tech Stack Rationale" },
                { id: "PRD", label: "PRD Document" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveProjectTab(tab.id)}
                className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                  activeProjectTab === tab.id
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Architecture Overview */}
          {activeProjectTab === "OVERVIEW" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5 text-blue-400" /> Architectural Design
                </h4>
                <p className="text-xs leading-relaxed text-slate-300">
                  {projectBlueprint.architectureSummary}
                </p>
              </div>

              <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-purple-400" /> System Data Flow
                </h4>
                <div className="text-xs font-mono text-slate-300 whitespace-pre-line leading-relaxed">
                  {projectBlueprint.systemDesignOverview}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: 4-Phase Step-by-Step Milestones */}
          {activeProjectTab === "PHASES" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectBlueprint.phases.map((phase) => (
                <div
                  key={phase.phase}
                  className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400">
                      Phase {phase.phase}: {phase.title}
                    </span>
                    <Badge variant="outline">{phase.duration}</Badge>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {phase.deliverables.map((del, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">&bull;</span>
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                    Git Target: <code className="text-purple-300">{phase.gitMilestone}</code>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Tech Stack Rationale */}
          {activeProjectTab === "TECH" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {projectBlueprint.techStack.map((techItem, i) => (
                <div key={i} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{techItem.tech}</span>
                    <Badge variant="outline" className="text-[10px]">{techItem.layer}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400">{techItem.reason}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: PRD Document */}
          {activeProjectTab === "PRD" && (
            <div className="relative rounded-xl border border-slate-800 bg-slate-950/80 p-4 font-mono text-xs text-slate-300 max-h-[300px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {projectBlueprint.prdMarkdown}
            </div>
          )}

          {/* Verifiable Portfolio Checklist */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <FolderGit2 className="h-3.5 w-3.5 text-emerald-400" /> Verifiable Portfolio Deliverables
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              {projectBlueprint.portfolioChecklist.map((item, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-slate-950/40 p-2 border border-slate-800/60">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Action Roadmap & Milestone Learning Tracker */}
      <Card className="glass-card space-y-4">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-800 gap-3">
          <div>
            <CardTitle className="text-lg">Interactive Action Roadmap</CardTitle>
            <CardDescription>Step-by-step verified curriculum with hands-on documentation & projects</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="purple">{completedCount} of {milestones.length} Milestones Done</Badge>
          </div>
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCoach(m);
                      }}
                      className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-xs font-semibold text-blue-400 hover:bg-blue-500/20 transition-all"
                    >
                      <Bot className="h-3.5 w-3.5" />
                      <span>Ask AI Coach</span>
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details & Curated Resources */}
                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-slate-800/60 space-y-4 mt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
                      <h5 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-blue-400" /> Curated Resources & Documentation
                      </h5>
                      <Button
                        onClick={() => handleOpenCoach(m)}
                        variant="outline"
                        size="sm"
                        className="text-xs gap-1 sm:hidden border-blue-500/30 text-blue-400"
                      >
                        <Bot className="h-3.5 w-3.5" /> Ask AI Coach
                      </Button>
                    </div>

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

      {/* AI Milestone Coach Modal */}
      <Modal
        isOpen={coachModalOpen}
        onClose={() => setCoachModalOpen(false)}
        title={selectedCoachMilestone ? `AI Learning Coach: ${selectedCoachMilestone.title}` : "AI Learning Coach"}
      >
        <div className="space-y-4">
          {coachLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              <p className="text-xs text-slate-400">Consulting Staff Engineer AI Coach...</p>
            </div>
          ) : coachResponse ? (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-slate-300 space-y-2 leading-relaxed">
                <h4 className="font-bold text-blue-400 text-sm">Deep-Dive Explanation</h4>
                <p className="whitespace-pre-line">{coachResponse.explanation}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-200">Key Engineering Takeaways</h4>
                <ul className="space-y-1 text-slate-300">
                  {coachResponse.keyTakeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">&check;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {coachResponse.sampleCode && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-200">Executable Code Example</h4>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(coachResponse.sampleCode);
                        setCodeCopied(true);
                        setTimeout(() => setCodeCopied(false), 2000);
                      }}
                      className="text-[11px] text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                    >
                      {codeCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      {codeCopied ? "Copied!" : "Copy Code"}
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-blue-300 overflow-x-auto">
                    {coachResponse.sampleCode}
                  </pre>
                </div>
              )}

              {coachResponse.exercise && (
                <div className="bg-purple-950/20 p-3 rounded-xl border border-purple-500/30 text-purple-200 space-y-1">
                  <h4 className="font-bold text-purple-300 flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-purple-400" /> Practice Challenge
                  </h4>
                  <p className="text-[11px] text-purple-300">{coachResponse.exercise}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Failed to load coach explanation. Please try again.</p>
          )}

          <div className="flex justify-end pt-2">
            <Button size="sm" variant="outline" onClick={() => setCoachModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
