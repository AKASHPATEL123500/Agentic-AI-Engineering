// Core CRUD Logic (Map-backed operations)Humari ToolRegistry class interior Map<string, ToolType>
// use karegi fast $O(1)$ lookups ke liye..
// register(tool): Validation check karegi,name normalize karegi, aur Map mein store karegi.
// .get(toolName): Normalized name se search karegi, nahi mila toh ToolNotFoundError throw karegi.
// .unregister(toolName): Tool ko Map se drop karegi.

import type { IToolRegistry } from "../02-registry-contract-and-errors/src/01-registry-Interfaces-&-contracts";
import {
  DuplicateToolError,
  InvalidToolError,
  ToolNotFoundError,
} from "../02-registry-contract-and-errors/src/02-custom-registry-errors";
import type { RegistryOptions } from "../02-registry-contract-and-errors/src/03-registry-options-&-configuration";
import type { ToolType } from "../02-registry-contract-and-errors/src/types";
import { NameNormalization } from "./01-name-normalization";
import { ValidateTools } from "./03-strict-input-validations";
import { isNewerVersion } from "./04-version-conflict-handling";

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

  getLLMSchema(): any[] {
    return this.list().map((tool) => tool.parameter);
  }
}
