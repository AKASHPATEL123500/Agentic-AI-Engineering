import { ToolRegistry } from "../../../../../03-core-operations-and-validation/02-crud-method-logic.ts";
import { getWatherTool } from "../../tools/get-weather-tool.ts";

async function testDuplicateBug() {
  console.log("==================================================");
  console.log("🧪 TESTING DUPLICATE GUARD (allowOverWrite: false)");
  console.log("==================================================\n");

  // 1. Registry initialize karo specifically allowOverWrite = false ke sath
  const registry = new ToolRegistry({
    allowOverWrite: false,
    strictValidation: true,
  });

  // console.log("▶ STEP 1: Registering 'get_weather' for the FIRST time...");
  // registry.register(getWatherTool);
  // console.log(
  //   "✅ First registration successful! Memory tools count:",
  //   registry.list().length,
  // );

  // console.log(
  //   "\n▶ STEP 2: Registering 'get_weather' AGAIN (Duplicate Check)...",
  // );
  try {
    // Ye second call FATNA chahiye DuplicateToolError ke sath
    registry.register(getWatherTool);

    // Agar control yahan tak pahuncha, toh exact BUG yahi par hai!
    console.error(
      "\n❌ BUG DETECTED: Code error throw nahi kar raha hai! Second register silently pass ho gaya!",
    );
    console.error("Tools count in registry:", registry.list().length);
  } catch (err: any) {
    console.log("\n🎉 DUPLICATE GUARD IS WORKING! Error thrown correctly:");
    console.log("Error Name:", err.name);
    console.log("Error Message:", err.message);
  }
}

testDuplicateBug();
