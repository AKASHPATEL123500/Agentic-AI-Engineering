import { performance } from "perf_hooks";
import type { IToolContext } from "../../types/context.type.ts";
import type { IToolType } from "../../types/types.ts";
import { ToolExecutionEngine } from "../engine/tool.exection.ts";
import type { ToolExecutionStandardResponse } from "../types.ts";

/**
 *
 * @param tool Tool legne execute ke liye
 * @param context this is tool context
 * @param args this is actual args that to be execute
 * @param timeoutMs And this is timeout milisecond that mean if you pass then a tool execute in this tuime by the if the tool time is exceed then reject error timeout error throw
 * @param externalSignal if a user canle the task during execution then it handle it and throw a lovely reponse
 */
export async function signleToolExecution<T>(
  tool: IToolType<any, T>,
  context: IToolContext,
  args: Record<string, any>,
  timeoutMs?: number,
  externalSignal?: AbortSignal,
): Promise<ToolExecutionStandardResponse<T>> {
  const requestId = crypto.randomUUID();
  const startTimeForDurationInMs = performance.now();
  const startTime = new Date().toISOString();

  try {
    const data = await ToolExecutionEngine.execute(
      tool,
      context,
      args,
      timeoutMs,
      externalSignal,
    );
    return {
      success: true,
      status: "completed",
      requestId: requestId,
      executionId: "",
      engineError: null,
      toolResponse: data,
      context: {
        name: "",
        userId: context.userId,
        role: context.role,
        workinDir: context.workingDir,
        timestamps: new Date().toISOString(),
      },
      metrics: {
        durationMs: data.metadata.executionMs || startTimeForDurationInMs,
        startTime: startTime,
        endTime: performance.now(),
        costIncurred: 1,
      },
    };
  } catch (error: any) {
    const isTimeout = error.message?.includes("[Timeout]");
    const isAbort = error.message?.includes("[Abort]");

    let currentStatus: any = "runtime_crash";
    if (isTimeout) currentStatus = "timed_out";
    if (isAbort) currentStatus = "aborted";

    return {
      // 3. FAILURE ENVELOPE: Agar tool atak gaya ya crash ho gaya
      success: false,
      status: currentStatus,
      executionId: requestId,
      requestId: requestId,
      engineError: {
        code: isTimeout ? 408 : 500,
        message: error.message || "Internal Engine Isolation Exception",
        detials: "",
        resion: "",
      },
      toolResponse: null,
      metrics: {
        startTime: startTime,
        endTime: performance.now(),
        durationMs: startTimeForDurationInMs,
      },
    };
  }
}
