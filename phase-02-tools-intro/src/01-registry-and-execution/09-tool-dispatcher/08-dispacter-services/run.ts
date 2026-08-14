import { WeatherTool } from "../../08-tool-loading-system/01-dynamic-module-importing/tools/weather.tool.ts";
import { HookManager } from "./all-topics.ts";

console.log("🪝 --- Phase 08: Interceptor & Hooks Test --- 🪝\n");

const hooks = new HookManager();

// ─── 22: APPLICATION LEVEL HOOKS REGISTRATION ────────────────━━━
// Hook 1: Logger (Tool chalne se pehle automatic print karega)
hooks.beforeExecute((tool, args, context) => {
  console.log(
    `[BEFORE HOOK] 🛰️ Preparing to launch tool: '${tool.name}' for user: '${context.userId}'`,
  );
});

// Hook 2: Auditor (Tool chalne ke baad output ko track karega)
hooks.afterExecute((tool, response, context) => {
  console.log(
    `[AFTER HOOK] ✅ Tool '${tool.name}' executed! Status was: '${response.status}'`,
  );
});

// ─── SIMULATING DISPATCHER EXECUTION FLOW ─────────────────────━━━
async function fakeDispatcherTrigger() {
  const mockContext = {
    userId: "user_vip_888",
    sessionId: "sess_123",
    role: "vip" as const,
    workingDir: ".",
  };
  const mockArgs = { city: "delhi", unit: "celsius" };

  // Step A: Trigger Before Hooks
  await hooks.triggerBefore(WeatherTool, mockArgs, mockContext);

  console.log("\n⚙️ [Dispatcher] Real tool execution happening right now...\n");
  // Simulating the actual tool run
  const mockResponse = {
    success: true,
    status: "success" as const,
    message: "Done",
    data: { temp: 28 },
    error: null,
    meta: {} as any,
  };

  // Step B: Trigger After Hooks
  await hooks.triggerAfter(WeatherTool, mockResponse, mockContext);
}

fakeDispatcherTrigger();
