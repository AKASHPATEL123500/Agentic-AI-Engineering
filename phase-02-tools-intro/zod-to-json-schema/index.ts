import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

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

const data = z.toJSONSchema(getWeatherScehma);
console.log(data);
