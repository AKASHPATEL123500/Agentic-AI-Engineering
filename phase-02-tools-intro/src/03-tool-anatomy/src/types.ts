import { z } from "zod";

export interface ToolContext {
  userId: string;
  sessionKey: string;
  workingDir: string;
  role: "user" | "guest" | "admin" | "vip";
}

export interface ToolType<
  TParams extends z.ZodObject<z.ZodRawShape> = z.ZodObject<z.ZodRawShape>,
> {
  name: string;
  descriptions: string;
  parameters: TParams;
  execute: (args: z.infer<TParams>, context: ToolContext) => Promise<unknown>;
}
