import fs from "node:fs/promises";
import path from "node:path";

export async function toolIgnoreSys(dirPath: string): Promise<string[]> {
  try {
    const fullPath = path.join(dirPath, ".toolignore");
    const rawContent = await fs.readFile(fullPath, "utf-8");

    const freshData = rawContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));

    return freshData;
  } catch (error) {
    return [];
  }
}
