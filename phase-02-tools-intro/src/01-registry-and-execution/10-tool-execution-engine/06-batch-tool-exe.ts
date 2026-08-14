import type {
  ToolType,
  ToolContext,
} from "../06-tool-registry/src/02-registry-contract-and-errors/src/types.ts";
import type { ToolExecutionStandardResponse } from "./01-contract-and-types";
import { ToolExecution } from "./05-tool-execution-engine.ts";

export interface BatchToolExecution {
  tool: ToolType<any, any>;
  args: any;
}

export async function executeMultipleToolsInParallel(
  requests: BatchToolExecution[],
  context: ToolContext,
  timeout: number = 1000,
): Promise<ToolExecutionStandardResponse[]> {
  console.log(
    `🏎️ [Parallel Engine] Launching ${requests.length} tools concurrently...`,
  );

  const exetionTime = requests.map((req) => {
    return ToolExecution(req.tool, req.args, context, timeout);
  });

  // Yeh saare promises ke ek sath complete hone ka wait karega
  const data = Promise.all(exetionTime);
  return data;
}
