import { safeToolLoad } from "./main.ts";
import type { ILooderToolContract, LoderResult } from "./types.ts";

export class ToolLoaderSystem implements ILooderToolContract {
  async load(filePath: string): Promise<LoderResult> {
    if (!filePath || typeof filePath !== "string") {
      throw new Error("File path is required and must be a string");
    }

    const data = await safeToolLoad(filePath);

    return {
      sussess: true,
      filePath: filePath,
      status: data.success ? "success" : "faild",
      error: data.error || null,
      tool: data.tool || null,
    };
  }

  async loadMany(filesPath: string[]): Promise<LoderResult[]> {
    if (!Array.isArray(filesPath)) {
      throw new Error("filesPath must be an array of file paths");
    }

    const loadPromise = filesPath.map((path) => this.load(path));

    const result = await Promise.all(loadPromise);
    return result;
  }
}
