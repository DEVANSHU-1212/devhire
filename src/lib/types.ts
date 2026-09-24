export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  headline?: string;
  bio?: string;
  targetRole: string;
  yearsOfExp: number;
  location?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  skills: SkillItem[];
  projects: ProjectItem[];
}

export interface SkillItem {
  id?: string;
  name: string;
  category: "Frontend" | "Backend" | "Database" | "Cloud" | "DevOps" | "AI" | "General";
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

export interface ProjectItem {
  id?: string;
  title: string;
  description: string;
  techStack: string;
  repoUrl?: string;
  liveUrl?: string;
  highlights?: string;
}

export interface ResumeAnalysis {
  id?: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  detectedSkills: string[];
  recommendations: string[];
  fileName?: string;
  rawText?: string;
  createdAt?: string;
}

export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Remote" | "Hybrid" | "Onsite";
  salaryMin?: number;
  salaryMax?: number;
  requiredSkills: string[];
  description: string;
  experienceLevel: "Entry" | "Junior" | "Mid-Level" | "Senior" | "Lead";
  applyUrl?: string;
  matchScore?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
  explanation?: string;
}

export type ApplicationStatus = "SAVED" | "APPLIED" | "OA" | "INTERVIEW" | "OFFER" | "REJECTED";

export interface ApplicationItem {
  id: string;
  jobId?: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  appliedDate: string;
  salary?: string;
  notes?: string;
  jobUrl?: string;
  matchScore?: number;
}

export interface InterviewQuestionItem {
  id: string;
  question: string;
  category: string;
  idealAnswer?: string;
}

export interface InterviewAnswerItem {
  questionId: string;
  candidateAnswer: string;
  score: number; // 0 - 100
  feedback: string;
  rubric: {
    technicalCorrectness: number; // 1-10
    relevance: number; // 1-10
    communication: number; // 1-10
    completeness: number; // 1-10
  };
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  description: string;
  starterCode: {
    javascript: string;
    typescript: string;
    python?: string;
  };
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  testCases: {
    input: any[];
    expected: any;
    isSecret?: boolean;
  }[];
}

export interface CodingSubmissionResult {
  problemId: string;
  language: string;
  status: "Passed" | "Failed" | "Runtime Error" | "Time Limit Exceeded";
  passedTests: number;
  totalTests: number;
  executionTimeMs: number;
  output?: string;
  testDetails: {
    testIndex: number;
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
    error?: string;
  }[];
}

export type SeniorityLevel = "Junior" | "Mid-Level" | "Senior" | "Staff / Lead" | "Principal";

export interface SkillBenchmarkItem {
  category: string;
  candidateScore: number;
  marketBenchmark: number;
  fullMark: number;
}

export interface SalaryImpactItem {
  skill: string;
  salaryBoostAvg: number;
  demandIndex: number; // 1-100
  category: string;
  rationale: string;
}

export interface ProjectPhaseMilestone {
  phase: number;
  title: string;
  duration: string;
  deliverables: string[];
  gitMilestone: string;
}

export interface ProjectBlueprint {
  id: string;
  title: string;
  tagline: string;
  difficulty: "Intermediate" | "Advanced" | "Expert";
  estimatedWeeks: number;
  targetSkills: string[];
  architectureSummary: string;
  systemDesignOverview: string;
  techStack: {
    layer: string;
    tech: string;
    reason: string;
  }[];
  phases: ProjectPhaseMilestone[];
  portfolioChecklist: string[];
  prdMarkdown: string;
}

export interface MissingSkill {
  name: string;
  priority: "High" | "Medium" | "Low";
  estimatedWeeks: number;
  category: string;
  impactScore: number; // 1-10
  description?: string;
}

export interface SkillGapAnalysis {
  targetRole: string;
  seniority: SeniorityLevel;
  readinessScore: number;
  matchedSkills: string[];
  missingSkills: MissingSkill[];
  missingCategorized: {
    core: MissingSkill[];
    accelerators: MissingSkill[];
    bonus: MissingSkill[];
  };
  salaryImpacts: SalaryImpactItem[];
  totalProjectedSalaryBoost: number;
  benchmarks: SkillBenchmarkItem[];
  milestones: RoadmapMilestone[];
  suggestedProject: ProjectBlueprint;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  category: string;
  weeksToComplete: number;
  completed: boolean;
  learningHours?: number;
  keyConcepts?: string[];
  resources: {
    title: string;
    url: string;
    type: "documentation" | "tutorial" | "project" | "course";
  }[];
}
