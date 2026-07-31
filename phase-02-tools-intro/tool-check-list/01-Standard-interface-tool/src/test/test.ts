import { calculatorTool } from "../tools/calculator.ts";
import { readFileTool } from "../tools/read-file.ts";

async function test() {
  console.log("Tool Name: ", calculatorTool.name);
  console.log("Tool discriptons: ", calculatorTool.description);

  const result = await calculatorTool.excute({ a: 10, b: 20 });
  console.log("outPut: ", result);
}

test();

async function readFileTest() {
  console.log("Tool Name: ", readFileTool.name);
  console.log("Tool discriptons: ", readFileTool.description);

  const result = await readFileTool.excute("../note.txt");

  console.log("outPut: ", result);
}
readFileTest();
