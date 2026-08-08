import fs from "node:fs/promises";
import path from "node:path";

/**
 * Single-Level Directory Scanner
 * Iska kaam hai diye gaye folder me se sirf *.ts files ke absolute paths nikalna.
 */
async function discoverTools(relativeFolder: string): Promise<string[]> {
  try {
    // 1. Relative path ko Absolute (poora) path me convert karo
    const absoluteFolderPath = path.resolve(relativeFolder);
    console.log(`🔍 Scanning folder: ${absoluteFolderPath}\n`);

    // 2. Folder ke andar ki saari files ki list read karo
    const allFiles = await fs.readdir(absoluteFolderPath);

    const toolPaths: string[] = [];

    // 3. Loop chalao aur check karo kaun si file hamare kaam ki hai
    for (const fileName of allFiles) {
      // Har file ka poora path banao
      const fullFilePath = path.join(absoluteFolderPath, fileName);

      // File ka extension (surname) pata karo
      const fileExtension = path.extname(fileName);

      // Agar file .ts hai, toh usko list me add karo
      if (fileExtension === ".ts") {
        toolPaths.push(fullFilePath);
        console.log(`✅ Found Tool: ${fileName}`);
      } else {
        console.log(`❌ Skipped (Not TypeScript): ${fileName}`);
      }
    }

    return toolPaths;
  } catch (error: any) {
    console.error(`🚨 Scanning failed: ${error.message}`);
    return [];
  }
}

// ---- RUNNING THE SCANNER ----
async function run() {
  // Hum apne dummy folder ka relative path de rahe hain
  const discoveredFiles = await discoverTools("../src/tools");

  console.log("\n==== FINAL DISCOVERED PATHS ARRAY ====");
  console.log(discoveredFiles);
}

run();
