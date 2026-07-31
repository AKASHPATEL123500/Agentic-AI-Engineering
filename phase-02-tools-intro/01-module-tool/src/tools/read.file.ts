import { readFile } from "node:fs/promises";

export async function readFileTool(path: string) {
  const content = readFile(path, "utf-8");
  return content;
}
