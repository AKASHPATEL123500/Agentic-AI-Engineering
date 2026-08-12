import { normalizeToolCall } from "./06-tool-call-normalization.ts";

// Test 1: OpenAI Raw Output
const openAIRaw = {
  id: "call_123",
  function: {
    name: "  WEATHER_TOOL  ",
    arguments: '{"city":"Delhi","unit":"celsius"}',
  },
};

// Test 2: Anthropic Raw Output
const anthropicRaw = {
  id: "toolu_999",
  name: "get_weather",
  input: { city: "Delhi", unit: "celsius" },
};

// Alias Mapping
const aliases = { get_weather: "weather_tool" };

console.log("Normalized OpenAI:", normalizeToolCall(openAIRaw, aliases));
console.log("Normalized Anthropic:", normalizeToolCall(anthropicRaw, aliases));

//Normalized OpenAI: {
//   id: "call_123",
//   toolName: "weather_tool",
//   args: {
//     city: "Delhi",
//     unit: "celsius",
//   },
//   metadata: {
//     name: "",
//     recivedAt: 2026-08-12T04:10:00.187Z,
//   },
// }
// Normalized Anthropic: {
//   id: "toolu_999",
//   toolName: "weather_tool",
//   args: {
//     city: "Delhi",
//     unit: "celsius",
//   },
//   metadata: {
//     name: "",
//     recivedAt: 2026-08-12T04:10:00.188Z,
//   },
// }
