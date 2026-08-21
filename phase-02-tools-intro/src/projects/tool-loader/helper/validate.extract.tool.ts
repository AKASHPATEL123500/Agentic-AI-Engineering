import type { IToolType } from "../../types/types.ts";

export interface validateToolResult {
  isValid: boolean;
  errors: string[];
}

export function validateToolShape(tool: IToolType): validateToolResult {
  const errors: string[] = [];

  if (!tool || typeof tool !== "object") {
    return {
      isValid: false,
      errors: ["Extracted item is not a valid object"],
    };
  }
  if (!tool.name || typeof tool.name !== "string" || tool.name.trim() === "") {
    errors.push("Tool 'name' is missing or not a non-empty string");
  }
  if (!tool.execute || typeof tool.execute !== "function") {
    errors.push("Tool must be a contain valid 'execute' function");
  }

  if (!tool.description || typeof tool.description !== "string") {
    errors.push("Tool 'description' is missing or not a string.");
  }

  if (!tool.params || typeof tool.params !== "object") {
    errors.push("Tool 'params' is missing or not a valid schema object.");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}
