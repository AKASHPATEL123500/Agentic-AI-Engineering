export interface IToolSecuirty {
  riskLevel: "low" | "medium" | "high" | "critical";
  requiresApproval: boolean;
  allowedRole: Array<"user" | "admin" | "premium" | "vip" | "guest">;
  approvalMessage?: string;
  createdAt?: string | number | null;
  approvalTo?: string;
  approvalBy?: string;
  userId?: string;
}
