import type { IToolContext } from "../../types/context.type";
import type { IToolType } from "../../types/types.ts";
import type { ToolExecutionStandardResponse } from "../types";
import { signleToolExecution } from "./signle.tool.execution";

export interface parallelTool {
  tool: IToolType<any, any>;
  args: Record<any, any>;
}

export async function parallelToolExecution(
  requests: parallelTool[],
  context: IToolContext,
  timeoutMs: number = 5000, // <-- Agar kuch nahi mila toh 5 second auto-assign ho jayega
  externalSignal?: AbortSignal,
): Promise<ToolExecutionStandardResponse[]> {
  console.log(
    `🏎️ [Parallel Engine] Launching ${requests.length} tools concurrently...`,
  );

  // tool execute
  const tool = requests.map((r) => {
    return signleToolExecution(
      r.tool,
      context,
      r.args,
      timeoutMs,
      externalSignal,
    );
  });

  // Yeh saare promises ke ek sath complete hone ka wait karega
  const data = await Promise.allSettled(tool);

  return data.map((result) => {
    if (result.status === "fulfilled") {
      return result.value;
    }

    return {
      executionId: "",
      success: false,
      requestId: "",
      toolResponse: null,
      engineError: result.reason?.message || "Unknown error",
    } as ToolExecutionStandardResponse;
  });
}
