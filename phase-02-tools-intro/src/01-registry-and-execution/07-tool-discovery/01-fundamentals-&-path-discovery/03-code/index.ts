import fs from "node:fs/promises";
import path from "node:path";

/**
 * Single-Level Directory Scanner
 * Iska kaam hai diye gaye folder me se sirf *.ts files ke absolute paths nikalna.
 */
async function discoverTools(relativeFolder: string): Promise<string[]> {
  try {
    const absolutePath = path.resolve(relativeFolder);
    console.log("Absolute Path: ", absolutePath);

    const findFiles = await fs.readdir(absolutePath);
    // console.log("This is files lits:: ", findFiles);

    const toolList: string[] = [];

    // loop
    for (const fileName of findFiles) {
      // console.log("this is loop file lits:", fileName);
      const fullPath = await path.join(absolutePath, fileName);
      // console.log("This is after loop result with absolute path:", fullPath);

      const fileExtenion = await path.extname(fullPath);
      if (fileExtenion === ".ts") {
        toolList.push(fullPath);
        console.log("Tool found : ", fileName);
      } else {
        console.log("Not found file:", fileName);
      }
    }

    return toolList;
  } catch (error: unknown) {
    console.log("Error", error.message);
    throw error;
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
