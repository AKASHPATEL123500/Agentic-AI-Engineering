import path from "node:path";
import type { z } from "zod";
import type { ToolContext, ToolType } from "./types.ts";
import { writeFileTool } from "./write-file.ts";
import { deleteFileTool } from "./delete-file.ts";
import { cwd } from "node:process";

async function runMyTool<T extends z.ZodObject<any>>(
  tool: ToolType<T>,
  inputData: unknown,
  context: ToolContext,
) {
  try {
    const checkInputIsVaild = tool.parameters.parse(inputData);
    const result = await tool.execute(checkInputIsVaild, context);
    return result;
  } catch (error: unknown) {
    // Agar input data galat hua to Zod error throw karega jo yahan catch ho jayega
    console.error(
      "Validation failed ya Tool fail ho gaya:",
      (error as Error).message,
    );
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

// testWriteFile();

async function testDeleteFile() {
  const dummyContext: ToolContext = {
    userId: "user_789",
    role: "admin", // guest role set kiya hai, isliye permission denied aayega
    sessionKey: "session_xyz",
    workingDir: path.join(process.cwd(), "agent-sandbox"), // folder ka naam
  };
  const result = await runMyTool(
    deleteFileTool,
    {
      filePath: "../../../../hello.txt", //  Khali nahi rakha, 'hello.txt' diya
    },
    dummyContext, // dummyContext ko pass kar diya runmy tool ko
  );
  console.log("Result : ", result);
}

testDeleteFile();

// console.log("Current Working Directory:", cwd());

// ========================================================================
// workingDir ko set kiya jahan se file delete karni hai
// workingDir ka matlab hai ki aapke tool ko kaunse folder mein kaam karna hai.
//  Yahan humne "agent-sandbox" folder ko set kiya hai.
//  Iska matlab hai ki jab hum file delete karenge,
//  to wo file is folder ke andar hi search hogi aur delete hogi.
//  Agar aap kisi aur folder mein kaam karna chahte ho,
//  to aap yahan us folder ka path de sakte ho.
// jo path.join(process.cwd(), "agent-sandbox") likha hai,
// iska matlab hai ki hum current working directory (cwd)
// ke andar "agent-sandbox" folder ko target kar rahe hain.
