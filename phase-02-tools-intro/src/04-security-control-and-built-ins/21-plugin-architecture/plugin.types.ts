import type { ToolType } from "../../Tools/types/types.ts";

export interface ToolPlugIn {
  id: string;
  name: string;
  discription: string;
  version: string;
  parms?: string;
  category: "finance" | "engineering" | "weather";
  auther?: string;
  tools: ToolType<any, any>[]; // ! Sare plugin Tool Array  mein hinge
  init?: () => Promise<void> | void; // ! Yaha setup and cleanup hooks hai
  destroy?: () => Promise<void> | void;
}
