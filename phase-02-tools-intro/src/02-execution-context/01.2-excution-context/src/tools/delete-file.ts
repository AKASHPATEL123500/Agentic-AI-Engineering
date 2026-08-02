import { z } from "zod";
import type { ToolType } from "./types.ts";
import { unlink } from "node:fs/promises";
import pathModule from "node:path";

const DeleteFileSchema = z.object({
  filePath: z.string().min(1, "File path cannot be empty"),
});

export const deleteFileTool: ToolType<typeof DeleteFileSchema> = {
  name: "Delete-File",
  description: "Deletes a file from the filesystem.",
  parameters: DeleteFileSchema,
  execute: async (args, context) => {
    try {
      if (!context) {
        return {
          success: false,
          status: "Execution context is required for this tool.",
          statusCode: 400,
          message:
            "Please provide a valid execution context with userId, role, sessionKey, and workingDir.",
        };
      }

      const { filePath } = args;
      const { userId, role, workingDir } = context;

      if (role === "guest") {
        return {
          success: false,
          actionSuccessful: false,
          status: "Permission denied: Guests cannot delete files.",
          statusCode: 403,
        };
      }

      // Step 1: workingDir aur filePath dono ko "resolve" karo (absolute + normalized path banega)
      const resolvedWorkingDir = pathModule.resolve(workingDir);
      const resolvedTargetPath = pathModule.resolve(workingDir, filePath);

      // Step 2: Check karo ki target path, workingDir ke ANDAR hi hai
      // startsWith isliye taaki "../" jaise tricks se bahar na nikal sake

      if (
        !resolvedTargetPath.startsWith(resolvedWorkingDir + pathModule.sep) &&
        resolvedTargetPath !== resolvedWorkingDir
      ) {
        return {
          success: false,
          status: "Access denied: Path traversal detected.",
          statusCode: 403,
          message: `File path "${filePath}" tries to access outside the working directory.`,
        };
      }

      // TODO: Yaha ek bahaut badi vulnerabiltiy hai :
      // yaha command workingDir se bhar bhi nikal kar file and folders ko delte kar sakta hai
      // isliye iska use nahi kiye
      // humne (pathModule.resolve) ka use kiya

      // const absoluetPath = pathModule.join(workingDir,filePath)
      // Here you would implement the actual file deletion logic.

      if (context.dryRun) {
        return {
          success: false,
          status: "Dry Run: file would have been deleted, but no action taken",
          filePath: resolvedTargetPath,
          statusCode: 200,
          message: `Dry Run: File at ${resolvedTargetPath} would have been deleted by user ${userId} in directory ${workingDir}.`,
        };
      }

      await unlink(resolvedTargetPath);
      console.log("File deleted successfully");

      return {
        success: true,
        actionSuccessful: true,
        status: "File deleted successfully",
        statusCode: 200,
        timestamp: new Date().toISOString(),
        filePath: filePath,
        role: role,
        userId: userId,
        workingDir: workingDir,
        message: `File at ${filePath} deleted successfully by user ${userId} in directory ${workingDir}.`,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
};
