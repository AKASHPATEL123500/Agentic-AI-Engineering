import { getWeatherTool } from "../tools/weather.tool.ts";

const startTime = Date.now();
const requestId = crypto.randomUUID();

export const metaData = (
  status:
    | "complete"
    | "in-progress"
    | "failed"
    | "unknown"
    | "max-reached"
    | "unauthrozied"
    | "guest-error"
    | "denied",
) => {
  return {
    executionMs: `${Date.now() - startTime}Ms`,
    timestamps: new Date().toISOString(),
    userDeteails: {
      userId: "",
      role: "",
      requestAt: new Date(),
      requestedId: requestId,
      requetedBy: "",
    },
    toolDteails: {
      name: getWeatherTool?.name,
      discription: getWeatherTool?.description,
      version: getWeatherTool?.version,
      riskLevel: getWeatherTool?.metadata?.secuirty?.riskLevel,
      createdAt: new Date(),
    },
    agentDteails: {
      name: getWeatherTool?.name,
      version: getWeatherTool?.version,
      createdAt: new Date(),
    },
  };
};
