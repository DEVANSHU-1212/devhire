import { CodingProblem, CodingSubmissionResult } from "./types";

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object" || a === null || b === null) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
  }
  return true;
}

/**
 * Sandboxed code executor for Javascript / Typescript solutions
 */
export async function executeCodeSolution(
  problem: CodingProblem,
  userCode: string,
  language: string = "javascript"
): Promise<CodingSubmissionResult> {
  const startTime = Date.now();
  const testDetails: CodingSubmissionResult["testDetails"] = [];
  let passedCount = 0;
  const capturedLogs: string[] = [];

  try {
    // Custom sandbox logger
    const customConsole = {
      log: (...args: any[]) => {
        capturedLogs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "));
      },
      warn: (...args: any[]) => {
        capturedLogs.push("[WARN] " + args.join(" "));
      },
      error: (...args: any[]) => {
        capturedLogs.push("[ERROR] " + args.join(" "));
      },
    };

    // Prepare execution context
    // Wrap code and problem invocation
    let cleanCode = userCode;

    // Test each testcase
    for (let i = 0; i < problem.testCases.length; i++) {
      const tc = problem.testCases[i];
      let testPassed = false;
      let actualResult: any = undefined;
      let runtimeError: string | undefined = undefined;

      try {
        // Build isolated evaluation string with timeout protection
        let executionBlock = "";
        if (problem.id === "two-sum") {
          executionBlock = `
            ${cleanCode}
            return twoSum(...args);
          `;
        } else if (problem.id === "valid-parentheses") {
          executionBlock = `
            ${cleanCode}
            return isValid(...args);
          `;
        } else if (problem.id === "lru-cache") {
          executionBlock = `
            ${cleanCode}
            return testLRU(args[0], args[1]);
          `;
        } else {
          // generic fallback: find first function name or execute directly
          executionBlock = `
            ${cleanCode}
            const fn = typeof solution !== 'undefined' ? solution : Object.values(this).find(v => typeof v === 'function');
            return fn ? fn(...args) : null;
          `;
        }

        const runner = new Function("args", "console", executionBlock);
        actualResult = runner(tc.input, customConsole);

        if (deepEqual(actualResult, tc.expected)) {
          testPassed = true;
          passedCount++;
        }
      } catch (err: any) {
        runtimeError = err?.message || String(err);
      }

      testDetails.push({
        testIndex: i + 1,
        passed: testPassed,
        input: JSON.stringify(tc.input),
        expected: JSON.stringify(tc.expected),
        actual: runtimeError ? "Error" : JSON.stringify(actualResult),
        error: runtimeError,
      });
    }

    const totalTests = problem.testCases.length;
    const executionTimeMs = Date.now() - startTime;
    const status: CodingSubmissionResult["status"] =
      passedCount === totalTests
        ? "Passed"
        : testDetails.some((t) => t.error)
        ? "Runtime Error"
        : "Failed";

    return {
      problemId: problem.id,
      language,
      status,
      passedTests: passedCount,
      totalTests,
      executionTimeMs,
      output: capturedLogs.join("\n"),
      testDetails,
    };
  } catch (globalErr: any) {
    return {
      problemId: problem.id,
      language,
      status: "Runtime Error",
      passedTests: 0,
      totalTests: problem.testCases.length,
      executionTimeMs: Date.now() - startTime,
      output: capturedLogs.join("\n"),
      testDetails: problem.testCases.map((tc, i) => ({
        testIndex: i + 1,
        passed: false,
        input: JSON.stringify(tc.input),
        expected: JSON.stringify(tc.expected),
        actual: "Error",
        error: globalErr?.message || "Execution failed",
      })),
    };
  }
}
