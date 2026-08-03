### Tool Anatomy — kya hai aur kyu

```bash
Simple definition: Tool Anatomy matlab —
ek tool ke andar kaunse-kaunse "parts" hone chahiye,
taaki wo LLM ke liye clear ho aur
system ke liye safe/reliable ho.
```

### Rule

```bash
┌────────────────────────────────────────────────────────┐
│                      TOOL ANATOMY                      │
├────────────────────────────────────────────────────────┤
│ 1. Metadata        ──> Identity (name, description)    │
│ 2. Schema Contract ──> Input rules (Zod parameters)    │
│ 3. Pre-flight      ──> Validation / Context Guards     │
│ 4. Core Execution  ──> Actual logic (Async Work)       │
│ 5. Safe Response   ──> Standard Output Format          │
└────────────────────────────────────────────────────────┘
```

**Exmaple Code Practical Implementation:**

`Aao is puri anatomy ko ek real example se samajhte hain. Hum ek execute-command-tool ya http-request-tool banate hain jo in saare 5 organs ko practically dikhata hai.`

```ts
import type { ToolTypes, ToolContext } from "./type.ts";
import { z } from "zod";

// ORGAN 2: Schema Contract (Inputs specification)
const fetchApiSchema = z.object({
  url: z.string().url("Invalid URL format").describe("Target API endpoint URL"),
  method: z
    .enum(["GET", "POST"])
    .default("GET")
    .describe("HTTP Request Method"),
  payload: z
    .record(z.any())
    .optional()
    .describe("Request body for POST requests"),
});

export const fetchApiTool: ToolType<typeof fetchApiSchema> = {
  // ORGAN 1: Metadata
  name: "fetch_api",
  description: "Makes secure external HTTP requests with context checks.",

  // ORGAN 2: Schema Link
  parameters: fetchApiSchema,

  // ORGAN 3, 4, 5: Execution Layer
  execuet: async (agrs, context) => {
      // -------------------------------------------------------------
      // ORGAN 3: Pre-flight Guard (Context & Permission Validation)
      // -------------------------------------------------------------
      if (!context) {
        return {
          success: false,
          error: "CONTEXT ACCESS DENIED: is required to run this tool.",
        };
      }

      if (!context?.userId) {
        return {
          success: false,
          error:
            "Unauthenticated: Action requires a valid user session context.",
        };
      }

      if (context.userRole === "guest" && args.method === "POST") {
        return {
          success: false,
          error:
            "Forbidden: Guest users are not allowed to make POST requests.",
        };
      }

      // -------------------------------------------------------------
      // ORGAN 4: Core Execution Logic
      // -------------------------------------------------------------

      try{
        console.log(`[ANATOMY-LOG] Requesting ${args.method} -> ${args.url}`);
        console.log(`[ANATOMY-LOG] Executed by User: ${context.userId}`);

        // Actual async operation
        const response = await fetch(args.url, {
        method: args.method,
        headers: { "Content-Type": "application/json" },
        body: args.method === "POST" && args.payload ? JSON.stringify(args.payload) : undefined,
        });

        const data = await response.json();

         // -----------------------------------------------------------
        // ORGAN 5: Safe & Standardized Response
        // -----------------------------------------------------------
      return {
        success: response.ok,
        status: response.status,
        data: data,
        meta: {
          requestedBy: context.userId,
          timestamp: new Date().toISOString(),
        },
      };

      }catch(error:unkown){
// ORGAN 5 (Error Case): Controlled Error Response
      return {
        success: false,
        error: `Network/Execution Failure: ${error.message}`,
      };
    }
};
```

**TEST**
Abb hum check karenge ki sare orgins sahi se kamm kar rahe hai ki nahi

```ts
import { fetchApiTool } from "./anatomy-demo.ts";

async function testAnatomy() {
  console.log(
    "=== TEST 1: Pre-flight Guard Failure (Guest attempting POST) ===",
  );
  const guestContext = {
    userId: "user_404",
    userRole: "guest" as const,
    workingDir: ".",
  };

  const res1 = await fetchApiTool.execute(
    {
      url: "https://jsonplaceholder.typicode.com/posts",
      method: "POST",
      payload: { title: "Test" },
    },
    guestContext,
  );
  console.log("Result 1:", res1);

  console.log("\n=== TEST 2: Valid Execution (Admin GET Request) ===");
  const adminContext = {
    userId: "admin_01",
    userRole: "admin" as const,
    workingDir: ".",
  };

  const res2 = await fetchApiTool.execute(
    { url: "https://jsonplaceholder.typicode.com/todos/1", method: "GET" },
    adminContext,
  );
  console.log("Result 2:", res2);
}

testAnatomy();
```

### Key Takeaways for 03-tool-anatomy:

```bash
1. Metadata: LLM ko batata hai ki tool karta kya hai.
2. Schema: Bad/malicious inputs ko entry gate par hi rok deta hai.
3. Pre-flight Check: Security/Permissions verification execution shuru hone se pehle karta hai.
4. Core Logic: Real work handles karta hai.
5. Standard Output: Always structured response bhejta hai (success, data/error, meta).
```
