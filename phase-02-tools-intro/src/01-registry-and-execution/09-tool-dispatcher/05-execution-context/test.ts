import { secuirtyInterceptorSystem } from "../../../04-security-control-and-built-ins/17-permissions-and-human-approval/03-security-interceptor.ts";
import { getWeatherTool } from "../../../Tools/get-weather.tool.ts";
import { ToolRegistry } from "../../06-tool-registry/src/03-core-operations-and-validation/02-crud-method-logic.ts";
import { ToolExecution } from "../../10-tool-execution-engine/05-tool-execution-engine.ts";
import { executeMultipleToolsInParallel } from "../../10-tool-execution-engine/06-batch-tool-exe.ts";
import { validateToolArgumenst } from "../04-input-validation/10-input-validation.ts";
import { ContextEngine } from "./13-context-construction.ts.ts";

const myRegistry = new ToolRegistry({
  strictValidation: true,
  strictMetadataCheck: true,
});
console.time("start Time to regsiter tool in registry");
myRegistry.register(getWeatherTool);
console.timeEnd("end time  And tool register successfully");

console.time("🟢 Phase 05 Test Started: Context Injection Engine...\n");

// Socho LLM se Phase 04 pass hokar yeh data aaya:
const validatedArgsFromPhase04 = {
  countries: "india",
  city: "delhi",
  unit: "celsius",
};

const validatedArgsFromPhase041 = {
  countries: "india",
  city: "prayagraj",
  unit: "celsius",
};

const validatedArgsFromPhase042 = {
  countries: "india",
  city: "mumbai",
  unit: "celsius",
};

const validatedArgsFromPhase043 = {
  countries: "india",
  city: "ghatupur",
  unit: "celsius",
};
const liveUserSession = {
  userId: "user_vip_888",
  sessionId: "session_token_xyz_123",
  role: "user" as const,
};

async function testToolDisptacerUserContext() {
  try {
    const tool = myRegistry.get(getWeatherTool.name);

    if (tool) {
      const validateArgs = validateToolArgumenst(
        tool,
        validatedArgsFromPhase04,
      );
      const validateArgs2 = validateToolArgumenst(
        tool,
        validatedArgsFromPhase041,
      );
      const validateArgs3 = validateToolArgumenst(
        tool,
        validatedArgsFromPhase042,
      );
      const validateArgs4 = validateToolArgumenst(
        tool,
        validatedArgsFromPhase043,
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

      // cast tool to any to satisfy differing ToolType generic shapes across modules
      const secuirty = await secuirtyInterceptorSystem(
        tool as any,
        valiadeteContext,
        validateArgs2,
      );
      if (!secuirty.procced) {
        console.log(secuirty.blockedResponse);
        return;
      }
      const data = await ToolExecution(
        tool as any,
        validateArgs2,
        valiadeteContext,
      );
      // const data = await executeMultipleToolsInParallel(
      //   [
      //     {
      //       tool: tool,
      //       args: validateArgs,
      //     },
      //     {
      //       tool: tool,
      //       args: validateArgs2,
      //     },
      //     {
      //       tool: tool,
      //       args: validateArgs3,
      //     },
      //     {
      //       tool: tool,
      //       args: validateArgs4,
      //     },
      //   ],
      //   valiadeteContext,
      // );
      console.log("\n✅ Tool Executed Successfully! Standardized Response:");
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("tool execution error : ", error);
  }
}

testToolDisptacerUserContext();
