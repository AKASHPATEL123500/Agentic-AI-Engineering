import { WeatherTool } from "./tool.ts";
import type { ToolContext } from "./types.ts";

async function testWeatherTool() {
  const dummayContext1: ToolContext = {
    userId: "abc_1234",
    sessionId: "xxxxxx-yyyyy-zzzzz",
    role: "guest",
    workingDir: "./workspace",
  };

  const res1 = await WeatherTool.execute(
    {
      city: "Prayagraj",
      unit: "imperial",
    },
    dummayContext1,
  );

  console.log("Result1:", res1);

  console.log("\n==============================================\n");

  const dummayContext2: ToolContext = {
    userId: "abc_1234",
    sessionId: "xxxxxx-yyyyy-zzzzz",
    role: "admin",
    workingDir: "./workspace",
  };

  const res2 = await WeatherTool.execute(
    {
      city: "Prayagraj",
      unit: "imperial",
    },
    dummayContext2,
  );

  console.log("Result2:", res2);
}
testWeatherTool();
