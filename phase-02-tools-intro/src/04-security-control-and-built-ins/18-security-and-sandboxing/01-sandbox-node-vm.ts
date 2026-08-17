import vm from "node:vm";

export interface SandboxExecutionOptions {
  timeoutMs?: number; // Max execution time (default 2000ms)
  allowedGlobals?: Record<string, any>; // Safe inputs/functions
}

export interface SandboxResult {
  success: boolean;
  result?: any;
  error?: string;
  executionTimeMs: number;
}

/**
 * 🚷 Safe Sandbox Evaluator
 * Runs untrusted JS code in an isolated VM context without host access.
 */
export function runInSandbox(
  code: string,
  options: SandboxExecutionOptions = {},
): SandboxResult {
  const startTime = Date.now();
  const timeoutMs = options.timeoutMs || 2000;

  // 1. Safe Isolated Context banao (No process, No require, No import, No process.env)
  const sandboxContext = {
    console: {
      log: (...args: any[]) => {}, // Silent or capture logs
    },
    Math: Math,
    JSON: JSON,
    Date: Date,
    ...options.allowedGlobals,
  };

  // 2. VM Context initialize karo
  const context = vm.createContext(sandboxContext);

  try {
    // 3. Compile & Run with strict CPU timeout
    const script = new vm.Script(code);
    const result = script.runInContext(context, {
      timeout: timeoutMs, // Agar infinite loop hua to timeout phod dega
    });

    return {
      success: true,
      result,
      executionTimeMs: Date.now() - startTime,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || String(err),
      executionTimeMs: Date.now() - startTime,
    };
  }
}

// Test 1: Safe Calculation (Normal LLM math/logic)
const safeCode = `
  const numbers = [10, 20, 30, 40];
  numbers.reduce((acc, curr) => acc + curr, 0);
`;
console.log("🟢 Safe Code Result:", runInSandbox(safeCode));
// Output: { success: true, result: 100 }

// Test 2: Hacker Attack (Trying to access environment variables or process)
const attackCode = `
  process.exit(1); // Main server crash karne ki koshish
`;
console.log("🔴 Attack Code Result:", runInSandbox(attackCode));
// Output: { success: false, error: 'process is not defined' } ➔ System Safe!

// Test 3: Infinite Loop Attack
const infiniteLoopCode = `
  while(true) {}
`;
console.log(
  "⏱️ Infinite Loop Result:",
  runInSandbox(infiniteLoopCode, { timeoutMs: 1000 }),
);
// Output: { success: false, error: 'Script execution timed out after 1000ms' } ➔ System Freeze Nahi Hua!
