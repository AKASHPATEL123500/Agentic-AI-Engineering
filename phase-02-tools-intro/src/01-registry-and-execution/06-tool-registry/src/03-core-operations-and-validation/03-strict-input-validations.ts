// Strict Validation Layer
// Jab koi tool register hone aaye, toh silently accept nahi hoga. Hum structural check karenge:
//Kya tool object mein name present hai?

import type { RegistryOptions } from "../02-registry-contract-and-errors/src/03-registry-options-&-configuration";
import type { ToolType } from "../02-registry-contract-and-errors/src/types";
import { InvalidToolError } from "../02-registry-contract-and-errors/src/02-custom-registry-errors.ts";

// Kya execute function present aur callable hai?
// Kya parameter schema (Zod) defined hai?
// Agar nahi hai, toh humara InvalidToolError throw hoga.

/*
1. Basic Object Check
2. Name ValiDations
3. Execution Function Check
4. Parameter Sceham Check (zod)
5. Strict Metadata Check (Conditional based on RegistryOptions)
 */

export function ValidateTools(tool: ToolType, option: RegistryOptions): void {
  // 1. Basich Object Check
  if (!tool || typeof tool !== "object") {
    throw new InvalidToolError(
      "UNKNOWN",
      "Tool defintion must be contain a vaild object",
    );
  }

  // 2. Name Validation check
  if (!tool.name || typeof tool.name !== "string" || tool.name.trim() === "") {
    throw new InvalidToolError(
      "UNKNOWN",
      "Tool name is reqired and must be a non-empty string",
    );
  }

  // 3. Execution Function Check
  if (!tool.execute || typeof tool.execute !== "function") {
    throw new InvalidToolError(
      tool.name,
      "Tool must be a contain valid 'execute' function",
    );
  }

  // 4. Parameters Schema check
  if (!tool.parameter || typeof tool.parameter !== "object") {
    throw new InvalidToolError(
      tool.name,
      "Tool must contain a valid Zod parameter schema.",
    );
  }

  // 5. Strict Metadata Check (Conditional based on RegistryOptions)
  if (option.strictMetadataCheck) {
    if (!tool.metadata) {
      throw new InvalidToolError(
        tool.name,
        "Metadata is required when 'strictMetadataCheck' is enabled.",
      );
    }
    if (
      !tool.metadata.category ||
      !tool.metadata.tags ||
      !tool.metadata.author ||
      tool.metadata.tags.length === 0
    ) {
      throw new InvalidToolError(
        tool.name,
        "Metadata must include at least 'category', authors and non-empty 'tags'.",
      );
    }
  }
}
