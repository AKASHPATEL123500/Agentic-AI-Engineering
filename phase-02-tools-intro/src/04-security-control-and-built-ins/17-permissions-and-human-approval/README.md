Mast! Goal 1 (Contract) clear ho gaya, ab seedha chalte hain **Goal 2: The Security & Policy Guard Engine** par.

Is step ka simple kaam hai: Jab Dispatcher tool chalane lage, toh Execution Engine se theek pehle ek Guard baith kar **3 cheezein verify karega**:

1. **Role Verification:** Kya current `context.role` is tool ke `allowedRoles` list mein hai?
2. **Approval Verification:** Kya is tool ko chalane ke liye human permission ki zaroorat hai (`requiresApproval === true`)?
3. **Execution Decision:**

- Sab safe hai ➔ `ALLOWED`
- Role galat hai ➔ `DENIED` (Forbidden)
- Approval chahiye ➔ `REQUIRES_APPROVAL` (System pause hoke decision mangega)

---

### 🛡️ Goal 2 Implementation: `01-security-policy-guard.ts`

Yeh module pure TypeScript mein zero-dependency, isolated aur predictable hai:

```typescript
import type { ToolMetaData, ToolSecurityPolicy } from "./metadata.types";
import type { ToolContext } from "./context.types";

export type SecurityDecisionStatus = "ALLOWED" | "DENIED" | "REQUIRES_APPROVAL";

export interface SecurityGuardResult {
  status: SecurityDecisionStatus;
  isAllowed: boolean;
  reason?: string;
  policy: ToolSecurityPolicy;
}

/**
 * 🔒 Security & Policy Guard
 * Checks incoming tool call against user context and tool security metadata.
 */
export function evaluateSecurityPolicy(
  toolName: string,
  metadata: ToolMetaData | undefined,
  context: ToolContext,
): SecurityGuardResult {
  // 1. Fallback Policy: Agar tool me security define nahi hai to safe default lagao
  const defaultPolicy: ToolSecurityPolicy = {
    riskLevel: "low",
    requiresApproval: false,
    allowedRoles: ["guest", "user", "premium", "vip", "admin"],
  };

  const policy = metadata?.security || defaultPolicy;

  // 2. Role-Based Access Control (RBAC) Check
  const userRole = context.role;
  const isRoleAuthorized = policy.allowedRoles.includes(userRole);

  if (!isRoleAuthorized) {
    return {
      status: "DENIED",
      isAllowed: false,
      reason: `Access Denied: Role '${userRole}' is not authorized to call '${toolName}'. Required roles: [${policy.allowedRoles.join(", ")}]`,
      policy,
    };
  }

  // 3. Human Approval Gate Check
  if (policy.requiresApproval || policy.riskLevel === "critical") {
    return {
      status: "REQUIRES_APPROVAL",
      isAllowed: false,
      reason:
        policy.approvalMessage ||
        `Tool '${toolName}' is marked as high-risk and requires human confirmation.`,
      policy,
    };
  }

  // 4. All checks passed -> Safe to run directly
  return {
    status: "ALLOWED",
    isAllowed: true,
    policy,
  };
}
```

---

### 🧪 Visualizing the 3 Real-World Cases

Aao dekhte hain yeh runtime par alag-alag tools ke sath kaise react karega:

- **Case 1 (Public Tool - `weather_tool` with `role: "guest"`):**
- Result: `{ status: "ALLOWED", isAllowed: true }` ➔ Seedha execution chalu!

- **Case 2 (Unauthorized - `delete_database` with `role: "user"`):**
- Result: `{ status: "DENIED", isAllowed: false, reason: "Access Denied: Role 'user' is not authorized..." }` ➔ Blocked, execution will never trigger!

- **Case 3 (Sensitive Tool - `transfer_funds` with `role: "admin"`):**
- Result: `{ status: "REQUIRES_APPROVAL", isAllowed: false, reason: "Warning: High-risk action..." }` ➔ System pauses and transfers control to the Approval Adapter!

---

Batao Akash bhai, Goal 2 ka yeh Decision Engine clear hua?

Iske baad hamara **Goal 3** hoga: **Approval Prompt Adapter** banana (`@clack/prompts` ke sath), jo `REQUIRES_APPROVAL` aane par terminal par clean UI dikhakar user se `[y/n]` le sake!

### OutPut

```ts
┌   🤖 AGENTIC SECURITY GATEWAY

Simulating critical tool call from LLM...

│
◇  ⚠️  HIGH-RISK ACTION CONFIRMATION ──────────────────────────────────────────╮
│                                                                              │
│  Tool: delete_database_records                                               │
│  Risk Level:  CRITICAL                                                       │
│  Arguments: {                                                                │
│    "table": "users",                                                         │
│    "dryRun": false,                                                          │
│    "batchSize": 500                                                          │
│  }                                                                           │
│  Reason: Permanently dropping inactive customer records from production DB.  │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────╯
│
◇  Kya aap is tool ko execute karne ki permission dete hain?
│  Yes, Execute
│
└  ✅ Permission Granted! Tool Execution Started.
```

### GOAL 4:

```ts
1. Dispatcher ke paas Tool + Args + Context aaya
                 │
                 ▼
 2. `evaluateSecurityPolicy(toolName, metadata, context)` chala
                 │
       ┌─────────┼────────────────────────┐
       ▼         ▼                        ▼
   [ALLOWED]  [DENIED]          [REQUIRES_APPROVAL]
       │         │                        │
       │         ▼                        ▼
       │     Throw Error        `promptHumanApproval()` Prompt Show Hua
       │   (Access Denied)                │
       │                         ┌────────┴────────┐
       │                         ▼                 ▼
       │                    [User: YES]       [User: NO]
       │                         │                 │
       └─────────────────────────┼────────┐        ▼
                                 │        │   Return Rejection
                                 ▼        └── (Tool Aborted)
                    tool.execute(args, context)
```

### Notes:

> 1. yaha ek gaurd hai jo check karta hai ki tool ke risk level ke base per and requires approval
> 2. yaha dispathcer mein use hota hai
> 3. just Tool Execute hone se phle iska laga dete hai
> 4. Taki ager tool ka risk level `critical` ho and requiredApproval:true
> 5. Ho to hum cli se user se yes or no le paye bas
> 6. iska bass yahi main kaam hai
