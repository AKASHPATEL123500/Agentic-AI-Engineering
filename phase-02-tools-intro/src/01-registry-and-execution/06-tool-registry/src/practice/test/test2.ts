import { getWatherTool } from "../tools.ts";
import { registry } from "./test.ts";

console.log("\n--- [TEST 1]: Registering Tool ---");
registry.register(getWatherTool);
console.log("\n--- [TEST 1]: RegisterED Tool Successfully ---");
