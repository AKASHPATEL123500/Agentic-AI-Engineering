import type { z } from "zod";

export interface ToolContext {
  userId: string;
  role: "user" | "admin" | "guest";
  sessionKey: string;
  workingDir: string;
  dryRun?: boolean;
}

export interface ToolType<
  TParams extends z.ZodObject<z.ZodRawShape> = z.ZodObject<z.ZodRawShape>,
> {
  name: string;
  description: string;
  parameters: TParams;
  execute: (args: z.infer<TParams>, context?: ToolContext) => Promise<unknown>;
}
