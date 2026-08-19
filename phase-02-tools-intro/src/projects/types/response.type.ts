export interface IToolResponse<TData> {
  success: boolean;
  status: "success" | "faild" | "denied";
  message?: string;
  data: TData | null;
  error: {
    code: string | number;
    errorType?: string;
    message: string;
  } | null;
  metadata: {
    executionMs: string | null | number;
    timestamps: string | number;
    userDeteails: {
      userId: string;
      role: string;
      requestAt: string | number | null;
      requestedId: string | number | null;
      requetedBy: string;
    };
    toolDteails: {
      name: string;
      discription: string;
      version: string;
      riskLevel: "low" | "medium" | "high" | "critical";
      createdAt?: string | number | null;
    };
    agentDteails: {
      name: string;
      version: string;
      status:
        | "complete"
        | "in-progress"
        | "failed"
        | "unknown"
        | "max-reached"
        | "unauthrozied"
        | "guest-error"
        | "denied";
      createdAt?: string | number | null;
    };
  };
}
