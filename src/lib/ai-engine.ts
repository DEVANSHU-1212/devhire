import { ResumeAnalysis, InterviewQuestionItem, InterviewAnswerItem, ProjectBlueprint } from "./types";

const ALL_SKILL_KEYWORDS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Angular", "Svelte", "Node.js", "Express.js",
  "NestJS", "Python", "Django", "FastAPI", "Go", "Golang", "Rust", "Java", "Spring Boot", "C++", "C#",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Prisma", "TypeORM", "GraphQL", "REST API", "Docker",
  "Kubernetes", "AWS", "GCP", "Azure", "CI/CD", "GitHub Actions", "Terraform", "Linux", "Git", "Ollama",
  "LangChain", "OpenAI", "Llama", "RAG", "Vector Database", "pgvector", "Pinecone", "Tailwind CSS",
  "shadcn/ui", "Redux", "Zustand", "TanStack Query", "Jest", "Vitest", "Playwright", "Cypress"
];

// Helper to safely call Ollama if running
async function callOllama(prompt: string, formatJson: boolean = false): Promise<string | null> {
  const ollamaUrl = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
  const model = process.env.OLLAMA_MODEL || "llama3";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        format: formatJson ? "json" : undefined,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const data = await res.json();
    return data.response;
  } catch {
    return null;
  }
}

/**
 * AI Resume Analysis Engine
 */
