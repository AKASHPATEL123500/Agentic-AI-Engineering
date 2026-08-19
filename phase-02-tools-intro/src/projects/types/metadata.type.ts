import type { IToolSecuirty } from "./tool.sec.type.ts";

export interface IToolMetadata {
  name: string;
  discription: string;
  version: string;
  tags: string[];
  category: string[];
  priority: string | number;
  timestamp: string | number | null;
  createdAt: string | number | null;
  secuirty: IToolSecuirty;
}
