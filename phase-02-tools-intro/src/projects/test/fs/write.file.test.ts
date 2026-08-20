import { writeFileTool } from "../../tools/fs/write.file.tool.ts";

async function writeFileTest() {
  const response = await writeFileTool.exexute(
    {
      filePath: "index.txt",
      content: "This is fisrt content to write in file",
      encoding: "utf-8",
      mode: "append",
    },
    {
      role: "admin",
      sessionId: "akash82sjksdn89u12903iodjoe092eweo",
      userId: "akash_1234",
      workingDir: "../../sandbox",
    },
  );

  console.dir(response, { depth: null });
}

writeFileTest();
