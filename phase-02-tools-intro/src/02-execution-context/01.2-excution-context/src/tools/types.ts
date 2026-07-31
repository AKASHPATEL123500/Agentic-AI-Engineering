import { z } from "zod";

export interface ToolContext {
  userId: string;
  role: "user" | "admin" | "guest";
  sessionKey: string;
  workingDir: string;
}

export interface ToolType<TParams extends z.ZodObject<any> = z.ZodObject<any>> {
  name: string;
  description: string;
  parameters: TParams;
  execute: (args: z.infer<TParams>, context?: ToolContext) => Promise<unknown>;
}
