import { z } from "zod";
import type { ToolMetaData } from "./04-metadata-structer-searchability-and-routing.ts";

// This is Context
export interface ToolContext {
  userId: string;
  sessionId: string;
  role: "user" | "premium" | "vip" | "admin" | "guest";
  workingDir: string;
}

// This is Stanadared Tool response
export interface StandaradrizationToolResponse<TData = unknown> {
  success: boolean;
  status: "success" | "denied" | "faild";
  message: string;
  data: TData | null;
  error: {
    code: number;
    message: string;
  } | null;
  meta: {
    executionTimeMs: number;
    timestamps: number;
    requestId: string;
    agent: {
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
    toolDetails: {
      name: string;
      descriptions: string;
      version: string;
    };
  };
}

// ToolType
export interface ToolType<
  TParams extends z.ZodObject<z.ZodRawShape> = z.ZodObject<z.ZodRawShape>,
  TOutPut = unknown,
> {
  name: string;
  description: string;
  version: string;
  parameter: TParams;
  metadata?: ToolMetaData;
  execute: (
    args: z.infer<TParams>,
    context: ToolContext,
  ) => Promise<StandaradrizationToolResponse<TOutPut>>;
}
