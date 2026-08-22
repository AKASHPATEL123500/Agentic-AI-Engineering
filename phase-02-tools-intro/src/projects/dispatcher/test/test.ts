import { ToolRegistry } from "../../registry/tool.registry.ts";
import { getWeatherTool } from "../../tools/weather/weather.tool.ts";
import { contextGen } from "../utils/inject.context.ts";
import { LLMInputValidate } from "../utils/input.validate.ts";
import { LLMToolCallNormalize } from "../utils/tool.call.normalize.ts";

const args = {
  countries: "india",
  city: "Allahabad",
  unit: "metric",
};
const aliases = { get_weather: "weather_tool" };

const liveUserSession = {
  userId: "user_vip_888",
  sessionId: "session_token_xyz_123",
  role: "admin" as const, // 👈 Badla: 'user' se 'admin' taaki authorization pass ho aur APPROVAL tak pahunche
};

const regsitry = new ToolRegistry({
  strictMetadataCheck: true,
  strictValidation: true,
  allowOverWrite: true,
});

console.log("Tool regsitering start");
regsitry.register(getWeatherTool);

console.log("Tool regsitering end");

console.log("\n");
console.log("Tool dispathcer start");

console.log("\n");

console.log("Tool geting start");
const tool = regsitry.getTool(getWeatherTool.name);
console.log("Tool get successfully start");

console.log("\n");

console.log("Tool exeution start.......");
console.log("\n");
console.log("Tool params validate starting.........");
const validateArgs = LLMInputValidate(tool, args);
console.log("this is tha validate args for tool", validateArgs);

console.log("\n");
console.log("Tool context injecting stsrated............");
const context = contextGen(liveUserSession);
console.log("this is tha validate context of user ", context);

console.log("\n");
console.log("Now finnlay executing the tool.....");
const response = await tool?.execute(validateArgs, context);
console.log("Tool execute successfully...");

console.dir(response, { depth: null });
