import type { LLMToolCallPayload } from "../types";

export interface rawLLMRespose {
  callId: string;
  rawName: any;
  parsedArgs: Record<string, any>;
}

export function exractArgsFromLLMPayload(
  rawLLMPaylod: LLMToolCallPayload,
): rawLLMRespose {
  const callId = rawLLMPaylod.id || rawLLMPaylod.callId || `call_${Date.now()}`;

  const rawName = rawLLMPaylod.name || rawLLMPaylod.function?.name || "";

  const rawArgs =
    rawLLMPaylod.args || rawLLMPaylod.function?.arguments || rawLLMPaylod.input;

  let parsedArs: Record<string, any> = {};

  if (typeof rawArgs === "string") {
    try {
      parsedArs = JSON.parse(rawArgs);
    } catch (error) {
      throw new Error(`Invalid JSON string in tool arguments: ${rawArgs}`);
    }
  } else if (typeof rawArgs === "object" || rawArgs !== null) {
    parsedArs = rawArgs;
  }

  return {
    callId: callId,
    rawName: rawName,
    parsedArgs: parsedArs,
  };
}
