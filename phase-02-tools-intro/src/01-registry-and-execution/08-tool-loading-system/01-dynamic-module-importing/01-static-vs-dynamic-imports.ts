import path from "node:path";
import { pathToFileURL } from "node:url";

// 1. Static Import Example (Ye compile-time par fixed hota hai, runtime par change nahi ho sakta)
// import { weatherTool } from "./tools/weather.tool.ts"; <-- Ye hum NAHI kar sakte kyunki path Discovery se dynamic milega.

/**
 *
 * @param filePath
 */

export async function LoadToolFromPath(filePath: string): Promise<unknown> {
  // SETP 1: create a absoluet path
  const absoluetPath = path.resolve(filePath);

  // STEP 2: Windows Path Fix (Crucial Step!)
  // Windows par path "D:\project\tool.ts" hota hai.
  // Node.js ES Module import ko "file:///D:/project/tool.ts" format chahiye hota hai.
  const fileUrl = pathToFileURL(absoluetPath).href;
  console.log("[ STEP 2 ] this is file url:", fileUrl);

  try {
    // STEP 3: Dynamic Import Call (Runtime Loading)
    // Ye bilkul normal 'import' jaisa hi hai, bas string variable accept karta hai.
    const importedModule = await import(fileUrl);
    console.log("[ STEP 3 ] this is imported module:", fileUrl);
    return importedModule;
  } catch (error: any) {
    console.error(`❌ Failed to import module at ${filePath}:`, error.message);
    throw error;
  }
}

async function testDynamicImport() {
  console.log("==================================================");
  console.log("🧪 TESTING DYNAMIC IMPORT MECHANICS");
  console.log("==================================================\n");

  // Pehla Discovery path (Maan lo Discovery se mila hai)
  const samplePath = "./tools/weather.tool.ts"; // Apne kisi existing tool file ka path do

  try {
    const rawModule = await LoadToolFromPath(samplePath);
    console.log("\n📦 Raw Loaded Module Object:", rawModule);
  } catch (err) {
    console.log("\n⚠️ Test execution failed - Ensure file path exists!");
  }
}

// Un-comment to test directly
testDynamicImport();
