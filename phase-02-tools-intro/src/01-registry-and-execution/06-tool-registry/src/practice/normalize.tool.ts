export function normalizedToolName(toolName: string): string {
  const trimName = toolName.trim();
  const toLowerCase = trimName.toLowerCase();
  const snakeName = toLowerCase.replace(/[ -]/g, "_");
  return snakeName;
}

console.log(normalizedToolName("Weather-Tool"));
// output: weather_tool
