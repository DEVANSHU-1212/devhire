"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  Compass,
  Mic,
  Code2,
  Kanban,
  LineChart,
  Bot,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Developer Profile", href: "/profile", icon: User },
  { label: "Resume Analyzer", href: "/resume", icon: FileText, badge: "AI" },
  { label: "Job Matching", href: "/jobs", icon: Briefcase },
  { label: "Skill Gap & Roadmap", href: "/skill-gap", icon: Compass },
  { label: "AI Interview Room", href: "/interview", icon: Mic, badge: "Live" },
  { label: "Coding Interview", href: "/coding", icon: Code2 },
  { label: "Application Tracker", href: "/applications", icon: Kanban },
  { label: "Analytics & Metrics", href: "/analytics", icon: LineChart },
  { label: "AI Career Agent", href: "/career-agent", icon: Bot, badge: "RAG" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-800/80 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/25">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
            Dev<span className="text-blue-400">Hire</span>
            <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-bold text-blue-400 uppercase tracking-widest">
              AI
            </span>
          </span>
          <span className="text-[10px] text-slate-400">Full-Stack Career Platform</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-100 border border-transparent"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                    item.badge === "Live"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse"
                      : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom User Profile Widget */}
      <div className="border-t border-slate-800/80 p-3">
        <div className="flex items-center justify-between rounded-xl bg-slate-900/80 p-2.5 border border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-sm">
              AL
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-200">Alex Le</span>
              <span className="text-[10px] text-slate-400">Full Stack Candidate</span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-500" />
        </div>
      </div>
    </aside>
  );
}
