// Core CRUD Logic (Map-backed operations)Humari ToolRegistry class interior Map<string, ToolType>
// use karegi fast $O(1)$ lookups ke liye..
// register(tool): Validation check karegi,name normalize karegi, aur Map mein store karegi.
// .get(toolName): Normalized name se search karegi, nahi mila toh ToolNotFoundError throw karegi.
// .unregister(toolName): Tool ko Map se drop karegi.

import type { IToolRegistry } from "../02-registry-contract-and-errors/src/01-registry-Interfaces-&-contracts.ts";
import {
  DuplicateToolError,
  InvalidToolError,
  ToolNotFoundError,
} from "../02-registry-contract-and-errors/src/02-custom-registry-errors.ts";
import type { RegistryOptions } from "../02-registry-contract-and-errors/src/03-registry-options-&-configuration.ts";
import type { ToolType } from "../02-registry-contract-and-errors/src/types.ts";
import { NameNormalization } from "./01-name-normalization.ts";
import { ValidateTools } from "./03-strict-input-validations.ts";
import { isNewerVersion } from "./04-version-conflict-handling.ts";
import {
  searchByCategory,
  searchByTag,
} from "../04-advanced-registry-features/01-search-and-filter-system.ts";
import {
  ExportToLLMSchema,
  type LLMToolSchema,
} from "../04-advanced-registry-features/05-safe-llm.schema-export.ts";
import { RegistryEventEmitter } from "../04-advanced-registry-features/02-registry-events-lifecycle.ts";
import {
  exportRegistryToJSON,
  importFromJSON,
} from "../04-advanced-registry-features/04-presistence-import-export.ts";
import fs from "node:fs";
// implements IToolRegistry Ka Kya Matlab Hai?
// Matlab: implements ka matlab hota hai "wada karna" ya "contract sign karna".
// Jab aap likhte hain class ToolRegistry implements IToolRegistry, toh aap TypeScript ko bol rahe hain:
/*
Mai ek class ToolRegistry bana raha hau 
aur main wada karta hoon ki is class ke andar 
wo saare functions aur variables honge
jo IToolRegistry ke interface mein tay kiya gaya hai
*/
export class ToolRegistry implements IToolRegistry {
  // Map declare and initlize local storage
  // 1. Internal Storage: Key-Value map jahan keys normalized tool names honge
  private tool: Map<string, ToolType> = new Map();

  // 2. Options Configuration (Default values ke sath)
  private options: RegistryOptions;
  public events: RegistryEventEmitter = new RegistryEventEmitter();
  constructor(options: RegistryOptions = {}) {
    this.options = {
      allowOverWrite: false,
      strictValidation: true,
      strictMetadataCheck: true,
      ...options,
    };
  }

  // ... Baki saare CRUD methods yahan aayenge

  register(tool: ToolType): void {
    // STEP 1: Strict Health Check (Validate Tool Shape & Metadata)
    if (this.options.strictValidation) {
      ValidateTools(tool, this.options);
    }
    // STEP 2: Normalize Tool Name
    const normalizeName = NameNormalization(tool.name);

    // STEP 3: Check If Tool Already Exists
    if (this.tool.has(normalizeName)) {
      const existingTool = this.tool.get(normalizeName);
      // Case A: Overwrite allowed NAHI hai -> Direct Error Throw karo
      if (!this.options.allowOverWrite) {
        throw new DuplicateToolError(normalizeName);
      }
      // Case B: Overwrite allowed hai -> Version Check Karo!
      // Agar naya tool older/same version ka hai -> Block Update
      const hashUpgreded = isNewerVersion(existingTool!.version, tool.version);
      if (!hashUpgreded) {
        throw new DuplicateToolError(
          `Cannot overwrite tool '${normalizeName}'. New version (${tool.version}) must be higher than current (${existingTool?.version}).`,
        );
      }
    }
    // STEP 4: All checks passed -> Register / Update Tool in Map
    this.tool.set(normalizeName, tool);

    this.events.emmitRegister(tool);
  }

