import type { ToolExecutionStandardResponse } from "../execution/types.ts";
import {
  parallelToolExecution,
  type parallelTool,
} from "../execution/wrapper/multiple.tool.execution.ts";
import { signleToolExecution } from "../execution/wrapper/signle.tool.execution.ts";
import type { ToolRegistry } from "../registry/tool.registry.ts";
import type { LLMToolCallPayload } from "./types.ts";
import { contextGen } from "./utils/inject.context.ts";
import { LLMInputValidate } from "./utils/input.validate.ts";
import { LLMToolCallNormalize } from "./utils/tool.call.normalize.ts";

export class ToolDispatcher {
  constructor(
    private registry: ToolRegistry,
    private aliasmap: Record<string, string> = {}, // LLM agar name galti kare to mapping ke liye
  ) {}

  /**
   * 🎯 SINGLE TOOL DISPATCH WITH REAL HELPERS
   */
  async dispatchSingle(
    paylaod: LLMToolCallPayload,
    sessionData: {
      userId: string;
      sessionId: string;
      role: "user" | "admin" | "premium" | "vip" | "guest";
    },
  ): Promise<ToolExecutionStandardResponse> {
    // payload ko validate normlize karo
    const cleanPayload = LLMToolCallNormalize(paylaod, this.aliasmap);
    const { args, toolName } = cleanPayload;

    // get tool
    const tool = this.registry.getTool(toolName);
    if (!tool) {
      throw new Error(
        `❌ Dispatcher Error: Tool '${toolName}' registry mein nahi mila!`,
      );
    }
    // validate input
    const validateArgs = LLMInputValidate(tool, args);
    // genrate context
    const context = contextGen(sessionData);

    // call to tool eecution and then exute tool and retunr data
    const response = signleToolExecution(tool, context, validateArgs, 5000);
    return response;
  }

  /**
   * 🏎️ BATCH PARALLEL DISPATCH WITH REAL HELPERS
   */
  async dispatchBatch(
    paylaod: LLMToolCallPayload[],
    sessionData: {
      userId: string;
      sessionId: string;
      role: "user" | "admin" | "premium" | "vip" | "guest";
    },
  ): Promise<ToolExecutionStandardResponse[]> {
    // context genrate
    const context = contextGen(sessionData);

    // validate payloads
    const data: parallelTool[] = paylaod.map((p) => {
      const cleanPaylaod = LLMToolCallNormalize(p, this.aliasmap);

      // get tool
      const tool = this.registry.getTool(cleanPaylaod.toolName);
      if (!tool) {
        throw new Error(
          `❌ Dispatcher Batch Error: Tool '${cleanPaylaod.toolName}' registry mein nahi mila!`,
        );
      }

      const args = LLMInputValidate(tool, cleanPaylaod.args);

      return {
        tool,
        args,
      };
    });

    const response = parallelToolExecution(data, context);

    return response;
  }
}
