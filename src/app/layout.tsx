import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "DevHire - AI-Powered Full-Stack Developer Career Platform",
  description:
    "Accelerate your engineering career with AI resume scoring, semantic job matching, skill gap roadmaps, AI mock interviews, and sandboxed coding challenges.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-blue-600 selection:text-white bg-slate-950">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
