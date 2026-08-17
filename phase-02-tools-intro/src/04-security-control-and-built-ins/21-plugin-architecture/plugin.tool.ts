import { z } from "zod";
import { PluginManger } from "./plugin.manager.ts";
import { ToolRegistry } from "../../01-registry-and-execution/06-tool-registry/src/03-core-operations-and-validation/02-crud-method-logic.ts";
import type { ToolType } from "../../Tools/types/types.ts";

// 1. Real Registry Instance
const myRegistry = new ToolRegistry();

// 2. Exact Schemas
const gitStatusSchema = z.object({
  branch: z.string().default("main").describe("Target branch to check status"),
});

const runLinterSchema = z.object({
  path: z.string().describe("Target directory path for linting"),
});

// 3. Claude-style "Engineering Suite Plugin" (Strictly Matching ToolType)
const engineeringPlugin = {
  id: "engineering-suite",
  name: "Engineering",
  version: "1.0.0",
  description: "Git and Code review tools for engineers",
  category: "engineering" as const,
  tools: [
    {
      name: "git_status",
      description: "Checks git repository status",
      version: "1.0.0",
      params: gitStatusSchema, // 👈 FIX: 'parameter' hata kar 'params' kiya
      metadata: {
        category: ["engineering", "git"],
        tags: ["git", "version-control", "cli"],
        version: "1.0.0",
        ppriority: 1,
        createdAt: new Date().toISOString(),
        timestamps: new Date().toISOString(),
        secuirty: {
          riskLevel: "low",
          requiresApproval: false,
          allowedRoles: ["admin", "user"],
        },
      },
      execute: async (rawArgs: any, context: any) => {
        return {
          success: true,
          status: "success" as const,
          message: "Git status retrieved.",
          data: { branch: "main", status: "Clean branch, nothing to commit" },
          error: null,
          meta: {
            executionTimeMs: 1,
            timestamps: Date.now(),
            requestId: `req_${Date.now()}`,
            toolDetails: { name: "git_status", version: "1.0.0" },
          },
        };
      },
    },
    {
      name: "run_linter",
      description: "Runs Biome or ESLint checks",
      version: "1.0.0",
      params: runLinterSchema, // 👈 FIX: 'params' add kiya
      metadata: {
        category: ["engineering", "code-quality"],
        tags: ["linter", "biome", "quality"],
        version: "1.0.0",
        ppriority: 1,
        createdAt: new Date().toISOString(),
        timestamps: new Date().toISOString(),
        secuirty: {
          riskLevel: "low",
          requiresApproval: false,
          allowedRoles: ["admin", "user"],
        },
      },
      execute: async (rawArgs: any, context: any) => {
        return {
          success: true,
          status: "success" as const,
          message: "Linter check completed.",
          data: { errors: 0, warnings: 0, status: "passed" },
          error: null,
          meta: {
            executionTimeMs: 2,
            timestamps: Date.now(),
            requestId: `req_${Date.now()}`,
            toolDetails: { name: "run_linter", version: "1.0.0" },
          },
        };
      },
    },
  ],
};

// 4. Test Runner
async function testPluginSystem() {
  const manager = new PluginManger(myRegistry);

  console.log("📦 Registry Tools (Before Install):", myRegistry.list?.() || []);

  // [+] Install Plugin
  await manager.install(engineeringPlugin);

  console.log("📦 Registry Tools (After Install):", myRegistry.list?.() || []);
  console.log(
    "🔌 Active Installed Plugins:",
    manager.listInstalled().map((p) => p.name),
  );

  // [-] Uninstall Plugin
  await manager.uninstall("engineering-suite");
  console.log(
    "📦 Registry Tools (After Uninstall):",
    myRegistry.list?.() || [],
  );
}

testPluginSystem();
