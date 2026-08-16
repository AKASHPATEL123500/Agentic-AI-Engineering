import type { ToolMetaData } from "../../../Tools/types/tool.metadata.ts";
import type { ToolContext } from "../../../Tools/types/types.ts";
import type { secuirtyApprovalHuman } from "../approval/approval.ts";

export type approvalStatus = "ALLOWED" | "REQUIRES_APPROVAL" | "DENIED";

export interface secuirtyApprovalResult {
  status: approvalStatus;
  isAllowd: boolean;
  resion?: string;
  policy: secuirtyApprovalHuman;
}

/**
 * Yaha ek gaurd hai jo check karega ki approval chiye ya nahi
 * @param toolName yaha toolName hai jo dispatcher dega
 * @param context conetxt bhi dispatcher dega
 * @param metadata metadata bhi dipatcher hi dega
 */

export function evaluateSecurityPolicy(
  toolName: string,
  context: ToolContext,
  metadata: ToolMetaData | undefined,
): secuirtyApprovalResult {
  // yaha defualt policy hai agr tool mein nahi hai to by defult yahi rahega
  const defaultPolicy: secuirtyApprovalHuman = {
    riskLevel: "low",
    requiresApproval: false,
    allowedRoles: ["admin", "guest", "premium", "user", "vip"],
  };

  const policy = metadata?.secuirty || defaultPolicy;

  // CASE 1. Role-Based Access Control (RBAC) Check
  const userRole = context.role;
  const isUserRoleExixts = policy.allowedRoles.includes(userRole);
  if (!isUserRoleExixts) {
    return {
      isAllowd: false,
      status: "DENIED",
      resion: `Access Denied: Role '${userRole}' is not authorized to call '${toolName}'. Required roles: [${policy.allowedRoles.join(", ")}]`,
      policy: policy,
    };
  }

  // CASE 2. Human Approval Gate Check
  if (
    policy.requiresApproval ||
    policy.riskLevel === "critical" ||
    policy.riskLevel === "high"
  ) {
    return {
      isAllowd: false,
      status: "REQUIRES_APPROVAL",
      resion:
        policy.approvalMessage ||
        `Tool '${toolName}' is marked as high-risk and requires human confirmation.`,
      policy: policy,
    };
  }
  return {
    isAllowd: true,
    status: "ALLOWED",
    policy: policy,
  };
}

// evaluateSecurityPolicy(toolName, context, metadata)

// 🧪 Visualizing the 3 Real-World Cases
// Aao dekhte hain yeh runtime par alag-alag tools ke sath kaise react karega:

// Case 1 (Public Tool - weather_tool with role: "guest"):

// Result: { status: "ALLOWED", isAllowed: true } ➔ Seedha execution chalu!

// Case 2 (Unauthorized - delete_database with role: "user"):

// Result: { status: "DENIED", isAllowed: false, reason: "Access Denied: Role 'user' is not authorized..." } ➔ Blocked, execution will never trigger!

// Case 3 (Sensitive Tool - transfer_funds with role: "admin"):

// Result: { status: "REQUIRES_APPROVAL", isAllowed: false, reason: "Warning: High-risk action..." } ➔ System pauses and transfers control to the Approval Adapter!

// Batao Akash bhai, Goal 2 ka yeh Decision Engine clear hua?
