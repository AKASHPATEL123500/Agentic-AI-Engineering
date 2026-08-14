import type {
  ToolType,
  ToolContext,
} from "../../06-tool-registry/src/02-registry-contract-and-errors/src/types.ts";

// Define Hook Types
type BeforeExecuteHook = (
  tool: ToolType,
  args: any,
  context: ToolContext,
) => Promise<void> | void;
type AfterExecuteHook = (
  tool: ToolType,
  response: any,
  context: ToolContext,
) => Promise<void> | void;

export class HookManager {
  private beforeHooks: BeforeExecuteHook[] = [];
  private afterHooks: AfterExecuteHook[] = [];

  /**
   * 22: Register a hook to run BEFORE tool execution
   */
  beforeExecute(fn: BeforeExecuteHook) {
    this.beforeHooks.push(fn);
  }

  /**
   * 22: Register a hook to run AFTER tool execution
   */
  afterExecute(fn: AfterExecuteHook) {
    this.afterHooks.push(fn);
  }

  /**
   * 23: Executing the Pre-hooks pipeline
   */
  async triggerBefore(
    tool: ToolType,
    args: any,
    context: ToolContext,
  ): Promise<void> {
    for (const hook of this.beforeHooks) {
      await hook(tool, args, context);
    }
  }

  /**
   * 23: Executing the Post-hooks pipeline
   */
  async triggerAfter(
    tool: ToolType,
    response: any,
    context: ToolContext,
  ): Promise<void> {
    for (const hook of this.afterHooks) {
      await hook(tool, response, context);
    }
  }
}
