import { ToolRegistry } from "../registry.tools.ts";
import { getWatherTool } from "../tools.ts";

console.log("==================================================");
console.log("🚀 AGENTIC AI TOOL REGISTRY - END-TO-END RUNNER");
console.log("==================================================\n");

export const registry = new ToolRegistry({
  strictMetadataCheck: true,
  strictValidation: true,
  allowOverWrite: true,
});

console.log("\n--- [TEST 1]: Registering Tool ---");
registry.register(getWatherTool);
console.log("\n--- [TEST 1]: RegisterED Tool Successfully ---");
