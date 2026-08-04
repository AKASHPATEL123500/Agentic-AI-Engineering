const toolRegistry = new Map<string, any>();

// tool set in the tool registry
toolRegistry.set("weather_tool", {
  descriptions: "This is w weather tool that fetch realtime data",
  run: () => "Prayagraj mein aaj dhoop hai.",
});

toolRegistry.set("calculator_tool", {
  descriptions: "this tool solve maths",
  run: () => 2 + 2,
});

// 2. instant lookup
const instantLookUp = toolRegistry.get("weather_tool");

// 3. Duplicate Stop karna
if (toolRegistry.has("weather_tool")) {
  console.log("This is already exixts");
}

// .set(key, value): Adds or updates a tool instantly.
// .has(key): Prevents duplicate registration errors before touching execution logic.
// .get(key): Fetches the exact tool in $O(1)$ constant time,
// avoiding slow array.find() loops.
// .forEach() / .values(): Makes it effortless to loop through all tools and dump their schemas for the LLM.
