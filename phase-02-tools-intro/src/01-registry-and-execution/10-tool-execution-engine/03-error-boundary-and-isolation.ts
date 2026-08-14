import { performance } from "perf_hooks";
import type {
  ToolType,
  ToolContext,
  StandaradrizationToolResponse,
} from "../06-tool-registry/src/02-registry-contract-and-errors/src/types.ts";

export class ErrorBoundaryManager {
  /**
   * 💡 Isolation Wrapper
   * Yeh function tool ko ek absolute try-catch boundary ke andar chalata hai
   * taaki sync aur async dono tarah ke crash handle ho sakein.
   */
  async runIsolated<T>(
    tool: ToolType<any, T>,
    args: any,
    context: ToolContext,
  ): Promise<StandaradrizationToolResponse<T>> {
    const startTime = performance.now();

    try {
      // 1. Tool ko execute karne ki koshish karo
      // Agar tool sahi se chal gaya, to uska response direct return ho jayega
      return await tool.execute(args, context);
    } catch (crashError: any) {
      // 2. 🚨 CRASH CAPTURED (Shock Absorber Kick-in)
      // Agar tool ke andar ka code phat gaya, to hum use poore system ko crash nahi karne denge.
      console.error(
        `🛑 [Error Boundary] Caught a severe crash in tool '${tool.name}':`,
        crashError,
      );

      const errorMessage =
        crashError instanceof Error ? crashError.message : String(crashError);

      // Hum manually wahi standard response format banakar return kar dete hain
      return {
        success: false,
        status: "faild",
        message: `Tool internal runtime crash: ${errorMessage}`,
        data: null,
        error: {
          code: 500, // Internal Runtime Error Code
          message: errorMessage || "RUNTIME_ERROR",
        },
        meta: {
          executionTimeMs: Math.round(performance.now() - startTime),
          timestamps: Date.now(),
          requestId: crypto.randomUUID(),
          agent: {
            name: "ErrorBoundaryAgent",
            version: "1.0.0",
            status: "failed",
          },
          toolDetails: {
            name: tool.name,
            descriptions: tool.description,
            version: tool.version,
          },
        },
      };
    }
  }
}
