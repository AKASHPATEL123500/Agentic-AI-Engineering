import { intro, outro } from "@clack/prompts";
import chalk from "chalk";
import { humanAprovalCli } from "../cli/approval-cli.ts";

async function main() {
  intro(chalk.bgBlue.white.bold(" 🤖 AGENTIC SECURITY GATEWAY "));

  console.log("\nSimulating critical tool call from LLM...\n");

  const simulatedPayload = {
    toolName: "delete_database_records",
    riskLevel: "critical",
    reason:
      "Permanently dropping inactive customer records from production DB.",
    args: {
      table: "users",
      dryRun: false,
      batchSize: 500,
    },
  };

  // Trigger Human Approval Prompt
  const isApproved = await humanAprovalCli(simulatedPayload);

  if (isApproved) {
    outro(chalk.green("✅ Permission Granted! Tool Execution Started."));
  } else {
    outro(chalk.red("🚫 Action Rejected! Security Block Maintained."));
  }
}

main();
