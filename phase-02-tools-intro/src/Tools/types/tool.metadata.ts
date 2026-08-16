import type { secuirtyApprovalHuman } from "../../04-security-control-and-built-ins/17-permissions-and-human-approval/approval/approval.ts";

export interface ToolMetaData {
  category: string[];
  tags: string[];
  ppriority: number;
  auther?: string;
  userId?: string;
  timestamps: number | string | undefined | null;
  createdAt: number | string | undefined | null | any;
  version?: string;
  secuirty: secuirtyApprovalHuman;
}