  get(toolName: string): ToolType | undefined {
    const normalizeToolName = NameNormalization(toolName);
    const tool = this.tool.get(normalizeToolName);
    if (!tool) {
      throw new ToolNotFoundError(normalizeToolName);
    }

    return tool;
  }

  has(toolName: string): boolean {
    const normalizeToolName = NameNormalization(toolName);

    return this.tool.has(normalizeToolName);
  }

  unregister(tool: string): boolean {
    const normalizeToolName = NameNormalization(tool);
    if (this.tool.has(normalizeToolName)) {
      this.events.emmitUnRegister(normalizeToolName);
      const deleteTool = this.tool.delete(normalizeToolName);
      return deleteTool;
    } else {
      return false;
    }
  }

  list(): ToolType[] {
    const list = Array.from(this.tool.values());
    return list;
  }

  clear(): void {
    const clear = this.tool.clear();
  }

  getLLMSchema(): LLMToolSchema[] {
    return this.list().map((tool) => ExportToLLMSchema(tool));
  }

  searchByCategory(category: string): ToolType[] {
    return searchByCategory(this.list(), category);
  }

  searchByTag(tag: string): ToolType[] {
    return searchByTag(this.list(), tag);
  }

  exportFromJson(): void {
    // Humne apni list li aur utility function ko de diya file mein save karne ke liye
    // exportRegistryToJSON(this.list(), "registry.tools.json");
    // console.log("Registry successfully JSON file mein save ho gayi hai!");

    // 🎯 FIX: Hum direct list nahi bhejenge. Pehle list ko pure converted LLM Schema (Plain JSON Objects) me badlenge!
    const cleanJsonTools = this.list().map((tool) => {
      return {
        name: tool.name,
        description: tool.description,
        version: tool.version,
        metadata: tool.metadata,
        // Yahan hum humare fix kiye hue ExportToLLMSchema ya native converter ka output daalenge:
        parameter: ExportToLLMSchema(tool).function.parameters,
      };
    });

    // Ab is ekdam clean bina-functions wale data ko file me save karenge
    exportRegistryToJSON(cleanJsonTools as any, "registry.tools.json");
    console.log("Registry successfully clean JSON file mein save ho gayi hai!");
  }

  importFromJSON(filePath: string): void {
    // 1. Utility function se saare saved tools ka array lekar aaye
    const loadedTools: ToolType[] = importFromJSON(filePath);

    // ==================== THIS IS OLD CODE =========================
    // 2. Loop chala kar ek-ek tool ko wapas se register kiya taaki Map bhar jaye
    // loadedTools.forEach((tool) => {
    //   this.register(tool);
    // });
    // ===================== HUM DIRECT REGSITER KAR RSHE THE ===========

    // solution:
    // 🎯 STEP A: Purani validation setting ko save kiya aur temporary off kar diya
    const originalStrictValidation = this.options.strictValidation;
    this.options.strictValidation = false;

    // 2. Loop chala kar ek-ek tool ko register karenge
    loadedTools.forEach((tools) => {
      // 🎯 STEP B: File se aaye tools ko ek dummy/mock execute function de dete hain
      // taaki register hone ke baad memory map sahi se build ho jaye
      const rehydratedTool: ToolType = {
        ...tools,
        execute: async (args: any, context: any) => {
          console.log(
            `🔄 Fallback execute triggered for restored tool: ${tools.name}`,
          );
          return { success: true } as any;
        },
      };

      this.register(rehydratedTool);
    });

    // 🎯 STEP C: Security guard ko wapas tight (true) kar diya
    this.options.strictValidation = originalStrictValidation;
    console.log(
      `${loadedTools.length} tools file se registry mein load ho gaye hain.`,
    );
  }
}

// const register: ToolRegistry = new ToolRegistry();

// register.events.onRegister((toolName, tool) => {
//   console.log(
//     `[SYSTEM LOG]: Naya tool system me add ho gaya hai ➔ Name: "${toolName}", Version: "${tool?.version}"`,
//   );
// });

// register.events.onUnregister((toolName, tool) => {
//   console.log(
//     `[ALERT]: Tool '${toolName}' removed from registry! Routing table update required.`,
//   );
// });
