import { z } from "zod";
import type { ToolType } from "./types.ts";
import { createMeta } from "./meta.ts";
import fs from "node:fs/promises";
import pathModule from "node:path";

export const createFolderScheama = z.object({
  folderPath: z
    .string()
    .min(2, "Folder Name must be at least 2 characters")
    .max(20, "Folder name cannot exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Special characters are not allowed except hyphen and underscore",
    ),
  isPrivate: z.boolean().default(false),
});

type createFolderInput = z.infer<typeof createFolderScheama>;

interface FolderOutPut {
  path: string;
  createdAt: number;
  folderName: string;
  fullPath: string;
}

export const createFolderTool: ToolType<
  typeof createFolderScheama,
  FolderOutPut
> = {
  name: "create_folder",
  description: "Creates a secure directory inside the workspace for storage.",
  version: "1.0.0",
  paramters: createFolderScheama,

  execute: async (rawArgs, context) => {
    try {
      // STEP 1: SCHEMA VALIDATION
      const validateArgs = createFolderScheama.parse(
        rawArgs,
      ) as createFolderInput;

      // STEP 2: CONTEXT & PERMISSION CHECK
      if (!context) {
        return {
          success: false,
          data: null,
          error: {
            code: "400",
            message: "UNAUTHORIZED ACCESS: Context is required.",
          },
          meta: createMeta("unauthrozied"),
        };
      }

      // 🚨 FIX: Guest user folder bana hi nahi sakta (chahe private ho ya public)
      // Agar aap chahte hain guest bilkul block ho jaye:
      if (context.role === "guest") {
        return {
          success: false,
          data: null,
          error: {
            code: "403",
            message:
              "FORBIDDEN: Guest users are not allowed to create folders.",
          },
          meta: createMeta("guest-error"),
        };
      }

      // STEP 3: ACTUAL LOGIC (Fixed Path Magic)
      // pathModule.join automatic context.workingDir ke andar aapka rasta sahi se bithayega (Double /tmp nahi hoga)
      const targetFullPath = pathModule.join(
        context.workingDir,
        context.userId,
        validateArgs.folderPath,
      );

      // Extract only folder name for representation (e.g., "test-folder")
      const finalFolderName = pathModule.basename(targetFullPath);

      // 🚨 FIX: Hum pure targetFullPath ko create karenge, uske parent ko nahi!
      await fs.mkdir(targetFullPath, { recursive: true });

      return {
        success: true,
        data: {
          path: `${context.userId}/${validateArgs.folderPath}`, // Relative representation
          createdAt: Date.now(),
          folderName: finalFolderName,
          fullPath: targetFullPath, // Absolute real path on computer
        },
        error: null,
        meta: createMeta("complete"),
      };
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          data: null,
          error: {
            code: "400",
            message: error.issues.map((e) => e.message).join(", "),
          },
          meta: createMeta("failed"),
        };
      }
      return {
        success: false,
        data: null,
        error: {
          code: "500",
          message: error.message || "Internal Server Error",
        },
        meta: createMeta("failed"),
      };
    }
  },
};
