import { ToolDiscovery } from "../discovery/tool.discovery";
import { ToolRegistry } from "../registry/tool.registry.ts";
import { ToolLoaderSystem } from "../tool-loader/index.ts";

/**
 * this is main function of the app
 */
async function bootstrap() {
  // registry instence
  const registry = new ToolRegistry({
    allowOverWrite: true,
    strictMetadataCheck: true,
    strictValidation: true,
  });

  // discovery instence
  const discovery = new ToolDiscovery();

  // loader instence
  const laoder = new ToolLoaderSystem();

  // tools file discover
  const discoverTools = await discovery.discover("../tools");
  console.log("Discovere tools:", discoverTools);

  // tools loade and validate shape

  const tools = await laoder.loadMany(discoverTools);
  console.log("loads tools:", tools);

  // tools load in registry
  for (const wraperTool of tools) {
    if (wraperTool.sussess && wraperTool.tool) {
      registry.register(wraperTool.tool);
    }
  }

  console.log("Tools ready", registry.list());

  console.log("=====================================================");

  console.dir(registry.getLLMSchema(), { depth: null });
}

bootstrap();
