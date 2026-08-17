import { z } from "zod";
import type { ToolMetaData } from "./tool.metadata.ts";

// FIX: Relaxed response interface to match actual tool return structures (tools use `meta` and optional `error`).

export interface ToolContext {
  userId: string;
  sessionId: string;
  role: "user" | "guest" | "admin" | "premium";
  workingDir: string;
  chatTime?: string;
  timestamps?: string;
  ip?: string;
  userAgent?: string;
  // TODO: isko baad mein kargeneg memory: ToolMemory;
}
export interface StandaradrizationToolResponse<TData> {
  success: boolean;
  status: "success" | "faild" | "denied" | "crash";
  message?: string;
  data: TData | null;
  // error may be null or contain custom details depending on tool
  error?: {
    code?: string | number;
    message?: string;
    [key: string]: any;
  } | null;
  // Some tools use `meta` key; others may use `metaData` — accept either
  meta?: {
    executionTimeMs?: number;
    timestamps?: string | number;
    requestId?: string;
    toolDetails?: {
      name?: string;
      description?: string;
      version?: string;
      [key: string]: any;
    };
    agent?: {
      name?: string;
      version?: string;
      status?:
        | "complete"
        | "in-progress"
        | "failed"
        | "unknown"
        | "max-reached"
        | "unauthrozied"
        | "guest-error";
      [key: string]: any;
    };
    [key: string]: any;
  };
  metaData?: Record<string, any>;
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
