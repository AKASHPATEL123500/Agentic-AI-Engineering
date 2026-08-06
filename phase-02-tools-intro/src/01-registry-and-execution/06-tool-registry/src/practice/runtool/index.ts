import { ToolRegistry } from "../registry.tools.ts";
import { getWatherTool } from "../tools.ts";

async function main() {
  const registry = new ToolRegistry({ allowOverWrite: true });

  console.log("Registering tool: ", getWatherTool.name);
  registry.register(getWatherTool);

  console.log("Registry list length (using method):", registry.list().length);
  console.log("Registry has tool (by name):", registry.has(getWatherTool.name));

  const tool = registry.get(getWatherTool.name);
  console.log("Got tool from registry:", tool.name, tool.version);

  // Execute with a mock context
  const context = {
    userId: "user-123",
    sessionId: "sess-456",
    role: "user",
    workingDir: ".",
  } as any;

  const result = await tool.execute(
    { city: "mumbai", unit: "celsius", countries: "india" } as any,
    context,
  );
  console.log("Tool execution result:", result);
}

main().catch((e) => console.error(e));
