export interface ToolMetaData {
  category: "finance" | "weather" | "files" | "utilities";
  tags: string[];
  author?: string;
  version?: string;
  priority: number; // 1 se 10 ke beech mein
}
