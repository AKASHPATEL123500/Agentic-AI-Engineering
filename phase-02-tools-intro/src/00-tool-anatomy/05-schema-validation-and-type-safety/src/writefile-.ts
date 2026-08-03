import { z } from "zod";
import type { ToolType } from "./types.ts";
import { createMeta } from "./meta.ts";
import pathModule from "node:path";
import { writeFile } from "node:fs/promises";

const writeFileAndCreateSchema = z.object({
  path: z
    .string()
    .describe(
      "File ka naam ya relative path (e.g., 'data.txt' ya 'logs/test.json')",
    ),
  mode: z
    .enum(["append", "overwrite"])
    .default("overwrite")
    .describe("This is mode that of tool"),
  content: z
    .string()
    .min(1, "Max 1 char is required to create a file")
    .describe("this is mai content of file that is writen in the file"),
  encoding: z
    .enum(["utf-8", "ascii", "base64"])
    .default("utf-8")
    .describe("This is encoding of the file"),
});

interface OutPutData {
  fileName: string;
  path: string;
  mode: string;
  flag: string;
  createdAt: string;
  userId: string;
  sessionId: string;
  requestId: string;
  workingDir: string;
}

type writeFileInput = z.infer<typeof writeFileAndCreateSchema>;
export const WriteFileTool: ToolType<
  typeof writeFileAndCreateSchema,
  OutPutData
> = {
  name: "write_file",
  description: "This is a tool that create any file and very accurate",
  version: "1.0.0",
  paramters: writeFileAndCreateSchema,
  execute: async (args, context) => {
    try {
      // 1 Schema validation
      const validtArgs = writeFileAndCreateSchema.parse(args) as writeFileInput;
      if (!context) {
        return {
          success: false,
          data: null,
          status: "faild",
          error: {
            code: "400",
            message: "UNAUTHORIZED ERROR: Context is required to run this tool",
          },
          meta: createMeta("unauthrozied"),
        };
      }

      if (context.role === "guest") {
        return {
          success: false,
          data: null,
          status: "denied",
          error: {
            code: "409",
            message:
              "ACCESS DENIED: Guest is not allowed to create and write a file",
          },
          meta: createMeta("guest-error"),
        };
      }

      const absolutePath = await pathModule.join(
        context?.workingDir,
        validtArgs.path,
      );
      const folderPath = await pathModule.dirname(absolutePath);

      const fileFlag = validtArgs.mode === "append" ? "a" : "w";
      const fileContent =
        validtArgs.mode === "append"
          ? `\n${validtArgs.content}`
          : validtArgs.content;

      await writeFile(validtArgs.path, fileContent, {
        encoding: validtArgs.encoding,
        flag: fileFlag,
      });

      const requestId = crypto.randomUUID();
      // retrun fresh data
      return {
        success: true,
        data: {
          fileName: validtArgs.path,
          path: absolutePath,
          mode: validtArgs.mode,
          flag: fileFlag,
          userId: context.userId,
          sessionId: context.sessionId,
          createdAt: new Date(),
          requestId: requestId,
          workingDir: context.workingDir,
          folderPath: folderPath,
        },
        message: "File create and write successfully",
        status: "success",
        error: null,
        meta: createMeta("complete"),
      };
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          data: null,
          message: "Zod Validation error",
          status: "faild",
          error: {
            code: "500",
            message: error.issues.map((e) => e.message).join(", "),
          },
          meta: createMeta("failed"),
        };
      }

      return {
        success: false,
        data: null,
        message: "Internal Server Error",
        status: "faild",
        error: {
          code: "500",
          message: (error as Error).message || "Internal Server Error",
        },
        meta: createMeta("failed"),
      };
    }
  },
};
