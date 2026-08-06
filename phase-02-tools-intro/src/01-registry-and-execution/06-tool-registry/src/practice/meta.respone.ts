import { getWatherTool } from "./tools.ts";

const requestId = crypto.randomUUID();
const startTime = Date.now();

export const metaData = (
  status:
    | "complete"
    | "in-progress"
    | "failed"
    | "unknown"
    | "max-reached"
    | "unauthrozied"
    | "guest-error",
) => {
  executionTimeMs: Date.now() - startTime;
  timestamps: new Date();
  requestId: requestId;
  agent: {
    name: "WeatherAgnet";
    version: "1.0.0";
    status: status;
  }
  toolDetails: {
    name: getWatherTool.name;
    description: getWatherTool.description;
    version: getWatherTool.version;
  }
};
