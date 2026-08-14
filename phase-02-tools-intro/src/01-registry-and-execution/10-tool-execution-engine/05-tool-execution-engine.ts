import { performance } from "perf_hooks";
import type {
  ToolType,
  ToolContext,
} from "../06-tool-registry/src/02-registry-contract-and-errors/src/types";
import { ToolExecutionSystem } from "./02-timeout-and-cancellation";
import type { ToolExecutionStandardResponse } from "./01-contract-and-types";

export async function ToolExecution<T>(
  tool: ToolType<any, T>,
  args: any,
  context: ToolContext,
  timeoutMs?: number,
  signals?: AbortSignal,
): Promise<ToolExecutionStandardResponse<T>> {
  const requestId = crypto.randomUUID();
  const startTimeForDurationInMs = performance.now();
  const startTime = new Date().toISOString();
  try {
    const data = await ToolExecutionSystem.execute(
      tool,
      args,
      context,
      (timeoutMs = 10),
      signals,
    );

    return {
      exectionId: requestId,
      requestId: requestId,
      success: true,
      status: "completed",
      context: {
        name: "user",
        userId: context.userId,
        role: context.role,
        workinDir: context.workingDir,
        timestamps: Date.now(),
      },
      toolResponse: data,
      engineError: null,
      metrics: {
        startTime: startTime,
        endTime: performance.now(),
        durationMs: startTimeForDurationInMs,
      },
    };
  } catch (globalCrash: any) {
    // 3. FAILURE ENVELOPE: Agar tool atak gaya ya crash ho gaya
    const isTimeout = globalCrash.message?.includes("[Timeout]");
    const isAbort = globalCrash.message?.includes("[Abort]");

    let currentStatus: any = "runtime_crash";
    if (isTimeout) currentStatus = "timed_out";
    if (isAbort) currentStatus = "aborted";

    return {
      exectionId: requestId,
      requestId: requestId,
      success: false,
      status: currentStatus,
      engineError: {
        code: isTimeout ? 408 : 500,
        message: globalCrash.message || "Internal Engine Isolation Exception",
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
