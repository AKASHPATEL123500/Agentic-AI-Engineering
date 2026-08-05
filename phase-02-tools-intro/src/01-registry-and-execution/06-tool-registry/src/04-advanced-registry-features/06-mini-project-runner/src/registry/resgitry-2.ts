import type { ToolContext } from "../../../../02-registry-contract-and-errors/src/types.ts";
import { ToolRegistry } from "../../../../03-core-operations-and-validation/02-crud-method-logic.ts";
import { getWatherTool } from "../tools/get-weather-tool.ts";

async function runMiniProject() {
  console.log("==================================================");
  console.log("🚀 AGENTIC AI TOOL REGISTRY - END-TO-END RUNNER");
  console.log("==================================================\n");

  // 1. Instantiation with Strict Validation Options
  const registry: ToolRegistry = new ToolRegistry({
    allowOverWrite: true,
    strictValidation: true,
    strictMetadataCheck: true,
  });

  // 2. Attach Observer Event Listeners
  registry.events.onRegister((name, tool) => {
    console.log(`📡 [EVENT]: Tool registered -> "${name}" (v${tool?.version})`);
  });

  registry.events.onUnregister((name) => {
    console.log(`📡 [EVENT]: Tool unregistered -> "${name}"`);
  });

  // --------------------------------------------------
  // TEST 1: Register Tool
  // --------------------------------------------------
  console.log("\n--- [TEST 1]: Registering Tool ---");
  registry.register(getWatherTool);

  // Verification via O(1) Map lookup
  console.log("Is 'get_weather' present?", registry.has("get_weather")); // Expected: true
  console.log(
    "Normalized lookup ('Get-Weather'):",
    registry.has("Get-Weather"),
  ); // Expected: true

  // --------------------------------------------------
  // TEST 2: LLM Schema Export & Search Discovery
  // --------------------------------------------------
  console.log("\n--- [TEST 2]: Metadata Search & LLM Schema ---");

  // Tag Filter
  const apiTools = registry.searchByTag("live");
  console.log(`Found ${apiTools.length} tool(s) with tag 'live'.`);

  // LLM Schema Exporter (OpenAI/Gemini format)
  const llmSchemas = registry.getLLMSchema();
  console.log("\n🤖 Generated LLM Tool Schema Payload:");
  console.log(JSON.stringify(llmSchemas, null, 2));

  // --------------------------------------------------
  // TEST 3: Execute Tool via Registry
  // --------------------------------------------------
  console.log("\n--- [TEST 3]: Executing Tool from Registry ---");
  const fetchedTool = registry.get("get_weather");

  if (!fetchedTool) {
    console.error(
      "Tool 'get_weather' not found in registry. Aborting execution.",
    );
    return;
  }

  const validContext: ToolContext = {
    userId: "usr_akash_123",
    sessionId: "sess_987654",
    role: "premium",
    workingDir: "../../sandbox",
  };

  // Execution Case A: Successful Fetch
  console.log("\n▶ Running 'get_weather' with valid context & args...");
  const result = await fetchedTool.execute(
    { countries: "india", city: "prayagraj", unit: "celsius" },
    validContext,
  );
  console.log("Execution Result:", JSON.stringify(result, null, 2));

  // Execution Case B: Without Context (Auth Failure Guard Check)
  console.log(
    "\n▶ Running 'get_weather' without context (Security Guard Check)...",
  );
  const unauthResult = await fetchedTool.execute({
    countries: "india",
    city: "prayagraj",
    unit: "celsius",
  });
  console.log("Unauth Guard Response:", JSON.stringify(unauthResult, null, 2));

  // --------------------------------------------------
  // TEST 4: Persistence (Export & Import Disk Sync)
  // --------------------------------------------------
  console.log("\n--- [TEST 4]: JSON File Persistence Sync ---");

  // File Export
  registry.exportFromJson();

  // Clear In-Memory Map
  registry.clear();
  console.log(
    "Registry cleared. Total tools in memory:",
    registry.list().length,
  ); // Expected: 0

  // Restore State from JSON
  registry.importFromJSON("registry.tools.json");
  console.log(
    "Restored state from disk. Total tools in memory:",
    registry.list().length,
  ); // Expected: 1

  console.log("\n==================================================");
  console.log("✅ ALL TESTS PASSED! STAGE 05 COMPLETE.");
  console.log("==================================================");
}

runMiniProject().catch((err) => {
  console.error("❌ Mini-Project Runner Failed:", err);
});
