import { ToolRegistry } from "../registry.tools.ts";
import { getWatherTool } from "../tools.ts";

// Comprehensive tests for ToolRegistry methods.
// NOTE: When importing `registry` from another file, that file's top-level
// logs run at import-time. To avoid ordering issues (seeing length 0 before
// registration from another module), this file runs the full test sequence
// in one place.

async function runTests() {
  console.log("==================================================");
  console.log("🚀 AGENTIC AI TOOL REGISTRY - END-TO-END RUNNER");
  console.log("==================================================\n");

  const registry = new ToolRegistry({
    strictMetadataCheck: true,
    strictValidation: true,
    allowOverWrite: false, // start with false to test duplicate rejection
  });

  console.log("Initial list length:", registry.list().length); // expect 0

  console.log("has() before register:", registry.has(getWatherTool.name)); // expect false

  // get() should throw when tool not found
  try {
    registry.get(getWatherTool.name);
    console.error("ERROR: expected get() to throw for missing tool");
  } catch (err: any) {
    console.log(
      "get() correctly threw for missing tool:",
      err.name || err.message,
    );
  }

  // Register the tool
  try {
    registry.register(getWatherTool);
    console.log("register() succeeded");
  } catch (err: any) {
    console.error("register() failed:", err);
  }

  console.log("After register, list length:", registry.list().length); // expect 1
  console.log("has() after register:", registry.has(getWatherTool.name)); // expect true

  // get the tool
  try {
    const tool = registry.get(getWatherTool.name);
    console.log("get() returned:", tool.name, tool.version);

    // execute the tool with a valid mock context
    const ctx = {
      userId: "u1",
      sessionId: "s1",
      role: "user",
      workingDir: ".",
    } as any;
    const result = await tool.execute(
      { city: "mumbai", unit: "celsius", countries: "india" } as any,
      ctx,
    );
    console.log("execute() result success:", result?.success);
  } catch (err: any) {
    console.error("get()/execute() failed:", err);
  }

  // Try duplicate registration when allowOverWrite is false (should throw)
  try {
    registry.register(getWatherTool);
    console.error(
      "ERROR: duplicate register did not throw when allowOverWrite=false",
    );
  } catch (err: any) {
    console.log("duplicate register correctly threw:", err.name || err.message);
  }

  // Now test overwrite behavior with higher version
  const higherVersionTool = { ...getWatherTool, version: "1.1.0" } as any;
  const registry2 = new ToolRegistry({
    allowOverWrite: true,
    strictValidation: true,
    strictMetadataCheck: true,
  });
  registry2.register(getWatherTool);
  console.log("registry2 initial length:", registry2.list().length); // 1
  try {
    registry2.register(higherVersionTool);
    console.log("registry2 overwrite with higher version succeeded");
  } catch (err: any) {
    console.error("registry2 overwrite failed:", err);
  }

  // unregister
  const removed = registry2.unregister(getWatherTool.name);
  console.log(
    "unregister() returned:",
    removed,
    "list length now:",
    registry2.list().length,
  );

  // clear
  registry2.clear();
  console.log("after clear, list length:", registry2.list().length);

  // Export / Import tests
  // FIX: add tests for exportFromJson() and importFromJSON(filePath)
  try {
    const registryForExport = new ToolRegistry({ allowOverWrite: true });
    registryForExport.register(getWatherTool);
    console.log("Exporting registry to sandbox/tool.json...");
    registryForExport.exportFromJson();

    // compute sandbox path relative to this test file
    const path = await import("node:path");
    const { fileURLToPath } = await import("node:url");
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const sandboxPath = path.resolve(__dirname, "../sandbox/tool.json");

    const registryImported = new ToolRegistry({ allowOverWrite: true });
    registryImported.importFromJSON(sandboxPath);
    console.log("Imported registry length:", registryImported.list().length);
  } catch (err: any) {
    console.error("export/import test failed:", err?.message || err);
  }

  console.log("\nAll registry tests completed.");
}

runTests().catch((e) => console.error(e));
