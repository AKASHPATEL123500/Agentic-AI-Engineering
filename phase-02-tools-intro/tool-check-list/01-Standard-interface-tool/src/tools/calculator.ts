// src/tools/calculator.ts

// import type { toolTypes } from "./types.ts";

// export const calculatorTool: toolTypes = {
//   name: "add_numbers",
//   description:
//     "Use this tool to add two numbers together. Requires 'a' and 'b'.",
//   excute: async (args) => {
//     const { a, b } = args;

//     const result = Number(a) + Number(b);

//     return {
//       success: true,
//       statusCode: 200,
//       result: result,
//       message: `${a} + ${b} = ${result}`,
//     };
//   },
// };

import { z } from "zod";
import type { ToolTypes } from "./types.ts";

const calculatorSchema = z.object({
  a: z.number().describe("First Number"),
  b: z.number().describe("Second Number"),
  operation: z
    .enum(["add", "subtract", "multiply", "divide"])
    .describe("Math Opreation to perfomnce"),
});

export const calculatorTool: ToolTypes<typeof calculatorSchema> = {
  name: "calculator",
  description:
    "Basic arithmetic calculations (add, subtract, multiply, divide) karne ke liye tool.",
  parameters: calculatorSchema,
  execute: async (agrs) => {
    const { a, b, operation } = agrs;
    switch (operation) {
      case "add":
        return { result: a + b };
      case "subtract":
        return { result: a - b };
      case "multiply":
        return { result: a * b };
      case "divide":
        if (b === 0) throw new Error("Zero (0) se divide nahi kar sakte!");
        return { result: a / b };
    }
  },
};
