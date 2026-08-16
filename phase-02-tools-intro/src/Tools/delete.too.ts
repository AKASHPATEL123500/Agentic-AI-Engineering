import { z } from "zod";
import type { ToolType } from "./types/types.ts";
import { unlink } from "node:fs/promises";
import pathModule from "node:path";

const DeleteFileSchema = z.object({
  filePath: z.string().min(1, "File path cannot be empty"),
});

export const deleteFileTool: ToolType<typeof DeleteFileSchema> = {
  name: "Delete-File",
  description: "Deletes a file from the filesystem.",
  params: DeleteFileSchema,
  version: "1.0.0",
  metadata: {
    category: [],
    tags: [],
    ppriority: 1,
    version: "1.0.0",
    secuirty: {
      riskLevel: "critical",
      requiresApproval: true,
      approvalMessage: "This is very critical task. do you agree [y/n]",
      allowedRoles: ["admin"],
    },
    createdAt: new Date().toISOString(),
    timestamps: new Date().toISOString(),
  },
  execute: async (args, context) => {
    try {
      if (!context) {
        return {
          success: false,
          status: "faild",
          statusCode: 400,
          message:
            "Please provide a valid execution context with userId, role, sessionKey, and workingDir.",
          data: null,
        };
      }

      const { filePath } = args;
      const { userId, role, workingDir } = context;

      if (role === "guest") {
        return {
          success: false,
          actionSuccessful: false,
          status: "denied",
          statusCode: 403,
          data: null,
        };
      }

      const resolvedWorkingDir = pathModule.resolve(workingDir);
      const resolvedTargetPath = pathModule.resolve(workingDir, filePath);

      if (
        !resolvedTargetPath.startsWith(resolvedWorkingDir + pathModule.sep) &&
        resolvedTargetPath !== resolvedWorkingDir
      ) {
        return {
          success: false,
          status: "denied",
          statusCode: 403,
          message: `File path "${filePath}" tries to access outside the working directory.`,
          data: null,
        };
      }

      const dryRun = Boolean((context as { dryRun?: boolean }).dryRun);
      if (dryRun) {
        return {
          success: false,
          status: "success",
          filePath: resolvedTargetPath,
          statusCode: 200,
          message: `Dry Run: File at ${resolvedTargetPath} would have been deleted by user ${userId} in directory ${workingDir}.`,
          data: {
            filePath: resolvedTargetPath,
            workingDir,
            userId,
            role,
            dryRun: true,
          },
        };
      }

      await unlink(resolvedTargetPath);
      console.log("File deleted successfully");

      return {
        success: true,
        actionSuccessful: true,
        status: "success",
        statusCode: 200,
        timestamp: new Date().toISOString(),
        filePath: filePath,
        role: role,
        userId: userId,
        workingDir: workingDir,
        message: `File at ${filePath} deleted successfully by user ${userId} in directory ${workingDir}.`,
        data: {
          filePath: resolvedTargetPath,
          workingDir,
          userId,
          role,
        },
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        success: false,
        status: "crash",
        error: errorMessage,
        data: null,
      };
    }
  },
};
