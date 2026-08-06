import { registry } from "./test.ts";

console.log("\n--- [TEST 4]: JSON File Persistence Sync ---");

// File Export
registry.exportFromJson();

// Clear In-Memory Map
registry.clear();
console.log("Registry cleared. Total tools in memory:", registry.list().length); // Expected: 0
console.log("\n--- [TEST 4]: JSON File Persistence successfully end ---");
