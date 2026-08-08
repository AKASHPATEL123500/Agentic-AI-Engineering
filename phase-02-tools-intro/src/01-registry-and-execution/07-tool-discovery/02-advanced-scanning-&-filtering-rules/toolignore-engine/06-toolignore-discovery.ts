import fs from "node:fs/promises";
import path from "path";

// 1. HELPER: .toolignore file padhne wala function
export async function loadIgnoreRules(dirPath: string): Promise<string[]> {
  const ignoreFilePath = path.join(dirPath, ".toolignore");
  try {
    const content = await fs.readFile(ignoreFilePath, "utf-8");
    return content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#"));
  } catch (error) {
    return [];
  }
}

// 2. HELPER: Path ko check karne wala function ki ignore hona chahiye ya nahi
function isIgnoredPath(fileName: string, ignoreRules: string[]): boolean {
  return ignoreRules.some((rule) => fileName.includes(rule));
}

// 3. MAIN DISCOVERY FUNCTION (Recursive + Ignore Engine)
export async function discoverToolsWithIgnore(
  dirPath: string,
  baseDir: string = dirPath,
  ignoreRules?: string[],
): Promise<string[]> {
  const absolutePath = path.resolve(dirPath);

  // Pehli baar call hone par .toolignore load karo
  if (!ignoreRules) {
    ignoreRules = await loadIgnoreRules(baseDir);
  }

  let discoveredPaths: string[] = [];
  const entries = await fs.readdir(absolutePath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(absolutePath, entry.name);

    // RULE 1: Agar name ignore list se match hota hai -> SKIP KAR DO
    if (isIgnoredPath(entry.name, ignoreRules)) {
      continue;
    }

    // RULE 2: Agar Folder hai -> Andar ghus ke dobara scan karo (Recursion)
    if (entry.isDirectory()) {
      const subFolderPaths = await discoverToolsWithIgnore(
        fullPath,
        baseDir,
        ignoreRules,
      );
      discoveredPaths = discoveredPaths.concat(subFolderPaths);
    }
    // RULE 3: Agar '.tool.ts' File hai -> Path save karo
    else if (entry.isFile() && entry.name.endsWith(".tool.ts")) {
      discoveredPaths.push(fullPath);
    }
  }

  return discoveredPaths;
}
// 🧪 Step 3: End-to-End Run Karke Test Karo
// Same file ke niche ye test runner add karke chalao (npx tsx 06-toolignore-discovery.ts):

// TypeScript
async function runEndToEndTest() {
  console.log("🔍 Starting Tool Discovery with .toolignore rules...\n");

  // Apne tools folder ka path do
  const toolsDirPath = path.resolve(
    "../../01-fundamentals-&-path-discovery/src/tools",
  );

  const resultPaths = await discoverToolsWithIgnore(toolsDirPath);

  console.log("✅ Final Discovered File Paths:");
  console.log(resultPaths);
}

runEndToEndTest();

// .toolignore engine pehle se ek blocklist(blacklist) taiyar karta hai,
//   aur scanner folder me ghoomte waqt us list waali kisi bhi file ya
//   folder ko touch nahi karta.
