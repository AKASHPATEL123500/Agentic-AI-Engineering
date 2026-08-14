import { ToolRegistry } from "../../06-tool-registry/src/03-core-operations-and-validation/02-crud-method-logic.ts";
import { WeatherTool } from "../../08-tool-loading-system/01-dynamic-module-importing/tools/weather.tool.ts";
import { validateToolArgumenst } from "../04-input-validation/10-input-validation.ts";
import { ContextEngine } from "../05-execution-context/13-context-construction.ts.ts";
import { PermissionDeniedError, PermissionEngine } from "./permsion.ts";
// Initialize Registry and Register our secure tool
const registry = new ToolRegistry({ strictValidation: true });

// We attach a required permission security tag to our tool metadata
const secureWeatherTool = {
  ...WeatherTool,
  metadata: {
    ...WeatherTool.metadata,
    requiredPermission: "wather_tool", // ◄── Is tool ko chalane ke liye 'get_weather' permission chahiye
  },
};
registry.register(secureWeatherTool);

console.log("🛡️ --- Phase 06: Permission and Safety Test --- 🛡️\n");

const inputArgs = { city: "delhi", unit: "celsius" };

// ========================================================
// CASE 1: Guest Attempt (Should fail because guest has no permissions)
// ========================================================
const guestSession = {
  userId: "user_guest_111",
  sessionId: "sess_999",
  role: "guest",
};

try {
  console.log("🚀 [TEST 1] Triggering with 'guest' role...");
  const tool = registry.get("wather_tool");

  if (tool) {
    const cleanArgs = validateToolArgumenst(tool, inputArgs); // Phase 04
    const context = ContextEngine.build(guestSession); // Phase 05

    // 🔥 SECURITY KICK-IN HERE! (Phase 06)
    PermissionEngine.check(tool, context);

    // If passed, execute (it will not reach here for guest)
    await tool.execute(cleanArgs, context);
  }
} catch (error) {
  if (error instanceof PermissionDeniedError) {
    console.log("🛑 Security Success! Gatekeeper caught the intruder.");
    console.log("Error Caught:", error.message);
  } else {
    console.error("Unexpected Error:", error);
  }
}

console.log("\n--------------------------------------------------\n");

// ========================================================
// CASE 2: VIP Attempt (Should pass because VIP has 'get_weather' permission)
// ========================================================
const vipSession = {
  userId: "user_vip_888",
  sessionId: "sess_123",
  role: "admin",
};

try {
  console.log("🚀 [TEST 2] Triggering with 'vip' role...");
  const tool = registry.get("wather_tool");

  if (tool) {
    const cleanArgs = validateToolArgumenst(tool, inputArgs); // Phase 04
    const context = ContextEngine.build(vipSession); // Phase 05

    // 🔥 SECURITY KICK-IN HERE! (Phase 06)
    PermissionEngine.check(tool, context);

    // Access granted, execute tool safely!
    const result = await tool.execute(cleanArgs, context);
    console.log("\n🎉 Tool Executed Successfully after Security Clearance!");
    console.log("Standardized Output Data:", JSON.stringify(result.data));
  }
} catch (error) {
  console.error("❌ Unexpected Security Failure in VIP Test:", error);
}
