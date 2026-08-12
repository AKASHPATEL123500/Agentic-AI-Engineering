// Iss function kaa kaam hai ki ek standared trike se input ko bana hai
// jo llm ne diya hai
// pichle wale function ne humne callId and rawName and parsedArgs diya hai
// abb hum unko bhi mila kar ek ache format mein banayege iss function mein
// yaha final function
// to all in all iss pahse kaam hai ki jo LLM ne input diya hai usko ek standrad trrike mein covert karna hai bass
// yahi main objective hai iss pahse 02 ka bass

import type {
  RawLLMToolCall,
  ToolCallPayload,
} from "./04-tool-call-structure.ts";
import { extractNameAndArgs } from "./05-tool-name-and-arguments";

/**
 * This is take a name and normalize into a standard format
 * @param name this is paramters
 * @example "Weather-Tool" ---- > "weather_tool"
 */
export function LLMInputNameNormalization(name: string): string {
  const trimName = name.trim();
  const convertIntoLowerCase = trimName.toLowerCase();
  const removeHypen = convertIntoLowerCase.replace(/[ -]/g, "_");
  return removeHypen;
}

console.log(LLMInputNameNormalization("Weather-Tool"));
// "Weather-Tool" ---- > "weather_tool"

/**
 *
 * @param rawData
 * @param aliasMap
 */
export function normalizeToolCall(
  rawData: RawLLMToolCall,
  aliasMap: Record<string, string> = {},
): ToolCallPayload {
  // 1. Extract data from the function
  const { callId, rawName, parsedArgs } = extractNameAndArgs(rawData);

  // 2. normalize raw namenusing above function
  let normalizeName = LLMInputNameNormalization(rawName);

  // Step 3: Alias Resolution (e.g., "get_weather" -> "weather_tool")
  if (aliasMap[normalizeName]) {
    normalizeName = aliasMap[normalizeName];
  }

  // Step 4: Ensure Arguments is a valid Object
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
