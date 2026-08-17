import { ToolRegistry } from "../../../01-registry-and-execution/06-tool-registry/src/03-core-operations-and-validation/02-crud-method-logic.ts";
import { PluginManger } from "../../../04-security-control-and-built-ins/21-plugin-architecture/plugin.manager.ts";
import { weatherPluginAdapter } from "../adapter/weather.adap.ts";

const myRegistry = new ToolRegistry({
  strictMetadataCheck: true,
  allowOverWrite: true,
  strictValidation: true,
});
const plugin = new PluginManger(myRegistry);

async function liveTestPlugIn() {
  console.log("PlugIn tool is installing....");
  const install = await plugin.install(weatherPluginAdapter);
  console.log("Plugin Install successfully in the registry");

  const liveWeatherTool = myRegistry.get("get_live_weather");
  console.log(
    "\n📡 Fetching Live Real-Time Weather from OpenWeatherMap API...\n",
  );

  const result = await liveWeatherTool?.execute(
    {
      city: "Lucknow",
      units: "metric",
    },
    {
      userId: "01",
      sessionId: "launda123",
      role: "admin",
      workingDir: process.cwd(),
    },
  );
  console.dir(result, { depth: null });
}

liveTestPlugIn();
