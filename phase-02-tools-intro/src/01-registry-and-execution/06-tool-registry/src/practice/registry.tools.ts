import { normalizedToolName } from "./normalize.tool.ts";
import { exportRegistryToJSON, importFromJSON } from "./presistence.ts";
import { DuplicateToolError, ToolNotFoundError } from "./registry.error.ts";
import type { IToolRegistry, RegistryOptions } from "./registry.type.ts";
import { ExportToLLMSchema } from "./safe.llm.schema.ts";
import { validateTools } from "./strict.validation.ts";
import type { ToolType } from "./types.ts";
import { isNewVersion } from "./version.check.ts";
import { fileURLToPath } from "node:url";
import path from "node:path";

export class ToolRegistry implements IToolRegistry {
  // map create
  private tools: Map<string, ToolType> = new Map();
  // 2. Options Configuration (Default values ke sath)
  public options: RegistryOptions;
  constructor(options: RegistryOptions = {}) {
    this.options = {
      allowOverWrite: false,
      strictValidation: true,
      strictMetadataCheck: true,
      ...options,
    };
  }
  register(tool: ToolType): void {
    // firstly validate tool all is right or not
    if (this.options.strictValidation) {
      validateTools(tool, this.options);
    }

    // normalize name
    const normalizeName = normalizedToolName(tool.name);

    // check if is alredy exists or not
    if (this.tools.has(normalizeName)) {
      const exitingTool = this.tools.get(normalizeName);

      // CASE A: if overwrite not allow then throw duplicate tool err
      if (!this.options.allowOverWrite) {
        throw new DuplicateToolError(normalizeName);
      }

      // CASE B: if allowoverwrite true hai to check kya newer version bada hai cuurent se
      const hashUpgraded = isNewVersion(exitingTool!.version, tool.version);
      if (!hashUpgraded) {
        throw new DuplicateToolError(
          `Can not over write tool ${normalizeName}. New version ${tool.version} must be higer to current version ${exitingTool?.version}`,
        );
      }
    }
    this.tools.set(normalizeName, tool);
  }
  unregister(toolName: string): boolean {
    const normalizeName = normalizedToolName(toolName);
    if (this.tools.has(normalizeName)) {
      this.tools.delete(normalizeName);
      return true;
    } else {
      return false;
    }
  }
  get(toolName: string): ToolType {
    const normalizeName = normalizedToolName(toolName);
    const tool = this.tools.get(normalizeName);

    if (!tool) {
      throw new ToolNotFoundError(normalizeName);
    }
    return tool;
  }
  has(toolName: string): boolean {
    const normalizeName = normalizedToolName(toolName);

    if (this.tools.has(normalizeName)) {
      return true;
    } else {
      return false;
    }
  }
  list(): ToolType[] {
    const tools = Array.from(this.tools.values());
    return tools;
  }
  clear(): void {
    this.tools.clear();
  }
  exportFromJson(): void {
    const cleandTools = this.list().map((tool) => {
      return {
        name: tool.name,
        description: tool.description,
        version: tool.version,
        metadata: tool.metadata,
        params: ExportToLLMSchema(tool).function.params,
      };
    });

    // 1. Current file ka directory path nikalein
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // 2. Ab 'sandbox/tool.json' ko current directory ke sath join karein
    const absolutePath = path.resolve(__dirname, "./sandbox/tool.json");

    // 3. Absolute path pass karein
    exportRegistryToJSON(cleandTools as any, absolutePath);

    console.log(
      `Registry successfully clean JSON file mein save ho gayi hai! Path: ${absolutePath}`,
    );
  }
  importFromJSON(filePath: string): void {
    const loadedTools: ToolType[] = importFromJSON(filePath) || [];

    const orginalStrictSetting = this.options.strictValidation;
    this.options.strictValidation = false;

    loadedTools.forEach((tool) => {
      const rehydratedTool: ToolType = {
        ...tool,
        execute: async (args: any, context: any) => {
          console.log(
            `🔄 Fallback execute triggered for restored tool: ${tool.name}`,
          );
          return { success: true } as any;
        },
      };

      this.register(rehydratedTool);
    });

    this.options.strictValidation = orginalStrictSetting;
    console.log(
      `${loadedTools.length} tools file se registry mein load ho gaye hain.`,
    );
  }
}

const news = new ToolRegistry({
  allowOverWrite: true,
  strictMetadataCheck: true,
  strictValidation: true,
});

console.log(news.options);
