import type { IToolType } from "./types.ts";

export interface IToolRegistry {
  getTool(toolName: string): IToolType | undefined;
  register(tool: IToolType): void;
  unregister(tool: string): void;
  has(toolName: string): boolean;
  clear(): void;
  list(): IToolType[];
  searchByCategory?(category: string): IToolType[];
  searchByTag?(tag: string): IToolType[];
  toolsSaveInJson?(): void;
  importSaveToolInToolRegistry?(filePath: string): IToolType[];
}
