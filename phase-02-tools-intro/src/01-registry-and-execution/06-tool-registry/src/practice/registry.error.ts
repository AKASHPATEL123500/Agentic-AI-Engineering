class ToolRegistryError extends Error {
  constructor(message: string, errorCode: string | number) {
    super(message);
    this.name = "ToolRegistryError";
  }
}

export class DuplicateToolError extends ToolRegistryError {
  constructor(toolName: string) {
    super(
      `This tool ${toolName} is already exixts in the tool regsitry`,
      "DUPLICATE_TOOL_ERROR",
    );
    this.name = "DuplicateToolError";
  }
}

export class ToolNotFoundError extends ToolRegistryError {
  constructor(toolName: string) {
    super(` '${toolName}' tool was not found in registry.`, "TOOL_NOT_FOUND");
    this.name = "ToolNotFoundError";
  }
}
export class InvalidToolError extends ToolRegistryError {
  constructor(toolName: string, reason: string) {
    super(`Tool '${toolName}' is invalid: ${reason}`, "INVALID_TOOL");
  }
}
