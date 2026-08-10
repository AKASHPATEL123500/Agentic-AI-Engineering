import { safeLoadToolModule } from "../02-tool-validation-and-sanitization/04-corrupted-module-isolation.ts";
import type {
  ILooderToolContract,
  LoderResult,
} from "../03-loader-infrastructure-and-events/05-loader-contract-interface.ts";

export class LoadTools implements ILooderToolContract {
  async load(filePath: string): Promise<LoderResult> {
    if (!filePath || typeof filePath !== "string") {
      throw new Error("file path is required and must be a string");
    }

    const data = await safeLoadToolModule(filePath);

    return {
      sussess: true,
      status: data.success ? "success" : "faild",
      filePath: data.filePath,
      tool: data.tool || null,
      error: data.error || null,
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
