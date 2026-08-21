import { exctractToolFromMoudle } from "./helper/extract.tool.ts";
import { exportToolFromTooldiscovery } from "./helper/recive.tool.file.path.ts";
import { validateToolShape } from "./helper/validate.extract.tool.ts";

export interface SafeLoadResult {
  success: boolean;
  tool?: any;
  filePath: string;
  error?: string;
}

/**
 *
 * @param filePath
 * @returns
 */
export async function safeToolLoad(filePath: string): Promise<SafeLoadResult> {
  try {
    const rawModule = await exportToolFromTooldiscovery(filePath);

    const freshTool = await exctractToolFromMoudle(rawModule);

    const validation = validateToolShape(freshTool);

    if (!validation.isValid) {
      return {
        success: false,
        filePath,
        error: `Shape Validation Failed: ${validation.errors.join(", ")}`,
      };
    }

    // if everything is 100% safe then return
    return {
      success: true,
      filePath,
      tool: freshTool,
    };
  } catch (error: any) {
    return {
      success: false,
      filePath,
      error: `Module Import/Crash Error: ${error?.message || "Unknown error"}`,
    };
  }
}
