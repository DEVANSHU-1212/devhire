"use client";

import React from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Ambient background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-[10%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="absolute top-[40%] right-[5%] h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[130px]" />
        <div className="absolute bottom-[5%] left-[25%] h-[350px] w-[350px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="relative z-10 flex min-h-screen flex-1 flex-col pl-64">
        <Header />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
