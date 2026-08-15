export interface ToolMemory {
  set(sessionId: string, data: Record<any, any>): void;
  get(sessionId: string): Record<string, any>;
  clear(sessionId: string): void;
}
