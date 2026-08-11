import { ToolRegistry } from "../../../06-tool-registry/src/03-core-operations-and-validation/02-crud-method-logic.ts";
import { CachedToolDiscoverer } from "../../../07-tool-discovery/03-discovery-Infrastructure-&-safety/08-discovery-cache-engine.ts";
import { LoadTools } from "../../04-loader-service-and-registry-bridge/07-batch-tool-loader.ts";
import type {
  IToolAutoRegistrationPipline,
  ToolRegistrationResult,
} from "./interface";

export class ToolAutoRegisterationPipline implements IToolAutoRegistrationPipline {
  // Constructor bolta hai: "Mujhe Discoverer, Loader, aur Registry laa kar do!"
  constructor(
    private readonly discovery: CachedToolDiscoverer,
    private readonly loader: LoadTools,
    private readonly toolRegistry: ToolRegistry,
  ) {}
  async registerFromDirectory(
    dirPath: string,
  ): Promise<ToolRegistrationResult> {
    // Ab is class ke andar hum un teeno ko use kar sakte hain!
    const result: ToolRegistrationResult = {
      discoverd: 0,
      loaded: 0,
      registered: 0,
      faild: 0,
      failuers: [],
    };

    let filePaths: string[] = [];

    // STEP 1: Discover dir path
    try {
      filePaths = await this.discovery.discover(dirPath);
      result.discoverd = filePaths.length;
    } catch (error) {
      result.faild++;
      result.failuers.push({
        filePath: dirPath,
        stage: "discoverd",
        error: error instanceof Error ? error.message : String(error),
      });
      return result; // Discovery hi fail ho gayi toh aage nahi badhenge
    }

    // STEP 2 & 3 — Loading & Registration Loop
    for (const filePath of filePaths) {
      try {
        const loadedTools = await this.loader.load(filePath);

        // Check if loading failed gracefully inside the loader
        if (!loadedTools.sussess || !loadedTools.tool) {
          result.faild++;
          result.failuers.push({
            filePath: filePath,
            stage: "loading",
            error: loadedTools.error || "Faild to load tools",
          });
          continue; // skip tool who is faild and next
        }
        result.loaded++;

        // STEP 3 — Registration
        try {
          this.toolRegistry.register(loadedTools.tool);
          result.registered++;
        } catch (error) {
          result.faild++;
          result.failuers.push({
            filePath,
            stage: "registertion",
            error: error instanceof Error ? error.message : String(error),
          });
        }
      } catch (error) {
        // Unexpected system/import crash
        result.faild++;
        result.failuers.push({
          filePath,
          stage: "loading",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
    return result;
  }
}

// const regsitry = new ToolRegistry({
//   allowOverWrite: true,
//   strictMetadataCheck: true,
//   strictValidation: true,
// });

// const load = new LoadTools();
// const discovery = new CachedToolDiscoverer();

// const auto = new ToolAutoRegisterationPipline(discovery, load, regsitry);

// auto.registerFromDirectory("../orchtretion/08-auto-registration-pipeline.ts");
