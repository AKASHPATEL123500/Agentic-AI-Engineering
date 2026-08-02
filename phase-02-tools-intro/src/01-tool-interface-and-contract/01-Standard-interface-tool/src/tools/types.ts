// export type toolArgv = Record<string, any>;

// export interface toolTypes {
//   name: string;
//   description: string;
//   excute: (agrs: toolArgv) => Promise<any>;
// }

import type { z } from "zod";
// 1. Tool Context (Extra Info jo Tool ko mil sakti hai)
export interface ToolContext {
  userId?: string;
  workingDir?: string;
}
// 2. Main Scaled Tool Interface
// TParams extends z.ZodObject<any> ka matlab: Parameters HAMESHA ek Zod Object Schema honge
export interface ToolTypes<
  TParams extends z.ZodObject<z.ZodRawShape> = z.ZodObject<z.ZodRawShape>,
> {
  name: string;
  description: string;
  parameters: TParams; // Zod Schema (Input Rule Blueprint)
  // z.infer<TParams> automatically TypeScript type nikal leta hai Zod Schema se!
  execute: (args: z.infer<TParams>, context?: ToolContext) => Promise<unknown>;
}
