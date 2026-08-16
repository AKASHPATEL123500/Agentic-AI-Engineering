import { secuirtyInterceptorSystem } from "../../../04-security-control-and-built-ins/17-permissions-and-human-approval/03-security-interceptor.ts";
import { getWeatherTool } from "../../../Tools/get-weather.tool.ts";
import { ToolRegistry } from "../../06-tool-registry/src/03-core-operations-and-validation/02-crud-method-logic.ts";
import { ToolExecution } from "../../10-tool-execution-engine/05-tool-execution-engine.ts";
import { validateToolArgumenst } from "../04-input-validation/10-input-validation.ts";
import { ContextEngine } from "./13-context-construction.ts.ts";
import chalk from "chalk";

const myRegistry = new ToolRegistry({
  strictValidation: true,
  strictMetadataCheck: true,
});

console.time("⏱️  Tool Registry Setup");
myRegistry.register(getWeatherTool);
console.timeEnd("⏱️  Tool Registry Setup");

console.log(
  chalk.blue("\n🟢 Phase 05 Test Started: Context Injection Engine...\n"),
);

// Test Arguments
const validatedArgsFromPhase041 = {
  countries: "india",
  city: "prayagraj",
  unit: "celsius",
};

// ⚠️ FIX 1: User Session ka role 'admin' karo ya tool metadata me 'user' allow karo!
// Kyunki tool security me sirf 'admin' allowed tha, isliye wo prompt poochne se pehle hi DENIED ho raha tha.
const liveUserSession = {
  userId: "user_vip_888",
  sessionId: "session_token_xyz_123",
  role: "admin" as const, // 👈 Badla: 'user' se 'admin' taaki authorization pass ho aur APPROVAL tak pahunche
};

async function testToolDispatcherWithSecurity() {
  try {
    const tool = myRegistry.get(getWeatherTool.name);

    if (!tool) {
      console.error("❌ Tool not found in registry!");
      return;
    }

    // Arguments validation
    const validateArgs2 = validateToolArgumenst(
      tool,
      validatedArgsFromPhase041,
    );
    console.log("👉 [Phase 04 Output] Validated Args:", validateArgs2);

    // Build context
    const valiadeteContext = ContextEngine.build(liveUserSession);
    console.log(
      "👉 [Phase 05 Output] Secure Context Injected:",
      valiadeteContext,
    );

    console.log(chalk.yellow("\n🛡️  Sending data to Security Interceptor..."));

    // 🛡️ SECURITY INTERCEPTOR TRIGGER
    // Ye tumhare humanAprovalCli ko internally await karega agar risk 'critical' ya 'high' hai
    const securityCheck = await secuirtyInterceptorSystem(
      tool as any,
      valiadeteContext,
      validateArgs2,
    );

    // Agar Security check fail ho gaya (Chahe DENIED ho ya Human ne Reject kiya ho)
    if (!securityCheck.procced) {
      console.log(chalk.red("\n🛑 [SECURITY BLOCK]: Agent execution halted."));
      console.log(JSON.stringify(securityCheck.blockedResponse, null, 2));
      return; // Dispatcher execution stops here safely
    }

    // 🚀 TOOL EXECUTION ENGINE (Only if procced is true)
    console.log(
      chalk.green("\n🚀 Security Cleared! Triggering ToolExecution..."),
    );

    const data = await ToolExecution(
      tool as any,
      validateArgs2,
      valiadeteContext,
    );

    console.log(
      chalk.greenBright(
        "\n✅ Tool Executed Successfully! Standardized Response:",
      ),
    );
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(chalk.bgRed("\n💥 Dispatcher Runtime Error: "), error);
  }
}

// Execution initialization
testToolDispatcherWithSecurity();
