import { z } from "zod";
import type { ToolType } from "./types";
/*

┌────────────────────────────────────────────────────────┐
│                      TOOL ANATOMY                      │
├────────────────────────────────────────────────────────┤
│ 1. Metadata        ──> Identity (name, description)    │
│ 2. Schema Contract ──> Input rules (Zod parameters)    │
│ 3. Pre-flight      ──> Validation / Context Guards     │
│ 4. Core Execution  ──> Actual logic (Async Work)       │
│ 5. Safe Response   ──> Standard Output Format          │
└────────────────────────────────────────────────────────┘

*/

const fetchApiSchema = z.object({
  url: z.string().url("Invaild Url Format").describe("Target endpoint Api"),
  method: z
    .enum(["GET", "POST"])
    .default("GET")
    .describe("HTTP Request Method"),
  payload: z
    .record(z.any())
    .optional()
    .describe("Request body for POST requests"),
});

export const fetechAPiTool: ToolType<typeof fetchApiSchema> = {
  name: "fetch_api",
  descriptions: "Makes secure external HTTP requests with context checks.",
  parameters: fetchApiSchema,
  execute: async (args, context) => {
    // ORGINS:3 Validation and Context Garud check

    if (!context) {
      return {
        success: false,
        status: "false",
        message: `Context is required to run this tool`,
      };
    }

    if (!context?.userId) {
      return {
        success: false,
        status: "Unauthrozied",
        message: "Unauthrized Access",
      };
    }
    if (context?.role === "guest" && args.method === "POST") {
      return {
        success: false,
        ststau: "Not Allowed",
        error: "Forbidden: Guest users are not allowed to make POST requests.",
      };
    }

    // OGINS:4 Core execution logic
    try {
      const response = await fetch(args.url, {
        method: args.method,
        headers: { "Content-Type": "application/json" },
        body:
          args.method === "POST" && args.payload
            ? JSON.stringify(args.payload)
            : undefined,
      });

      const data = await response.json();

      return {
        success: true,
        status: response.status,
        headers: response.headers,
        url: response.url,
        data: data,
        meta: {
          requestedBy: context.userId,
          role: context.role,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Network/Execution Failure: ${error.message}`,
      };
    }
  },
};
