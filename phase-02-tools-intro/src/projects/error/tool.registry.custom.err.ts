export class ToolRegistryError extends Error {
  constructor(
    message: string,
    public errorCode: string,
  ) {
    super(message);
    this.name = "ToolRegistryError";
  }
}

export class IDuplicateToolError extends ToolRegistryError {
  constructor(toolName: string) {
    super(
      `This tool ${toolName} is already exixts in the tool registry`,
      "DUPLICATE_TOOL_ERROR",
    );
    this.name = "DuplicateToolError";
  }
}

export class IToolNotFoundError extends ToolRegistryError {
  constructor(toolName: string) {
    super(
      `${toolName} tool is not found in the tool registry`,
      "TOOL_NOT_FOUND_ERROR",
    );
    this.name = "ToolNotFoundError";
  }
}

export class IInvalidToolError extends ToolRegistryError {
  constructor(toolName: string, resion: string) {
    super(`Tool '${toolName}' is invalid: ${resion}`, "INVALID_TOOL");
    this.name = "InvalidToolError";
  }
}
