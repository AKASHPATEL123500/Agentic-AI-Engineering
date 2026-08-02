import { readFileTool } from "./tool.ts";

export function agent(message: string) {
	if (message === "Read note.txt") {
		return readFileTool("note.txt");
	} else {
		console.log("File not found");
	}
}
