import type { IToolType } from "../types/types";
import { z } from "zod";

export interface LLMSchema {
  type: "function";
  function: {
    name: string;
    description: string;
    params: any | unknown;
  };
}

export function IConvertLLMSchema(tool: IToolType): LLMSchema {
  return {
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      params: z.toJSONSchema(tool.params),
    },
  };
}
