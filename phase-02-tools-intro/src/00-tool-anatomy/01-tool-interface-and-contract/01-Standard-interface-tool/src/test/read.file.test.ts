import { readFileTool } from "../tools/read-file.ts";

async function test() {
	const result = await readFileTool.execute({
		filePath: "../note.txt",
		encoding: "utf-8",
	});
	console.log("Result : ", result);
}
test();
