import { ToolRegistry } from "../../../../../03-core-operations-and-validation/02-crud-method-logic";
import { getWatherTool } from "../../tools/get-weather-tool";

async function testVersionUpgradeGuard() {
  console.log("\n==================================================");
  console.log("🧪 TESTING VERSION UPGRADE GUARD (allowOverWrite: true)");
  console.log("==================================================");

  // 1. Naya strict instance banaya jisme overwrite ALLOWED hai
  const upgradeRegistry = new ToolRegistry({
    allowOverWrite: true,
    strictValidation: true,
    strictMetadataCheck: true,
  });

  // 2. Pehli baar normal register kiya (v1.0.0)
  console.log("\n▶ STEP 1: Registering initial tool (v1.0.0)...");
  upgradeRegistry.register(getWatherTool);
  console.log(
    `✅ Initial Tool registered! Current version in memory: ${
      upgradeRegistry.get("get_weather")?.version
    }`,
  );

  // 3. CASE A: Upgraded version (v2.5.0) register karke check karte hain
  console.log("\n▶ STEP 2: Upgrading tool to higher version (v2.5.0)...");
  try {
    const upgradedTool = {
      ...getWatherTool,
      version: "2.5.0",
    } as typeof getWatherTool;

    upgradeRegistry.register(upgradedTool);

    const memoryVersion = upgradeRegistry.get("get_weather")?.version;
    if (memoryVersion === "2.5.0") {
      console.log(
        `✅ [PASS]: Higher version (v2.5.0) safely overwrite ho gaya! New version in memory: ${memoryVersion}`,
      );
    } else {
      console.log(
        `❌ [FAIL]: Overwrite process silent fail hua. Version in memory: ${memoryVersion}`,
      );
    }
  } catch (error: any) {
    console.log(
      `❌ [FAIL]: Higher version update hona chahiye tha par error aaya: ${error.message}`,
    );
  }

  // 4. CASE B: Jaanbujhkar low version (v1.2.0) daalenge jabki memory me v2.5.0 chal raha hai
  console.log("\n▶ STEP 3: Attempting downgrade to lower version (v1.2.0)...");
  try {
    const downgradedTool = {
      ...getWatherTool,
      version: "1.2.0",
    } as typeof getWatherTool;

    upgradeRegistry.register(downgradedTool);

    console.log(
      "❌ [FAIL]: System ne lower version update allow kar diya! (Yeh block hona chahiye tha)",
    );
  } catch (error: any) {
    // Agar isne update block karke error di, toh SemVer guard passed!
    console.log(`🎉 VERSION GUARD IS WORKING! Error thrown correctly:`);
    console.log(`   Error Name: ${error.name || "DuplicateToolError"}`);
    console.log(`   Error Message: ${error.message}`);
  }

  console.log("\n==================================================");
  console.log("🏁 VERSION UPGRADE GUARD TEST COMPLETE");
  console.log("==================================================\n");
}

// Function invocation
testVersionUpgradeGuard().catch((err) => {
  console.error("❌ Version Guard Test Runner crashed:", err);
});
