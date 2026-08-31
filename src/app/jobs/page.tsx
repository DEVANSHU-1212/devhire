"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  ArrowRight,
  MapPin,
  DollarSign,
  Plus,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { SAMPLE_JOBS, INITIAL_SKILLS } from "@/lib/mock-data";
import { calculateJobMatch } from "@/lib/job-matcher";
import { JobItem } from "@/lib/types";

export default function JobMatchingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "HIGH_MATCH" | "REMOTE">("ALL");
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [trackedSuccess, setTrackedSuccess] = useState<string | null>(null);

  const jobsWithMatch = SAMPLE_JOBS.map((job) => {
    const match = calculateJobMatch(job, INITIAL_SKILLS);
    return {
      ...job,
      matchScore: match.matchScore,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      explanation: match.explanation,
    };
  });

  const filteredJobs = jobsWithMatch.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterType === "HIGH_MATCH") return (job.matchScore || 0) >= 70;
    if (filterType === "REMOTE") return job.type === "Remote";
    return true;
  });

  const handleTrackApplication = (job: JobItem) => {
    setTrackedSuccess(job.id);
    setTimeout(() => setTrackedSuccess(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-2">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Semantic & Keyword Job Matching</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Matched Career Opportunities
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Jobs scored against your verified skills with transparent keyword breakdown and skill gap explanations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/skill-gap">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>View Target Skill Roadmap</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by role title, company, or required skill (e.g. Docker, React)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 text-xs text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant={filterType === "ALL" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilterType("ALL")}
            className="text-xs"
          >
            All Roles ({jobsWithMatch.length})
          </Button>
          <Button
            variant={filterType === "HIGH_MATCH" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilterType("HIGH_MATCH")}
            className="text-xs"
          >
            High Match (&gt;70%)
          </Button>
          <Button
            variant={filterType === "REMOTE" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilterType("REMOTE")}
            className="text-xs"
          >
            Remote
          </Button>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => {
          const score = job.matchScore || 0;
          return (
            <Card
              key={job.id}
              className="glass-card flex flex-col justify-between hover:border-blue-500/40 transition-all cursor-pointer"
              onClick={() => setSelectedJob(job)}
            >
              <div className="space-y-3">
                {/* Card Top */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 hover:text-blue-400 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-400">{job.company}</p>
                  </div>
                  <Badge
                    variant={score >= 80 ? "success" : score >= 50 ? "default" : "warning"}
                    className="shrink-0"
                  >
                    {score}% Match
                  </Badge>
                </div>

                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-500" />
                    {job.location}
                  </span>
                  {job.salaryMin && job.salaryMax && (
                    <span className="flex items-center gap-0.5 text-emerald-400 font-semibold">
                      ${job.salaryMin / 1000}k - ${job.salaryMax / 1000}k
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">{job.description}</p>

                {/* Matched / Missing pills */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <div className="flex flex-wrap gap-1">
                    {job.matchedSkills?.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20"
                      >
                        ✓ {s}
                      </span>
                    ))}
                    {job.missingSkills?.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-400"
                      >
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/60" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleTrackApplication(job)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
                  {trackedSuccess === job.id ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Added to Tracker
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Plus className="h-3.5 w-3.5" /> Track in Kanban
                    </span>
                  )}
                </button>

                <Button variant="primary" size="sm" className="h-7 text-xs px-3" onClick={() => setSelectedJob(job)}>
                  View Details
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <Modal isOpen={!!selectedJob} onClose={() => setSelectedJob(null)} maxWidth="lg" title={selectedJob.title}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-300">{selectedJob.company}</h4>
                <p className="text-xs text-slate-400">{selectedJob.location} • {selectedJob.experienceLevel}</p>
              </div>
              <Badge variant={selectedJob.matchScore && selectedJob.matchScore >= 80 ? "success" : "default"}>
                {selectedJob.matchScore}% Verified Match
              </Badge>
            </div>

            <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-3.5 text-xs text-blue-200">
              <span className="font-bold">Match Breakdown:</span> {selectedJob.explanation}
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Role Description</h5>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedJob.description}</p>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Required Skills & Match Status</h5>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-emerald-950/30 p-2.5 border border-emerald-500/20">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 mb-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Matched In Profile ({selectedJob.matchedSkills?.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedJob.matchedSkills?.map((s) => (
                      <span key={s} className="rounded bg-emerald-500/20 text-[10px] text-emerald-300 px-1.5 py-0.5">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-amber-950/30 p-2.5 border border-amber-500/20">
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1 mb-1">
                    <AlertCircle className="h-3.5 w-3.5" /> Missing Skills ({selectedJob.missingSkills?.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedJob.missingSkills?.map((s) => (
                      <span key={s} className="rounded bg-amber-500/20 text-[10px] text-amber-300 px-1.5 py-0.5">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <Link href="/interview">
                <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  Practice Interview for this Role
                </Button>
              </Link>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedJob(null)}>
                  Close
                </Button>
                {selectedJob.applyUrl && (
                  <a href={selectedJob.applyUrl} target="_blank" rel="noreferrer">
                    <Button variant="primary" size="sm" className="gap-1.5">
                      <span>Apply on Site</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
