// Purana ToolType ek single tool ka blueprint tha.
// Lekin IToolRegistry contract poore Store/Manager ka blueprint hai.

// Iska kaam ye batana hai ki Registry ke paas kaun-kaun se operational controls hone chahiye:

// register(tool): Store me naya tool add karne ke liye.
// unregister(toolName): Kisi tool ko remove karne ke liye.
// get(toolName): Tool ka structure retrieval ke liye.
// has(toolName): Tool ki presence check karne ke liye.
// list(): Saare registered tools ki array nikalne ke liye.
// getLLMSchemas(): LLM ke liye OpenAI/Gemini compatible JSON export ke liye.

// Purpose: hum e interface banayege and ye bateyga ki
// jab hum classess banayega to unke pass kya functuion and method and return type hona chiye
// to ye sab hum pahle hi interface mein define kar de rahe hai
// hum kah sakte hai ki rule ban de rahe hai
// ki ek class ke pass ye ye chizen honi chaiye
import type { ToolType } from "./types.ts";

export interface IToolRegistry {
  register(tool: ToolType): void; // Map me tool add karega
  unregister(tool: string): boolean; // Map mein se tool delete then return true by the way retrun false if tool is not exixts
  get(toolName: string): ToolType | undefined;
  has(toolName: string): boolean;
  list(): ToolType[]; // Store mein jitne bhi tools hain, unki poori list/array laa kar dega. and retrun Type ToolType with array list  []

  clear(): void;
  getLLMSchema(): any[];
}
