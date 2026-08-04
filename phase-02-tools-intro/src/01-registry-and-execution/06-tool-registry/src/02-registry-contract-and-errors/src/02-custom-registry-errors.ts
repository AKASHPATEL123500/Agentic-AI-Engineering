// Custom Error se hum specific error classes banate hai
// Error (Base Class)
// └── ToolRegistryError (Registry Specific)
//     ├── DuplicateToolError  -> Jab same name se doosra tool aaye
//     ├── ToolNotFoundError   -> Jab LLM aisi string bheje jo registered hi na ho
//     └── InvalidToolError    -> Jab tool ka schema structure hi corrupt ho

export class ToolRegistryError extends Error {
  constructor(
    message: string,
    public errorCode: string,
  ) {
    super(message);
    this.name = "ToolRegistryError";
  }
}

export class DuplicateToolError extends ToolRegistryError {
  constructor(toolName: string) {
    super(
      `This tool ${toolName} is already exixts in the tool registry`,
      "DUPLICATE_TOOL_ERROR",
    );
    this.name = "DuplicateToolError";
  }
}

export class ToolNotFoundError extends ToolRegistryError {
  constructor(toolName: string) {
    super(`Tool '${toolName}' was not found in registry.`, "TOOL_NOT_FOUND");
    this.name = "ToolNotFoundError";
  }
}

export class InvalidToolError extends ToolRegistryError {
  constructor(toolName: string, reason: string) {
    super(`Tool '${toolName}' is invalid: ${reason}`, "INVALID_TOOL");
    this.name = "InvalidToolError";
  }
}
