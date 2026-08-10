import type { CachedToolDiscoverer } from "../../../07-tool-discovery/03-discovery-Infrastructure-&-safety/08-discovery-cache-engine.ts";
import type { LoadTools } from "../../04-loader-service-and-registry-bridge/07-batch-tool-loader.ts";
import fs from "node:fs";
export interface ToolRegistryLike {
  register(tool: any): void;
}

export async function autoRegisterToolsPipeline(
  dirPath: string,
  discoverer: CachedToolDiscoverer,
  loader: LoadTools,
  registry: ToolRegistryLike,
) {
  console.log(`🚀 Starting Auto-Registration Pipeline for: ${dirPath}\n`);

  // STEP 1: Discovery Engine se Paths nikaalo
  const filePaths = await discoverer.discover(dirPath);
  console.log(`🔍 Discovered ${filePaths.length} tool file(s).`);

  if (filePaths.length === 0) {
    console.log("⚠️ No tools found to register.");
    return { registeredCount: 0, failedCount: 0 };
  }

  // STEP 2: Batch Loader se Saari Files Parallel Load Karo
  const loadResults = await loader.loadMany(filePaths);

  let registeredCount = 0;
  let failedCount = 0;

  // STEP 3: Loop Chala Kar Registry Mein Inject Karo
  for (const item of loadResults) {
    if (item.sussess && item.tool) {
      registry.register(item.tool);
      registeredCount++;
      const data = JSON.stringify(item.tool, null, 2);
      await fs.writeFileSync("tool.json", data);
      console.log(`✅ Auto-Registered: ${item.tool.name}`);
    } else {
      failedCount++;
      console.error(
        `❌ Failed to register tool from ${item.filePath}:`,
        item.error,
      );
    }
  }

  console.log(
    `\n🎉 Pipeline Finished: ${registeredCount} registered, ${failedCount} failed.`,
  );
  return { registeredCount, failedCount };
}
