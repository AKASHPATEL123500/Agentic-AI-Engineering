import { createFolderTool } from "./tool.ts";

const startTime = Date.now();
const requestId = crypto.randomUUID();

export const createMeta = (
  status:
    | "complete"
    | "in-progress"
    | "failed"
    | "unknown"
    | "max-reached"
    | "unauthrozied"
    | "guest-error",
) => ({
  executionTimeMs: Date.now() - startTime,
  timestamp: new Date().toISOString(),
  requestId: requestId,
  agent: {
    name: "WeatherTool",
    version: "0.0.1",
    status: status,
  },
  toolDetails: {
    name: createFolderTool.name,
    description: createFolderTool.description,
    version: createFolderTool.version,
  },
});
