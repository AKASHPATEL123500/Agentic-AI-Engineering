import path from "node:path";
import { extractToolFromModule } from "../01-dynamic-module-importing/02-module-exporter-extractor.ts";
import { pathToFileURL } from "node:url";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Extracted object ko validate karta hai ki wo valid Tool format mein hai ya nahi
 */

export function validateToolShape(tool: any): ValidationResult {
  const errors: string[] = [];

  if (!tool || typeof tool !== "object") {
    return { isValid: false, errors: ["Extracted item is not an object"] };
  }

  if (!tool.name || typeof tool.name !== "string" || tool.name.trim() === "") {
    errors.push("Tool 'name' is missing or not a non-empty string");
  }

  if (!tool.description || typeof tool.description !== "string") {
    errors.push("Tool 'description' is missing or not a string.");
  }

  if (!tool.parameter || typeof tool.parameter !== "object") {
    errors.push("Tool 'params' is missing or not a valid schema object.");
  }

  if (!tool.execute || typeof tool.execute !== "function") {
    errors.push("Tool 'execute' is missing or not a function.");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

// async function testExtractor() {
//   const filePath = "../01-dynamic-module-importing/tools/weather.tool.ts";
//   const absolutePath = path.resolve(filePath);
//   const fileUrl = pathToFileURL(absolutePath).href;

//   // 1. Raw Module import kiya
//   const rawModule = await import(fileUrl);

//   // 2. Extractor se Clean Tool Object nikala
//   try {
//     const cleanTool = await extractToolFromModule(rawModule);
//     console.log("\n==================================================");
//     console.log("🎉 EXTRACTOR SUCCESS: Pure Tool Object Extracted!");
//     console.log("==================================================");
//     console.log("Tool Name       :", cleanTool.name);
//     console.log("Tool Version    :", cleanTool.version);
//     console.log("Has Execute Fn? :", typeof cleanTool.execute === "function");
//     console.log("Clean Object    :", cleanTool);

//     const result = validateToolShape(cleanTool);
//     console.log("\n==================================================");
//     console.log("🛡️ VALIDATION RESULT:");
//     console.log("==================================================");
//     console.log("Is Valid Tool? :", result.isValid);
//     console.log("Errors List   :", result.errors);
//   } catch (err: any) {
//     console.error("❌ Extraction Failed:", err.errors);
//   }
// }

// testExtractor();
