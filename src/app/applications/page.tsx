"use client";

import React, { useState } from "react";
import {
  Kanban,
  Table as TableIcon,
  Plus,
  Trash2,
  ExternalLink,
  DollarSign,
  Calendar,
  Building2,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea } from "@/components/ui/input";
import { ApplicationItem, ApplicationStatus } from "@/lib/types";

const INITIAL_APPLICATIONS: ApplicationItem[] = [
  {
    id: "app-1",
    company: "ScaleFlow Tech",
    role: "Full Stack Engineer (AI)",
    status: "INTERVIEW",
    appliedDate: "2026-08-25",
    salary: "$145,000",
    notes: "Completed initial screening. System design round scheduled with Staff Engineer.",
    matchScore: 92,
  },
  {
    id: "app-2",
    company: "Veloce Cloud",
    role: "Senior Frontend Engineer",
    status: "OA",
    appliedDate: "2026-08-28",
    salary: "$160,000",
    notes: "Received HackerRank OA link. 90 mins deadline.",
    matchScore: 88,
  },
  {
    id: "app-3",
    company: "Apex Data Labs",
    role: "Backend & Systems Developer",
    status: "APPLIED",
    appliedDate: "2026-08-29",
    salary: "$135,000",
    notes: "Applied via referral on LinkedIn.",
    matchScore: 78,
  },
  {
    id: "app-4",
    company: "NeuralCraft",
    role: "Junior AI Application Engineer",
    status: "OFFER",
    appliedDate: "2026-08-15",
    salary: "$105,000",
    notes: "Offer received! Negotiating equity and remote flexibility.",
    matchScore: 95,
  },
  {
    id: "app-5",
    company: "CyberMatrix Global",
    role: "Lead Platform Architect",
    status: "SAVED",
    appliedDate: "2026-08-30",
    salary: "$190,000",
    notes: "Need to update resume with Docker multi-stage & Redis caching before submitting.",
    matchScore: 68,
  },
];

const COLUMNS: { id: ApplicationStatus; label: string; badgeVariant: "default" | "success" | "warning" | "danger" | "purple" | "outline" }[] = [
  { id: "SAVED", label: "Saved", badgeVariant: "outline" },
  { id: "APPLIED", label: "Applied", badgeVariant: "default" },
  { id: "OA", label: "Online Assessment", badgeVariant: "warning" },
  { id: "INTERVIEW", label: "Interview", badgeVariant: "purple" },
  { id: "OFFER", label: "Offer", badgeVariant: "success" },
  { id: "REJECTED", label: "Rejected", badgeVariant: "danger" },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>(INITIAL_APPLICATIONS);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newStatus, setNewStatus] = useState<ApplicationStatus>("APPLIED");
  const [newSalary, setNewSalary] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const handleAddApplication = () => {
    if (!newCompany.trim() || !newRole.trim()) return;

    const newApp: ApplicationItem = {
      id: `app-${Date.now()}`,
      company: newCompany.trim(),
      role: newRole.trim(),
      status: newStatus,
      appliedDate: new Date().toISOString().split("T")[0],
      salary: newSalary.trim() || undefined,
      notes: newNotes.trim() || undefined,
      matchScore: 85,
    };

    setApplications((prev) => [newApp, ...prev]);
    setNewCompany("");
    setNewRole("");
    setNewSalary("");
    setNewNotes("");
    setIsAddModalOpen(false);
  };

  const handleMoveStatus = (id: string, nextStatus: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: nextStatus } : app))
    );
  };

  const handleDelete = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-2">
            <Kanban className="h-3.5 w-3.5" />
            <span>Job Pipeline & Kanban</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Application Lifecycle Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track and manage your developer job applications across all recruitment stages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === "kanban" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Kanban className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === "table" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <TableIcon className="h-4 w-4" />
            </button>
          </div>

          <Button variant="gradient" size="sm" onClick={() => setIsAddModalOpen(true)} className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            <span>Add Application</span>
          </Button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6 overflow-x-auto pb-4">
          {COLUMNS.map((col) => {
            const colApps = applications.filter((a) => a.status === col.id);
            return (
              <div key={col.id} className="flex flex-col rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3 min-w-[220px] space-y-3">
                {/* Column Header */}
                <div className="flex items-center justify-between px-1 pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300">{col.label}</span>
                  <Badge variant={col.badgeVariant} size="sm">
                    {colApps.length}
                  </Badge>
                </div>

                {/* Cards List */}
                <div className="flex-1 space-y-2.5 overflow-y-auto">
                  {colApps.map((app) => (
                    <div
                      key={app.id}
                      className="group rounded-xl border border-slate-800/90 bg-slate-900/90 p-3.5 space-y-2.5 transition-all hover:border-slate-700 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h4 className="text-xs font-bold text-slate-100">{app.role}</h4>
                          <span className="text-[11px] text-slate-400 font-medium">{app.company}</span>
                        </div>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity p-0.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {app.salary && (
                        <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-0.5">
                          <DollarSign className="h-3 w-3" /> {app.salary}
                        </div>
                      )}

                      {app.notes && (
                        <p className="text-[10px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 line-clamp-2">
                          {app.notes}
                        </p>
                      )}

                      {/* Move status dropdown */}
                      <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">{app.appliedDate}</span>
                        <select
                          value={app.status}
                          onChange={(e) => handleMoveStatus(app.id, e.target.value as ApplicationStatus)}
                          className="text-[10px] bg-slate-950 text-slate-300 rounded border border-slate-800 px-1 py-0.5 focus:outline-none"
                        >
                          {COLUMNS.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {colApps.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-850 p-4 text-center">
                      <span className="text-[11px] text-slate-600">No applications</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <Card className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                <tr>
                  <th className="p-3.5 font-semibold">Company & Role</th>
                  <th className="p-3.5 font-semibold">Status</th>
                  <th className="p-3.5 font-semibold">Salary Target</th>
                  <th className="p-3.5 font-semibold">Applied Date</th>
                  <th className="p-3.5 font-semibold">Notes</th>
                  <th className="p-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-100">{app.role}</div>
                      <div className="text-[11px] text-slate-400">{app.company}</div>
                    </td>
                    <td className="p-3.5">
                      <Badge
                        variant={
                          app.status === "OFFER"
                            ? "success"
                            : app.status === "INTERVIEW"
                            ? "purple"
                            : app.status === "OA"
                            ? "warning"
                            : "default"
                        }
                      >
                        {app.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-emerald-400 font-medium">{app.salary || "N/A"}</td>
                    <td className="p-3.5 text-slate-400">{app.appliedDate}</td>
                    <td className="p-3.5 text-slate-400 max-w-xs truncate">{app.notes || "—"}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Application Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Track New Job Application">
        <div className="space-y-4">
          <Input
            label="Company Name"
            placeholder="e.g. OpenAI, Stripe, ScaleFlow"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
          />
          <Input
            label="Role Title"
            placeholder="e.g. Full Stack Engineer"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Initial Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
              >
                {COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Salary Range (Optional)"
              placeholder="e.g. $140k - $160k"
              value={newSalary}
              onChange={(e) => setNewSalary(e.target.value)}
            />
          </div>
          <Textarea
            label="Notes & Interview Deadlines"
            placeholder="Key talking points, recruiter name, or OA link..."
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddApplication}>
              Add to Tracker
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
