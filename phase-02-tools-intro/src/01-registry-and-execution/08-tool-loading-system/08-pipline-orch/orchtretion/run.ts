import { LoadTools } from "../../04-loader-service-and-registry-bridge/07-batch-tool-loader.ts";
import { autoRegisterToolsPipeline } from "./08-auto-registration-pipeline.ts";

// Dummy Registry (Mock) test karne ke liye
const mockRegistry = {
  tools: new Map(),
  register(tool: any) {
    this.tools.set(tool.name, tool);
  },
};

async function testPipeline() {
  const loader = new LoadTools();

  // Fake Mock Discoverer jo tumhare weather tool ka path return kare
  const mockDiscoverer: any = {
    async discover() {
      return ["../01-dynamic-module-importing/tools/weather.tool.ts"];
    },
  };

  await autoRegisterToolsPipeline(
    "./tools",
    mockDiscoverer,
    loader,
    mockRegistry,
  );

  console.log(
    "\n🗄️ Registry Final State:",
    Array.from(mockRegistry.tools.keys()),
  );
}

testPipeline();
