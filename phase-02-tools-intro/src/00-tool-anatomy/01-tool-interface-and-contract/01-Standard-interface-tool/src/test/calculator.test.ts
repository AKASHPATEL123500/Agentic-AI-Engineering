import { calculatorTool } from "../tools/calculator.ts";

async function calculaterTest() {
	console.log("Tool Name : ", calculatorTool.name);
	console.log("Tool Description: ", calculatorTool.description);
	const result = await calculatorTool.execute({
		a: 10,
		b: 20,
		opreation: "add",
	});
	console.log("Result:", result);
}
calculaterTest();
