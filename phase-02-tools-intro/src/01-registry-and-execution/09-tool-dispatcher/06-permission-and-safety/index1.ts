/**
 * 16 — Tool Permission Check
 *
 * Dispatcher ka ek important kaam:
 * "Kya ye user is tool ko call kar sakta hai?"
 *
 * Permission check do cheezon par depend karta hai:
 *   1. User ka role (admin/user/guest)
 *   2. Tool ki required permissions
 *
 * Ye validation + permission ke beech mein aata hai.
 * Agar permission nahi → execute hi mat karo.
 */

// ─── Permission Types ─────────────────────────────────────────────────────────

export type Permission =
  | "*" // All tools (admin only)
  | "read_file"
  | "write_file"
  | "delete_file"
  | "get_weather"
  | "search_web"
  | "run_code"
  | "database_read"
  | "database_write"
  | "database_delete"
  | "system_info"
  | "network_request";

export type UserRole = "admin" | "user" | "guest";

// ─── Role → Default Permissions ───────────────────────────────────────────────

export const ROLE_DEFAULT_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ["*"],
  user: [
    "read_file",
    "get_weather",
    "search_web",
    "database_read",
    "system_info",
  ],
  guest: ["get_weather", "search_web"],
};

// ─── Tool → Required Permission ───────────────────────────────────────────────

export const TOOL_REQUIRED_PERMISSIONS: Record<string, Permission[]> = {
  get_weather: ["get_weather"],
  search_web: ["search_web"],
  read_file: ["read_file"],
  write_file: ["write_file"],
  delete_file: ["delete_file"],
  run_code: ["run_code"],
  database_query: ["database_read"],
  database_insert: ["database_write"],
  database_delete: ["database_delete"],
  get_system_info: ["system_info"],
  http_request: ["network_request"],
};

// ─── Permission Checker ───────────────────────────────────────────────────────

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  missingPermissions?: Permission[];
  userPermissions?: Permission[];
}

export class PermissionChecker {
  /**
   * Check if user can call a tool
   */
  check(opts: {
    userRole: UserRole;
    userPermissions?: Permission[]; // custom permissions (override defaults)
    toolName: string;
  }): PermissionCheckResult {
    const { userRole, toolName } = opts;

    // Get user's effective permissions
    const effectivePermissions: Permission[] =
      opts.userPermissions ?? ROLE_DEFAULT_PERMISSIONS[userRole];

    // Admin with "*" → allow everything
    if (effectivePermissions.includes("*")) {
      return { allowed: true, userPermissions: effectivePermissions };
    }

    // Get tool's required permissions
    const required = TOOL_REQUIRED_PERMISSIONS[toolName] ?? [];

    // If tool has no permission requirement → allow
    if (required.length === 0) {
      return { allowed: true, userPermissions: effectivePermissions };
    }

    // Check if user has all required permissions
    const missing = required.filter(
      (perm) => !effectivePermissions.includes(perm),
    );

    if (missing.length === 0) {
      return { allowed: true, userPermissions: effectivePermissions };
    }

    return {
      allowed: false,
      reason: `Missing permissions: ${missing.join(", ")}`,
      missingPermissions: missing,
      userPermissions: effectivePermissions,
    };
  }

  /**
   * Batch check: which tools can this user access?
   */
  allowedTools(userRole: UserRole, userPermissions?: Permission[]): string[] {
    return Object.keys(TOOL_REQUIRED_PERMISSIONS).filter(
      (tool) =>
        this.check({ userRole, userPermissions, toolName: tool }).allowed,
    );
  }
}

// ─── Permission Error ─────────────────────────────────────────────────────────

export class PermissionDeniedError extends Error {
  constructor(
    public readonly _toolName: string,
    public readonly _callId: string,
    public readonly _missingPermissions: Permission[],
    public readonly _userRole: UserRole,
  ) {
    super(
      `Permission denied: "${_userRole}" cannot access "${_toolName}". ` +
        `Missing: ${_missingPermissions.join(", ")}`,
    );
    this.name = "PermissionDeniedError";
  }

  toToolResult() {
    return {
      callId: this._callId,
      success: false,
      error: {
        code: "PERMISSION_DENIED",
        message: this.message,
        toolName: this._toolName,
        userRole: this._userRole,
        missingPermissions: this._missingPermissions,
      },
    };
  }
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

console.log("🔐 Tool Permission Check — Demo\n");
console.log("=".repeat(55));

const checker = new PermissionChecker();

const testCases: Array<{
  role: UserRole;
  tool: string;
  customPerms?: Permission[];
}> = [
  { role: "admin", tool: "database_delete" }, // admin can do anything
  { role: "user", tool: "get_weather" }, // user has this
  { role: "user", tool: "database_delete" }, // user cannot delete
  { role: "guest", tool: "search_web" }, // guest can search
  { role: "guest", tool: "read_file" }, // guest cannot read files
  { role: "user", tool: "write_file" }, // user cannot write
  // Custom permissions override
  {
    role: "user",
    tool: "write_file",
    customPerms: ["read_file", "write_file", "get_weather"],
  },
];

console.log("\n🧪 Permission Tests:\n");

testCases.forEach(({ role, tool, customPerms }) => {
  const result = checker.check({
    userRole: role,
    userPermissions: customPerms,
    toolName: tool,
  });
  const icon = result.allowed ? "✅" : "❌";
  const custom = customPerms ? " [custom perms]" : "";
  console.log(`  ${icon} [${role}${custom}] → "${tool}"`);
  if (!result.allowed) {
    console.log(`     Reason: ${result.reason}`);
  }
});

// What can each role access?
console.log("\n📊 Allowed tools by role:");
(["admin", "user", "guest"] as UserRole[]).forEach((role) => {
  const tools = checker.allowedTools(role);
  console.log(`  ${role}: ${tools.join(", ")}`);
});

// PermissionDeniedError demo
console.log("\n🚫 PermissionDeniedError:");
try {
  const result = checker.check({ userRole: "guest", toolName: "delete_file" });
  if (!result.allowed) {
    throw new PermissionDeniedError(
      "delete_file",
      "call_001",
      result.missingPermissions ?? [],
      "guest",
    );
  }
} catch (err) {
  if (err instanceof PermissionDeniedError) {
    console.log(`  ${err.name}: ${err.message}`);
    console.log(`  Tool Result:`, err.toToolResult());
  }
}

console.log("\n" + "=".repeat(55));
