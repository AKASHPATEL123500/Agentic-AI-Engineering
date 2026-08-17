import { z } from "zod";
import type { ToolType } from "./types/types.ts";
import { metaData } from "./meta/tool.res.metadata.ts";

const getWeatherScehma = z.object({
  countries: z
    .enum(["india", "singapore", "vietnam", "china"])
    .default("india")
    .describe("This is region required to get weather frequently"),
  city: z
    .string()
    .trim()
    .toLowerCase()
    .describe("This is city required to get weather"),
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

export const getWeatherTool: ToolType<typeof getWeatherScehma, any> = {
  name: "get_weather",
  description: "Fetches current weather information for a given city.",
  version: "1.0.0",
  params: getWeatherScehma,
  metadata: {
    category: ["weather", "live-weather"],
    tags: ["api", "live", "forecast", "public"],
    version: "1.0.0",
    ppriority: 1,
    createdAt: new Date().toISOString(),
    timestamps: new Date().toISOString(),
    secuirty: {
      riskLevel: "critical",
      requiresApproval: false,
      allowedRoles: ["admin"],
    },
  },
  execute: async (rawArgs, context) => {
    try {
      // 🔥 FIX 3: Safety Guard sabse pehle! Taki context undefined hone par crash na ho
      if (!context || !context.sessionId || !context.userId) {
        return {
          success: false,
          status: "faild",
          message:
            "[UNAUTHORIZED ACCESS] Valid context & session credentials are required.",
          data: null,
          error: {
            code: 401,
            message: "Unauthorized tool invocation pattern.",
          },
          meta: metaData("unauthrozied", {
            name: getWeatherTool.name,
            description: getWeatherTool.description,
            version: getWeatherTool.version,
          }),
        };
      }

      // Input arguments validation via Zod
      const validateRawArgs = getWeatherScehma.parse(rawArgs) as weatherInput;

      if (validateRawArgs?.city.toLowerCase() === "unknown") {
        throw new Error("City Not Found In DB");
      }

      // TODO: yaha pending mein hai
      // ◄── LIVE MEMORY FETCH ──►
      // const tm = new ToolMemorys();
      // const sessionMemory = tm.get(context.sessionId);

      // // Agar is session ke andar history array nahi bana, to initialize karo
      // if (!sessionMemory.history) {
      //   sessionMemory.history = [];
      // }

      // // Naya search raw arguments history list mein add karo
      // sessionMemory.history.push(validateRawArgs);

      // // ◄── LIVE MEMORY SAVE ──►
      // // Poore updated object ko store mein wapas save karo!
      // tm.set(context.sessionId, sessionMemory);

      const mockData: WeatherData = {
        countries: validateRawArgs?.countries,
        city: validateRawArgs?.city,
        unit: validateRawArgs?.unit,
        temptrauter: validateRawArgs?.unit === "celsius" ? 25.3 : 85.8,
        humnidity: 122,
        condition: "Today is cloudy",
        IQ: 123,
      };

      return {
        success: true,
        status: "success",
        message: "Weather fetched successfully with historical log.",
        // 🔥 FIX: data mein ab pure session ki purani history return hogi!
        data: mockData,
        error: null,
        meta: metaData("complete", {
          name: getWeatherTool.name,
          description: getWeatherTool.description,
          version: getWeatherTool.version,
        }),
      };
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return {
          success: false,
          status: "faild",
          message: "Tool input validation failure",
          data: null,
          error: {
            code: "TOOL_VALIDATION_ERROR",
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
        meta: metaData("failed", {
          name: getWeatherTool.name,
          description: getWeatherTool.description,
          version: getWeatherTool.version,
        }),
      };
    }
  },
};
