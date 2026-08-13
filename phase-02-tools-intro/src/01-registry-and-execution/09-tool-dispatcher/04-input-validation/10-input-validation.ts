import { z } from "zod";
import type { ToolType } from "../../06-tool-registry/src/02-registry-contract-and-errors/src/types.ts";

/**
 * Custom Error: Jab LLM galat input bhejega, toh yeh error trigger hogi.
 * Isme hum saari galtiyon ko ek list (issues) mein daal denge taaki LLM use padh sake.
 */
export class CustomToolValidationError extends Error {
  public issues: string[];

  constructor(
    public toolName: string,
    zodError: z.ZodError,
  ) {
    // zod ke error ko ek ache format mein bdalna
    const formattedIssues = zodError.issues.map(
      (issue) => `[Field: ${issue.path.join(".")}] -> ${issue.message}`,
    );

    super(
      `Validation failed for tool '${toolName}': ${formattedIssues.join(", ")}`,
    );
    this.name = "ToolValidationError";
    this.issues = formattedIssues;
  }
}

/**
 *
 * @param tool
 * @param args
 */
export function validateToolArgumenst(
  tool: ToolType,
  args: Record<string, any>,
): Record<string, any> {
  try {
    const valiadetArgs = tool.parameter.parse(args);

    return valiadetArgs;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new CustomToolValidationError(tool.name, error);
    }
    throw error;
  }
}
