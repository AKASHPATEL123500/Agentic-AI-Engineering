import { LoadTools } from "../04-loader-service-and-registry-bridge/07-batch-tool-loader.ts";

const loader = new LoadTools();

const data = await loader.loadMany([
  "../01-dynamic-module-importing/tools/weather.tool.ts",
  "../01-dynamic-module-importing/tools/weather.tool.ts",
]);

// console.log("DATA: ", data[0]?.tool.params);
console.log("DATA:", data);
