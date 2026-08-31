import { JobItem, SkillItem, SkillGapAnalysis } from "./types";
import { DEFAULT_ROADMAP } from "./mock-data";

/**
 * Calculates match percentage and detailed skill overlap for a job
 */
export function calculateJobMatch(
  job: JobItem,
  candidateSkills: string[] | SkillItem[]
): {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
} {
  const normalizedCandidateSkills = candidateSkills.map((s) =>
    typeof s === "string" ? s.toLowerCase().trim() : s.name.toLowerCase().trim()
  );

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const req of job.requiredSkills) {
    const isMatched = normalizedCandidateSkills.some(
      (cSkill) => cSkill === req.toLowerCase().trim() || cSkill.includes(req.toLowerCase().trim()) || req.toLowerCase().trim().includes(cSkill)
    );
    if (isMatched) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  }

  const total = job.requiredSkills.length;
  const matchScore = total > 0 ? Math.round((matchedSkills.length / total) * 100) : 100;

  let explanation = "";
  if (matchScore >= 80) {
    explanation = `Outstanding match! You possess ${matchedSkills.length} of ${total} required core skills for ${job.title}.`;
  } else if (matchScore >= 50) {
    explanation = `Strong foundation. You match ${matchedSkills.length} core skills, with opportunities to pick up ${missingSkills.slice(0, 2).join(", ")}.`;
  } else {
    explanation = `Bridgeable gap. Prioritizing ${missingSkills.slice(0, 3).join(", ")} will significantly boost your fit for this role.`;
  }

  return {
    matchScore,
    matchedSkills,
    missingSkills,
    explanation,
  };
}

/**
 * Generates Skill Gap Analysis and interactive learning roadmap for a target role
 */
export function generateSkillGap(
  targetRole: string,
  userSkills: string[] | SkillItem[]
): SkillGapAnalysis {
  const normalizedUserSkills = new Set(
    userSkills.map((s) => (typeof s === "string" ? s.toLowerCase().trim() : s.name.toLowerCase().trim()))
  );

  // Role archetypes
  const roleSkillProfiles: Record<string, { required: string[]; categoryMap: Record<string, string> }> = {
    "Full Stack Developer": {
      required: ["React", "TypeScript", "Node.js", "Express.js", "PostgreSQL", "Redis", "Docker", "Git", "REST API", "Tailwind CSS"],
      categoryMap: {
        Docker: "DevOps",
        Redis: "Backend",
        PostgreSQL: "Database",
        TypeScript: "Frontend",
        "Express.js": "Backend",
      },
    },
    "Frontend Engineer": {
      required: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux", "Jest", "Web Vitals", "Git", "GraphQL"],
      categoryMap: {
        "Next.js": "Frontend",
        "Web Vitals": "Frontend",
        Jest: "Testing",
        GraphQL: "Frontend",
      },
    },
    "Backend / Systems Engineer": {
      required: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "CI/CD", "System Design"],
      categoryMap: {
        Redis: "Backend",
        Docker: "DevOps",
        Kubernetes: "Cloud",
        AWS: "Cloud",
        "System Design": "Architecture",
      },
    },
    "AI / ML Application Engineer": {
      required: ["Python", "TypeScript", "React", "LangChain", "Ollama", "pgvector", "FastAPI", "Docker", "RAG"],
      categoryMap: {
        LangChain: "AI",
        Ollama: "AI",
        pgvector: "Database",
        RAG: "AI",
        FastAPI: "Backend",
      },
    },
  };

  const targetProfile = roleSkillProfiles[targetRole] || roleSkillProfiles["Full Stack Developer"];
  const matchedSkills: string[] = [];
  const missingSkills: { name: string; priority: "High" | "Medium" | "Low"; estimatedWeeks: number; category: string }[] = [];

  targetProfile.required.forEach((req, idx) => {
    if (normalizedUserSkills.has(req.toLowerCase())) {
      matchedSkills.push(req);
    } else {
      missingSkills.push({
        name: req,
        priority: idx < 3 ? "High" : idx < 6 ? "Medium" : "Low",
        estimatedWeeks: idx < 3 ? 2 : 1,
        category: targetProfile.categoryMap[req] || "Core Skill",
      });
    }
  });

  const readinessScore = Math.round(
    (matchedSkills.length / Math.max(targetProfile.required.length, 1)) * 100
  );

  return {
    targetRole,
    readinessScore,
    matchedSkills,
    missingSkills,
    milestones: DEFAULT_ROADMAP,
  };
}
