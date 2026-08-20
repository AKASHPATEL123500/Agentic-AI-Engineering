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
  toolDetails?: {
    name: string;
    discription: string;
    version: string;
    riskLevel: string;
    userId: string;
    role: string;
    requestedBy: string;
  },
) => {
  return {
    executionMs: `${Date.now() - startTime} Ms`,
    timestamps: new Date().toISOString(),
    userDeteails: {
      userId: toolDetails?.userId,
      role: toolDetails?.role,
      requestAt: new Date(),
      requestedId: requestId,
      requetedBy: toolDetails?.userId,
    },
    toolDteails: {
      name: toolDetails?.name,
      discription: toolDetails?.discription,
      version: toolDetails?.version,
      riskLevel: toolDetails?.riskLevel,
      createdAt: new Date(),
    },
    agentDteails: {
      name: toolDetails?.name,
      version: toolDetails?.version,
      createdAt: new Date(),
    },
  };
};
