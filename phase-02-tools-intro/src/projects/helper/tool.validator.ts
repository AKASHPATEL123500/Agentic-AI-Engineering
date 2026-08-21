import { IInvalidToolError } from "../error/tool.registry.custom.err.ts";
import type { IToolRegistrySetting } from "../types/setting.ts";
import type { IToolType } from "../types/types.ts";
/**
1. Basic Object Check
2. Name ValiDations
3. Execution Function Check
4. Parameter Sceham Check (zod)
5. Strict Metadata Check (Conditional based on RegistryOptions)
 */

export function IToolValiadate(
  tool: IToolType,
  options: IToolRegistrySetting,
): void {
  if (!tool || typeof tool !== "object") {
    throw new IInvalidToolError(
      "UNKNOWN",
      "Tool defintion must be contain a vaild object",
    );
  }

  if (!tool.name || typeof tool.name !== "string" || tool.name.trim() === "") {
    throw new IInvalidToolError(
      tool.name,
      "Tool name is reqired and must be a non-empty string",
    );
  }

  if (!tool.execute || typeof tool.execute !== "function") {
    throw new IInvalidToolError(
      tool.name,
      "Tool must be a contain valid 'execute' function",
    );
  }

  if (!tool.params || typeof tool.params !== "object") {
    throw new IInvalidToolError(
      tool.name,
      "Tool must contain a valid Zod parameter schema.",
    );
  }

  if (options.strictMetadataCheck) {
    if (!tool.metadata) {
      throw new IInvalidToolError(
        tool.name,
        "Metadata is required when 'strictMetadataCheck' is enabled.",
      );
    }
    if (
      !tool.metadata.category ||
      !tool.metadata.tags ||
      tool.metadata.tags.length === 0
    ) {
      throw new IInvalidToolError(
        tool.name,
        "Metadata must include at least 'category', authors and non-empty 'tags'.",
      );
    }
  }
}
