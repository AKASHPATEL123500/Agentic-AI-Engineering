import { z } from "zod";
import type { ToolType } from "./types.ts";
import { metaData } from "./meta.respone.ts";

const getWeatherScehma = z.object({
  countries: z
    .enum(["india", "singapore", "vietnam", "china"])
    .default("india")
    .describe("This is resion that is rquired to get weather frequntly"),

  city: z
    .string()
    .trim()
    .toLowerCase()
    .describe("This is city that is required to get weather"),
  unit: z
    .enum(["celsius", "fahrenheit", "Imperial"])
    .default("celsius")
    .describe("This is unit choose any one"),
});

type weatherInput = z.infer<typeof getWeatherScehma>;

export interface WeatherData {
  countries: string;
  city: string;
  unit: string;
  temptrauter: number;
  humnidity: number | string;
  condition: string;
  IQ: number;
}

export const getWatherTool: ToolType<typeof getWeatherScehma, WeatherData> = {
  name: "get_weather",
  description: "Fetches current weather information for a given city.",
  version: "1.0.0",
  params: getWeatherScehma,
  metadata: {
    category: ["weather", "live-weather"],
    tags: ["api", "live", "forecast"],
    version: "1.0.0",
    ppriority: 1,
    createdAt: new Date().toISOString(),
    timestamps: new Date().toISOString(),
  },
  execute: async (rawArgs, context) => {
    try {
      // !. Check Raw Args is valid it releted to zod object or not
      const validateRawArgs = getWeatherScehma.parse(rawArgs) as weatherInput;
      if (!context) {
        return {
          success: false,
          status: "faild",
          message:
            "[UNAUTHROZIED ACCESS] Context is require dto run  this tool",
          data: null,
          error: {
            code: 401,
            message:
              "[UNAUTHROZIED ACCESS] Context is require dto run  this tool",
          },
          meta: metaData("unauthrozied"),
        };
      }

      if (!context.sessionId || !context.userId) {
        return {
          success: false,
          status: "faild",
          message: "Invaild Credential Error",
          data: null,
          error: {
            code: 401,
            message: "[INVAILD ACCESS] Inavild Credential Error",
          },
          meta: metaData("unauthrozied"),
        };
      }

      if (validateRawArgs?.city.toLowerCase() === "unknown") {
        throw new Error("City Not Found In DB");
      }

      const mockData: WeatherData = {
        countries: validateRawArgs?.countries,
        city: validateRawArgs?.city,
        unit: validateRawArgs?.unit,
        temptrauter: validateRawArgs?.unit === "celsius" ? 25.3 : 85.8,
        humnidity: 122,
        condition: "Toady is cloudy",
        IQ: 123,
      };

      return {
        success: true,
        status: "success",
        message: "Weather fetch successfully",
        data: mockData,
        error: null,
        meta: metaData("complete"),
      };
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return {
          success: false,
          status: "faild",
          message: "Tool execution error",
          data: null,
          error: {
            code: "TOOL_EXECUTION_ERROR",
            message: err.issues.map((e) => e.message).join(", "),
          },
          meta: metaData("failed"),
        };
      }
      return {
        success: false,
        status: "faild",
        message: "Tool execution error",
        data: null,
        error: {
          code: "TOOL_EXECUTION_ERROR",
          message:
            err.message || "An unexpected error occurred inside the tool.",
        },
        meta: metaData("failed"),
      };
    }
  },
};
