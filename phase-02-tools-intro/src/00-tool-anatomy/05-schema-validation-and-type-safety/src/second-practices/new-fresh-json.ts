import { z } from "zod";

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

// 2. CONVERTER FUNCTION (Plain JavaScript Se Clean Up Karenge)
export function convertToLLMSchema(zodSchema: any, ToolName: string) {
  // Pehle Zod se standard JSON schema nikalwaya
  const rawSchema = z.toJSONSchema(zodSchema) as any;

  // 👉 TRICK 1: Sabsay upar se $schema ko delete kar diya
  delete rawSchema.$schema;

  // 👉 TRICK 2: Users ke andar jaakar email ka ganda regex saaf kar diya
  if (rawSchema.properties?.users?.items?.properties?.email) {
    const emailField = rawSchema.properties.users.items.properties.email;

    // Faltu ke complex patterns aur allOf ko delete kiya
    delete emailField.pattern;
    delete emailField.allOf;

    // Isko ekdum simple standard bana diya jo LLM samajh sake
    emailField.type = "string";
    emailField.format = "email";
  }

  return {
    name: ToolName,
    parameters: rawSchema, // Ab yeh ekdum clean schema hai
  };
}

// 3. Run aur Print karo
const jsonSchemaForLLM = convertToLLMSchema(
  bulkUserBaseSchema,
  "register-user",
);
console.log(
  "LLM KE LIYE PERFECT SCHEMA:\n",
  JSON.stringify(jsonSchemaForLLM, null, 2),
);
