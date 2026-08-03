// 1. Initialize the Map
// Key: string (tool name) | Value: object (tool definition)
const toolRegistry = new Map<
  string,
  { description: string; execute: (args: any) => any }
>();

// -------------------------------------------------------------
// A. SET (.set): Registering new tools
// -------------------------------------------------------------
toolRegistry.set("get_weather", {
  description: "Fetches live weather reports for a given city",
  execute: (args: { city: string }) =>
    `Weather in ${args.city} is 28°C and clear.`,
});

toolRegistry.set("calculate_tax", {
  description: "Calculates total tax based on income",
  execute: (args: { amount: number }) => args.amount * 0.18,
});

console.log("Registered Tools Count:", toolRegistry.size); // Output: 2

// -------------------------------------------------------------
// B. HAS (.has): Checking if a tool exists (Duplicate Guard)
// -------------------------------------------------------------
const toolToFind = "get_weather";

if (toolRegistry.has(toolToFind)) {
  console.log(`✅ Tool '${toolToFind}' exists in the registry.`);
} else {
  console.log(`❌ Tool '${toolToFind}' is missing!`);
}

// -------------------------------------------------------------
// C. GET (.get): O(1) Instant Lookup & Execution
// -------------------------------------------------------------
const selectedToolName = "get_weather";

// Retrieve the tool definition instantly without looping
const tool = toolRegistry.get(selectedToolName);

if (tool) {
  // Execute the tool logic directly
  const output = tool.execute({ city: "Lucknow" });
  console.log("Execution Output:", output);
}

// -------------------------------------------------------------
// D. ITERATING (.entries or .values): Exporting Schemas/List
// -------------------------------------------------------------
console.log("\n--- Available Tools for LLM ---");
toolRegistry.forEach((toolDef, toolName) => {
  console.log(`- [${toolName}]: ${toolDef.description}`);
});
