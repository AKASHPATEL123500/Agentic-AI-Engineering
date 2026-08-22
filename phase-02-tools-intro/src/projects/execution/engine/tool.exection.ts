import { performance } from "perf_hooks";
import type { IToolContext } from "../../types/context.type.ts";
import type { IToolType } from "../../types/types.ts";
import type { IToolResponse } from "../../types/response.type.ts";

export class ToolExecutionEngine {
  static async execute<T>(
    tool: IToolType<any, T>,
    context: IToolContext,
    args: Record<string, any>,
    timeoutMs?: number,
    externalSignal?: AbortSignal,
  ): Promise<IToolResponse<T>> {
    const startTimeMs = performance.now();
    let timeoutId: any;

    // Agar time poora ho gaya aur tool fasa raha, to yeh error throw karega
    const timeoutPromise = new Promise<IToolResponse<T>>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(
          new Error(
            `[Timeout] Tool '${tool.name}' execution exceeded the limit of ${timeoutMs}ms.`,
          ),
        );
      }, timeoutMs);
    });
    // Agar bahar se user ne beech mein hi process cancel kar di
    const cancellationPromise = new Promise<IToolResponse<T>>((_, reject) => {
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
    });

    const executeData = tool.execute(args, context);

    try {
      // Race! Teeno mein se jo pehle line cross karega, computer use pakad lega
      const response = await Promise.race([
        timeoutPromise,
        cancellationPromise,
        executeData,
      ]);

      // --- SUCCESS FLOW ---
      // Tool ne safely response de diya! Hum bas bahar se stopwatch ka exact time fill kar rahe hain
      response.metadata.executionMs = Math.floor(
        performance.now() - startTimeMs,
      );
      response.metadata.timestamps = new Date().toISOString();
      return response;
    } catch (error: any) {
      // --- TIMEOUT OR CRASH FALLBACK ---
      // Agar stopwatch phat gayi ya tool crash hua, to hum manually wahi same format return karenge
      const isTimeout = error.message?.includes("[Timeout]");

      return {
        success: false,
        status: "faild",
        message: error.message || "Execution failed",
        data: null,
        error: {
          code: isTimeout ? 408 : 500,
          errorType: isTimeout ? "TIME_OUT_ERROR" : "SERVER_ERROR",
          message: error.message || "INTERNAL_EXECUTION_ERROR",
        },
        metadata: {
          executionMs: Math.floor(performance.now() - startTimeMs),
          timestamps: new Date().toISOString(),
          userDeteails: {
            userId: context?.userId || "",
            role: context?.role || "",
            requetedBy: context?.userId || "",
            requestAt: new Date().toISOString(),
            requestedId: crypto.randomUUID(),
          },
          agentDteails: {
            name: "ExecutionEngine",
            status: isTimeout ? "max-reached" : "failed",
            version: "1.0.0",
            createdAt: new Date().toISOString(),
          },
          toolDteails: {
            name: tool?.name || "",
            discription: tool?.description || "",
            riskLevel: tool.metadata.secuirty.riskLevel || "low",
            version: "1.0.0",
            createdAt: new Date().toISOString(),
          },
        },
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
