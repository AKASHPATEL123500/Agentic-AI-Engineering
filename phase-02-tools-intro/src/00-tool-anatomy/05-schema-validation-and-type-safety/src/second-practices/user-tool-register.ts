import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// 🛠️ Step 1: Complex Nested Schema Design
// Aao 05-schema-validation-and-type-safety ke liye
//  ek high-level real-world tool schema design karte
//  hain—jaise ek bulk-user-register-tool.
// child single user schema
const singleUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "At least 3 char is vital")
    .max(10, "Max 10 char is allowed"),
  role: z.enum(["developer", "admin", "viewer"]).default("viewer"),
  email: z.string().trim().toLowerCase().email("Invaild Email"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
});

// Parent bulk user schema
const bulkUserSchema = z
  .object({
    batchName: z.string().trim().min(1, "At leat one batch is required"),
    users: z
      .array(singleUserSchema)
      .min(1, "User list can not be empty at least one user must be"),
    notifyUsers: z.boolean().default(true),
  })
  .refine(
    (data) => {
      // Custom Validation Rule: Duplicate emails check
      const emails = data.users.map((u) => u.email);
      return new Set(emails).size === emails.length;
    },
    {
      message: "Duplicate emails found in the batch input!",
      path: ["users"],
    },
  );

export type bulkUserInput = z.infer<typeof bulkUserSchema>;

// check dirty data to send
// and when i pased this data
// then userbulk schema isko check karega and lowere case ki wajah se
// errorr throe kar dega refine kyu ki dono email same hai length
try {
  const dirtLLMInput = {
    batchName: "Alpha Batch",
    users: [
      {
        name: "Akash",
        role: "viewer",
        email: "TEST@domain.com",
        tags: ["dev"],
      },
      {
        name: "Akash",
        role: "viewer",
        email: "test@domain.com",
        tags: ["viewer"],
      },
    ],
  };
  bulkUserSchema.parse(dirtLLMInput);
} catch (error: any) {
  console.log(" Validation caugth error:", error.errors || error.message);
}

// 🛠️ Next Step: Zod Schema Ko LLM Ke Liye Convert Karna (JSON Schema)
/*
Notes:
1. LLM ko zod ka object ya schema nahi samjh ata hai
2. aur llm kp typescript and type nahis amjh ate hai
3. isliye hum ek library ka use karte hai
4. jo normal schema ko llm ke liye schema format mein convert kar deti hai 
5. lib hai `npm i zod-to-json-schema`
6. Zod schema ko JSON Schema me easily
7. convert karne ke liye zod-to-json-schema library ya 
8. custom transformer use kiya jata hai
*/

// sab se pahle ek funtion banate hai jo JSoN Schema mein convert karegi
// isko hum two parameters denge
// sod schema denge
// toolname

export function convertToLLMSchema(
  // 1. ZodObject ki jagah ZodTypeAny likha taaki refine() wale schemas bhi accept ho sakein
  zodSchema: z.ZodTypeAny,
  ToolName: string,
) {
  return {
    name: ToolName,
    // 2. Options object ka use kiya taaki direct/flat OpenAPI standard JSON mile
    perameters: zodToJsonSchema(zodSchema as any, {
      name: ToolName,
      $refStrategy: "none",
      target: "openApi3", // LLMs ke liye openApi3 target sabse best hai
    }),
  };
}

const jsonSchemaForLLM = convertToLLMSchema(bulkUserSchema, "register-user");
console.log("JSON SCEHMA For LLM: ", JSON.stringify(jsonSchemaForLLM, null, 2));
