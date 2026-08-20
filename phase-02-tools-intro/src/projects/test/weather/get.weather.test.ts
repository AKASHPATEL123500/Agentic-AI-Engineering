import { getWeatherTool } from "../../tools/weather/weather.tool.ts";

async function testGetWeather() {
  const response = await getWeatherTool.exexute(
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

  console.dir(response, { depth: null });
}

testGetWeather();
