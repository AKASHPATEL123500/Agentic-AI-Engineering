import type { z } from "zod";
import { hello } from "../../components/src/hello.ts";
import { readFileTool } from "../tools/read-file.ts";
import type { ToolTypes } from "../tools/types.ts";
import { writeFileTool } from "../tools/write-file/write-file.tool.ts";

// export async function toolRun<T extends z.ZodObject<any>>(
//   tool: ToolTypes<T>,
//   rawData: unknown,
// ) {
//   try {
//     const safeData = await tool.parameters.parse(rawData);
//     const output = await tool.execute(safeData);
//     return output;
//   } catch (error: any) {
//     console.log("ERROR: Error During tool running", error.message);
//   }
// }

// Yeh function kisi bhi tool ko aur uske inputs ko lekar chalayega
async function runMyTool<T extends z.ZodObject<any>>(
	tool: ToolTypes<T>,
	inputData: unknown, // Abhi humein nahi pata data kya hai
) {
	console.log(`\n--- Testing Tool: [${tool.name}] ---`);

	try {
		// 1. Sabse pehle input data ko tool ke parameters (Zod Schema) se check (validate) karo
		// .parse() karne se data sahi type ka ban jayega aur safe ho jayega
		const validatedArgs = tool.parameters.parse(inputData);

		// 2. Ab check kiya hua safe data tool ke execute function ko de do
		const result = await tool.execute(validatedArgs);

		console.log("Result:", result);
		return result;
	} catch (error: any) {
		// Agar input data galat hua to Zod error throw karega jo yahan catch ho jayega
		console.error("Validation failed ya Tool fail ho gaya:", error.message);
	}
}

async function testReadFile() {
	// Sahi path dena
	await runMyTool(readFileTool, {
		filePath: "../note.txt",
		encoding: "utf-8",
	});
	// Output aayega -> Result: { success: true, filePath: './sample.txt', content: 'Hello, TS Generics!' }
}

// testReadFile();

async function testWriteFile() {
	await runMyTool(writeFileTool, {
		filePath: "../../components/src/index.html",
		encoding: "utf-8",
		mode: "overwrite",
		content: "Hello this is test file. by aksh reddy",
	});
}

testWriteFile();
