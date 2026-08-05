import type { ToolType } from "../02-registry-contract-and-errors/src/types.ts";
import { NameNormalization } from "../03-core-operations-and-validation/01-name-normalization.ts";
import { z } from "zod";

export interface LLMToolSchema {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: any | unknown;
  };
}

/**
 * Function: Export to LLM Schema
 */
export function ExportToLLMSchema(tool: ToolType): LLMToolSchema {
  return {
    type: "function",
    function: {
      name: NameNormalization(tool.name),
      description: tool.description,
      parameters: z.toJSONSchema(tool.parameter),
    },
  };
}
