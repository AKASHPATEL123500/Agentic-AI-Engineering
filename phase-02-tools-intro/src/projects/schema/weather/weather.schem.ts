import { z } from "zod";

export const weatherSchema = z.object({
  city: z
    .string()
    .trim()
    .min(1, "city is required filed")
    .toLowerCase()
    .describe("Citye Name (delhi, Tokoyo and ect)"),
  // accept friendly unit names and map to OpenWeather units (metric/imperial/standard)
  units: z
    .enum(["metric", "imperial", "standard"])
    .default("metric")
    .describe(
      "Unit: 'celsius'|'fahrenheit'|'imperial' (mapped to OpenWeather)",
    ),
});
