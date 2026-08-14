import type {
  ToolType,
  ToolContext,
} from "../../06-tool-registry/src/02-registry-contract-and-errors/src/types.ts";

// 1. Define custom error for permission failure
export class PermissionDeniedError extends Error {
  constructor(
    public readonly toolName: string,
    public readonly userRole: string,
    public readonly requiredPermission: string,
  ) {
    super(
      `[🔒 Permission Denied] Role '${userRole}' does not have the required permission '${requiredPermission}' to run tool '${toolName}'.`,
    );
    this.name = "PermissionDeniedError";
  }
}

// 2. Role to Permissions Mapping (Simple & Effective)
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ["*"], // Admin can access everything
  vip: ["wather_tool", "search_web"],
  user: ["wather_tool"],
  guest: [], // Guest has no permissions by default
};

export class PermissionEngine {
  /**
   * Main Gatekeeper function to check if user has access
   */
  static check(tool: ToolType, context: ToolContext): void {
    const userRole = context.role || "guest";

    // Har tool ke metadata mein hum check karenge ki usko kaunsi permission chahiye
    // Agar tool par koi security nahi lagi, to default mein hum tool ka naam hi permission maan lenge
    const requiredPermission = tool.metadata?.requiredPermission || tool.name;

    console.log(
      `🔒 [Security Guard] Checking permissions for tool: '${tool.name}'...`,
    );
    console.log(
      `ℹ️ Required: '${requiredPermission}' | User Role: '${userRole}'`,
    );

    const userAllowedPermissions = ROLE_PERMISSIONS[userRole] || [];
    console.log("[ ALLOWED PERMISSON ] ", userAllowedPermissions);

    // 1. If admin, grant access instantly
    if (userAllowedPermissions.includes("*")) {
      console.log("✅ [Security Guard] Admin override! Access Granted.");
      return;
    }

    // 2. Check if user role has the specific required permission
    if (!userAllowedPermissions.includes(requiredPermission)) {
      throw new PermissionDeniedError(tool.name, userRole, requiredPermission);
    }

    console.log("✅ [Security Guard] Permission Verified! Access Granted.");
  }
}
