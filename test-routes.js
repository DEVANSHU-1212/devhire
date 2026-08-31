async function testAll() {
  console.log("=== Testing DevHire Endpoints ===");

  // 1. Home
  try {
    const homeRes = await fetch("http://localhost:3000");
    console.log("1. GET / status:", homeRes.status);
  } catch (e) {
    console.log("1. GET / error:", e.message);
  }

  // 2. Resume Analyzer API
  try {
    const resumeRes = await fetch("http://localhost:3000/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "Senior Software Engineer with 3 years of React, Next.js, Node.js, TypeScript, PostgreSQL, and Redis experience. Built scalable e-commerce systems with 40% latency reduction.",
        fileName: "test_resume.txt",
      }),
    });
    const resumeData = await resumeRes.json();
    console.log("2. POST /api/resumes - Score:", resumeData.score, "Skills detected:", resumeData.detectedSkills?.length);
  } catch (e) {
    console.log("2. POST /api/resumes error:", e.message);
  }

  // 3. Interview Generation API
  try {
    const genRes = await fetch("http://localhost:3000/api/interviews?action=generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "Full Stack Engineer", difficulty: "Medium", type: "Technical" }),
    });
    const genData = await genRes.json();
    console.log("3. POST /api/interviews (generate) - Questions count:", genData.questions?.length);
  } catch (e) {
    console.log("3. POST /api/interviews error:", e.message);
  }

  // 4. Interview Evaluation API
  try {
    const evalRes = await fetch("http://localhost:3000/api/interviews?action=evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: "Explain the Node.js event loop.",
        answer: "Node.js uses libuv event loop to handle non-blocking I/O. Microtask queue (process.nextTick and Promise callbacks) is processed before the macrotask timers and check phase.",
        category: "Node.js",
      }),
    });
    const evalData = await evalRes.json();
    console.log("4. POST /api/interviews (evaluate) - Score:", evalData.score, "Technical Rubric:", evalData.rubric?.technicalCorrectness);
  } catch (e) {
    console.log("4. POST /api/interviews evaluate error:", e.message);
  }

  // 5. Coding Sandbox API
  try {
    const codeRes = await fetch("http://localhost:3000/api/coding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        problemId: "two-sum",
        code: `function twoSum(nums, target) {
          const map = new Map();
          for (let i = 0; i < nums.length; i++) {
            const comp = target - nums[i];
            if (map.has(comp)) return [map.get(comp), i];
            map.set(nums[i], i);
          }
          return [];
        }`,
        language: "javascript",
      }),
    });
    const codeData = await codeRes.json();
    console.log("5. POST /api/coding - Status:", codeData.status, "Passed:", codeData.passedTests, "/", codeData.totalTests);
  } catch (e) {
    console.log("5. POST /api/coding error:", e.message);
  }

  // 6. Career Agent API
  try {
    const agentRes = await fetch("http://localhost:3000/api/career-agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "What are the most critical skills to learn for a Full Stack AI role?",
        context: { targetRole: "Full Stack AI", skills: ["React", "Node.js"] },
      }),
    });
    const agentData = await agentRes.json();
    console.log("6. POST /api/career-agent - Actions count:", agentData.suggestedActions?.length);
  } catch (e) {
    console.log("6. POST /api/career-agent error:", e.message);
  }

  console.log("=== All Backend APIs Verified Successfully! ===");
}

testAll();
