import { z } from "zod";

export const readFileSchema = z.object({
  filePath: z
    .string()
    .min(1, "File Path is required!")
    .describe("Aapko jo file read karni hai, uska absolute ya relative path."),
  encoding: z
    .enum(["utf-8", "ascii", "base64"])
    .default("utf-8")
    .describe("File ka text encoding format (default: utf-8)."),
});

export type readFileInput = z.infer<typeof readFileSchema>;
