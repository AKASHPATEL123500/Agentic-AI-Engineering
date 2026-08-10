// import path from "node:path";
// import { pathToFileURL } from "node:url";
// import { extractToolFromModule } from "../02-module-exporter-extractor.ts";
// import fs from "node:fs";

// async function testExtractor() {
//   const filePath = "../tools/weather.tool.ts";
//   const absolutePath = path.resolve(filePath);
//   const fileUrl = pathToFileURL(absolutePath).href;

//   // 1. Raw Module import kiya
//   const rawModule = await import(fileUrl);

//   // 2. Extractor se Clean Tool Object nikala
//   try {
//     const cleanTool = await extractToolFromModule(rawModule);

//     // saved in json fomat in file
//     const filePath = "extract.from.module.json";
//     // cleanTool ka jo data hai usko string mein convert karna hai
//     await fs.writeFileSync(filePath, JSON.stringify(cleanTool, null, 2));
//     console.log("\n==================================================");
//     console.log("🎉 EXTRACTOR SUCCESS: Pure Tool Object Extracted!");
//     console.log("==================================================");
//     console.log("Tool Name       :", cleanTool.name);
//     console.log("Tool Version    :", cleanTool.version);
//     console.log("Has Execute Fn? :", typeof cleanTool.execute === "function");
//     console.log("Clean Object    :", cleanTool);
//   } catch (err: any) {
//     console.error("❌ Extraction Failed:", err.message);
//   }
// }

// testExtractor();
