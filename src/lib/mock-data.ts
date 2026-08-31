import { JobItem, CodingProblem, RoadmapMilestone, SkillGapAnalysis } from "./types";

export const INITIAL_SKILLS = [
  { name: "React", category: "Frontend" as const, proficiency: "Advanced" as const },
  { name: "TypeScript", category: "Frontend" as const, proficiency: "Advanced" as const },
  { name: "Node.js", category: "Backend" as const, proficiency: "Intermediate" as const },
  { name: "Express.js", category: "Backend" as const, proficiency: "Intermediate" as const },
  { name: "PostgreSQL", category: "Database" as const, proficiency: "Intermediate" as const },
  { name: "Tailwind CSS", category: "Frontend" as const, proficiency: "Expert" as const },
  { name: "Next.js", category: "Frontend" as const, proficiency: "Advanced" as const },
  { name: "Git", category: "DevOps" as const, proficiency: "Advanced" as const },
];

export const INITIAL_PROJECTS = [
  {
    title: "E-Commerce Real-time Analytics",
    description: "Built high-throughput event streaming pipeline with Next.js, Redis, and WebSockets.",
    techStack: "Next.js, TypeScript, Redis, Prisma, Tailwind CSS",
    repoUrl: "https://github.com/developer/ecommerce-analytics",
    liveUrl: "https://ecommerce-analytics-demo.app",
    highlights: "Reduced API response times by 45% using Redis caching.",
  },
  {
    title: "AI Document Summarizer",
    description: "Full-stack application to parse, chunk, and extract key insights from complex PDF documents.",
    techStack: "React, Node.js, Ollama, LangChain, PostgreSQL",
    repoUrl: "https://github.com/developer/ai-summarizer",
    liveUrl: "https://ai-summarizer-demo.app",
    highlights: "Processed 500+ documents with 98% extraction accuracy.",
  },
];

export const SAMPLE_JOBS: JobItem[] = [
  {
    id: "job-1",
    title: "Full Stack Engineer (AI Platform)",
    company: "ScaleFlow Technologies",
    location: "San Francisco, CA (Hybrid)",
    type: "Hybrid",
    salaryMin: 130000,
    salaryMax: 165000,
    experienceLevel: "Mid-Level",
    requiredSkills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "Docker", "Ollama"],
    description: "Join our core engineering team building high-performance AI developer tooling. You'll architect Next.js frontends and Node.js microservices.",
    applyUrl: "https://scaleflow.tech/careers/fullstack",
  },
  {
    id: "job-2",
    title: "Senior Frontend Engineer",
    company: "Veloce Cloud",
    location: "Remote (US/EU)",
    type: "Remote",
    salaryMin: 145000,
    salaryMax: 180000,
    experienceLevel: "Senior",
    requiredSkills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GraphQL", "Jest", "Performance"],
    description: "Lead frontend architecture for our cloud control plane. Deep focus on Web Vitals, micro-frontends, and design system engineering.",
    applyUrl: "https://veloce.cloud/jobs/senior-frontend",
  },
  {
    id: "job-3",
    title: "Backend & Systems Developer",
    company: "Apex Data Labs",
    location: "New York, NY (Onsite)",
    type: "Onsite",
    salaryMin: 120000,
    salaryMax: 150000,
    experienceLevel: "Mid-Level",
    requiredSkills: ["Node.js", "Express.js", "PostgreSQL", "Redis", "Docker", "Prisma", "AWS"],
    description: "Build robust REST & gRPC data ingestion pipelines handling millions of events daily.",
    applyUrl: "https://apexdata.io/careers/backend",
  },
  {
    id: "job-4",
    title: "Junior AI Application Engineer",
    company: "NeuralCraft",
    location: "Remote",
    type: "Remote",
    salaryMin: 85000,
    salaryMax: 110000,
    experienceLevel: "Junior",
    requiredSkills: ["JavaScript", "React", "Python", "Node.js", "LangChain", "Git"],
    description: "Exciting entry role for enthusiastic developers looking to bridge full-stack web and generative AI workflows.",
    applyUrl: "https://neuralcraft.ai/jobs/junior-ai",
  },
  {
    id: "job-5",
    title: "Lead Platform Architect",
    company: "CyberMatrix Global",
    location: "Austin, TX (Remote Optional)",
    type: "Remote",
    salaryMin: 175000,
    salaryMax: 215000,
    experienceLevel: "Lead",
    requiredSkills: ["TypeScript", "Node.js", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "CI/CD"],
    description: "Spearhead our multi-tenant distributed cloud infrastructure serving over 2M active developers worldwide.",
    applyUrl: "https://cybermatrix.global/careers/platform-lead",
  },
];

