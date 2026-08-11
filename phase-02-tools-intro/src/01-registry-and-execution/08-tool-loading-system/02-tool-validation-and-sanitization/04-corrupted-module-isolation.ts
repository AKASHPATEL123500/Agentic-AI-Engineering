import { extractToolFromModule } from "../01-dynamic-module-importing/02-module-exporter-extractor.ts";
import { validateToolShape } from "./03-shape-checker-guard.ts";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface SafeLoadResult {
  success: boolean;
  tool?: any;
  filePath: string;
  error?: string;
}

/**
 * Kisi bhi dynamic tool file ko 100% Sandboxed/Isolated environment mein load karta hai.
 * Crucial Rule: Ye function KABHI BHI throw nahi karega (Fail-Safe Architecture).
 */
export async function safeLoadToolModule(
  filePath: string,
): Promise<SafeLoadResult> {
  try {
    // 🛡️ FIX: Absolute path (D:\...) ko valid file:// URL mein convert karo!
    const absoluteFilePath = path.resolve(filePath);

    // ES Module file path pass to
    const fileUrl = pathToFileURL(absoluteFilePath).href;
    // 1. Dynamic Import (Agar file syntax error se corrupted hai, toh 'catch' block pakad lega)
    const rawModule = await import(fileUrl);

    // 2. Extract Tool Object
    const cleanTool = await extractToolFromModule(rawModule);

    // 3. Shape Validation Guard Check
    const validation = validateToolShape(cleanTool);

    if (!validation.isValid) {
      return {
        success: false,
        filePath,
        error: `Shape Validation Failed: ${validation.errors.join(", ")}`,
      };
    }

    // Everything is 100% Valid & Safe!
    return {
      success: true,
      filePath,
      tool: cleanTool,
    };
  } catch (error: any) {
    // 🛡️ CRASH PROTECTION: Error catch karke quietly error result return kar do
    return {
      success: false,
      filePath,
      error: `Module Import/Crash Error: ${error?.message || "Unknown error"}`,
    };
  }
}

// async function testIsolation() {
//   const filePath = "../01-dynamic-module-importing/tools/weather.tool.ts";

//   const absoluetPath = path.resolve(filePath);
//   const fileUrl = pathToFileURL(absoluetPath).href;

//   const result = await safeLoadToolModule(fileUrl);
//   if (result.success) {
//     console.log("✅ [SAFE LOAD SUCCESS]: Tool is ready to use!");
//     console.log("Tool Loaded:", result.tool.name);
//   } else {
//     console.error(
//       "❌ [ISOLATED ERROR HANDLED]: File failed safely without crashing system!",
//     );
//     console.error("Reason:", result.error);
//   }
// }

// testIsolation();
