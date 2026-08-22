import type { weatherResponse } from "../../res/weather.respone.ts";
import { weatherSchema } from "../../schema/weather/weather.schem.ts";
import type { IToolType } from "../../types/types.ts";
import { z } from "zod";
import { metaData } from "../../utils/response.metadat.ts";
import "dotenv/config";

// api key setup
const apikey =
  process.env.OPEN_WEATHER_API_KEY || "1768f50bab6a7292aeec344d1e7079bd";

// type of weather schema
type weatherInput = z.infer<typeof weatherSchema>;

export const getWeatherTool: IToolType<typeof weatherSchema, weatherResponse> =
  {
    name: "get_weather",
    description:
      "This is weather tool that fetch live weather data and is is very accurate tool",
    version: "1.0.0",
    params: weatherSchema,
    metadata: {
      name: "get_weather",
      tags: ["live", "real", "weather", "data", "accurate"],
      category: ["weather", "live-weather", "real-time", "feautres"],
      discription:
        "This is weather tool that fetch live weather data and is is very accurate tool",
      priority: 1,
      version: "1.0.0",
      secuirty: {
        allowedRole: ["user", "admin", "guest", "premium", "vip"],
        riskLevel: "low",
        requiresApproval: false,
      },
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    execute: async (args, context) => {
      try {
        // validate args
        const validateArs = weatherSchema.parse(args) as weatherInput;

        if (!validateArs) {
          return {
            success: false,
            status: "denied",
            data: null,
            message: "Arguments is not valid",
            error: {
              code: 400,
              errorType: "VALIDATE_ARGUMENTS_ERROR",
              message:
                "Args is not valid for schema please provide a valid schema",
            },
            metadata: metaData("denied"),
          };
        }
        if (!validateArs || !validateArs.city || !validateArs.units) {
          return {
            success: false,
            status: "faild",
            data: null,
            message: "argsuments and args property are required error",
            error: {
              code: 400,
              errorType: "ARGEMUNET_REQUIRED_ERROR",
              message: "arguments and property is reuired",
            },
            metadata: metaData("failed"),
          };
        }

        if (
          !context ||
          !context.role ||
          !context.sessionId ||
          !context.userId ||
          !context.workingDir
        ) {
          return {
            success: false,
            status: "faild",
            data: null,
            message: "contxt is required and all propertis is also required",
            error: {
              code: 400,
              errorType: "CONTEXT_ERROR",
              message: "contxt is required and all propertis is also required",
            },
            metadata: metaData("failed"),
          };
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(validateArs.city)}&units=${validateArs.units}&appid=${apikey}`;

        const response = await fetch(url);
        let data: any = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              `Error during fetchinh weather data city ${validateArs.city} is not found`,
          );
        }

        return {
          success: true,
          status: "success",
          message: `live weather fetch successfully for ${validateArs.city}`,
          data: {
            data,
          },
          error: null,
          metadata: metaData("complete"),
        };
      } catch (error: unknown | any) {
        return {
          success: false,
          status: "faild",
          message:
            error.message ||
            "Error durig fetech live data from the oprn weather",
          data: null,
          error: {
            code: 500,
            errorType: "SEVER_ENTRNAL_ERROR",
            message:
              error.message || "server entrnal error and open weather error",
          },
          metadata: metaData("failed"),
        };
      }
    },
  };
