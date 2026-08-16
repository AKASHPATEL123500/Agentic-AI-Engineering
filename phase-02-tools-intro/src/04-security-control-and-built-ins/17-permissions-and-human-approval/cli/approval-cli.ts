import { isCancel, intro, outro, note, confirm } from "@clack/prompts";
import chalk from "chalk";

export interface ApprovalPromptPayload {
  toolName: string;
  args: Record<string, any>;
  riskLevel: string;
  reason?: string;
}

/**
 * 🫱‍🫲 Interactive Human Approval Prompt using @clack/prompts
 * @param payload
 */
export async function humanAprovalCli(
  payload: ApprovalPromptPayload,
): Promise<boolean> {
  // 1. Box bana kar sensitive details highlight karo
  const details = [
    `${chalk.bold("Tool:")} ${chalk.cyan(payload.toolName)}`,
    `${chalk.bold("Risk Level:")} ${
      payload.riskLevel === "critical"
        ? chalk.bgRed.white.bold(` ${payload.riskLevel.toUpperCase()} `)
        : chalk.yellow.bold(payload.riskLevel.toUpperCase())
    }`,
    `${chalk.bold("Arguments:")} ${chalk.dim(JSON.stringify(payload.args, null, 2))}`,
    payload.reason
      ? `${chalk.bold("Reason:")} ${chalk.red(payload.reason)}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  note(details, chalk.yellow("⚠️  HIGH-RISK ACTION CONFIRMATION"));

  // 2. Interactive Yes/No Prompt
  const shouldExecute = await confirm({
    message: chalk.bold(
      "Kya aap is tool ko execute karne ki permission dete hain?",
    ),
    active: "Yes, Execute",
    inactive: "No, Cancel",
    initialValue: false, // Default selection 'No' for maximum safety
  });

  // 3. Handle Ctrl + C or cancellation
  if (isCancel(shouldExecute) || !shouldExecute) {
    return false;
  }
  return true;
}
