import { PluginManger } from "./plugin.manager.ts";
import { ToolRegistry } from "../../01-registry-and-execution/06-tool-registry/src/03-core-operations-and-validation/02-crud-method-logic.ts";
import { createOpenWeatherPlugin } from "./openweathermap.plugin.ts";
import dotenv from "dotenv";

dotenv.config();

async function runLiveWeather() {
  const OPENWEATHER_API_KEY =
    process.env.OPENWEATHER_API_KEY || "**********************************";

  const registry = new ToolRegistry();
  const manager = new PluginManger(registry);

  // 1. Live Plugin Create & Install
  const weatherPlugin = createOpenWeatherPlugin(OPENWEATHER_API_KEY);
  await manager.install(weatherPlugin);

  // 2. Tool Fetch From Registry
  const liveWeatherTool = registry.get("get_live_weather");

  console.log(
    "\n📡 Fetching Live Real-Time Weather from OpenWeatherMap API...\n",
  );

  // 3. Real API Execution
  const result = await liveWeatherTool.execute(
    { city: "Allahabad", units: "metric" },
    {
      userId: "akash_01",
      sessionId: "sess_live",
      role: "admin",
      workingDir: process.cwd(),
    },
  );

  console.dir(result, { depth: null });
}

runLiveWeather();