export const CODING_PROBLEMS: CodingProblem[] = [
  {
    id: "two-sum",
    title: "1. Two Sum",
    difficulty: "Easy",
    category: "Array & Hash Table",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your solution here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    },
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1] },
      { input: [[1, 5, 9, 12, 18], 21], expected: [2, 3] },
    ],
  },
  {
    id: "valid-parentheses",
    title: "20. Valid Parentheses",
    difficulty: "Easy",
    category: "Stack & String",
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  
  for (let char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.length === 0 || stack.pop() !== map[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`,
      typescript: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.length === 0 || stack.pop() !== map[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`,
    },
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'.",
    ],
    testCases: [
      { input: ["()"], expected: true },
      { input: ["()[]{}"], expected: true },
      { input: ["(]"], expected: false },
      { input: ["([{}])"], expected: true },
      { input: ["((("], expected: false },
    ],
  },
  {
    id: "lru-cache",
    title: "146. LRU Cache Implementation",
    difficulty: "Medium",
    category: "Design & Hash Table",
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(capacity)\` Initialize the LRU cache with positive size \`capacity\`.
- \`get(key)\` Return the value of the \`key\` if the key exists, otherwise return \`-1\`.
- \`put(key, value)\` Update the value of the \`key\` if the \`key\` exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\` from this operation, evict the least recently used key.

The functions \`get\` and \`put\` must each run in \`O(1)\` average time complexity.`,
    starterCode: {
      javascript: `class LRUCache {
  /**
   * @param {number} capacity
   */
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  /** 
   * @param {number} key
   * @return {number}
   */
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  /** 
   * @param {number} key 
   * @param {number} value
   * @return {void}
   */
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}

// Wrapper function for test cases
function testLRU(ops, params) {
  let cache = null;
  const result = [];
  for (let i = 0; i < ops.length; i++) {
    if (ops[i] === "LRUCache") {
      cache = new LRUCache(params[i][0]);
      result.push(null);
    } else if (ops[i] === "put") {
      cache.put(params[i][0], params[i][1]);
      result.push(null);
    } else if (ops[i] === "get") {
      result.push(cache.get(params[i][0]));
    }
  }
  return result;
}`,
      typescript: `class LRUCache {
  private capacity: number;
  private cache: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}`,
    },
    examples: [
      {
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: "[null, null, null, 1, null, -1, null, -1, 3, 4]",
      },
    ],
    constraints: ["1 <= capacity <= 3000", "0 <= key <= 10^4", "0 <= value <= 10^5"],
    testCases: [
      {
        input: [
          ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"],
          [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]],
        ],
        expected: [null, null, null, 1, null, -1, null, -1, 3, 4],
      },
    ],
  },
];

export const DEFAULT_ROADMAP: RoadmapMilestone[] = [
  {
    id: "m-1",
    title: "1. Advanced Docker & Containerization",
    description: "Master multi-stage Docker builds, docker-compose orchestration, and container networking.",
    category: "DevOps",
    weeksToComplete: 1,
    completed: true,
    resources: [
      { title: "Docker Official Docs for Node.js", url: "https://docs.docker.com/language/nodejs/", type: "documentation" },
      { title: "Multi-stage Build Best Practices", url: "https://docs.docker.com/build/building/multi-stage/", type: "tutorial" },
    ],
  },
  {
    id: "m-2",
    title: "2. Redis Caching & Asynchronous Task Queues",
    description: "Implement distributed in-memory caching, rate-limiting, and BullMQ worker queues.",
    category: "Backend",
    weeksToComplete: 2,
    completed: false,
    resources: [
      { title: "Redis for Modern Full-Stack Apps", url: "https://redis.io/docs/", type: "documentation" },
      { title: "Building Resilient Queues with Redis", url: "https://bullmq.io/", type: "tutorial" },
    ],
  },
  {
    id: "m-3",
    title: "3. Vector Search & RAG Architecture",
    description: "Implement pgvector similarity searches, chunking strategies, and LangChain embeddings.",
    category: "AI",
    weeksToComplete: 2,
    completed: false,
    resources: [
      { title: "pgvector PostgreSQL Extension Guide", url: "https://github.com/pgvector/pgvector", type: "documentation" },
      { title: "Retrieval Augmented Generation Patterns", url: "https://www.deeplearning.ai", type: "course" },
    ],
  },
  {
    id: "m-4",
    title: "4. System Design & Microservice Resiliency",
    description: "Architect rate-limiting, idempotent API endpoints, circuit breakers, and distributed tracing.",
    category: "Architecture",
    weeksToComplete: 2,
    completed: false,
    resources: [
      { title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", type: "project" },
      { title: "Twelve-Factor App Methodology", url: "https://12factor.net/", type: "documentation" },
    ],
  },
];
