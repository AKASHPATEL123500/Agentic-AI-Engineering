import type { z } from "zod";
import type { ToolContext, ToolType } from "./types.ts";
import { writeFileTool } from "./write-file.ts";
import path from "node:path";

async function runMyTool<T extends z.ZodObject<any>>(
  tool: ToolType<T>,
  inputData: unknown,
  context: ToolContext,
) {
  try {
    const checkInputIsVaild = tool.parameters.parse(inputData);
    const result = await tool.execute(checkInputIsVaild, context);
    return result;
  } catch (error: any) {
    // Agar input data galat hua to Zod error throw karega jo yahan catch ho jayega
    console.error("Validation failed ya Tool fail ho gaya:", error.message);
  }
}

async function testWriteFile() {
  // Dummy context banaya jisme bataya ki kis folder mein kaam karna hai
  const dummyContext: ToolContext = {
    userId: "user_789",
    role: "admin",
    sessionKey: "session_xyz",
    workingDir: path.join(process.cwd(), "agent-sandbox"), // folder ka naam
  };
  const result = await runMyTool(
    writeFileTool,
    {
      path: "hello.txt", //  Khali nahi rakha, 'hello.txt' diya
      content: "Aapke unique Tool Runner function se yeh file bani hai!",
      mode: "overwrite",
      encoding: "utf-8",
    },
    dummyContext, // dummyContext ko pass kar diya runmy tool ko
  );
  console.log("Result : ", result);
}

testWriteFile();
