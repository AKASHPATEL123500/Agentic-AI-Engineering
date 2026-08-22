import { ToolRegistry } from "../../registry/tool.registry.ts";
import { readFileTool } from "../../tools/fs/read.file.tool.ts";
import { writeFileTool } from "../../tools/fs/write.file.tool.ts";
import type { IToolContext } from "../../types/context.type.ts";
import { ToolExecutionEngine } from "../engine/tool.exection.ts";
import { parallelToolExecution } from "../wrapper/multiple.tool.execution.ts";
import { signleToolExecution } from "../wrapper/signle.tool.execution.ts";

// 1. Setup Configurations
const registry = new ToolRegistry({
  allowOverWrite: true,
  strictMetadataCheck: true,
  strictValidation: true,
});

const controller = new AbortController();

const context: IToolContext = {
  userId: "akash_1234",
  sessionId: "101992-20owoxsjnxn29i",
  role: "admin",
  workingDir: process.cwd(),
};

const args = {
  filePath: "./execution.engine.test.ts",
  encoding: "utf-8",
};

const args1 = {
  filePath: "test.txt",
  encoding: "utf-8",
  content: ` this is test content that is writing from parrelle test date is ${new Date().toISOString()}`,
  mode: "append",
};

// 2. Main Wrapper Function for Async Execution
async function runTestPipeline() {
  try {
    console.log("Tool registry start: tool registering start hai....");
    registry.register(readFileTool);
    registry.register(writeFileTool);

    console.log("\n");

    console.log("Tool getting from the registry");
    const fileReadTool = registry.getTool(readFileTool.name);
    const fileWriteTool = registry.getTool(writeFileTool.name);
    console.log("Tool get successfully from the registry");

    // Safety Check: Agar tool nahi mila toh wahin ruk jao
    if (!fileReadTool) {
      console.error(
        `❌ Error: Tool '${readFileTool.name}' registry mein nahi mila! Pehle check karo registered hai ya nahi.`,
      );
      return;
    }

    if (!fileWriteTool) {
      console.error(
        `❌ Error: Tool '${readFileTool.name}' registry mein nahi mila! Pehle check karo registered hai ya nahi.`,
      );
      return;
    }

    console.log("\n");
    console.log(
      `parellel Tool executing starting: read tool : ${readFileTool.name} \n and this write tool for wrte content ${writeFileTool.name}`,
    );

    // console.log("\n🛑 --- TESTING CANCELLATION (AbortSignal check) ---");
    // 2. Tool chalne se PEHLE hi use cancel/abort kar do
    // controller.abort();

    // Engine execution wrapper ke andar await safely chalega
    // const response = await signleToolExecution(tool, context, args, 1000);
    const response = await parallelToolExecution(
      [
        {
          args: args,
          tool: readFileTool,
        },
        {
          args: args1,
          tool: writeFileTool,
        },
      ],
      context,
    );

    // console.log("\n📥 [CANCELLATION ENGINE RESPONSE]:");
    console.log("\n📥 [ENGINE RESPONSE]:");
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("🔥 Pipeline ke andar severe crash hua:", error);
  }
}

// 3. Pipeline ko execute karo
runTestPipeline();
