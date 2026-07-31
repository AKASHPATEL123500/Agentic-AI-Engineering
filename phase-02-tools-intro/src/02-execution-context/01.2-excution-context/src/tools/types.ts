import { z } from "zod";

export interface ToolContext {
  userId: string;
  sessionKey?: string;
  workingDir: string;
}

export interface ToolType<TParams extends z.ZodObject<any> = z.ZodObject<any>> {
  name: string;
  description: string;
  paramters: TParams;
  execuet: (args: z.infer<TParams>, context?: ToolContext) => Promise<unknown>;
}
