import type { IToolContext } from "../types/context.type.ts";
import type { IToolResponse } from "../types/response.type.ts";
import type { IToolType } from "../types/types.ts";

export type ExecutionStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "timed_out"
  | "aborted";

export interface ToolExecutionStandardResponse<TData = unknown> {
  executionId: string;
  success: boolean;
  status: ExecutionStatus;
  requestId: string;
  // context
  context?: {
    name: string | null;
    userId: string | number;
    workinDir?: string;
    timestamps: number | string | null;
    role: string;
  };
  toolResponse: IToolResponse<TData> | null;
  engineError: {
    code: number;
    message: string;
    resion?: string;
    detials?: string;
  } | null;

  metrics?: {
    startTime: string; // ISO Timestamp
    endTime: string | number | null; // ISO Timestamp
    durationMs: number | string | null; // Execution time in milliseconds
    costIncurred?: number; // Agar tool kisi paid third-party API ko call karta hai (e.g., Serper, Twilio)
  };
}

export interface IToolExecutionInput {
  args: Record<string, any>;
  tool: IToolType<any, any>;
  context: IToolContext;
  options: IToolExecutionoptions;
}

export interface IToolExecutionoptions {
  timeoutMs?: number; // Max duration jo hum tool ko chalne ke liye denge (e.g., 5000ms)
  signal?: AbortSignal; // Native mechanism jisse hum chalti hui execution ko cancel kar sakein
}
