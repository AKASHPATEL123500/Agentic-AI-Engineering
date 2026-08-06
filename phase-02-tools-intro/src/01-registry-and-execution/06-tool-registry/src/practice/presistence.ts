import type { ToolType } from "./types.ts";
import fs from "node:fs";
import path from "node:path"; // <-- Folder path handle karne ke liye

export interface SerializedREgistry {
  version: string;
  exportedAt: string;
  toolLegnth: number;
  tools: ToolType[];
}

export function exportRegistryToJSON(
  tools: ToolType[],
  filePath: string,
): void {
  const data: SerializedREgistry = {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    toolLegnth: tools.length,
    tools: tools,
  };

  // Fix: Pehle check karo ki 'sandbox' folder maujood hai ya nahi, nahi toh banao
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const readAbleData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, readAbleData, "utf-8");
}

export function importFromJSON(filePath: string): ToolType[] | undefined {
  try {
    if (!filePath) {
      throw new Error("File path is required");
    }
    // Fix: Pehle check karo file sach mein exist karti hai ya nahi
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at ${filePath}`);
    }

    const data = fs.readFileSync(filePath, "utf-8");
    const parsed: SerializedREgistry = JSON.parse(data);

    // Fix: Pehle check 'Array.isArray' ke aage '!' (not) lagaya taaki valid array par error na aaye
    if (!parsed.tools || !Array.isArray(parsed.tools)) {
      throw new Error("Invalid registry backup format.");
    }
    return parsed.tools;
  } catch (error) {
    console.log(`Failed to import registry state: ${(error as Error).message}`);
    return undefined;
  }
}
