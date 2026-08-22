import { INameNormlizetion } from "../../helper/tool.name.normalize.ts";
import type { LLMToolCallPayload, ToolCallPayload } from "../types.ts";
import { exractArgsFromLLMPayload } from "./llm.res.recive.ts";

export function LLMToolCallNormalize(
  rawData: LLMToolCallPayload,
  aliasMap: Record<string, string> = {},
): ToolCallPayload {
  const { callId, rawName, parsedArgs } = exractArgsFromLLMPayload(rawData);

  let normalizeName = INameNormlizetion(rawName);

  if (aliasMap[normalizeName]) {
    normalizeName = aliasMap[normalizeName];
  }

  const cleanArgs =
    parsedArgs && typeof parsedArgs === "object" ? parsedArgs : {};

  return {
    id: callId,
    toolName: normalizeName,
    args: cleanArgs,
    metadata: {
      name: "",
      recivedAt: new Date(),
    },
  };
}
