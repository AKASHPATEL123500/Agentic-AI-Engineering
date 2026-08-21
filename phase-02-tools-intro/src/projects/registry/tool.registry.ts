import {
  IDuplicateToolError,
  IToolNotFoundError,
} from "../error/tool.registry.custom.err.ts";
import { IConvertLLMSchema, type LLMSchema } from "../helper/llm.schema.ts";
import { INameNormlizetion } from "../helper/tool.name.normalize.ts";
import {
  IToolSearchByCategory,
  IToolSearchByTag,
} from "../helper/tool.search.ts";
import { IToolValiadate } from "../helper/tool.validator.ts";
import { INewerVersionCheck } from "../helper/tool.version.check.ts";
import {
  ISaveToolsImport,
  IToolsSaveInJSONFile,
} from "../prisistence/tools.save.in.json.file.ts";
import { getWeatherTool } from "../tools/weather/weather.tool.ts";
import type { IToolRegistry } from "../types/registry.types.ts";
import type { IToolRegistrySetting } from "../types/setting.ts";
import type { IToolType } from "../types/types.ts";
import fs from "node:fs";

export class ToolRegistry implements IToolRegistry {
  private tool: Map<string, IToolType> = new Map();
  private options: IToolRegistrySetting;

  constructor(options: IToolRegistrySetting = {}) {
    this.options = {
      allowOverWrite: false,
      strictMetadataCheck: true,
      strictValidation: true,
      ...options,
    };
  }

  register(tool: IToolType): void {
    if (this.options.strictValidation) {
      IToolValiadate(tool, this.options);
    }

    const normalizeName = INameNormlizetion(tool.name);

    if (this.tool.has(normalizeName)) {
      const existingTool = this.tool.get(normalizeName);
      if (!this.options.allowOverWrite) {
        throw new IDuplicateToolError(normalizeName);
      }

      const hashUpgaredVersion = INewerVersionCheck(
        existingTool?.version!,
        tool.version,
      );
      if (!hashUpgaredVersion) {
        throw new IDuplicateToolError(
          `Cannot overwrite tool '${normalizeName}'. New version (${tool.version}) must be higher than current (${existingTool?.version}).`,
        );
      }
    }

    this.tool.set(normalizeName, tool);
    console.log("Tool register successfully");
  }
  unregister(toolName: string): boolean {
    const normalizeName = INameNormlizetion(toolName);
    if (this.tool.has(normalizeName)) {
      this.tool.delete(normalizeName);
      return true;
    } else {
      return false;
    }
  }
  getTool(toolName: string): IToolType | undefined {
    const normalizeName = INameNormlizetion(toolName);
    if (this.tool.has(normalizeName)) {
      const tool = this.tool.get(normalizeName);
      return tool;
    }
  }
  has(toolName: string): boolean {
    const normalizeName = INameNormlizetion(toolName);

    return this.tool.has(normalizeName);
  }
  list(): IToolType[] {
    const tool = Array.from(this.tool.values());
    return tool;
  }
  clear(): void {
    this.tool.clear();
  }
  searchByCategory(category: string): IToolType[] {
    const data = IToolSearchByCategory(this.list(), category);
    return data;
  }
  searchByTag(tag: string): IToolType[] {
    const data = IToolSearchByTag(this.list(), tag);
    return data;
  }
  toolsSaveInJsonFile(): void {
    const cleanTools = this.list().map((tool) => {
      return {
        name: tool.name,
        description: tool.description,
        version: tool.version,
        metadata: tool.metadata,
        params: IConvertLLMSchema(tool).function.params,
      };
    });
    IToolsSaveInJSONFile(cleanTools, "tools.json");
    console.log("File created suucessfully and data save");
  }
  toolLoadFromJsonFile(filePath: string): void {
    const loadTools: IToolType[] = ISaveToolsImport(filePath);

    const orginalStrictValidation = this.options.strictValidation;
    this.options.strictValidation = false;

    loadTools.forEach((tools) => {
      const rehydreatedTool: IToolType = {
        ...tools,
        exexute: async (args, context) => {
          console.log(
            `🔄 Fallback execute triggered for restored tool: ${tools.name}`,
          );
          return { success: true } as any;
        },
      };

      this.register(rehydreatedTool);
    });

    this.options.strictValidation = orginalStrictValidation;
    console.log(
      `${loadTools.length} tools file se registry mein load ho gaye hain.`,
    );
  }

  getLLMSchema(): LLMSchema[] {
    const data = this.list().map((tool) => IConvertLLMSchema(tool));
    const strinfyData = JSON.stringify(data, null, 2);
    fs.writeFileSync("tool.schema.json", strinfyData);
    return data;
  }
}
