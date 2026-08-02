import fs, { writeFile } from "node:fs/promises";
import pathModule from "node:path";
import { z } from "zod";
import type { ToolType } from "./types.ts";

const writeFileSchema = z.object({
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

export const writeFileTool: ToolType<typeof writeFileSchema> = {
	name: "",
	description: "",
	parameters: writeFileSchema,
	execute: async (agrs, context) => {
		try {
			if (!context) {
				throw new Error(
					"Execution context is missing. Tool operation aborted.",
				);
			}
			const { path, encoding, content, mode } = agrs;
			const { userId, role, sessionKey, workingDir } = context;

			// CONTEXT KA ASLI KAAM: User ke path ko context ki working directory se jodna
			const absolutePath = pathModule.join(workingDir, path);
			// / Folder nikalna (e.g., agar path 'logs/test.txt' hai toh 'logs' folder nikalega)
			const folderPath = await pathModule.dirname(absolutePath);
			//  BUG FIX: Pehle file ka naam folder ban raha tha, ab sahi folderPath banega
			await fs.mkdir(folderPath, { recursive: true });

			// mode checking
			const fileFlag = mode === "append" ? "a" : "w";
			const fileContent = mode === "append" ? `\n${content}` : content;

			const writeContent = await writeFile(absolutePath, fileContent, {
				encoding: encoding,
				flag: fileFlag,
			});

			return {
				success: true,
				status: "success",
				statusCode: 200,
				message: "File Writen successfully",
				fileFlag: fileFlag,
				folderPath: folderPath,
				encoding: encoding,
				timestamp: new Date(),
				content: writeContent,
				metaData: {
					host: "localhost",
					version: 1,
					ip: "12.21.233",
					time: new Date(),
					status: "success",
					statusCode: 200,
					user: userId,
					role: role,
					workingDir: workingDir,
				},
			};
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			return {
				success: false,
				error: errorMessage,
			};
		}
	},
};
