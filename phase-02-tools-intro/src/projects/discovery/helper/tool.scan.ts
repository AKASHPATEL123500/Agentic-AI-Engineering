import path from "node:path";
import fs from "node:fs/promises";
import { toolIgnoreSys } from "./tool.ignore.ts";

export async function toolScan(
  relativePath: string,
  ignoreList: string[] = [],
): Promise<string[]> {
  const absolutePath = path.resolve(relativePath);

  if (ignoreList.length === 0) {
    ignoreList = await toolIgnoreSys(absolutePath);
  }

  let discoverdTool: string[] = [];

  const readFiles = await fs.readdir(absolutePath);

  for (const file of readFiles) {
    const fullPath = path.join(absolutePath, file);

    const isIgnored = ignoreList.some((rule) => {
      // Rule se wildcard '*' hata do agar daala ho
      const cleanRule = rule.replace(/\*/g, "").trim();
      return file.startsWith(cleanRule) || file.includes(cleanRule);
    });

    if (isIgnored) {
      continue;
    }

    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      const subFolderScan = await toolScan(fullPath);
      discoverdTool = discoverdTool.concat(subFolderScan);
    } else if (stat.isFile() && file.endsWith(".tool.ts")) {
      discoverdTool.push(fullPath);
    }
  }
  return discoverdTool;
}
