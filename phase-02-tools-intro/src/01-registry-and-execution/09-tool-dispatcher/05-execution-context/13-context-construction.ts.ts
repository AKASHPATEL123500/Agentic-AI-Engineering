import type { ToolContext } from "../../06-tool-registry/src/02-registry-contract-and-errors/src/types.ts";

export class ContextEngine {
  /**
   * 14 & 15: Context Construct karne wala factory function.
   * Yeh live HTTP request ya user session se data lekar strict ToolContext banata hai.
   */
  static build(sessionData: {
    userId: string;
    sessionId: string;
    role?: any;
  }): ToolContext {
    return {
      userId: sessionData.userId,
      sessionId: sessionData.sessionId,
      role: sessionData.role || "user", // Default role 'user' set ho jayega
      workingDir: process.cwd(), // 15: Bun/Node ka current working directory automatic inject ho gaya!
    };
  }
}

// // Socho hamare API backend se user ki session info yeh mili:
// const liveUserSession = {
//   userId: "user_vip_888",
//   sessionId: "session_token_xyz_123",
//   role: "vip" as const,
// };
// const data = ContextEngine.build(liveUserSession);
// console.log(data);
