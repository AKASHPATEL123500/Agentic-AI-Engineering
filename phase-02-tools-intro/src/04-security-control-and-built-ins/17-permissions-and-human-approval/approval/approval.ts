export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface secuirtyApprovalHuman {
  // Tool ka risk level kya hai
  riskLevel: RiskLevel;

  // 2. Kya bina Human Approval ke chal sakta hai?
  requiresApproval: boolean;

  approvalMessage?: string;
  allowedRoles: Array<"guest" | "user" | "premium" | "vip" | "admin">;

  // 5. Rate Limiting Protection (LLM loop attack se bachne ke liye)
  rateLimit?: {
    maxCallsPerMinute: number;
  };
}
