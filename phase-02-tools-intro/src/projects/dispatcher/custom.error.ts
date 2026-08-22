// 09-tool-resolution-errors: Agar registry ke bahar dispatcher mein koi problem aaye uske liye
import { z } from "zod";
export class DispatcherResolutionError extends Error {
  constructor(
    public code: "RESOLVER_ERROR" | "INVALID_TOOL_OBJECT",
    message: string,
  ) {
    super(`[Dispatcher Resolution Error] ${message}`);
    this.name = "DispatcherResolutionError";
  }
}

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
