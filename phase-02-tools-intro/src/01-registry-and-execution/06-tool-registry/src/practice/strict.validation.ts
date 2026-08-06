import { InvalidToolError } from "./registry.error.ts";
import type { RegistryOptions } from "./registry.type.ts";
import type { ToolType } from "./types.ts";

export function validateTools(tool: ToolType, option: RegistryOptions): void {
  if (!tool || typeof tool !== "object") {
    throw new InvalidToolError(
      "UNKNOWN",
      "Tool definition must be contain a vaild object",
    );
  }

  if (!tool.name || typeof tool.name !== "string" || tool.name.trim() === "") {
    throw new InvalidToolError(
      tool.name,
      "Tool must be conatin a non-empty name",
    );
  }

  if (!tool.execute || typeof tool.execute !== "function") {
    throw new InvalidToolError(
      tool.name,
      "Tool must be a contain valid 'execute' function",
    );
  }

  // 4. Parameters Schema check
  if (!tool.params || typeof tool.params !== "object") {
    throw new InvalidToolError(
      tool.name,
      "Tool must contain a valid Zod parameter schema.",
    );
  }

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
      !tool.metadata.ppriority
    ) {
      throw new InvalidToolError(
        tool.name,
        "Metadata must include at least 'category', authors and non-empty 'tags'.",
      );
    }
  }
}
