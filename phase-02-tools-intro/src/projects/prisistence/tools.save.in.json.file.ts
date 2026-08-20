import type { IToolType } from "../types/types.ts";
import fs from "node:fs";

export interface IToolSaveRules {
  version: string;
  exportedAt: string;
  toolCounts: number;
  tools: IToolType[];
}

export function IToolsSaveInJSONFile(
  tools: IToolType[],
  filePath: string,
): void {
  const data: IToolSaveRules = {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    toolCounts: tools.length,
    tools: tools,
  };
  const stringfyData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, stringfyData, "utf-8");
}

export function ISaveToolsImport(filePath: string): IToolType[] {
  try {
    if (!filePath) {
      throw new Error("File is not exixts");
    }
    const rawData = fs.readFileSync(filePath, "utf-8");
    const parseData: IToolSaveRules = JSON.parse(rawData);

    if (!parseData || !parseData.tools || !Array.isArray(parseData.tools)) {
      throw new Error("Invalid registry backup format.");
    }

    return parseData.tools;
  } catch (error) {
    throw new Error(
      `Failed to import registry state: ${(error as Error).message}`,
    );
  }
}
