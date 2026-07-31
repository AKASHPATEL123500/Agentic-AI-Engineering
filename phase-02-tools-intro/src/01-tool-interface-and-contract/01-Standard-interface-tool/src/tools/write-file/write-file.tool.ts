import { z } from "zod";
import type { ToolTypes } from "../types.ts";
import { writeFile } from "node:fs/promises";
import pathModule from "path";
import fs from "node:fs/promises";

const writeFileSchema = z.object({
  filePath: z
    .string()
    .min(1, "File path is required")
    .describe("this is file path that is to be created")
    .default("test.txt"),
  encoding: z
    .enum(["utf-8", "ascii", "base64"])
    .default("utf-8")
    .describe("File ka text encoding format (default: utf-8)."),
  content: z
    .string()
    .describe("The actual text, code, or data to insert into the file"),
  mode: z
    .enum(["overwrite", "append"])
    .default("overwrite")
    .describe("This is mode, select this mode to write your file as you want"),
});

export const writeFileTool: ToolTypes<typeof writeFileSchema> = {
  name: "",
  description: "",
  parameters: writeFileSchema,
  execute: async (args) => {
    try {
      const { filePath, mode, encoding, content } = args;

      // 1. Yeh line file ke naam se pehle wale saare folders ka rasta nikal legi
      // Jaise 'src/components/button.tsx' se 'src/components' nikal legi
      const folderPath = await pathModule.dirname(filePath);
      // 2. Yeh line computer mein check karega aur missing folders khud bana dega!
      // recursive: true ka matlab hai - jitne bhi nested folders hain, sab bana do
      await fs.mkdir(folderPath, { recursive: true });

      const fileFlag = mode === "append" ? "a" : "w";
      const finalContent = mode === "append" ? `\n${args.content}` : content;

      const writecontent = await writeFile(filePath, finalContent, {
        encoding: encoding,
        flag: fileFlag,
      });

      return {
        success: true,
        fileFlag: fileFlag,
        folderPath: folderPath,
        message: `File '${filePath}' successfully updated using '${mode}' mode.`,
        content: writecontent,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `File operation failed: ${error.message}`,
      };
    }
  },
};
