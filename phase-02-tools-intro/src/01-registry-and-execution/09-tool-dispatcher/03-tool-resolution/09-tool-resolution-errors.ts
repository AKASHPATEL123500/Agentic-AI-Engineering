// 09-tool-resolution-errors: Agar registry ke bahar dispatcher mein koi problem aaye uske liye

export class DispatcherResolutionError extends Error {
  constructor(
    public code: "RESOLVER_ERROR" | "INVALID_TOOL_OBJECT",
    message: string,
  ) {
    super(`[Dispatcher Resolution Error] ${message}`);
    this.name = "DispatcherResolutionError";
  }
}
