export interface IToolContext {
  userId: string;
  sessionId: string;
  role: "user" | "admin" | "premium" | "vip" | "guest";
  workingDir: string;
}
