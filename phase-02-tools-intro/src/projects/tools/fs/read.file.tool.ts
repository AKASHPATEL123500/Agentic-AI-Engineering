import { readFileSchema } from "../../schema/fs/read.file.schema.ts";
import type { IToolType } from "../../types/types.ts";
import { metaData } from "../../utils/response.metadat.ts";
import fs from "node:fs/promises";
import path from "node:path";

export const readFileTool: IToolType<
  typeof readFileSchema,
  { content: string; filePath: string }
> = {
  name: "read_file",
  description: "Read a file from disk with validation and safe path handling",
  version: "1.0.0",
  params: readFileSchema,
  metadata: {
    name: "read_file",
    tags: ["file", "read-file", "content-read", "code-read", "etc", "live"],
    category: ["file-system", "read-file", "read-content"],
    discription: "Read file content safely and return string",
    priority: 1,
    version: "1.0.0",
    secuirty: {
      allowedRole: ["user", "admin", "guest", "premium", "vip"],
      riskLevel: "low",
      requiresApproval: false,
    },
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  execute: async (args, context) => {
    const start = Date.now();
    try {
      // validate args
      const input = readFileSchema.parse(args);

      // basic context validation
      if (!context || !context.workingDir) {
        return {
          success: false,
          status: "faild",
          message: "Tool context or workingDir missing",
          data: null,
          error: {
            code: 400,
            errorType: "CONTEXT_ERROR",
            message: "Context with workingDir is required",
          },
          metadata: metaData("denied", {
            name: "read_file",
            discription: "Read file tool",
            version: "1.0.0",
            riskLevel: "low",
            userId: context?.userId || "",
            role: (context as any)?.role || "",
            requestedBy: context?.userId || "",
          }),
        };
      }

      // resolve path safely against workingDir
      const resolvedWorkingDir = path.resolve(context.workingDir);

      const resolvedPath = path.resolve(resolvedWorkingDir, input.filePath);

      // Prevent path traversal outside workingDir
      if (!resolvedPath.startsWith(resolvedWorkingDir)) {
        return {
          success: false,
          status: "faild",
          message: "Access denied: path outside working directory",
          data: null,
          error: {
            code: 403,
            errorType: "ACCESS_DENIED",
            message: "Requested path is outside of allowed working directory",
          },
          metadata: metaData("denied", {
            name: "read_file",
            discription: "Read file tool",
            version: "1.0.0",
            riskLevel: "low",
            userId: context.userId,
            role: context.role,
            requestedBy: context.userId,
          }),
        };
      }

      // check file exists and is a file
      let stat;
      try {
        stat = await fs.stat(resolvedPath);
      } catch (e) {
        return {
          success: false,
          status: "faild",
          message: "File not found",
          data: null,
          error: {
            code: 404,
            errorType: "NOT_FOUND",
            message: `File does not exist: ${input.filePath}`,
          },
          metadata: metaData("failed", {
            name: "read_file",
            discription: "Read file tool",
            version: "1.0.0",
            riskLevel: "low",
            userId: context.userId,
            role: context.role,
            requestedBy: context.userId,
          }),
        };
      }

      if (!stat.isFile()) {
        return {
          success: false,
          status: "faild",
          message: "Path is not a file",
          data: null,
          error: {
            code: 400,
            errorType: "INVALID_TARGET",
            message: `Target is not a file: ${input.filePath}`,
          },
          metadata: metaData("failed", {
            name: "read_file",
            discription: "Read file tool",
            version: "1.0.0",
            riskLevel: "low",
            userId: context.userId,
            role: context.role,
            requestedBy: context.userId,
          }),
        };
      }

      // read the file
      const content = await fs.readFile(resolvedPath, {
        encoding: input.encoding,
      });

      return {
        success: true,
        status: "success",
        message: "File read successfully",
        data: {
          content: String(content),
          filePath: resolvedPath,
          workigDir: resolvedWorkingDir,
        },
        error: null,
        metadata: metaData("complete", {
          name: "read_file",
          discription: "Read file tool",
          version: "1.0.0",
          riskLevel: "low",
          userId: context.userId,
          role: context.role,
          requestedBy: context.userId,
        }),
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : JSON.stringify(err);
      return {
        success: false,
        status: "faild",
        message: "Unexpected error while reading file",
        data: null,
        error: {
          code: 500,
          errorType: "INTERNAL_ERROR",
          message: errMsg,
        },
        metadata: metaData("failed", {
          name: "read_file",
          discription: "Read file tool",
          version: "1.0.0",
          riskLevel: "low",
          userId: (args as any)?.userId || "",
          role: "",
          requestedBy: "",
        }),
      };
    } finally {
      // could log execution time if desired
      void (Date.now() - start);
    }
  },
};
