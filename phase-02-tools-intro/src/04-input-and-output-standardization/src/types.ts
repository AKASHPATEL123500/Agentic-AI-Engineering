import { z } from "zod";

export interface ToolContext {
  userId: string;
  sessionId: string;
  role: "admin" | "user" | "guest";
  workingDir: string;
}

// Standardized input interface for tools
// Hum chchte hai ki chahe tool fail ho ya pass lekin uska response ek hi formmat mein aye.
export interface StandardToolResponse<TData = unknown> {
  success: boolean;
  data: TData | null;
  error: {
    code: string;
    message: string;
  } | null;
  meta: {
    executionTimeMs: number;
    timestamp: string;
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
      description: string;
      version: string;
    };
  };
}

export interface ToolType<
  TParams extends z.ZodObject<z.ZodRawShape> = z.ZodObject<z.ZodRawShape>,
  TInPut = unknown,
> {
  name: string;
  description: string;
  params: TParams;
  version: string;
  execute: (
    args: z.infer<TParams>,
    context: ToolContext,
  ) => Promise<StandardToolResponse<TInPut>>;
}

interface Box<T> {
  value: T;
}

const Box: Box<string> = {
  value: "Hello",
};
