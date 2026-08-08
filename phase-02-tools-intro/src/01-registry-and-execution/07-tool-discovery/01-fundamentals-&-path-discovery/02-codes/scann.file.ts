import fs from "node:fs/promises";
import path from "node:path";

export async function scanToolsDirectory(dirPath: string) {
  // 1. Folder path ko absolute path mein badla
  const absolutePath = path.resolve(dirPath);
  // 2. Folder ke andar ki saari files ke naam padhe
  const readFiles = await fs.readdir(absolutePath);
  // 3. Sirf wo files filter ki jo '.tool.ts' se end hoti hain
  const filterFiles = readFiles.filter((file) => file.endsWith(".tool.ts"));
  // 4. Har file name ka poora absolute path bana kar array return kiya
  return filterFiles.map((file) => path.join(absolutePath, file));
}

// OUTPUTS:
// 1.
// aboslute path : D:\agentic-ai-engineering\phase-02-tools-intro\src\01-registry-and-execution\07-tool-discovery\01-fundamentals-&-path-discovery\src\tools
// 2.
// read files in this absolute path
// files list
// Discovered File Paths: [
//   "data.json", "delete-file.tool.ts", "fetch-api.tool.ts", "format-date.tool.ts", "generate-id.tool.ts",
//   "hash-password.tool.ts", "index.c", "index.txt", "parse-json.tool.ts", "read-file.tool.ts",
//   "resize-image.tool.ts", "validate-email.tool.ts", "write-file.tool.ts"
// ]

// 3.
// this is filter file only .tools.ts file read
// Discovered File Paths: [ "delete-file.tool.ts", "fetch-api.tool.ts", "format-date.tool.ts",
//   "generate-id.tool.ts", "hash-password.tool.ts", "parse-json.tool.ts", "read-file.tool.ts",
//   "resize-image.tool.ts", "validate-email.tool.ts", "write-file.tool.ts"
// ]

// 4.
// this is tha full absolute + file path
// Discovered File Paths: [
//   "D:\\agentic-ai-engineering\\phase-02-tools-intro\\src\\01-registry-and-execution\\07-tool-discovery\\01-fundamentals-&-path-discovery\\src\\tools\\delete-file.tool.ts",
//   "D:\\agentic-ai-engineering\\phase-02-tools-intro\\src\\01-registry-and-execution\\07-tool-discovery\\01-fundamentals-&-path-discovery\\src\\tools\\fetch-api.tool.ts",
//   "D:\\agentic-ai-engineering\\phase-02-tools-intro\\src\\01-registry-and-execution\\07-tool-discovery\\01-fundamentals-&-path-discovery\\src\\tools\\format-date.tool.ts",
//   "D:\\agentic-ai-engineering\\phase-02-tools-intro\\src\\01-registry-and-execution\\07-tool-discovery\\01-fundamentals-&-path-discovery\\src\\tools\\generate-id.tool.ts",
//   "D:\\agentic-ai-engineering\\phase-02-tools-intro\\src\\01-registry-and-execution\\07-tool-discovery\\01-fundamentals-&-path-discovery\\src\\tools\\hash-password.tool.ts",
//   "D:\\agentic-ai-engineering\\phase-02-tools-intro\\src\\01-registry-and-execution\\07-tool-discovery\\01-fundamentals-&-path-discovery\\src\\tools\\parse-json.tool.ts",
//   "D:\\agentic-ai-engineering\\phase-02-tools-intro\\src\\01-registry-and-execution\\07-tool-discovery\\01-fundamentals-&-path-discovery\\src\\tools\\read-file.tool.ts",
//   "D:\\agentic-ai-engineering\\phase-02-tools-intro\\src\\01-registry-and-execution\\07-tool-discovery\\01-fundamentals-&-path-discovery\\src\\tools\\resize-image.tool.ts",
//   "D:\\agentic-ai-engineering\\phase-02-tools-intro\\src\\01-registry-and-execution\\07-tool-discovery\\01-fundamentals-&-path-discovery\\src\\tools\\validate-email.tool.ts",
//   "D:\\agentic-ai-engineering\\phase-02-tools-intro\\src\\01-registry-and-execution\\07-tool-discovery\\01-fundamentals-&-path-discovery\\src\\tools\\write-file.tool.ts"
// ]
