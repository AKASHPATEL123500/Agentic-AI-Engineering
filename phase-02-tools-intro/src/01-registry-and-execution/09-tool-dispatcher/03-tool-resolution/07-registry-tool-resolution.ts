// iska main kaam yahi hai ki LLM ne jo toolname diya hai hume usko
//  apne tool regirty mein get karna hai

import type { ToolType } from "../../06-tool-registry/src/02-registry-contract-and-errors/src/types.ts";
import type { ToolRegistry } from "../../06-tool-registry/src/03-core-operations-and-validation/02-crud-method-logic.ts";
import { ToolNotFoundError } from "../../06-tool-registry/src/02-registry-contract-and-errors/src/02-custom-registry-errors.ts";
import { DispatcherResolutionError } from "./09-tool-resolution-errors";
/**
 *
 * @param toolName
 * @param registry
 */
export async function resolveToolFromRegistry(
  toolName: string,
  registry: ToolRegistry,
): ToolType {
  // check kya ye tool exixte karta hai
  const isExixst = registry.has(toolName);

  // agr yaha exixt nahi karti hai to custom error throe karo
  if (!isExixst) {
    // 08-tool-not-found yaha pahle se hi bana hai ToolRegistry  mein hai to wahi use kar liye hai
    throw new ToolNotFoundError(toolName);
  }
  try {
    // agr hume miil gaya to tool registry se get karo
    const tool = registry.get(toolName);
    if (!tool || !tool.execute || typeof tool.execute !== "function") {
      throw new DispatcherResolutionError(
        "INVALID_TOOL_OBJECT",
        `Tool '${toolName}' was found but its execution function is missing or broken.`,
      );
    }
    return tool;
  } catch (error) {
    throw error;
  }
}
