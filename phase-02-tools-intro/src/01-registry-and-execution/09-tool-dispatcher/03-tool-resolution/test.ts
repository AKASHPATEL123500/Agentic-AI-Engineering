import { ToolNotFoundError } from "../../06-tool-registry/src/02-registry-contract-and-errors/src/02-custom-registry-errors.ts";
import { ToolRegistry } from "../../06-tool-registry/src/03-core-operations-and-validation/02-crud-method-logic.ts";
import { WeatherTool } from "../../08-tool-loading-system/01-dynamic-module-importing/tools/weather.tool.ts";
import { resolveToolFromRegistry } from "./07-registry-tool-resolution.ts";

const myToolRegsitry = new ToolRegistry({
  strictValidation: true,
  allowOverWrite: false,
  strictMetadataCheck: true,
});

// Step 2: Real Weather tool ko register karo
myToolRegsitry.register(WeatherTool);
console.log("🟢 System Ready: Real Weather Tool is registered inside Map.\n");

const cleanNameFromPhase02 = "wather_tool";
try {
  console.log(`🔍 Case 1: Resolving '${cleanNameFromPhase02}'...`);
  const resolvedTool = await resolveToolFromRegistry(
    cleanNameFromPhase02,
    myToolRegsitry,
  );
  console.log("✅ Case 1 Success! Tool Found in Registry Map.");
  console.log("Tool Name:", resolvedTool.name);
  console.log("Tool Version:", resolvedTool.version);
  console.log("Tool Description:", resolvedTool.description);
} catch (error) {
  console.error("❌ Case 1 Unexpectedly Crashed:", error);
}

const badNameFromPhase02 = "delete_all_database_files"; // Yeh hamare paas nahi hai

try {
  console.log(`🔍 Case 2: Resolving '${badNameFromPhase02}'...`);

  // Yeh line error throw karegi
  resolveToolFromRegistry(badNameFromPhase02, myToolRegsitry);
} catch (error) {
  // 08-tool-not-found-handling
  if (error instanceof ToolNotFoundError) {
    console.log(
      "🛑 Case 2 Success! Guard caught the 'Tool Not Found' error safely.",
    );
    console.log("Registry Error Code/Message:", error.message);
  } else {
    console.error("❌ System crashed with unknown error:", error);
  }
}