export async function analyzeResumeText(rawText: string, fileName: string = "resume.pdf"): Promise<ResumeAnalysis> {
  // 1. First try LLM (Ollama)
  const systemPrompt = `You are an elite Senior Staff Tech Recruiter and Technical Hiring Manager.
Analyze the following resume and return ONLY valid JSON matching this schema:
{
  "score": number (0-100),
  "strengths": string[],
  "weaknesses": string[],
  "detectedSkills": string[],
  "recommendations": string[]
}
Resume content:
${rawText.slice(0, 4000)}`;

  const ollamaResponse = await callOllama(systemPrompt, true);
  if (ollamaResponse) {
    try {
      const parsed = JSON.parse(ollamaResponse);
      return {
        ...parsed,
        fileName,
        rawText,
        createdAt: new Date().toISOString(),
      };
    } catch {
      // fallback to heuristics
    }
  }

  // 2. Intelligent NLP / Heuristic fallback parser
  const lowerText = rawText.toLowerCase();
  const detectedSkills = ALL_SKILL_KEYWORDS.filter((skill) =>
    new RegExp(`\\b${skill.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(lowerText)
  );

  // Check for sections
  const hasProjects = /project|built|developed|created/i.test(rawText);
  const hasMetrics = /\d+%\s*|\$\d+|\d+\s*users|\d+\s*ms|\d+x/i.test(rawText);
  const hasExperience = /experience|employment|worked|engineer|developer/i.test(rawText);
  const hasEducation = /education|university|degree|bachelor|master|b\.?s\.?/i.test(rawText);

  // Compute calculated score
  let score = 45;
  if (detectedSkills.length >= 8) score += 20;
  else if (detectedSkills.length >= 4) score += 12;
  else score += 5;

  if (hasMetrics) score += 15;
  if (hasProjects) score += 10;
  if (hasExperience) score += 10;
  if (hasEducation) score += 5;
  score = Math.min(score, 96);

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  if (detectedSkills.length > 0) {
    strengths.push(`Strong core stack identified: ${detectedSkills.slice(0, 5).join(", ")}`);
  }
  if (hasProjects) {
    strengths.push("Good inclusion of real-world portfolio projects demonstrating applied engineering.");
  }
  if (hasMetrics) {
    strengths.push("Excellent use of quantifiable metrics and business impact statements.");
  } else {
    weaknesses.push("Lacks quantifiable impact metrics (e.g. latency reduction %, user scale, throughput).");
    recommendations.push("Quantify achievements with data: 'Improved API latency by 40%' instead of 'Optimized backend'.");
  }

  if (!detectedSkills.some(s => ["Docker", "Kubernetes", "AWS", "CI/CD"].includes(s))) {
    weaknesses.push("Limited Cloud & DevOps skills highlighted (Docker, AWS, CI/CD).");
    recommendations.push("Add cloud infrastructure and containerization tools (Docker, AWS, GitHub Actions) to stand out.");
  }

  if (!detectedSkills.some(s => ["Redis", "PostgreSQL", "Prisma"].includes(s))) {
    recommendations.push("Highlight experience with high-performance databases and caching systems (Redis, PostgreSQL).");
  }

  if (strengths.length === 0) {
    strengths.push("Clean baseline structure with identifiable technical keywords.");
  }

  recommendations.push("Include links to live demos and GitHub repositories for all featured portfolio projects.");

  return {
    score,
    strengths,
    weaknesses,
    detectedSkills,
    recommendations,
    fileName,
    rawText,
    createdAt: new Date().toISOString(),
  };
}

/**
 * AI Interview Question Generator
 */
export async function generateInterviewQuestions(
  role: string,
  difficulty: "Easy" | "Medium" | "Hard",
  type: "Technical" | "Behavioral" | "System Design"
): Promise<InterviewQuestionItem[]> {
  const prompt = `Generate 4 realistic ${difficulty} level interview questions for a ${role} role focusing on ${type}.
Return ONLY valid JSON array with objects: [{"id": "q-1", "question": "string", "category": "string", "idealAnswer": "string"}]`;

  const ollamaResponse = await callOllama(prompt, true);
  if (ollamaResponse) {
    try {
      const parsed = JSON.parse(ollamaResponse);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fallback
    }
  }

  // Curated high-yield question bank fallback
  if (type === "Behavioral") {
    return [
      {
        id: "q-1",
        question: "Tell me about a time you faced a critical production bug or outage. How did you diagnose, mitigate, and prevent recurrence?",
        category: "Incident Management",
        idealAnswer: "Candidate should follow STAR method: explain the trigger, immediate triage/rollback steps, root cause analysis (RCA), and post-mortem safeguards (automated tests, alerts).",
      },
      {
        id: "q-2",
        question: "Describe a situation where you had a technical disagreement with a teammate or lead. How did you resolve it?",
        category: "Collaboration",
        idealAnswer: "Focus on data-driven benchmarking, collaborative RFCs/proof of concepts, egoless communication, and committing to team decisions.",
      },
      {
        id: "q-3",
        question: "How do you manage shifting product requirements and tight deadlines without compromising code quality?",
        category: "Prioritization",
        idealAnswer: "Discuss scope negotiation, MVP decomposition, technical debt tracking, and clear stakeholder communication.",
      },
    ];
  }

  if (type === "System Design") {
    return [
      {
        id: "q-1",
        question: "How would you design a distributed rate limiter for a public API handling 50,000 requests per second?",
        category: "System Design",
        idealAnswer: "Discuss sliding window counter or token bucket algorithms, Redis in-memory storage, Lua scripts for atomic operations, and graceful HTTP 429 status responses with retry-after headers.",
      },
      {
        id: "q-2",
        question: "Design an asynchronous background job processing system for resource-heavy AI resume parsing.",
        category: "Distributed Architecture",
        idealAnswer: "Separate API ingestion from workers using a message broker (Redis BullMQ/RabbitMQ), implement exponential backoff retry policies, dead-letter queues, and WebSocket progress updates.",
      },
      {
        id: "q-3",
        question: "Explain how you would implement database indexing and caching strategies to scale a slow read-heavy dashboard.",
        category: "Performance & Scaling",
        idealAnswer: "B-Tree composite indexes, EXPLAIN ANALYZE query profiling, Redis cache-aside pattern, TTL invalidation strategies, and read-replicas.",
      },
    ];
  }

  // Technical (Default)
  return [
    {
      id: "q-1",
      question: `Explain how the Node.js event loop handles asynchronous I/O and how it differs from browser JavaScript execution.`,
      category: "Node.js Core",
      idealAnswer: "Explain libuv thread pool, microtasks (process.nextTick, Promise queues) vs macrotasks (setImmediate, setTimeout), and non-blocking I/O event polling.",
    },
    {
      id: "q-2",
      question: `What are the trade-offs between Server-Side Rendering (SSR), Static Site Generation (SSG), and Client-Side Rendering in Next.js?`,
      category: "Frontend Architecture",
      idealAnswer: "Discuss TTFB (Time to First Byte), SEO advantages, server load vs CDN caching, dynamic data freshness, and hydration overhead.",
    },
    {
      id: "q-3",
      question: `How do database transactions (ACID properties) and isolation levels prevent race conditions in concurrent financial or booking operations?`,
      category: "Databases & Concurrency",
      idealAnswer: "Explain Atomicity, Consistency, Isolation, Durability, row-level locking (SELECT FOR UPDATE), optimistic vs pessimistic locking, and isolation levels.",
    },
    {
      id: "q-4",
      question: `How would you secure a full-stack REST API against common OWASP vulnerabilities (SQL Injection, XSS, CSRF, and Broken Auth)?`,
      category: "Security",
      idealAnswer: "Parameterized queries/ORMs, CSP headers, HttpOnly/SameSite cookies, JWT validation with short TTL + refresh tokens, rate limiting, and Zod input validation.",
    },
  ];
}

/**
 * AI Interview Answer Evaluator
 */
export async function evaluateInterviewAnswer(
  question: string,
  candidateAnswer: string,
  category: string
): Promise<InterviewAnswerItem> {
  const prompt = `You are an expert technical interviewer. Evaluate this candidate's answer.
Question: "${question}"
Candidate Answer: "${candidateAnswer}"
Category: "${category}"

Return ONLY valid JSON:
{
  "score": number (0-100),
  "feedback": "string with constructive critique and missing key points",
  "rubric": {
    "technicalCorrectness": number (1-10),
    "relevance": number (1-10),
    "communication": number (1-10),
    "completeness": number (1-10)
  }
}`;

  const ollamaResponse = await callOllama(prompt, true);
  if (ollamaResponse) {
    try {
      const parsed = JSON.parse(ollamaResponse);
      return {
        questionId: "evaluated",
        candidateAnswer,
        score: parsed.score || 75,
        feedback: parsed.feedback || "Good explanation with solid technical depth.",
        rubric: parsed.rubric || {
          technicalCorrectness: 8,
          relevance: 8,
          communication: 8,
          completeness: 7,
        },
      };
    } catch {
      // fallback
    }
  }

  // Heuristic evaluation based on length, depth, and technical terminology
  const wordCount = candidateAnswer.trim().split(/\s+/).length;
  let technicalScore = 6;
  let relevanceScore = 7;
  let commScore = 7;
  let completenessScore = 6;

  if (wordCount > 60) {
    technicalScore += 2;
    completenessScore += 2;
    commScore += 1;
  } else if (wordCount < 20) {
    technicalScore = Math.max(technicalScore - 2, 3);
    completenessScore = Math.max(completenessScore - 3, 3);
  }

  const hasKeywords = /because|trade-off|architecture|performance|scale|security|concurrency|async|cache/i.test(candidateAnswer);
  if (hasKeywords) {
    technicalScore = Math.min(technicalScore + 1, 10);
    relevanceScore = Math.min(relevanceScore + 1, 10);
  }

  const overallScore = Math.round(
    ((technicalScore + relevanceScore + commScore + completenessScore) / 40) * 100
  );

  let feedback = "Strong foundational understanding demonstrated.";
  if (wordCount < 30) {
    feedback = "Your answer captures the high-level concept but could be expanded with concrete code examples, architectural trade-offs, and edge cases.";
  } else if (hasKeywords) {
    feedback = "Excellent response! You clearly articulated the underlying mechanisms and highlighted key architectural implications.";
  }

  return {
    questionId: "evaluated",
    candidateAnswer,
    score: overallScore,
    feedback,
    rubric: {
      technicalCorrectness: technicalScore,
      relevance: relevanceScore,
      communication: commScore,
      completeness: completenessScore,
    },
  };
}

/**
 * AI Career Agent Advisory
 */
export async function askCareerAgent(
  userQuery: string,
  userContext: {
    targetRole?: string;
    skills?: string[];
    resumeScore?: number;
    missingSkills?: string[];
  }
): Promise<{ reply: string; suggestedActions: string[] }> {
  const prompt = `You are DevHire's AI Senior Principal Career Mentor.
User Context:
- Target Role: ${userContext.targetRole || "Full Stack Engineer"}
- Current Skills: ${userContext.skills?.join(", ") || "React, TypeScript, Node.js"}
- Resume Score: ${userContext.resumeScore || 75}/100
- Skill Gaps to Close: ${userContext.missingSkills?.join(", ") || "Docker, Redis, System Design"}

User Query: "${userQuery}"

Provide a crisp, actionable, high-impact recommendation and 3 concrete next action items.
Return ONLY valid JSON:
{
  "reply": "string (markdown supported)",
  "suggestedActions": ["action 1", "action 2", "action 3"]
}`;

  const ollamaResponse = await callOllama(prompt, true);
  if (ollamaResponse) {
    try {
      const parsed = JSON.parse(ollamaResponse);
      if (parsed.reply) return parsed;
    } catch {
      // fallback
    }
  }

  // Built-in high-quality fallback
  return {
    reply: `### Recommended Action Plan for ${userContext.targetRole || "Full Stack Developer"}

Based on your current profile and career trajectory:
1. **Strengthen Infrastructure & Caching**: Top tech teams expect strong proficiency with **Redis** (caching, rate-limiting, job queues) and **Docker** container orchestration.
2. **Portfolio Impact**: Ensure your projects highlight **measurable engineering metrics** (e.g. *handled 10k requests/sec*, *reduced DB queries by 60% with Redis*).
3. **Mock Interview Routine**: Practice at least 2 technical and 1 system design mock interviews weekly to sharpen your articulate delivery under pressure.`,
    suggestedActions: [
      "Launch a Docker & Redis containerized project",
      "Run an AI Mock Interview in System Design",
      "Upload updated resume for score re-evaluation",
    ],
  };
}

/**
 * AI Personalized Portfolio Project Blueprint Builder
 */
export async function generateProjectBlueprintAI(
  targetRole: string,
  seniority: string,
  missingSkills: string[],
  userInterests: string = "High-scale real-time systems"
): Promise<ProjectBlueprint> {
  const prompt = `You are an elite Staff Software Architect & Principal Engineering Mentor at DevHire.
Generate a custom, highly technical portfolio project blueprint designed specifically to prove mastery of these missing skills: ${missingSkills.join(", ")}.
Target Role: ${seniority} ${targetRole}.
Engineering Focus: ${userInterests}.

Return ONLY valid JSON matching this schema:
{
  "id": "proj-custom-ai",
  "title": "string (Compelling, production-grade project name)",
  "tagline": "string (One-line technical description of features and scale)",
  "difficulty": "Intermediate" | "Advanced" | "Expert",
  "estimatedWeeks": number (2-5),
  "targetSkills": ["string"],
  "architectureSummary": "string (Deep architectural paragraph)",
  "systemDesignOverview": "string (Numbered 1-4 step data flow and component topology)",
  "techStack": [
    { "layer": "Frontend" | "Backend" | "Database" | "Cache" | "DevOps" | "AI", "tech": "string", "reason": "string" }
  ],
  "phases": [
    {
      "phase": 1,
      "title": "string",
      "duration": "Week 1",
      "deliverables": ["string", "string", "string"],
      "gitMilestone": "string"
    }
  ],
  "portfolioChecklist": ["string", "string", "string"],
  "prdMarkdown": "string (Full markdown PRD formatted document)"
}`;

  const ollamaResponse = await callOllama(prompt, true);
  if (ollamaResponse) {
    try {
      const parsed = JSON.parse(ollamaResponse);
      if (parsed.title && parsed.phases) {
        return parsed;
      }
    } catch {
      // fallback
    }
  }

  // Deterministic high-caliber fallback tailored to the skills
  const skillsLabel = missingSkills.slice(0, 3).join(" & ") || "Full-Stack Architecture";
  return {
    id: `proj-ai-${Date.now()}`,
    title: `Distributed Real-Time Engine with ${skillsLabel}`,
    tagline: `High-concurrency microservice system engineered to demonstrate production mastery of ${missingSkills.join(", ")}.`,
    difficulty: seniority.includes("Senior") || seniority.includes("Staff") ? "Expert" : "Advanced",
    estimatedWeeks: 3,
    targetSkills: missingSkills.length > 0 ? missingSkills : ["Redis", "Docker", "PostgreSQL", "System Design"],
    architectureSummary: `An end-to-end distributed system orchestrating multi-region state synchronization, high-throughput caching with Redis, resilient database persistence via PostgreSQL, and automated CI/CD container orchestration with Docker.`,
    systemDesignOverview: `1. Ingestion Layer: REST & WebSocket gateway handles concurrent client requests with sliding-window rate limiters.
2. In-Memory Cache & Broker: Redis manages cache-aside caching, sub-millisecond session state, and pub/sub message broadcast.
3. Persistence & Relational Schema: PostgreSQL with ACID transactions, composite indexing, and database migrations.
4. Containerization & CI/CD: Docker Compose for local orchestration, multi-stage Dockerfile, and GitHub Actions automated test suites.`,
    techStack: [
      { layer: "Frontend", tech: "Next.js 15 & Tailwind CSS", reason: "Server Components, responsive glassmorphic UI, and live telemetry dashboards." },
      { layer: "Backend", tech: "Node.js / Express & TypeScript", reason: "Asynchronous event-driven I/O with strict type safety." },
      { layer: "Cache & Broker", tech: "Redis", reason: "Distributed locks, sliding-window rate limiting, and pub/sub events." },
      { layer: "Database", tech: "PostgreSQL & Prisma ORM", reason: "ACID compliance, composite indexing, and automated schema migrations." },
      { layer: "DevOps", tech: "Docker & GitHub Actions", reason: "Reproducible container builds and automated lint/test CI pipelines." },
    ],
    phases: [
      {
        phase: 1,
        title: "Relational Schema, Docker Environment & Core APIs",
        duration: "Week 1",
        deliverables: [
          "Setup multi-container Docker Compose with Node.js and PostgreSQL.",
          "Design Prisma relational schema with indexing and foreign key constraints.",
          "Implement JWT auth and input validation using Zod schemas.",
        ],
        gitMilestone: "feat(core): docker environment and prisma database schema",
      },
      {
        phase: 2,
        title: "Redis In-Memory Caching & Rate Limiting Engine",
        duration: "Week 2",
        deliverables: [
          "Build sliding-window rate limiter preventing API abuse (100 req/min).",
          "Implement cache-aside pattern with automatic TTL invalidation on updates.",
          "Run benchmark load tests with autocannon validating sub-15ms response times.",
        ],
        gitMilestone: "feat(perf): redis caching layer and sliding-window rate limiting",
      },
      {
        phase: 3,
        title: "Production Hardening, CI/CD & Visual Portfolio Documentation",
        duration: "Week 3",
        deliverables: [
          "Author comprehensive README with Mermaid system design diagrams.",
          "Configure GitHub Actions workflow for automated test assertions.",
          "Deploy live containerized demo and document performance benchmarks.",
        ],
        gitMilestone: "chore(deploy): github actions ci and architecture documentation",
      },
    ],
    portfolioChecklist: [
      "Public GitHub repository with clean Conventional Commit history",
      "Mermaid architecture diagram & setup instructions in README",
      "Quantifiable performance benchmarks (e.g. 95th percentile latency < 20ms)",
      "Live working demo deployment with HTTPS",
    ],
    prdMarkdown: `# Product Requirements Document (PRD)
## Project: Distributed Real-Time Engine with ${skillsLabel}

### 1. Objective
Build an industry-standard, production-ready portfolio piece demonstrating applied competence in ${missingSkills.join(", ")} for ${seniority} ${targetRole} positions.

### 2. Architecture & Data Flow
\`\`\`mermaid
graph TD
    Client[Client App / Web Dashboard] -->|HTTPS / WSS| Gateway[API Gateway & Rate Limiter]
    Gateway -->|Cache Check| Redis[(Redis In-Memory Cache)]
    Gateway -->|Durable Persistence| Postgres[(PostgreSQL DB)]
    Gateway -->|Container Runtime| Docker[Docker Swarm / Cloud]
\`\`\`

### 3. Deliverables Checklist
- [x] Docker-compose starts all services with zero environment drift.
- [x] Redis caching layer reduces database load by >70%.
- [x] Unit & integration test suites achieve >85% coverage.`,
  };
}

/**
 * AI Milestone Coach & Explainer
 */
export async function explainMilestoneAI(
  milestoneTitle: string,
  category: string,
  context: string = ""
): Promise<{ explanation: string; keyTakeaways: string[]; sampleCode: string; exercise: string }> {
  const prompt = `You are a Principal Engineering Instructor at DevHire.
Explain this roadmap milestone concept for a developer:
Milestone: "${milestoneTitle}"
Category: "${category}"
Context: "${context}"

Provide an intuitive explanation, 3 key engineering takeaways, a practical TypeScript/Bash/SQL code snippet, and a hands-on exercise challenge.
Return ONLY valid JSON:
{
  "explanation": "string (2-3 paragraphs with markdown)",
  "keyTakeaways": ["string", "string", "string"],
  "sampleCode": "string (executable code snippet with comments)",
  "exercise": "string (practical challenge)"
}`;

  const ollamaResponse = await callOllama(prompt, true);
  if (ollamaResponse) {
    try {
      const parsed = JSON.parse(ollamaResponse);
      if (parsed.explanation && parsed.keyTakeaways) {
        return parsed;
      }
    } catch {
      // fallback
    }
  }

  return {
    explanation: `### Mastering ${milestoneTitle}
In modern high-scale engineering, **${milestoneTitle}** is a critical capability. It transforms traditional monolithic workflows into resilient, distributed systems capable of handling millions of concurrent requests with predictable latency.

By implementing this pattern, you eliminate single-point-of-failure bottlenecks, decouple compute from state, and enable seamless horizontal scaling.`,
    keyTakeaways: [
      "Decouple stateful operations using in-memory or message broker layers.",
      "Always design with idempotency and graceful failure recovery in mind.",
      "Profile real-world performance metrics (p95 latency, throughput, memory footprint).",
    ],
    sampleCode: `// Example: Sliding-Window Rate Limiting with Redis & TypeScript
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function checkRateLimit(userId: string, limit = 60, windowSec = 60): Promise<{ allowed: boolean; remaining: number }> {
  const now = Date.now();
  const clearBefore = now - windowSec * 1000;
  const key = \`rate_limit:\${userId}\`;

  const multi = redis.multi();
  multi.zremrangebyscore(key, 0, clearBefore);
  multi.zadd(key, now, \`\${now}-\${Math.random()}\`);
  multi.zcard(key);
  multi.expire(key, windowSec);

  const results = await multi.exec();
  const requestCount = results?.[2]?.[1] as number;

  return {
    allowed: requestCount <= limit,
    remaining: Math.max(0, limit - requestCount),
  };
}`,
    exercise: `Challenge: Clone a sample Express/Next.js API and implement the Redis sliding-window middleware above. Simulate 100 concurrent requests using autocannon or curl to verify HTTP 429 status code handling.`,
  };
}

