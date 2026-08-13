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

// ye ek function hai jo
// two paras le raha hai jise ki tool, args
// to hum iss arge ko iss tool.paramter.parse(args)
// agr yaha args validate hoga yani hamare tool ke ander
// jo paramters hai agr usse yaha args match kar gaya to
// hum yahi re retrun kar denge agr match nahi karega to error
// throw karega aur ss error ko hum catch kar rahe hao

// Too iss phase ka main foucs tahi hai ki
// llm ne jo args diya hai kya waha
// hamare tool ke params se match karta hai ki nahi
// bass
