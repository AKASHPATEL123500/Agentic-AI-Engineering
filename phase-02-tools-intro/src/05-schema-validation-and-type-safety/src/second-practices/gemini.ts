import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// 1. PEHLE BASE SCHEMA DEFINE KARO
const bulkUserBaseSchema = z.object({
  batchName: z.string().min(3).trim(),
  users: z
    .array(
      z.object({
        email: z.string().email().trim().lowercase(),
        role: z.enum(["admin", "developer", "viewer"]).default("viewer"),
        tags: z.array(z.string()).min(1),
      }),
    )
    .min(1),
  notifyUsers: z.boolean().default(true),
});

// 2. FULL SCHEMA WITH REFINE
export const bulkUserSchema = bulkUserBaseSchema.refine(
  (data) => {
    const emails = data.users.map((u) => u.email);
    return new Set(emails).size === emails.length;
  },
  {
    message: "Duplicate emails found in the batch input!",
    path: ["users"],
  },
);

// 3. CONVERTER FUNCTION
export function convertToLLMSchema(zodSchema: z.ZodTypeAny, ToolName: string) {
  return {
    name: ToolName,
    parameters: zodToJsonSchema(zodSchema as any, {
      name: ToolName,
      $refStrategy: "none",
      target: "openApi3",
    }),
  };
}

// 4. AB CALL KARO (SCHEMA DEFINITION KE BAAD)
const jsonSchemaForLLM = convertToLLMSchema(
  bulkUserBaseSchema,
  "register-user",
);
console.log(
  "JSON SCHEMA For LLM:\n",
  JSON.stringify(jsonSchemaForLLM, null, 2),
);

// =================== ZOD BUILT IN LIB ===========================
console.log(JSON.stringify(z.toJSONSchema(bulkUserBaseSchema), null, 2));
