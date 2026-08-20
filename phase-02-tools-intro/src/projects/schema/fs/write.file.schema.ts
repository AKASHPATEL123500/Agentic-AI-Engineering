import { z } from "zod";

export const writeFileSchema = z.object({
  filePath: z
    .string()
    .min(1)
    .trim()
    .describe("File path to create a file in the dircetory"),
  content: z
    .string()
    .describe("Content that us write in the file while creating a file"),
  encoding: z
    .enum(["utf-8", "ascii", "base64", "binary"])
    .default("utf-8")
    .describe("Encoding that is need to erite a file to set encoding"),
  mode: z
    .enum(["append", "overwrite"])
    .default("append")
    .describe("Mode that helps to write content append and overite mode"),
});

export type writeFileInput = z.infer<typeof writeFileSchema>;
