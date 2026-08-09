import fs from "node:fs/promises";
import path from "node:path";
import type { DiscoveryToolsEvents } from "../../../04-discovery-service-&-runner-project/10-discovery-event.emiiter.ts";

// Helper Function: Jo .toolignore file ko read karke saaf-suthri array banayega
async function getIgnoreList(dirPath: string): Promise<string[]> {
  try {
    const ignoreFilePath = path.join(dirPath, ".toolignore");
    const rawContent = await fs.readFile(ignoreFilePath, "utf-8");
    // console.log("ingonre data ; ", rawContent);

    const freshData = rawContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
    // return rawContent
    //   .split("\n") // Har line ko alag karo
    //   .map((line) => line.trim()) // Faltu spaces hatao
    //   .filter((line) => line && !line.startsWith("#")); // Empty lines aur comments hatao
    // console.log("this is fresh data : ", freshData);

    return freshData;
  } catch {
    // Agar .toolignore file nahi milti, toh khali array return karo
    return [];
  }
}

// console.log(
//   "Ignore result jo return kiya hai : ",
//   await getIgnoreList("../../../01-fundamentals-&-path-discovery/src/tools"),
// );

//Ignore result jo return kiya hai :
// [
//  "draft-",
//  "test-",
//  "fetch-",
//  "delete-",
//  "read-",
//  "resize-",
//  "validate-",
//  "write-",
//  "parse-",
//  "hash-",
//  "generate-"
// ]

// Main Recursive Scanner with Ignore Logic
export async function scanToolsWithIgnore(
  dirPath: string,
  ignoreList: string[] = [],
  events?: DiscoveryToolsEvents,
): Promise<string[]> {
  const absolutePath = path.resolve(dirPath);

  // Pehli baar me agar ignore list khali hai, toh load kar lo
  if (ignoreList.length === 0) {
    ignoreList = await getIgnoreList(absolutePath);
    console.log("ignore list data in main function:", ignoreList);
  }

  let discoveredTools: string[] = [];
  const items = await fs.readdir(absolutePath);

  for (const item of items) {
    const fullPath = path.join(absolutePath, item);
    // // 🛡️ CHECK: Agar file ya folder ka naam ignore list me hai, toh skip karo!
    // if (ignoreList.includes(item)) {
    //   // evenet trigger
    //   events?.emitFileIgnored(fullPath, "Matched .toolignore rule");
    //   console.log(`🚫 Ignored by .toolignore: ${item}`);
    //   continue;
    // }

    // ❌ PURANA CODE (Jo EXACT Match dhoondh raha tha)
    // if (ignoreList.includes(item)) { ... }

    // ✅ NAYA CODE (Jo Prefix / Partial Match check karega)

    const isIgnored = ignoreList.some((rule) => {
      // Rule se wildcard '*' hata do agar daala ho
      const cleanRule = rule.replace(/\*/g, "").trim();

      console.log("this is data from in loop is ignored : ", cleanRule);

      return item.startsWith(cleanRule) || item.includes(cleanRule);
    });

    console.log("this is is ignored result : ", isIgnored);

    if (isIgnored) {
      // event trigger
      events?.emitFileIgnored(fullPath, "Matched .toolignore rule");
      console.log(`🚫 Ignored by .toolignore: ${item}`);
      continue;
    }

    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      // Sub-folder me jate waqt ignoreList ko aage pass kar do
      const subFolderTools = await scanToolsWithIgnore(
        fullPath,
        ignoreList,
        events,
      );
      discoveredTools = discoveredTools.concat(subFolderTools);
    } else if (stat.isFile() && item.endsWith(".tool.ts")) {
      discoveredTools.push(fullPath);
      events?.emitFileFound(fullPath);
    }
  }

  return discoveredTools;
}
