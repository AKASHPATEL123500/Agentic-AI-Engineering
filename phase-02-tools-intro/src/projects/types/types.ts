import { z } from "zod";
import type { IToolContext } from "./context.type.ts";
import type { IToolMetadata } from "./metadata.type.ts";
import type { IToolResponse } from "./response.type.ts";

export interface IToolType<
  TParams extends z.ZodObject<z.ZodRawShape> = z.ZodObject<z.ZodRawShape>,
  TOutPut = unknown,
> {
  name: string;
  description: string;
  version: string;
  params: TParams;
  metadata: IToolMetadata;
  execute: (
    args: z.infer<TParams>,
    context: IToolContext,
  ) => Promise<IToolResponse<TOutPut>>;
}
