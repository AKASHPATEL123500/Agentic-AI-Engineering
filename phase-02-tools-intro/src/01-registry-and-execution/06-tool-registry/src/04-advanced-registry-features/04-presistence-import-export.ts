// Problem: problem yaha hai ki jise hi laptop off hota hai wise hi saremap
//clear ho jate hai Map mein itne bhi data hoga

import type { ToolType } from "../02-registry-contract-and-errors/src/types.ts";
import fs from "node:fs";

// Solution:Presistence
// Persistence ka mtlb: hai ki data ko permament save karna.
// hum regsitry ke sare tools ko ek JSON .file mein save karegnge
// taki system restart hone per data save rahe
// thats it!

// Export ka mtlb hai: JSON file mein save karna yahi ( Export ) hai.
// Import: JSON file se data load karna yahi ( Import ) hai.

export interface SerializedRegistry {
  version: string;
  exportedAt: string;
  toolCounts: number;
  tools: ToolType[];
}

/**
 * 1. Export Tools in JSON File
 */
export function exportRegistryToJSON(
  tools: ToolType[],
  filePath: string,
): void {
  const data: SerializedRegistry = {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    toolCounts: tools.length,
    tools: tools,
  };

  const convertReadableJson = JSON.stringify(data, null, 2);

  fs.writeFileSync(filePath, convertReadableJson, "utf-8");
}

/**
 *  2. Import JSON file
 */
export function importFromJSON(filePath: string): ToolType[] {
  try {
    if (!filePath) {
      throw new Error("File is not exixts");
    }
    const data = fs.readFileSync(filePath, "utf-8");
    const parsed: SerializedRegistry = JSON.parse(data);

    if (!parsed.tools || !Array.isArray(parsed.tools)) {
      throw new Error("Invalid registry backup format.");
    }

    return parsed.tools;
  } catch (error) {
    throw new Error(
      `Failed to import registry state: ${(error as Error).message}`,
    );
  }
}
