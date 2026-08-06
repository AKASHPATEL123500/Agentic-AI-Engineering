import { z } from "zod";
import type { ToolMetaData } from "./tool.metadata.ts";

export interface ToolContext {
  userId: string;
  sessionId: string;
  role: "user" | "guest" | "admin" | "premium";
  workingDir: string;
  chatTime?: string;
  timestamps?: string;
  ip?: string;
  userAgent?: string;
}
export interface StandaradrizationToolResponse<TData> {
  success: boolean;
  status: "success" | "faild" | "denied" | "crash";
  message?: string;
  data: TData | null;
  error: {
    errorName: string;
    code: string | number;
    message: string;
  };
  metaData: {
    executionTimeMs: string | number;
    timestamps: string | number;
    requestId: string;
    toolDetails: {
      name: string;
      descriptions: string;
      version: string;
      timestamps?: number;
    };
    agentDetails: {
      name: string;
      version: string;
      status:
        | "complete"
        | "in-progress"
        | "failed"
        | "unknown"
        | "max-reached"
        | "unauthrozied"
        | "guest-error";
    };
  };
}
export interface ToolType<
  TParams extends z.ZodObject<z.ZodRawShape> = z.ZodObject<z.ZodRawShape>,
  TInput = unknown,
> {
  name: string;
  description: string;
  version: string;
  metadata: ToolMetaData;
  params: TParams;
  execute: (
    args: z.infer<TParams>,
    context: ToolContext,
  ) => Promise<StandaradrizationToolResponse<TInput>>;
}
