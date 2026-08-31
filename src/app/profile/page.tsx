"use client";

import React, { useState } from "react";
import {
  User,
  Plus,
  Trash2,
  ExternalLink,
  Code2,
  Globe,
  Briefcase,
  GraduationCap,
  Save,
  Sparkles,
  Code,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { INITIAL_SKILLS, INITIAL_PROJECTS } from "@/lib/mock-data";
import { SkillItem, ProjectItem } from "@/lib/types";

export default function DeveloperProfilePage() {
  const [name, setName] = useState("Alex Le");
  const [headline, setHeadline] = useState("Full Stack Software Engineer & Systems Builder");
  const [bio, setBio] = useState("Passionate about architecting high-performance web applications with Next.js, Node.js, and Redis. Experienced in end-to-end full-stack development and generative AI integrations.");
  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  const [yearsOfExp, setYearsOfExp] = useState("2");
  const [location, setLocation] = useState("San Francisco, CA (Open to Remote)");
  const [githubUrl, setGithubUrl] = useState("https://github.com/alexle");
  const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com/in/alexle");
  const [portfolioUrl, setPortfolioUrl] = useState("https://alexle.dev");

  const [skills, setSkills] = useState<SkillItem[]>(INITIAL_SKILLS);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);

  // Modals
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<SkillItem["category"]>("Frontend");
  const [newSkillProficiency, setNewSkillProficiency] = useState<SkillItem["proficiency"]>("Intermediate");

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectTech, setNewProjectTech] = useState("");
  const [newProjectRepo, setNewProjectRepo] = useState("");
  const [newProjectLive, setNewProjectLive] = useState("");

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills((prev) => [
      ...prev,
      {
        name: newSkillName.trim(),
        category: newSkillCategory,
        proficiency: newSkillProficiency,
      },
    ]);
    setNewSkillName("");
    setIsSkillModalOpen(false);
  };

  const handleRemoveSkill = (skillName: string) => {
    setSkills((prev) => prev.filter((s) => s.name !== skillName));
  };

  const handleAddProject = () => {
    if (!newProjectTitle.trim()) return;
    setProjects((prev) => [
      ...prev,
      {
        title: newProjectTitle.trim(),
        description: newProjectDesc.trim(),
        techStack: newProjectTech.trim(),
        repoUrl: newProjectRepo.trim() || undefined,
        liveUrl: newProjectLive.trim() || undefined,
      },
    ]);
    setNewProjectTitle("");
    setNewProjectDesc("");
    setNewProjectTech("");
    setNewProjectRepo("");
    setNewProjectLive("");
    setIsProjectModalOpen(false);
  };

  const handleSaveProfile = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-2">
            <User className="h-3.5 w-3.5" />
            <span>Developer Portfolio Identity</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Candidate Profile & Verified Skills
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain your core tech stack, featured portfolio projects, and target role benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-400 animate-fade-in flex items-center gap-1">
              ✓ Profile Saved
            </span>
          )}
          <Button variant="gradient" size="md" onClick={handleSaveProfile} className="gap-2">
            <Save className="h-4 w-4" />
            <span>Save Profile</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Personal & Target Info */}
        <Card className="glass-card lg:col-span-1 space-y-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Personal Details</CardTitle>
            <CardDescription>Primary candidate information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Professional Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Role Archetype</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
              >
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="Backend / Systems Engineer">Backend / Systems Engineer</option>
                <option value="AI / ML Application Engineer">AI / ML Application Engineer</option>
              </select>
            </div>
            <Input label="Years of Experience" value={yearsOfExp} onChange={(e) => setYearsOfExp(e.target.value)} />
            <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <Textarea label="Bio / Executive Summary" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <Input label="GitHub URL" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
              <Input label="LinkedIn URL" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
              <Input label="Portfolio / Blog URL" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Skills & Featured Projects */}
        <div className="space-y-6 lg:col-span-2">
          {/* Skills Management Card */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Skills & Proficiencies ({skills.length})</CardTitle>
                <CardDescription>Directly factored into Job Matching & Skill Gap calculation</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => setIsSkillModalOpen(true)} className="gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" />
                <span>Add Skill</span>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 transition-all hover:border-slate-700"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-100">{skill.name}</span>
                      <span className="text-[10px] text-slate-400">{skill.category} • {skill.proficiency}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveSkill(skill.name)}
                      className="text-slate-500 hover:text-rose-400 p-0.5 rounded transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Featured Projects Card */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Featured Engineering Projects ({projects.length})</CardTitle>
                <CardDescription>Showcased during technical evaluations & recruiter matching</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => setIsProjectModalOpen(true)} className="gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" />
                <span>Add Project</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 transition-colors hover:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-100">{proj.title}</h4>
                    <div className="flex items-center gap-2">
                      {proj.repoUrl && (
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-white"
                        >
                          <Code2 className="h-4 w-4" />
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-blue-400"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300">{proj.description}</p>
                  {proj.highlights && (
                    <p className="text-[11px] text-emerald-400 font-medium">★ {proj.highlights}</p>
                  )}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.techStack.split(",").map((tech) => (
                      <span key={tech} className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Skill Modal */}
      <Modal isOpen={isSkillModalOpen} onClose={() => setIsSkillModalOpen(false)} title="Add Technical Skill">
        <div className="space-y-4">
          <Input
            label="Skill Name"
            placeholder="e.g. Docker, Redis, Next.js"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
          />
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value as any)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="Cloud">Cloud</option>
              <option value="DevOps">DevOps</option>
              <option value="AI">AI</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Proficiency Level</label>
            <select
              value={newSkillProficiency}
              onChange={(e) => setNewSkillProficiency(e.target.value as any)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsSkillModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddSkill}>
              Add to Profile
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Project Modal */}
      <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title="Add Featured Project">
        <div className="space-y-4">
          <Input
            label="Project Title"
            placeholder="e.g. Distributed Task Queue"
            value={newProjectTitle}
            onChange={(e) => setNewProjectTitle(e.target.value)}
          />
          <Textarea
            label="Description"
            placeholder="Brief explanation of architecture and purpose..."
            value={newProjectDesc}
            onChange={(e) => setNewProjectDesc(e.target.value)}
          />
          <Input
            label="Tech Stack (comma-separated)"
            placeholder="e.g. Next.js, Redis, Node.js, Tailwind"
            value={newProjectTech}
            onChange={(e) => setNewProjectTech(e.target.value)}
          />
          <Input
            label="Repository URL"
            placeholder="https://github.com/..."
            value={newProjectRepo}
            onChange={(e) => setNewProjectRepo(e.target.value)}
          />
          <Input
            label="Live Demo URL"
            placeholder="https://..."
            value={newProjectLive}
            onChange={(e) => setNewProjectLive(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsProjectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddProject}>
              Save Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
