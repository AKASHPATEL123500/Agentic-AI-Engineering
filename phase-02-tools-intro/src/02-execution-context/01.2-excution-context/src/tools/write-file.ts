import { z } from "zod";

const WriteFileInputSchema = z.object({
  path: z
    .string()
    .min(1, "File path is required")
    .describe(
      "File ka naam ya relative path (e.g., 'data.txt' ya 'logs/test.json')",
    ),
  content: z.string().describe("Text ya code jo file mein write karna hai"),
  mode: z
    .enum(["overwrite", "append"])
    .default("overwrite")
    .describe("File update karne ka mode"),
  encoding: z
    .enum(["utf-8", "ascii", "base64"])
    .default("utf-8")
    .describe("File encoding format"),
});
