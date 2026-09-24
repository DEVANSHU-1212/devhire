import {
  JobItem,
  SkillItem,
  SkillGapAnalysis,
  SeniorityLevel,
  MissingSkill,
  SalaryImpactItem,
  SkillBenchmarkItem,
  ProjectBlueprint,
  RoadmapMilestone,
} from "./types";
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
      (cSkill) =>
        cSkill === req.toLowerCase().trim() ||
        cSkill.includes(req.toLowerCase().trim()) ||
        req.toLowerCase().trim().includes(cSkill)
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

// Market impact multiplier database for skills
const SKILL_MARKET_IMPACT: Record<
  string,
  { salaryBoostAvg: number; demandIndex: number; category: string; rationale: string }
> = {
  Docker: {
    salaryBoostAvg: 14000,
    demandIndex: 94,
    category: "DevOps",
    rationale: "Universal industry standard for containerized microservices and reproducible dev environments.",
  },
  Redis: {
    salaryBoostAvg: 16500,
    demandIndex: 91,
    category: "Backend",
    rationale: "Crucial for sub-millisecond caching, distributed rate limiting, and pub/sub task brokers.",
  },
  Kubernetes: {
    salaryBoostAvg: 22000,
    demandIndex: 88,
    category: "Cloud",
    rationale: "Required for high-scale enterprise cloud infrastructure and orchestrating zero-downtime deployments.",
  },
  AWS: {
    salaryBoostAvg: 18000,
    demandIndex: 96,
    category: "Cloud",
    rationale: "Dominant cloud provider with high hiring density across startups and enterprise tiers.",
  },
  "System Design": {
    salaryBoostAvg: 25000,
    demandIndex: 98,
    category: "Architecture",
    rationale: "Primary gatekeeper skill for Mid to Senior/Staff promotions and top-tier compensation bands.",
  },
  pgvector: {
    salaryBoostAvg: 20000,
    demandIndex: 89,
    category: "AI",
    rationale: "Enables production RAG architectures directly within scalable PostgreSQL databases.",
  },
  LangChain: {
    salaryBoostAvg: 17500,
    demandIndex: 85,
    category: "AI",
    rationale: "Accelerates enterprise LLM agent orchestration, memory, and multi-model tool pipelines.",
  },
  GraphQL: {
    salaryBoostAvg: 12000,
    demandIndex: 82,
    category: "Frontend",
    rationale: "Prevents over-fetching and powers decoupled micro-frontend / mobile API gateways.",
  },
  Kafka: {
    salaryBoostAvg: 21000,
    demandIndex: 90,
    category: "Backend",
    rationale: "Backbone of high-throughput real-time distributed streaming and event-driven architectures.",
  },
  PostgreSQL: {
    salaryBoostAvg: 15000,
    demandIndex: 95,
    category: "Database",
    rationale: "Most loved relational database with rich indexing, JSONB, ACID guarantees, and pgvector support.",
  },
  "CI/CD": {
    salaryBoostAvg: 13500,
    demandIndex: 92,
    category: "DevOps",
    rationale: "Essential for modern continuous delivery pipelines, automated testing, and security scanning.",
  },
};

/**
 * Generates Skill Gap Analysis, Benchmarks, Salary ROI, and Project Blueprint for a target role
 */
