import type {
  ToolType,
  StandaradrizationToolResponse,
  ToolContext,
} from "../../Tools/types/types.ts";
import { humanAprovalCli } from "./cli/approval-cli.ts";
import { evaluateSecurityPolicy } from "./secuirty/approva.secuirty.cheker.ts";

export interface SecurityInterceptorResult {
  procced: boolean;
  blockedResponse?: StandaradrizationToolResponse<null>;
}

/**
 * Yaha Inceptor hai jo human approval ko manage karega and
 * Jo data disptahcer dega usko hum le rahe hai
 * @param tool
 * @param context
 * @param args
 */
export async function secuirtyInterceptorSystem(
  tool: ToolType<any, any>,
  context: ToolContext,
  args: Record<string, any>,
): Promise<SecurityInterceptorResult> {
  // Step 1: Policy Evaluate karo
  const decision = evaluateSecurityPolicy(tool.name, context, tool.metadata);

  // Case A: Role Not Authorized (DENIED)
  if (decision.status === "DENIED") {
    return {
      procced: false,
      blockedResponse: {
        success: false,
        status: "denied",
        data: null,
        message: decision.resion || "Access Denied by Security Policy.",
        error: {
          code: 403,
          message: "UNAUTHORIZED_ROLE",
        },
        meta: {
          executionTimeMs: 0,
          timestamps: Date.now(),
          requestId: `sec_req_${Date.now()}`,
          agent: {
            name: "SecurityGateway",
            version: "1.0.0",
            status: "unauthrozied",
          },
          toolDetails: {
            name: tool.name,
            descriptions: tool.description,
            version: tool.version,
          },
        },
      },
    };
  }

  // Case B: Requires Human Approval
  if (decision.status === "REQUIRES_APPROVAL") {
    const isApprovedByUser = await humanAprovalCli({
      toolName: tool.name,
      args,
      riskLevel: decision.policy.riskLevel,
      reason: decision.resion,
    });
    // Agar user ne cancel kiya (No select kiya)
    if (!isApprovedByUser) {
      return {
        procced: false,
        blockedResponse: {
          success: false,
          status: "denied",
          message:
            "Action rejected: Human operator denied execution permission.",
          data: null,
          error: {
            code: 401,
            message: "HUMAN_APPROVAL_REJECTED",
          },
          meta: {
            executionTimeMs: 0,
            timestamps: Date.now(),
            requestId: `sec_req_${Date.now()}`,
            agent: {
              name: "SecurityGateway",
              version: "1.0.0",
              status: "failed",
            },
            toolDetails: {
              name: tool.name,
              descriptions: tool.description,
              version: tool.version,
            },
          },
        },
      };
    }
  }

  // Case C: Allowed (Directly or Approved by Human)
  return {
    procced: true,
  };
}
