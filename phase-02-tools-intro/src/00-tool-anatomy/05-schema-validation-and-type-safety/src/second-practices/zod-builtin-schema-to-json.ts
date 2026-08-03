import { z } from "zod";

// Base Schema
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

// Full Schema with Refine for Execution
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

// Pure Clean Schema Extractor (No external buggy packages!)
export function convertToLLMSchema(
  zodSchema: z.ZodObject<any>,
  toolName: string,
) {
  const shape = zodSchema.shape;
  const properties: Record<string, any> = {};
  const required: string[] = [];

  for (const key in shape) {
    const field = shape[key];
    properties[key] = {
      type: field._def.typeName
        ? field._def.typeName.replace("Zod", "").toLowerCase()
        : "string",
      description: field.description || undefined,
    };

    if (!field.isOptional()) {
      required.push(key);
    }
  }

  return {
    name: toolName,
    parameters: {
      type: "object",
      properties,
      required,
    },
  };
}

const jsonSchemaForLLM = convertToLLMSchema(
  bulkUserBaseSchema,
  "register-user",
);
console.log(
  "JSON SCHEMA For LLM:\n",
  JSON.stringify(jsonSchemaForLLM, null, 2),
);
