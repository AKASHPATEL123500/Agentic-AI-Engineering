// LLMs ko 100 tools ek saath bhejoge toh context
// window flood ho jayegi aur API bill high ho jayega.
// Isiliye har tool ke saath Metadata attach hota hai:

// tags: e.g., ["database", "read-only"]
// category: e.g., "finance" ya "system"
// version: e.g., "1.2.0"
// priority: e.g., 1 (High priority tools pehle dikhe)

export interface ToolMetaData {
  category: "finance" | "weather" | "files" | "utilities" | string;
  tags: string[];
  author?: string;
  version?: string;
  priority: number; // 1 se 10 ke beech mein
}
