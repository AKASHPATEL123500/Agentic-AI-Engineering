import { readFileTool } from "../tools/read-file.ts";
import { toolRun } from "./tool.runner.ts";

async function testReadFile() {
  await toolRun(readFileTool, { filePath: "../note.txt", encoding: "" });
}

testReadFile();
