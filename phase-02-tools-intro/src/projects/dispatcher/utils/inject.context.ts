import type { IToolContext } from "../../types/context.type.ts";

export function contextGen(sessionData: {
  userId: string;
  sessionId: string;
  role: "user" | "admin" | "premium" | "vip" | "guest";
}): IToolContext {
  return {
    userId: sessionData.userId,
    sessionId: sessionData.sessionId,
    role: sessionData.role,
    workingDir: process.cwd(),
  };
}
