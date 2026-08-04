// 1. Ek registry banayi aur tools dale
// const myToolsRegistry = new Map();

// myToolsRegistry.set("weather_tool", "Shehar ka taapman check karta hai");
// myToolsRegistry.set("calculator_tool", "Maths ke sawaal solve karta hai");
// myToolsRegistry.set("search_tool", "Google par search karta hai");

// // 2. .forEach() ka use
// // Syntax: map.forEach((value, key) => { ... })
// myToolsRegistry.forEach((ToolKaKaam, ToolKaNaam) => {
//   console.log(`🤖 Tool Name: ${ToolKaNaam} | Function: ${ToolKaKaam}`);
// });

// ======================================================================

// Practices
const ToolRegistry = new Map<
  string,
  { description: string; execute: (args: any) => any }
>();

// Set tools
ToolRegistry.set("get_weather", {
  description: "Fetches live weather reports for a given city",
  execute: async (args: { city: string }) =>
    `Weather in ${args?.city} is 28°C and clear.`,
});

ToolRegistry.set("calculate_tax", {
  description: "Calculates total tax based on income",
  execute: (args: { amount: number }) => args.amount * 0.18,
});

console.log("Registered Tools Count:", ToolRegistry.size); // Output: 2

const llmInput = "get_weather";
if (ToolRegistry.has(llmInput)) {
  const tool = ToolRegistry.get(llmInput);
  const ouput = tool?.execute({ city: "Paryagraj" });
  console.log("OutPut : ", ouput);
} else {
  console.log("This tool is not exixts");
}

console.log("\n--- Available Tools for LLM ---");
ToolRegistry.forEach((w, n) => {
  console.log(`-[${n}]: ${w.description}`);
});
