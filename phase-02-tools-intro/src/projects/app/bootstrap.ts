import { ToolDiscovery } from "../discovery/tool.discovery.ts";
import { ToolDispatcher } from "../dispatcher/tool.dispatcher.ts";
import { ToolRegistry } from "../registry/tool.registry.ts";
import { ToolLoaderSystem } from "../tool-loader/index.ts";
import type { IToolContext } from "../types/context.type.ts";

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

  // console.log("Tools ready", registry.list());

  // console.log("=====================================================");

  // console.dir(registry.getLLMSchema(), { depth: null });

  const dispatcher = new ToolDispatcher(registry);

  // const paylaod = {
  //   city: "Allahabad",
  //   unit: "metric",
  // };

  // ✅ Naya ekdum sahi LLM format wala payload:
  const paylaod = {
    id: "call_gemini_12345", // Tool call ki unique ID
    name: "get-weather", // get_weather Apne registered weather tool ka sahi name likhna yahan!
    args: {
      // Asli arguments is 'args' ke andar jayenge
      city: "Allahabad",
      unit: "metric",
    },
  };
  const sessionData = {
    userId: "akasj_1233",
    role: "admin" as const,
    sessionId: "29nmxsj3u839ujshu2kjnkjn23u893u",
  };

  try {
    const data = await dispatcher.dispatchSingle(paylaod, sessionData);

    console.log(
      "📥 [Dispatcher Execution Result]:",
      JSON.stringify(data, null, 2),
    );
  } catch (error: any) {
    console.error(error.message);
  }
}

bootstrap();
