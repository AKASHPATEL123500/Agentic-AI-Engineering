import { ToolRegistry } from "../../../../03-core-operations-and-validation/02-crud-method-logic.ts";
import { getWatherTool } from "../tools/get-weather-tool.ts";

export const registry: ToolRegistry = new ToolRegistry({
  allowOverWrite: false,
  strictMetadataCheck: true,
  strictValidation: true,
});

console.log("🟢 [INIT]: Fresh Tool Registry instance taiyar hai!");

registry.events.onRegister((name, tool) => {
  console.log(`📡 [EVENT]: Tool registered -> "${name}" (v${tool?.version})`);
});

registry.events.onUnregister((name) => {
  console.log(`📡 [EVENT]: Tool unregistered -> "${name}"`);
});
