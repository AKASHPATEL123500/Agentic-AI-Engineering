import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// --- STEP 1: Pehle saare schemas define karo ---
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

// Server-side ke liye refined schema (Isko bacha ke rakhein)
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

// --- STEP 2: Ab converter function banao ---
export function convertToLLMSchema(
  zodSchema: any, // Version issue se bachne ke liye any rakha hai
  ToolName: string,
) {
  return {
    name: ToolName,
    parameters: zodToJsonSchema(zodSchema, {
      target: "openApi3", // Flat OpenAPI structure ke liye
    }),
  };
}

// --- STEP 3: Sabsay aakhri mein convert aur log karo ---
// Dhyaan dein: Hum LLM ke liye 'bulkUserBaseSchema' bhej rahe hain kyunki LLM ko refine se matlab nahi hai
const jsonSchemaForLLM = convertToLLMSchema(
  bulkUserBaseSchema,
  "register-user",
);

console.log(
  "JSON SCHEMA For LLM:\n",
  JSON.stringify(jsonSchemaForLLM, null, 2),
);
