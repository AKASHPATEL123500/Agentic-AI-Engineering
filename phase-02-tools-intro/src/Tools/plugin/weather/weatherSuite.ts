import { z } from "zod";
import type { ToolType } from "../../types/types.ts";

const weatherSchema = z.object({
  city: z
    .string()
    .min(1)
    .trim()
    .describe("City Name (e.g Dheli, lacknwon, Tokyo)"),
  units: z
    .enum(["metric", "imperial", "standard"])
    .default("metric")
    .describe("Units of measurement: metric (Celsius), imperial (Fahrenheit)"),
});

export interface weatherResult {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number | string;
  pressure: string;
  condition: string;
  description: string;
  windSpeed: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

export const getLiveWetherTool: ToolType<typeof weatherSchema, weatherResult> =
  {
    name: "get_live_weather",
    description: "Fetches current live temperature and humidity",
    version: "1.0.0",
    params: weatherSchema,
    metadata: {
      category: ["get-current-wether", "live-weather", "very-accuratly"],
      tags: ["weather", "live", "fetch"],
      ppriority: 1,
      secuirty: {
        riskLevel: "low",
        requiresApproval: false,
        approvalMessage:
          "this tool is not required any approval to run this tool because this is very low risky tool",
        allowedRoles: ["admin", "guest", "premium", "user", "vip"],
      },
      createdAt: new Date().toISOString(),
      timestamps: new Date().toISOString(),
      version: "1.0.0",
    },
    execute: async (args, contect) => {
      const startTime = Date.now();
      try {
        const OPEN_WEATHER_API_KEY = "**********************************";
        const { city, units } = args;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${OPEN_WEATHER_API_KEY}`;

        const response = await fetch(url);
        const data: any = await response.json();
        if (!response.ok) {
          throw new Error(
            data.message ||
              `Error during fetchinh weather data city ${city} is not found`,
          );
        }

        return {
          success: true,
          status: "success",
          message: `Live wather for ${city} , ${data.sys?.country} fetch suuccssfully city `,
          data: {
            city: data.name,
            country: data.sys?.country,
            temperature: data.main?.temp,
            feelsLike: data.main?.feels_like,
            tempMin: data.main?.temp_min,
            tempMax: data.main?.temp_max,
            humidity: `${data.main?.humidity}%`,
            pressure: `${data.main?.pressure} hPa`,
            condition: data.weather?.[0]?.main,
            description: data.weather?.[0]?.description,
            windSpeed: `${data.wind?.speed} m/s`,
            coordinates: {
              lat: data.coord?.lat,
              lon: data.coord?.lon,
            },
          },
          rawData: {
            data,
          },
          error: null,
          meta: {
            executionTimeMs: Date.now() - startTime,
            timestamps: Date.now(),
            requestId: crypto.randomUUID(),
            agent: {
              name: getLiveWetherTool.name,
              version: getLiveWetherTool.version,
              status: "complete",
            },
            toolDetails: {
              name: getLiveWetherTool.name,
              description: getLiveWetherTool.description,
              version: getLiveWetherTool.version,
            },
          },
        };
      } catch (error: any) {
        return {
          success: false,
          status: "faild",
          message: error.message || "Live API request failed",
          data: null,
          error: {
            code: "OPENWEATHER_FETCH_ERROR",
            message:
              error.message ||
              "Open weather error during fetching live weather Data",
          },
        };
      }
    },
  };
