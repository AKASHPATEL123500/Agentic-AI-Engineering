// Issme hum jo LLM ka raw data hoga ussme se three filed niklana hai
// 1. callId
// 2. rawName
// 3. rawArgsParsed

import type { RawLLMToolCall } from "./04-tool-call-structure.ts";

export interface ExtrctToolNameAndArgs {
  callId: string;
  rawName: string;
  parsedArgs: Record<string, any>;
}
/**
 *
 * @param rawLLMCall
 * @returns callId, rawName, parsedArgs
 */

export function extractNameAndArgs(rawLLMCall: RawLLMToolCall): {
  callId: string;
  rawName: string;
  parsedArgs: Record<string, any>;
} {
  // 1. Extract Call ID (with fallback uuid/timestamp)
  const callId = rawLLMCall.id || rawLLMCall.callId || `call_${Date.now()}`;
  // 2. Extract Tool Name (OpenAI puts it inside `function.name`, others at root `name`)
  const rawName = rawLLMCall.name || rawLLMCall.function?.name || "";
  // 3. Extract Raw Arguments (OpenAI -> function.arguments, Anthropic -> input, Gemini -> args
  const rawArgs =
    rawLLMCall.function?.arguments || rawLLMCall.input || rawLLMCall.args;

  let parsedArgs: Record<string, any> = {};
  // OpenAI sends `arguments` as stringified JSON string -> "{\"city\":\"Delhi\"}"
  if (typeof rawArgs == "string") {
    try {
      parsedArgs = JSON.parse(rawArgs);
    } catch (error) {
      throw new Error(`Invalid JSON string in tool arguments: ${rawArgs}`);
    }
  } else if (typeof rawArgs === "object" && rawArgs !== null) {
    parsedArgs = rawArgs;
  }

  return {
    callId,
    rawName,
    parsedArgs,
  };
}

// Note :
// Iss function ne rawLLM input liya and ussme se bass three property nikala  bass
// callId, rawName, parsedArgs
