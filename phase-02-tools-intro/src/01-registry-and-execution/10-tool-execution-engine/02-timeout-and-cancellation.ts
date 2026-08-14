import type {
  ToolType,
  ToolContext,
  StandaradrizationToolResponse,
} from "../06-tool-registry/src/02-registry-contract-and-errors/src/types.ts";
import { performance } from "perf_hooks";

export class ToolExecutionSystem {
  static async execute<T>(
    tool: ToolType<any, T>,
    args: any,
    context: ToolContext,
    timeoutMs?: number,
    externalSignal?: AbortSignal,
  ): Promise<StandaradrizationToolResponse<T>> {
    const startTime = performance.now();
    let timeoutId: any;
    // 1. THE TIME BOMB (Stopwatch Promise)
    // Agar time poora ho gaya aur tool fasa raha, to yeh error throw karega
    const timeoutPromise = new Promise<StandaradrizationToolResponse<T>>(
      (_, reject) => {
        timeoutId = setTimeout(() => {
          reject(
            new Error(
              `[Timeout] Tool '${tool.name}' execution exceeded the limit of ${timeoutMs}ms.`,
            ),
          );
        }, timeoutMs);
      },
    );

    // 2. THE CANCELLATION PROMISE
    // Agar bahar se user ne beech mein hi process cancel kar di
    const cancellationPromise = new Promise<StandaradrizationToolResponse<T>>(
      (_, reject) => {
        if (externalSignal?.aborted) {
          return reject(
            new Error(`[Abort] Tool '${tool.name}' execution was canceled.`),
          );
        }
        externalSignal?.addEventListener("abort", () => {
          reject(
            new Error(`[Abort] Tool '${tool.name}' execution was canceled.`),
          );
        });
      },
    );

    // 3. ACTUAL TOOL EXECUTION PROMISE
    const executionData = tool.execute(args, context);

    try {
      // Race! Teeno mein se jo pehle line cross karega, computer use pakad lega
      const response = await Promise.race([
        executionData,
        timeoutPromise,
        cancellationPromise,
      ]);

      // --- SUCCESS FLOW ---
      // Tool ne safely response de diya! Hum bas bahar se stopwatch ka exact time fill kar rahe hain
      response.meta.executionTimeMs = Math.floor(performance.now() - startTime);
      response.meta.timestamps = Date.now();
      return response;
    } catch (error: any) {
      // --- TIMEOUT OR CRASH FALLBACK ---
      // Agar stopwatch phat gayi ya tool crash hua, to hum manually wahi same format return karenge
      const isTimeout = error.message?.includes("[Timeout]");

      return {
        success: false,
        status: "faild",
        data: null,
        message: error.message || "Execution failed",
        error: {
          code: isTimeout ? 408 : 500,
          message: error.message || "INTERNAL_EXECUTION_ERROR",
        },
        meta: {
          executionTimeMs: Math.round(performance.now() - startTime),
          timestamps: Date.now(),
          requestId: crypto.randomUUID(),
          agent: {
            name: "ExecutionEngine",
            version: "1.0.0",
            status: isTimeout ? "max-reached" : "failed",
          },
          toolDetails: {
            name: tool.name,
            descriptions: tool.description,
            version: tool.version,
          },
        },
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
