import type { IToolType } from "../../types/types.ts";
import { CustomToolValidationError } from "../custom.error.ts";
import { z } from "zod";

export function LLMInputValidate(
  tool: IToolType,
  agrs: Record<string, any>,
): Record<string, any> {
  try {
    const validateInput = tool.params.parse(agrs);
    return validateInput;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw new CustomToolValidationError(tool.name, error);
    }
    throw error;
  }
}
