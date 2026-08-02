import type { ToolContext, ToolType } from "./types.ts";
import { createFolderTool } from "./tool.ts";

async function test() {
  const dummyContext: ToolContext = {
    userId: "user-123",
    role: "admin",
    workingDir: "./temp",
    sessionId: "session-456",
  };

  const result = await createFolderTool.execute(
    {
      folderPath: "test-folder",
      isPrivate: false,
    },
    dummyContext,
  );
  console.log("result", result);
}

test();

// result {
//   success: false,
//   data: null,
//   error: {
//     code: '400',
//     message: 'Special characters are not allowed except hyphen and underscore'
//   },
//   meta: {
//     executionTimeMs: 31,
//     timestamp: '2026-08-02T08:17:36.338Z',
//     requestId: '9f1b28ee-8951-4308-bc61-aafef1a989a9',
//     agent: { name: 'WeatherTool', version: '0.0.1', status: 'failed' },
//     toolDetails: {
//       name: 'create_folder',
//       description: 'Creates a secure directory inside the workspace for storage.',
//       version: '1.0.0'
//     }
//   }
// }
