// 📄 18-e2b-sandbox-tool.ts
import "dotenv/config"; // .env se API Key load karne ke liye
import { z } from "zod";
import { Sandbox } from "@e2b/code-interpreter"; //
import type { ToolType } from "../../Tools/types/types";

// Latest E2B Execution response types
interface E2bExecutionOutput {
  text: string;
  error?: string;
  logs: {
    stdout: Array<{ line: string; timestamp: number }>;
    stderr: Array<{ line: string; timestamp: number }>;
  };
}

interface CloudSandboxError {
  code: string;
  message: string;
}

interface CloudCodeInterpreterResponseData {
  output: string;
  errorLogs: string | null;
}

interface CloudCodeInterpreterSuccessResponse {
  success: true;
  status: "success";
  message: string;
  data: CloudCodeInterpreterResponseData;
  error: null;
}

interface CloudCodeInterpreterErrorResponse {
  success: false;
  status: "faild";
  message: string;
  data: null;
  error: CloudSandboxError;
}

// Input validation schema via Zod
const e2bInterpreterSchema = z.object({
  language: z
    .enum(["python", "js", "javascript"])
    .default("python")
    .describe("The programming language of the snippet."),
  code: z
    .string()
    .describe(
      "The clean algorithmic code string to run inside the secure enterprise cloud sandbox.",
    ),
});

export const cloudCodeInterpreterTool: ToolType<
  typeof e2bInterpreterSchema,
  any
> = {
  name: "cloud_code_interpreter",
  description:
    "Executes Python or JavaScript code safely inside an enterprise-grade cloud MicroVM sandbox.",
  version: "2.0.0",
  params: e2bInterpreterSchema,
  metadata: {
    category: ["code-execution", "sandbox"],
    tags: ["e2b", "secure", "cloud", "interpreter"],
    version: "2.0.0",
    ppriority: 1,
    timestamps: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    secuirty: {
      riskLevel: "medium",
      requiresApproval: false,
      allowedRoles: ["user", "premium", "vip", "admin"],
    },
  },
  execute: async (rawArgs, context) => {
    let sandbox: any = undefined;
    try {
      const validated = e2bInterpreterSchema.parse(rawArgs);

      console.log(
        `\n🛸 Spawning a secure E2B MicroVM for [${validated.language.toUpperCase()}]...`,
      );

      // Sandbox create karte hain apiKey ke sath
      sandbox = await Sandbox.create({
        apiKey: "*******************************************",
      });

      console.log("🏃 Running the code inside the isolated container...");

      const targetLang =
        validated.language === "js" ? "javascript" : validated.language;

      // Code execute karte hain
      const executionResult: E2bExecutionOutput = await sandbox.runCode(
        validated.code,
        {
          language: targetLang,
        },
      );

      // 🔥 FIX: Naye SDK me sandbox ko release/delete karne ke liye `.kill()` ka use hota hai, close ka nahi.
      await sandbox.kill();

      // Output values extraction
      const standardOutput =
        executionResult.text ||
        executionResult.logs.stdout.map((l) => l.line).join("\n");

      const standardErrors =
        executionResult.error ||
        (executionResult.logs.stderr.length > 0
          ? executionResult.logs.stderr.map((l) => l.line).join("\n")
          : null);

      const response: CloudCodeInterpreterSuccessResponse = {
        success: true,
        status: "success",
        message: "Code executed successfully inside enterprise sandbox.",
        data: {
          output: standardOutput || "No explicit stdout printed.",
          errorLogs: standardErrors,
        },
        error: null,
      };

      return response;
    } catch (err: any) {
      // 🔥 FIX: Error block me bhi `.kill()` lagaya hai
      if (sandbox) await sandbox.kill();

      const response: CloudCodeInterpreterErrorResponse = {
        success: false,
        status: "faild",
        message: "Cloud Sandbox execution failed.",
        data: null,
        error: { code: "SANDBOX_RUNTIME_ERROR", message: err.message },
      };

      return response;
    }
  },
};

// --- RUNTIME TESTING ---
const attackPayload = {
  language: "python" as const,
  code: `
import os
print("Trying to access host environment...")
print("Found inside sandbox:", os.environ.get('SECRET_DATABASE_URL', 'Not Found (Safe Room)!'))
x = 10
y = 20
print(f"Calculation Result inside VM: {x + y}")
  `,
};

// Dispatcher Context mock trigger
const executionResponse = await cloudCodeInterpreterTool.execute(
  attackPayload,
  {
    userId: "demo-user",
    sessionId: "demo-session",
    role: "user",
    workingDir: ".",
  },
);

console.log("\n📬 Final Standardized Sandbox Tool Response Output:");
console.log(JSON.stringify(executionResponse, null, 2));
