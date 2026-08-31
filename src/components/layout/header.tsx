"use client";

import React from "react";
import Link from "next/link";
import { Search, Bell, Sparkles, Cpu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-8 backdrop-blur-xl">
      {/* Search Bar */}
      <div className="relative w-80">
        <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search jobs, skills, problems, roadmaps..."
          className="h-9 w-full rounded-lg border border-slate-800 bg-slate-900/90 pl-9 pr-4 text-xs text-slate-200 placeholder:text-slate-500 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* AI Status Badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <Cpu className="h-3.5 w-3.5 ml-0.5" />
          <span>AI Engine Ready</span>
        </div>

        {/* Quick Action Button */}
        <Link href="/interview">
          <Button size="sm" variant="gradient" className="gap-1.5 text-xs shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Practice Interview</span>
          </Button>
        </Link>

        {/* Notification Icon */}
        <button className="relative rounded-lg border border-slate-800 bg-slate-900/90 p-2 text-slate-400 hover:text-slate-200 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-500" />
        </button>
      </div>
    </header>
  );
}
