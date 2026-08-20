import { readFileTool } from "../../tools/fs/read.file.tool.ts";
import { writeFileTool } from "../../tools/fs/write.file.tool.ts";
import { getWeatherTool } from "../../tools/weather/weather.tool.ts";
import { ToolRegistry } from "../tool.registry.ts";

const registry = new ToolRegistry({
  allowOverWrite: true,
  strictMetadataCheck: true,
  strictValidation: true,
});

console.log("================REGITSER TOOL================");
registry.register(getWeatherTool);
registry.register(readFileTool);
registry.register(writeFileTool);
console.log("================REGITSER TOOL SUCCESSFULLY================");

console.log("\n\n");
console.log("=================== TOOL SEARCH TEST ================");
const data = registry.searchByTag("live");
console.log(
  "======================= TAGS SEARCH SUCCESSFLLY =================",
);
console.log(data);

console.log("\n\n");
console.log("=================== TOOL LIST[] ================");
console.log(registry.list());

console.log("\n\n");
console.log("=================== TOOL SAVE IN JSON ================");
registry.toolsSaveInJson();
