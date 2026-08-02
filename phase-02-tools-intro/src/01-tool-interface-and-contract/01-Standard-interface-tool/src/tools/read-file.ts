import { readFile } from "node:fs/promises";
import { z } from "zod";
import type { ToolTypes } from "./types.ts";

const readFileSchema = z.object({
	filePath: z
		.string()
		.min(1, "File Path is required!")
		.describe("Aapko jo file read karni hai, uska absolute ya relative path."),
	encoding: z
		.enum(["utf-8", "ascii", "base64"])
		.default("utf-8")
		.describe("File ka text encoding format (default: utf-8)."),
});

export const readFileTool: ToolTypes<typeof readFileSchema> = {
	name: "read-file",
	description: "",
	parameters: readFileSchema,
	execute: async (args, context) => {
		const { filePath, encoding } = args;

		try {
			const content = await readFile(filePath, { encoding: encoding });
			return {
				success: true,
				filePath: filePath,
				content: content,
			};
		} catch (error: any) {
			return {
				success: false,
				message: `File padhne mein dikkat aayi: ${error.message}`,
			};
		}
	},
};
