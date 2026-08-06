import type { ToolType } from "./types.ts";

export interface SafeLLMSceham {
  type: "function";
  function: {
    name: string;
    description: string;
    params: any | unknown;
  };
}

export function ExportToLLMSchema(tool: ToolType): SafeLLMSceham {
  return {
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      params: tool.params,
    },
  };
}
