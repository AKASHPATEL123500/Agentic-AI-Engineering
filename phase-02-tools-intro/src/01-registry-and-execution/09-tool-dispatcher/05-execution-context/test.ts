import { ToolRegistry } from "../../06-tool-registry/src/03-core-operations-and-validation/02-crud-method-logic.ts";
import { WeatherTool } from "../../08-tool-loading-system/01-dynamic-module-importing/tools/weather.tool.ts";
import { ToolExecution } from "../../10-tool-execution-engine/05-tool-execution-engine.ts";
import { validateToolArgumenst } from "../04-input-validation/10-input-validation.ts";
import { ContextEngine } from "./13-context-construction.ts.ts";

const myRegistry = new ToolRegistry({
  strictValidation: true,
  strictMetadataCheck: true,
});
console.time("start Time to regsiter tool in registry");
myRegistry.register(WeatherTool);
console.timeEnd("end time  And tool register successfully");

console.time("🟢 Phase 05 Test Started: Context Injection Engine...\n");

// Socho LLM se Phase 04 pass hokar yeh data aaya:
const validatedArgsFromPhase04 = {
  countries: "india",
  city: "delhi",
  unit: "celsius",
};

const liveUserSession = {
  userId: "user_vip_888",
  sessionId: "session_token_xyz_123",
  role: "vip" as const,
};

async function testToolDisptacerUserContext() {
  try {
    const tool = myRegistry.get(WeatherTool.name);

    if (tool) {
      const validateArgs = validateToolArgumenst(
        tool,
        validatedArgsFromPhase04,
      );
      console.log("👉 [Phase 04 Output] Validated Args:", validateArgs);

      const valiadeteContext = ContextEngine.build(liveUserSession);
      console.log(
        "👉[Phase 05 Output] Secure Context Injected:",
        valiadeteContext,
      );

      console.log("\n🚀 Triggering tool.execute(cleanArgs, strictContext)...");
      // to the 09-tool-executin system
      console.log("Data send to Tool Execution.............");

      const data = await ToolExecution(tool, validateArgs, valiadeteContext);
      console.log("\n✅ Tool Executed Successfully! Standardized Response:");
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("tool execution error : ", error);
  }
}

testToolDisptacerUserContext();
