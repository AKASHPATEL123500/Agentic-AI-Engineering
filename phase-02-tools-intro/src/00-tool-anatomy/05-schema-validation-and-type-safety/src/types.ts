import { z } from "zod";

export interface StandardToolResponse<TData = unknown> {
  success: boolean;
  data: TData | null;
  status: "success" | "faild" | "denied";
  message: string;
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

export interface ToolContext {
  userId: string;
  sessionId: string;
  role: "admin" | "user" | "guest";
  workingDir: string;
}

export interface ToolType<
  TParams extends z.ZodObject<z.ZodRawShape> = z.ZodObject<z.ZodRawShape>,
  TInput = unknown,
> {
  name: string;
  description: string;
  version: string;
  paramters: TParams;
  execute: (
    args: z.infer<TParams>,
    context: ToolContext,
  ) => Promise<StandardToolResponse<TInput>>;
}
