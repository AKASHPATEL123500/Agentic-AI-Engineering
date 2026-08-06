import type { ToolType } from "./types.ts";

export interface IToolRegistry {
  register(tool: ToolType): void;
  unregister(toolName: string): boolean;
  get(toolName: string): ToolType;
  has(toolName: string): boolean;
  list(): ToolType[];
  clear(): void;
  getLLMSchema?(): any;
  searchByCategory?(category: string): ToolType[];
  searchByTag?(tags: string | string[]): ToolType[];
  exportFromJson(): void;
  importFromJSON(filePath: string): void;
}

export interface RegistryOptions {
  allowOverWrite?: boolean;
  strictValidation?: boolean;
  strictMetadataCheck?: boolean;
}