export function generateSkillGap(
  targetRole: string,
  userSkills: string[] | SkillItem[],
  seniority: SeniorityLevel = "Mid-Level"
): SkillGapAnalysis {
  const normalizedUserSkills = new Set(
    userSkills.map((s) => (typeof s === "string" ? s.toLowerCase().trim() : s.name.toLowerCase().trim()))
  );

  // Role archetypes with core vs advanced requirements
  const roleSkillProfiles: Record<
    string,
    {
      base: string[];
      seniorAdditions: string[];
      staffAdditions: string[];
      categoryMap: Record<string, string>;
      defaultProject: ProjectBlueprint;
    }
  > = {
    "Full Stack Developer": {
      base: ["React", "TypeScript", "Node.js", "Express.js", "PostgreSQL", "Redis", "Docker", "Git", "REST API", "Tailwind CSS"],
      seniorAdditions: ["System Design", "AWS", "CI/CD", "GraphQL", "Jest"],
      staffAdditions: ["Kubernetes", "Microservices", "Observability", "Database Sharding"],
      categoryMap: {
        Docker: "DevOps",
        Redis: "Backend",
        PostgreSQL: "Database",
        TypeScript: "Frontend",
        "Express.js": "Backend",
        "System Design": "Architecture",
        AWS: "Cloud",
        "CI/CD": "DevOps",
        Kubernetes: "Cloud",
        GraphQL: "Frontend",
      },
      defaultProject: {
        id: "proj-fs-1",
        title: "Distributed Collaborative Workspace & Real-Time Analytics",
        tagline: "High-concurrency document canvas with Redis caching, WebSockets, and Docker orchestration",
        difficulty: "Advanced",
        estimatedWeeks: 3,
        targetSkills: ["Redis", "Docker", "WebSockets", "System Design", "PostgreSQL"],
        architectureSummary: "Micro-service architecture combining a Next.js 15 client, Node.js WebSocket gateway, Redis pub/sub broker for cluster scaling, and PostgreSQL with Prisma ORM for durable persistence.",
        systemDesignOverview: `1. Client connects via WSS (WebSocket Secure) through Nginx reverse proxy.
2. In-memory session state & rate limits managed by Redis cluster.
3. Document deltas broadcasted using Redis Pub/Sub channels across multi-instance nodes.
4. Asynchronous snapshot workers persist documents to PostgreSQL with ACID transactions.`,
        techStack: [
          { layer: "Frontend", tech: "Next.js 15 & React 19", reason: "Server components for instant load & responsive glassmorphic UI." },
          { layer: "Real-time Gateway", tech: "Node.js & WebSockets (ws)", reason: "Low-latency bi-directional synchronization." },
          { layer: "Cache & Broker", tech: "Redis (Pub/Sub & Hashes)", reason: "Cross-instance state broadcast and sub-millisecond rate limiting." },
          { layer: "Persistence", tech: "PostgreSQL & Prisma", reason: "Type-safe relational data model with composite indexes." },
          { layer: "DevOps", tech: "Docker & Docker Compose", reason: "Multi-container local & cloud production environment orchestration." },
        ],
        phases: [
          {
            phase: 1,
            title: "Core Multi-Tenant Schema & REST Ingestion",
            duration: "Week 1",
            deliverables: [
              "Design Prisma schema with User, Workspace, Document, and Revision models.",
              "Implement JWT authentication middleware with bcrypt hashing.",
              "Setup Dockerized PostgreSQL and automated migration pipelines.",
            ],
            gitMilestone: "feat(core): initial multi-tenant schema and docker setup",
          },
          {
            phase: 2,
            title: "Redis Caching & Sliding-Window Rate Limiting",
            duration: "Week 2",
            deliverables: [
              "Implement Redis sliding-window algorithm for API protection (100 req/min).",
              "Add cache-aside layer for document metadata with TTL invalidation.",
              "Benchmark cache hit ratio (targeting >85%) using autocannon.",
            ],
            gitMilestone: "feat(perf): redis caching layer and rate limiter",
          },
          {
            phase: 3,
            title: "Real-Time WebSocket Sync & Pub/Sub Cluster",
            duration: "Week 3",
            deliverables: [
              "Build WebSocket server with heartbeat health checks and room isolation.",
              "Hook Redis Pub/Sub adapter to sync broadcast events across worker instances.",
              "Implement conflict resolution for simultaneous character edits.",
            ],
            gitMilestone: "feat(realtime): redis pubsub websocket gateway",
          },
          {
            phase: 4,
            title: "Production Hardening, CI/CD & Documentation",
            duration: "Week 4",
            deliverables: [
              "Create multi-stage Dockerfile with non-root user security practices.",
              "Setup GitHub Actions workflow for linting, type-checking, and unit tests.",
              "Author comprehensive architectural README with Mermaid system diagrams.",
            ],
            gitMilestone: "chore(deploy): github actions ci and architecture docs",
          },
        ],
        portfolioChecklist: [
          "Live demo URL hosted with SSL certificate",
          "GitHub README with Mermaid architecture diagram and setup guide",
          "Documented performance benchmarks (e.g. latency under 1,000 concurrent sockets)",
          "Clean commit history following Conventional Commits format",
        ],
        prdMarkdown: `# Product Requirements Document (PRD)
## Project: Distributed Collaborative Workspace & Real-Time Analytics

### 1. Executive Summary
A production-grade distributed document and whiteboard collaboration platform designed to demonstrate proficiency in high-concurrency Node.js architectures, Redis caching, and Docker orchestration.

### 2. Key Architecture Vectors
- **Low Latency**: <50ms end-to-end delta delivery via WebSockets.
- **Scalability**: Redis Pub/Sub broker enabling horizontal scaling across arbitrary backend container replicas.
- **Resilience**: Redis sliding-window rate limiters with graceful 429 back-pressure handling.

### 3. Verification Criteria
- [x] Supports 500 simultaneous socket connections per node instance.
- [x] Database queries optimized with composite indexes (p95 < 15ms).
- [x] Docker-compose starts all services with zero manual configuration.`,
      },
    },
    "Frontend Engineer": {
      base: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux", "Jest", "Web Vitals", "Git", "GraphQL"],
      seniorAdditions: ["Design Systems", "Performance Profiling", "Micro-Frontends", "CI/CD"],
      staffAdditions: ["Custom Renderers", "Web Workers", "WASM Integration", "Architecture Governance"],
      categoryMap: {
        "Next.js": "Frontend",
        "Web Vitals": "Frontend",
        Jest: "Testing",
        GraphQL: "Frontend",
        "Design Systems": "Frontend",
        "Performance Profiling": "Frontend",
      },
      defaultProject: {
        id: "proj-fe-1",
        title: "High-Performance Enterprise Design System & Micro-Frontend Hub",
        tagline: "Accessible, zero-runtime CSS tokens with automated Visual Regression & Core Web Vitals telemetry",
        difficulty: "Advanced",
        estimatedWeeks: 3,
        targetSkills: ["Design Systems", "Web Vitals", "GraphQL", "Jest", "TypeScript"],
        architectureSummary: "Modular component library published as NPM package with Storybook 8, Radix UI primitives, Tailwind CSS v3 token engine, and automated Lighthouse CI performance auditing.",
        systemDesignOverview: `1. Storybook interactive documentation workbench with automated accessibility (a11y) audits.
2. Micro-frontend shell utilizing module federation for isolated domain deploys.
3. GraphQL Apollo client with normalized cache and optimistic UI mutations.
4. Automated Playwright visual regression testing on every GitHub pull request.`,
        techStack: [
          { layer: "Component Framework", tech: "React 19 & Next.js 15", reason: "Server and Client Component boundaries with React compiler." },
          { layer: "UI Primitives", tech: "Radix UI & Tailwind CSS", reason: "Unstyled accessible foundations with custom token scales." },
          { layer: "Data Layer", tech: "GraphQL & TanStack Query", reason: "Fine-grained query cache and optimistic updates." },
          { layer: "Testing Suite", tech: "Jest, React Testing Library & Playwright", reason: "Full coverage from unit logic to visual regression." },
        ],
        phases: [
          {
            phase: 1,
            title: "Design System Architecture & Accessible Primitives",
            duration: "Week 1",
            deliverables: [
              "Create token architecture (colors, typography, elevation, spacing).",
              "Build accessible Modal, Combobox, Data Table, and Toast components.",
              "Setup Storybook 8 with dark mode toggle and documentation MDX pages.",
            ],
            gitMilestone: "feat(ui): design system tokens and core primitives",
          },
          {
            phase: 2,
            title: "GraphQL Gateway & Optimistic UI Mutations",
            duration: "Week 2",
            deliverables: [
              "Define GraphQL schema with pagination and filtering types.",
              "Implement TanStack Query hooks with instant optimistic updates.",
              "Add offline queueing and toast synchronization.",
            ],
            gitMilestone: "feat(data): graphql integration and optimistic updates",
          },
          {
            phase: 3,
            title: "Performance Optimization & Web Vitals Telemetry",
            duration: "Week 3",
            deliverables: [
              "Optimize INP (Interaction to Next Paint) under 100ms.",
              "Implement image optimization and font subsetting for LCP < 1.2s.",
              "Setup custom Web Vitals reporting analytics hook.",
            ],
            gitMilestone: "perf(vitals): web vitals optimization and analytics",
          },
        ],
        portfolioChecklist: [
          "Interactive Storybook hosted on Vercel/GitHub Pages",
          "Lighthouse Score 100 on Performance, Accessibility, Best Practices, SEO",
          "Comprehensive unit tests with >85% code coverage report",
        ],
        prdMarkdown: `# Product Requirements Document (PRD)
## Project: High-Performance Enterprise Design System

### 1. Goal
Provide an enterprise-ready UI component library and dashboard shell highlighting mastery of React 19, accessible design systems, and Core Web Vitals optimization.`,
      },
    },
    "Backend / Systems Engineer": {
      base: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "CI/CD", "System Design"],
      seniorAdditions: ["Kafka", "gRPC", "Distributed Tracing", "Database Sharding"],
      staffAdditions: ["Consensus Algorithms", "Multi-Region Replication", "Chaos Engineering"],
      categoryMap: {
        Redis: "Backend",
        Docker: "DevOps",
        Kubernetes: "Cloud",
        AWS: "Cloud",
        "System Design": "Architecture",
        Kafka: "Backend",
        gRPC: "Backend",
      },
      defaultProject: {
        id: "proj-be-1",
        title: "High-Throughput Financial Ledger & Event-Driven Ingestion Engine",
        tagline: "ACID-compliant double-entry ledger with Kafka event streaming and Redis idempotent deduplication",
        difficulty: "Expert",
        estimatedWeeks: 4,
        targetSkills: ["System Design", "Redis", "Docker", "Kubernetes", "PostgreSQL", "Kafka"],
        architectureSummary: "High-resilience distributed microservices processing financial transactions with double-entry accounting guarantees, Kafka partitions for ordered processing, and Redis distributed locks.",
        systemDesignOverview: `1. Ingestion API validates payload via Zod and issues idempotency key verification.
2. Kafka partitions event streams by account UUID to preserve strict transactional ordering.
3. Worker services acquire Redis Redlock, execute double-entry balance modifications within serializable DB transactions.
4. Prometheus & Grafana scrape Prometheus metrics for p99 latency and queue depth.`,
        techStack: [
          { layer: "Runtime", tech: "Node.js & Go / TypeScript", reason: "High-speed concurrent I/O event processing." },
          { layer: "Event Streaming", tech: "Apache Kafka", reason: "Distributed, partitioned, durable log with replay capabilities." },
          { layer: "Distributed Locking", tech: "Redis (Redlock algorithm)", reason: "Prevents double-spend race conditions across worker nodes." },
          { layer: "Storage", tech: "PostgreSQL (Serializable)", reason: "Strict ACID guarantees for financial ledger entries." },
          { layer: "Infrastructure", tech: "Docker & Kubernetes Helm Charts", reason: "Declarative cluster configuration and auto-scaling." },
        ],
        phases: [
          {
            phase: 1,
            title: "Double-Entry Accounting Schema & ACID Transactions",
            duration: "Week 1",
            deliverables: [
              "Design schema with Account, JournalEntry, Posting, and AuditLog tables.",
              "Implement database constraints preventing negative balances and unbalanced entries.",
              "Write integration test suite validating ACID serializability.",
            ],
            gitMilestone: "feat(ledger): double-entry accounting core",
          },
          {
            phase: 2,
            title: "Kafka Event Pipeline & Idempotent Ingestion",
            duration: "Week 2",
            deliverables: [
              "Setup Kafka broker with partitioned topics keyed by account ID.",
              "Build idempotency filter using Redis key expiration and atomic transactions.",
              "Implement dead-letter queue (DLQ) for failed payload inspection.",
            ],
            gitMilestone: "feat(kafka): distributed event ingestion pipeline",
          },
          {
            phase: 3,
            title: "Distributed Locking & Concurrency Stress Testing",
            duration: "Week 3",
            deliverables: [
              "Implement Redis Redlock algorithm for distributed mutual exclusion.",
              "Conduct load testing with k6 simulating 5,000 concurrent transfers.",
              "Verify zero race conditions or phantom balances under high concurrency.",
            ],
            gitMilestone: "perf(concurrency): distributed locking and stress test",
          },
          {
            phase: 4,
            title: "Observability, Kubernetes Deployment & Grafana Dashboards",
            duration: "Week 4",
            deliverables: [
              "Export OpenTelemetry traces and Prometheus metrics.",
              "Create Kubernetes manifests (Deployments, Services, ConfigMaps, HPA).",
              "Author system design deep-dive documenting throughput and failure recovery.",
            ],
            gitMilestone: "ops(k8s): helm charts and grafana dashboards",
          },
        ],
        portfolioChecklist: [
          "k6 stress test benchmark logs demonstrating 0 ledger balance discrepancies",
          "Kubernetes deployment manifests with horizontal pod autoscaler (HPA)",
          "Grafana dashboard screenshot showcasing p99 latency and queue lag",
        ],
        prdMarkdown: `# Product Requirements Document (PRD)
## Project: High-Throughput Financial Ledger & Event Ingestion Engine

### 1. Architectural Mission
Design a resilient distributed transactional ledger to demonstrate senior-level mastery of distributed systems, concurrency control, event streaming, and cloud infrastructure.`,
      },
    },
    "AI / ML Application Engineer": {
      base: ["Python", "TypeScript", "React", "LangChain", "Ollama", "pgvector", "FastAPI", "Docker", "RAG"],
      seniorAdditions: ["Agentic Workflows", "Vector Search Optimization", "Fine-Tuning", "Evaluation Rubrics"],
      staffAdditions: ["Multi-Agent Consensus", "DSPy Optimization", "Low-Latency Speculative Decoding"],
      categoryMap: {
        LangChain: "AI",
        Ollama: "AI",
        pgvector: "Database",
        RAG: "AI",
        FastAPI: "Backend",
        Python: "AI",
        Docker: "DevOps",
      },
      defaultProject: {
        id: "proj-ai-1",
        title: "Autonomous Multi-Agent Code Reviewer & Production RAG Knowledge Base",
        tagline: "Multi-agent LLM pipeline with pgvector semantic search, AST code graph analysis, and automated PR evaluations",
        difficulty: "Advanced",
        estimatedWeeks: 3,
        targetSkills: ["pgvector", "LangChain", "RAG", "FastAPI", "Docker", "Python"],
        architectureSummary: "Autonomous AI agent architecture using FastAPI, pgvector similarity search with hybrid keyword ranking, LangChain tool calling, and local Ollama / Gemini fallback.",
        systemDesignOverview: `1. Codebase repository parsed into AST chunks and embedded via text-embedding-3 / nomic-embed.
2. High-dimensional embeddings stored in PostgreSQL with pgvector HNSW indexing.
3. Multi-agent review crew (Security, Performance, Style) reviews PR diffs with grounded citations.
4. Next.js 15 interactive frontend streams token responses via Server-Sent Events (SSE).`,
        techStack: [
          { layer: "AI Orchestration", tech: "LangChain & Ollama / Gemini", reason: "Agent tool calling, memory management, and model agnosticism." },
          { layer: "Vector Database", tech: "PostgreSQL & pgvector", reason: "HNSW index for sub-5ms semantic similarity search." },
          { layer: "Backend API", tech: "FastAPI & Python 3.11", reason: "Asynchronous high-speed endpoints with Pydantic typing." },
          { layer: "Frontend UI", tech: "Next.js 15 & Tailwind CSS", reason: "Streaming chat UI with syntax highlighting and diff viewers." },
        ],
        phases: [
          {
            phase: 1,
            title: "Semantic Chunking & pgvector HNSW Storage",
            duration: "Week 1",
            deliverables: [
              "Build AST-aware recursive text splitter for TypeScript and Python files.",
              "Setup PostgreSQL with pgvector extension and create HNSW cosine index.",
              "Implement hybrid search combining BM25 full-text search with vector embeddings.",
            ],
            gitMilestone: "feat(rag): semantic chunking and pgvector search",
          },
          {
            phase: 2,
            title: "Multi-Agent Review Pipeline & Tool Calling",
            duration: "Week 2",
            deliverables: [
              "Create specialized agent personas: Security Auditor, Performance Guru, Architect.",
              "Implement LangChain tool calling for file system reading and Git diff parsing.",
              "Add token-efficient reflection loop for hallucination prevention.",
            ],
            gitMilestone: "feat(agents): multi-agent review crew and tool calling",
          },
          {
            phase: 3,
            title: "Streaming UI & Automated Evaluation Benchmarks",
            duration: "Week 3",
            deliverables: [
              "Build streaming Server-Sent Events (SSE) interface in Next.js 15.",
              "Implement automated RAG evaluation rubric (Faithfulness, Answer Relevance).",
              "Package full stack with Docker Compose and local Ollama model preloading.",
            ],
            gitMilestone: "feat(ui): streaming nextjs interface and eval benchmarks",
          },
        ],
        portfolioChecklist: [
          "Live demo repository with video walkthrough of automated PR review",
          "Automated RAG benchmark test suite proving >92% grounding accuracy",
          "Docker Compose configuration with 1-command startup",
        ],
        prdMarkdown: `# Product Requirements Document (PRD)
## Project: Autonomous Multi-Agent Code Reviewer & RAG Engine

### 1. Vision
Build a production-grade generative AI application showcasing state-of-the-art RAG, vector database indexing, and multi-agent coordination.`,
      },
    },
    "Cloud / DevOps Platform Engineer": {
      base: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Linux", "Git", "Python", "Prometheus"],
      seniorAdditions: ["GitOps (ArgoCD)", "Service Mesh (Istio)", "Security Scanning", "Cost Optimization"],
      staffAdditions: ["Multi-Cluster Federation", "Zero-Trust Architecture", "Custom K8s Operators"],
      categoryMap: {
        Docker: "DevOps",
        Kubernetes: "Cloud",
        AWS: "Cloud",
        Terraform: "DevOps",
        "CI/CD": "DevOps",
        Linux: "DevOps",
        Prometheus: "DevOps",
      },
      defaultProject: {
        id: "proj-devops-1",
        title: "Enterprise GitOps Kubernetes Platform with Automated Canary Deployments",
        tagline: "Infrastructure as Code with Terraform, ArgoCD GitOps, Prometheus observability, and Istio traffic splitting",
        difficulty: "Advanced",
        estimatedWeeks: 3,
        targetSkills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"],
        architectureSummary: "End-to-end cloud platform provisioning AWS EKS clusters with Terraform, automated ArgoCD GitOps continuous deployment, and Prometheus/Grafana monitoring.",
        systemDesignOverview: `1. Terraform provisions VPC, subnets, IAM roles, and AWS EKS cluster.
2. ArgoCD synchronizes desired state from Git repository to Kubernetes clusters.
3. Flagger & Istio orchestrate automated canary analysis based on Prometheus error rates.
4. GitHub Actions runs Trivy security scans and builds signed container images.`,
        techStack: [
          { layer: "IaC", tech: "Terraform", reason: "Declarative modular cloud infrastructure provisioning." },
          { layer: "Orchestration", tech: "Kubernetes & Helm", reason: "Microservice scaling, health probing, and secret management." },
          { layer: "GitOps", tech: "ArgoCD", reason: "Continuous delivery with automated rollback on drift." },
          { layer: "Monitoring", tech: "Prometheus & Grafana", reason: "Cluster metric scraping and custom alerting rules." },
        ],
        phases: [
          {
            phase: 1,
            title: "Terraform AWS Modular Infrastructure",
            duration: "Week 1",
            deliverables: [
              "Author reusable Terraform modules for VPC, EKS, and IAM policies.",
              "Configure remote S3 state backend with DynamoDB state locking.",
              "Validate infrastructure provisioning with tflint and checkov security checks.",
            ],
            gitMilestone: "feat(iac): terraform modular eks cluster setup",
          },
          {
            phase: 2,
            title: "ArgoCD GitOps & Helm Deployments",
            duration: "Week 2",
            deliverables: [
              "Deploy ArgoCD controller and configure application-set CRDs.",
              "Create parameterized Helm chart for microservice deployments.",
              "Setup sealed-secrets for encrypted Git secret management.",
            ],
            gitMilestone: "feat(gitops): argocd application controller and helm charts",
          },
          {
            phase: 3,
            title: "Canary Rollouts & Observability Stack",
            duration: "Week 3",
            deliverables: [
              "Configure Prometheus, Grafana, and Alertmanager stack.",
              "Setup automated canary rollouts with Flagger metric triggers.",
              "Author incident runbook and post-mortem template.",
            ],
            gitMilestone: "ops(observability): prometheus metrics and canary deployments",
          },
        ],
        portfolioChecklist: [
          "Terraform code repository with Clean Architecture module structure",
          "Screenshots of ArgoCD GitOps sync and Grafana cluster dashboards",
          "Automated GitHub Actions CI/CD with Trivy vulnerability reports",
        ],
        prdMarkdown: `# Product Requirements Document (PRD)
## Project: Enterprise GitOps Kubernetes Cloud Platform`,
      },
    },
  };

  const targetProfile = roleSkillProfiles[targetRole] || roleSkillProfiles["Full Stack Developer"];

  // Assemble full required skill list based on seniority level
  let requiredList = [...targetProfile.base];
  if (seniority === "Senior" || seniority === "Staff / Lead" || seniority === "Principal") {
    requiredList = [...requiredList, ...targetProfile.seniorAdditions];
  }
  if (seniority === "Staff / Lead" || seniority === "Principal") {
    requiredList = [...requiredList, ...targetProfile.staffAdditions];
  }

  const matchedSkills: string[] = [];
  const rawMissingSkills: { name: string; index: number }[] = [];

  requiredList.forEach((req, idx) => {
    if (normalizedUserSkills.has(req.toLowerCase())) {
      matchedSkills.push(req);
    } else {
      rawMissingSkills.push({ name: req, index: idx });
    }
  });

  const missingSkills: MissingSkill[] = rawMissingSkills.map(({ name, index }) => {
    const marketInfo = SKILL_MARKET_IMPACT[name];
    const category = targetProfile.categoryMap[name] || marketInfo?.category || "Core Skill";
    const priority: "High" | "Medium" | "Low" =
      index < 4 ? "High" : index < 8 ? "Medium" : "Low";
    const estimatedWeeks = index < 3 ? 2 : index < 7 ? 1 : 1;
    const impactScore = marketInfo ? Math.round(marketInfo.demandIndex / 10) : 7;

    return {
      name,
      priority,
      estimatedWeeks,
      category,
      impactScore,
      description:
        marketInfo?.rationale || `Key market requirement for ${seniority} ${targetRole} positions.`,
    };
  });

  const missingCategorized = {
    core: missingSkills.filter((s) => s.priority === "High"),
    accelerators: missingSkills.filter((s) => s.priority === "Medium"),
    bonus: missingSkills.filter((s) => s.priority === "Low"),
  };

  // Salary ROI impact calculation
  const salaryImpacts: SalaryImpactItem[] = missingSkills
    .filter((s) => SKILL_MARKET_IMPACT[s.name])
    .map((s) => {
      const info = SKILL_MARKET_IMPACT[s.name];
      return {
        skill: s.name,
        salaryBoostAvg: info.salaryBoostAvg,
        demandIndex: info.demandIndex,
        category: info.category,
        rationale: info.rationale,
      };
    })
    .sort((a, b) => b.salaryBoostAvg - a.salaryBoostAvg);

  const totalProjectedSalaryBoost = salaryImpacts.reduce((acc, curr) => acc + curr.salaryBoostAvg, 0);

  // Skill Benchmark Radar Data
  const categories = ["Frontend", "Backend", "Database", "Cloud", "DevOps", "AI", "Architecture"];
  const benchmarks: SkillBenchmarkItem[] = categories.map((cat) => {
    const categorySkillsInRole = requiredList.filter(
      (s) => (targetProfile.categoryMap[s] || "General") === cat
    );
    const totalCat = Math.max(categorySkillsInRole.length, 1);
    const candidateCatMatched = categorySkillsInRole.filter((s) =>
      normalizedUserSkills.has(s.toLowerCase())
    ).length;

    const candidateScore = Math.round((candidateCatMatched / totalCat) * 100);
    // Market benchmark standards: Junior 55%, Mid 75%, Senior 85%, Staff 92%
    const marketBenchmark =
      seniority === "Junior"
        ? 60
        : seniority === "Mid-Level"
        ? 75
        : seniority === "Senior"
        ? 88
        : 95;

    return {
      category: cat,
      candidateScore: Math.min(candidateScore + (candidateScore > 0 ? 10 : 0), 100),
      marketBenchmark,
      fullMark: 100,
    };
  });

  const readinessScore = Math.min(
    Math.round((matchedSkills.length / Math.max(requiredList.length, 1)) * 100),
    100
  );

  return {
    targetRole,
    seniority,
    readinessScore,
    matchedSkills,
    missingSkills,
    missingCategorized,
    salaryImpacts,
    totalProjectedSalaryBoost,
    benchmarks,
    milestones: DEFAULT_ROADMAP,
    suggestedProject: targetProfile.defaultProject,
  };
}

