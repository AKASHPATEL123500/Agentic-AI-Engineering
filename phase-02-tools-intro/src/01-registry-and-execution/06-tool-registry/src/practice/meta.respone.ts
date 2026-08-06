// FIX: Return a proper metadata object and handle crypto fallback

const requestId =
  typeof crypto !== "undefined" && (crypto as any).randomUUID
    ? (crypto as any).randomUUID()
    : String(Date.now());
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
  toolDetails?: { name?: string; description?: string; version?: string },
) => {
  return {
    executionTimeMs: Date.now() - startTime,
    timestamps: new Date().toISOString(),
    requestId: requestId,
    agent: {
      name: "WeatherAgent",
      version: "1.0.0",
      status: status,
    },
    toolDetails: {
      name: toolDetails?.name || "unknown",
      description: toolDetails?.description || "",
      version: toolDetails?.version || "",
    },
  };
};
