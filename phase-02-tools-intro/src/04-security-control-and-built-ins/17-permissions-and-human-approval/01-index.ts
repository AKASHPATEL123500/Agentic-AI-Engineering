import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export interface ApprovalRequest {
  toolName: string;
  args: Record<string, any>;
  reason?: string;
}

export class HumanApprovalGuard {
  /**
   * Terminal par [y/n] prompt poochta hai aur user ka decision return karta hai
   */
  static async requestTerminalApproval(req: ApprovalRequest): Promise<boolean> {
    const rl = readline.createInterface({ input, output });

    console.log("\n⚠️  [SECURITY ALERT] Human Approval Required!");
    console.log(`👉 Tool: ${req.toolName}`);
    console.log(`👉 Arguments:`, JSON.stringify(req.args, null, 2));
    if (req.reason) console.log(`👉 Reason: ${req.reason}`);

    try {
      const answer = await rl.question(
        "\n❓ Kya aap is tool ko execute karne ki permission dete hain? (y/n): ",
      );
      const isApproved =
        answer.trim().toLowerCase() === "y" ||
        answer.trim().toLowerCase() === "yes";
      return isApproved;
    } finally {
      rl.close();
    }
  }
}

async function runDangerousAction() {
  const toolCall = {
    toolName: "delete_database_records",
    args: { table: "users", filter: "status = 'inactive'" },
    requiresApproval: true,
  };

  if (toolCall.requiresApproval) {
    const isApproved = await HumanApprovalGuard.requestTerminalApproval({
      toolName: toolCall.toolName,
      args: toolCall.args,
      reason: "Destructive database operation",
    });

    if (!isApproved) {
      console.log("\n🚫 Action CANCELLED by user! System remains safe.");
      return {
        success: false,
        status: "denied",
        message: "Execution rejected by user.",
      };
    }
  }

  console.log("\n✅ Approved! Executing dangerous tool safely...");
  return { success: true, status: "success", message: "Action executed." };
}

runDangerousAction();
