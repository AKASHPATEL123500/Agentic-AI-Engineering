import { readFileTool } from "../../tools/fs/read.file.tool.ts";

async function testReadFile() {
  const res = await readFileTool.exexute(
    {
      filePath: "index.txt",
      encoding: "utf-8",
    },
    {
      role: "admin",
      sessionId: "aijwiehi3iw89u092jiwu3839",
      userId: "akash_1234",
      workingDir: "../../sandbox",
    },
  );
  console.dir(res, { depth: null });
}

testReadFile();
