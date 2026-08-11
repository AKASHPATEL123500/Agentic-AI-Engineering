import { z } from "zod";
import { createMeta } from "../../../../00-tool-anatomy/04-input-and-output-standardization/src/tool.meta.ts";
import type { ToolType } from "./types.ts";

const weatherSchema = z.object({
  city: z
    .string()
    .trim()
    .lowercase()
    .min(1, "City is required")
    .describe("This is City name"),
  unit: z
    .enum(["celsius", "fahrenheit"])
    .default("celsius")
    .describe("This is unit choose any one"),
});

interface WeatherData {
  temptrauter: number;
  humindity: number;
  condition: string;
  IQ: number;
}

export const WeatherTool: ToolType<typeof weatherSchema, WeatherData> = {
  name: "wather_tool",
  description:
    "This is weather tool that fatch real time weather based on city and unit and more...",
  parameter: weatherSchema,
  version: "0.0.1",
  metadata: {
    category: "weather",
    tags: ["fetch-live-weather", "weather-tool", "100%-accurate"],
    priority: 1,
  },
  execute: async (args, context) => {
    try {
      if (!context) {
        return {
          success: false,
          data: null,
          error: {
            code: "UNAUTHROZIED ERROR",
            message: "Context is required to run this tool",
          },
          meta: createMeta("unauthrozied"),
        };
      }
      if (context?.role === "guest") {
        return {
          success: false,
          data: null,
          error: {
            code: "FORBIDDEN ERROR",
            message: "Guest user cant fetch weather",
          },
          meta: createMeta("guest-error"),
        };
      }
      if (args?.city.toLowerCase() === "unknown") {
        throw new Error("City Not Found");
      }

      const mockData: WeatherData = {
        temptrauter: args?.unit === "celsius" ? 28 : 82.5,
        humindity: 65,
        condition: "Praty Cloudy",
        IQ: 127,
      };

      return {
        success: true,
        data: mockData,
        error: null,
        meta: createMeta("complete"),
      };
    } catch (err: any) {
      return {
        success: false,
        data: null,
        error: {
          code: "TOOL_EXECUTION_ERROR",
          message:
            err.message || "An unexpected error occurred inside the tool.",
        },
        meta: createMeta("failed"),
      };
    }
  },
};
