import { ToolRegistry } from "../../../06-tool-registry/src/03-core-operations-and-validation/02-crud-method-logic.ts";
import { CachedToolDiscoverer } from "../../../07-tool-discovery/03-discovery-Infrastructure-&-safety/08-discovery-cache-engine.ts";
import { LoadTools } from "../../04-loader-service-and-registry-bridge/07-batch-tool-loader.ts";
import { ToolAutoRegisterationPipline } from "./08-auto-registration-pipeline.ts";
import fs from "node:fs";

async function testPipline() {
  // instance
  const discovery = new CachedToolDiscoverer();
  const loader = new LoadTools();
  const registry = new ToolRegistry({
    allowOverWrite: false,
    strictMetadataCheck: true,
    strictValidation: true,
  });
  const orchtrationPipline = new ToolAutoRegisterationPipline(
    discovery,
    loader,
    registry,
  );

  // Path do jaha apka tool file hai
  const toolFilePath = "../../01-dynamic-module-importing/tools";
  const result = await orchtrationPipline.registerFromDirectory(toolFilePath);
  const getLLMScema = registry.getLLMSchema();
  const data = JSON.stringify(getLLMScema, null, 2);
  await fs.writeFileSync("get.llm.schema.json", data);
  const exportJson = registry.exportFromJson();
  console.log("==================================================");
  console.log("📊 PIPELINE EXECUTION STATS:");
  console.log("==================================================");
  console.log("Discoverd  : ", result.discoverd);
  console.log("Loaded     : ", result.loaded);
  console.log("Registered : ", result.registered);
  console.log("Failed     :", result.faild);
  console.log("Failures   :", result.failuers);
  console.log("\n🗄️ Registered Tool Keys:", Array.from(registry.list()));
  console.log("Get Registry tool:", registry.get("wather_tool"));
  console.log("Get LLM Schema tool:", data);
  console.log("export from json test:", exportJson);
}

testPipline();
