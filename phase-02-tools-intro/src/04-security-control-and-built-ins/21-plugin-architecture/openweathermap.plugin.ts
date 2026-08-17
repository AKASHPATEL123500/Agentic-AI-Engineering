import { z } from "zod";
import type { ToolType } from "../../Tools/types/types.ts";

const openWeatherSchema = z.object({
  city: z
    .string()
    .min(1)
    .describe("City name (e.g., 'Delhi', 'London', 'Tokyo')"),
  units: z
    .enum(["metric", "imperial", "standard"])
    .default("metric")
    .describe("Units of measurement: metric (Celsius), imperial (Fahrenheit)"),
});

export function createOpenWeatherPlugin(apiKey: string) {
  return {
    id: "live-weather-suite",
    name: "OpenWeather Live Suite",
    version: "1.0.0",
    description:
      "Fetches live, real-time meteorological data directly from OpenWeatherMap API",
    category: "weather" as const,
    tools: [
      {
        name: "get_live_weather",
        description:
          "Retrieves live real-time temperature, humidity, wind, and conditions for any global city",
        version: "1.0.0",
        params: openWeatherSchema,
        metadata: {
          category: ["weather", "live-api"],
          tags: ["weather", "realtime", "openweathermap"],
          version: "1.0.0",
          ppriority: 1,
          createdAt: new Date().toISOString(),
          timestamps: new Date().toISOString(),
          secuirty: {
            riskLevel: "low" as const,
            requiresApproval: false,
            allowedRoles: ["admin", "user", "guest"] as Array<
              "admin" | "user" | "guest"
            >,
          },
        },
        execute: async (
          args: z.infer<typeof openWeatherSchema>,
          context: any,
        ) => {
          const startTime = Date.now();
          try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(args.city)}&units=${args.units}&appid=${apiKey}`;

            const response = await fetch(url);
            const data: any = await response.json();

            if (!response.ok) {
              throw new Error(
                data.message || `Failed to fetch weather for '${args.city}'`,
              );
            }

            return {
              success: true,
              status: "success" as const,
              message: `Live weather for ${data.name}, ${data.sys?.country} fetched successfully.`,
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
              error: null,
              meta: {
                executionTimeMs: Date.now() - startTime,
                timestamps: Date.now(),
                requestId: `owm_${Date.now()}`,
                toolDetails: {
                  name: "get_live_weather",
                  description: "OpenWeatherMap API Live Fetcher",
                  version: "1.0.0",
                },
              },
            };
          } catch (err: any) {
            return {
              success: false,
              status: "faild" as const,
              message: err.message || "Live API request failed",
              data: null,
              error: {
                code: "OPENWEATHER_FETCH_ERROR",
                message: err.message,
              },
            };
          }
        },
      },
    ],
  };
}
