import type { writeFileResult } from "../../res/write.file.response.ts";
import {
  writeFileSchema,
  type writeFileInput,
} from "../../schema/fs/write.file.schema.ts";
import type { IToolType } from "../../types/types.ts";
import { metaData } from "../../utils/response.metadat.ts";
import pathModule from "node:path";
import fs from "node:fs/promises";
import { z } from "zod";

export const writeFileTool: IToolType<typeof writeFileSchema, writeFileResult> =
  {
    name: "write_file",
    description: "This is write file tool and write content is tha file",
    version: "1.0.0",
    params: writeFileSchema,
    metadata: {
      name: "write_file",
      tags: ["file", "create", "content", "live"],
      category: ["file-system", "write-file", "write-content"],
      discription: "This is write file tool and write content is tha file",
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
    exexute: async (args, context) => {
      try {
        const validateArgs = writeFileSchema.parse(args) as writeFileInput;
        if (!validateArgs) {
          return {
            success: false,
            status: "denied",
            data: null,
            message: "Arguments is not valid",
            error: {
              code: 400,
              errorType: "VALIDATE_ARGUMENTS_ERROR",
              message:
                "Args is not valid for schema please provide a valid schema",
            },
            metadata: metaData("denied"),
          };
        }
        if (!validateArgs.filePath || !validateArgs.content) {
          return {
            success: false,
            status: "denied",
            data: null,
            message: "Arguments is not valid",
            error: {
              code: 400,
              errorType: "ARGUMENTS_MISSING_ERROR",
              message:
                "Args is not valid for schema please provide a valid schema",
            },
            metadata: metaData("denied"),
          };
        }
        if (
          !context ||
          !context.role ||
          !context.sessionId ||
          !context.userId ||
          !context.workingDir
        ) {
          return {
            success: false,
            status: "faild",
            data: null,
            message: "contxt is required and all propertis is also required",
            error: {
              code: 400,
              errorType: "CONTEXT_ERROR",
              message: "contxt is required and all propertis is also required",
            },
            metadata: metaData("failed"),
          };
        }

        const absolutePath = pathModule.join(
          context.workingDir,
          validateArgs.filePath,
        );
        const folderPath = pathModule.dirname(absolutePath);
        await fs.mkdir(folderPath, { recursive: true });

        // mode cheking
        const fileFlag = validateArgs.mode === "append" ? "a" : "w";
        const fileContent =
          validateArgs.mode === "append"
            ? `\n${validateArgs.content}`
            : validateArgs.content;

        // create file content
        const data = await fs.writeFile(absolutePath, fileContent, {
          encoding: validateArgs.encoding,
          flag: fileFlag,
        });

        return {
          success: true,
          status: "success",
          message: `File ${absolutePath} create and write successfully`,
          data: {
            filepath: validateArgs.filePath,
            absolutePath: absolutePath,
            folderPath: folderPath,
            fileFlag: fileFlag,
            createdBy: context.userId,
            createdAt: new Date().toISOString(),
            data: {
              data,
            },
          },
          error: null,
          metadata: metaData("complete", {
            name: writeFileTool.name,
            discription: writeFileTool.description,
            userId: context.userId,
            requestedBy: context.userId,
            role: context.role,
            riskLevel: writeFileTool.metadata.secuirty.riskLevel,
            version: writeFileTool.version,
          }),
        };
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (error instanceof z.ZodError) {
          return {
            success: false,
            status: "faild",
            message: errorMessage || "Error durig creating or writing a file ",
            data: null,
            error: {
              code: 500,
              errorType: "SEVER_ENTRNAL_ERROR",
              message:
                errorMessage || "server entrnal error and open weather error",
            },
            metadata: metaData("failed"),
          };
        }
        return {
          success: false,
          status: "faild",
          message: errorMessage || "Error durig creating or writing a file ",
          data: null,
          error: {
            code: 500,
            errorType: "SEVER_ENTRNAL_ERROR",
            message:
              errorMessage || "server entrnal error and open weather error",
          },
          metadata: metaData("failed"),
        };
      }
    },
  };
