import type { ToolPlugIn } from "../../../04-security-control-and-built-ins/21-plugin-architecture/plugin.types.ts";
import { getLiveWetherTool } from "../weather/weatherSuite.ts";

export const weatherPluginAdapter: ToolPlugIn = {
  id: "engineering-suite",
  name: "weather-suite",
  version: "1.0.0",
  discription: "Weather tool for get rel time weather data",
  category: "weather",
  tools: [getLiveWetherTool],
};
