import { fetechAPiTool } from "./ftech-api-tool.ts";
import type { ToolContext } from "./types";

async function testFetchApi() {
  const dummyContext1: ToolContext = {
    userId: "abc_123",
    role: "guest",
    sessionKey: "7susnxiw9ljaij82jsksiwik",
    workingDir: ".",
  };

  const dummyContext2: ToolContext = {
    userId: "abc_123",
    role: "admin",
    sessionKey: "7susnxiw9ljaij82jsksiwik",
    workingDir: ".",
  };

  console.log(
    "=== TEST 1: Pre-flight Guard Failure (Guest attempting POST) ===",
  );
  const res1 = await fetechAPiTool.execute(
    {
      url: "https://jsonplaceholder.typicode.com/posts",
      method: "POST",
      payload: {
        title: "test",
        name: "Akash",
        username: "redy",
        pass: "1728snsi783s",
      },
    },
    dummyContext1,
  );
  console.log("Result 1:", res1);

  console.log("\n==== TEST 2: Valid Execution ( Admin request) ====");

  const res2 = await fetechAPiTool.execute(
    {
      url: "https://jsonplaceholder.typicode.com/posts",
      method: "POST",
      payload: {
        title: "Admin test",
        name: "Admin",
        username: "Admin",
      },
    },
    dummyContext2,
  );

  console.log("Result 2:", res2);
}

testFetchApi().catch((err) => {
  console.error("Error during test execution:", err);
});
