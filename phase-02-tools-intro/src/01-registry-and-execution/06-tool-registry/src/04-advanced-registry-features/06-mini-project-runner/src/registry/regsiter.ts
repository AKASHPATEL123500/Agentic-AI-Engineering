// import { ToolRegistry } from "../../../../03-core-operations-and-validation/02-crud-method-logic.ts";
// import { getWatherTool } from "../tools/get-weather-tool.ts";

// // ToolRegistry Instence
// const registry: ToolRegistry = new ToolRegistry({
//   allowOverWrite: true,
//   strictMetadataCheck: true,
//   strictValidation: true,
// });

// console.log("\n--- TEST 1: Registration aur Event Triggering ---");
// registry.register(getWatherTool);

// // console.log("\n--- TEST 2: Smart Version Overwrite Validation ---");
// // const upgardedWeatherTool = { ...getWatherTool, version: "2.0.0" } as typeof getWatherTool
// // registry.register(upgardedWeatherTool)

// registry.events.onRegister((name, tool) => {
//   console.log(
//     `🔔 [EVENT]: Naya tool successfully register hua -> ${name} (v${tool?.version})`,
//   );
// });

// registry.events.onUnregister((name) => {
//   console.log(`🔕 [EVENT]: Tool hata diya gaya -> ${name}`);
// });
