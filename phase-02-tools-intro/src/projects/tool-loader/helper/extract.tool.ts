/**
 *
 * @param rawModule
 * @returns
 */

export async function exctractToolFromMoudle(rawModule: any): Promise<any> {
  if (!rawModule || typeof rawModule !== "object") {
    throw new Error("Invalid module: Imported file is empty or not an object.");
  }

  // CASE 1. if tool is exported with suing "default" then check
  if (rawModule.default || typeof rawModule.default === "object") {
    if (
      rawModule.default.name &&
      rawModule.default.execute &&
      typeof rawModule.default.execute === "function"
    ) {
      return rawModule.default;
    }
  }

  // CASE 2. name export check
  for (const key of Object.keys(rawModule)) {
    const exportedModule = rawModule[key];

    if (
      exportedModule &&
      typeof exportedModule === "object" &&
      typeof exportedModule.name === "string" &&
      typeof exportedModule.execute === "function"
    ) {
      return exportedModule;
    }
  }

  // CASE 3. agr dono case faild then it wiil bhi throw
  // CASE 3: Agar pure module me koi valid tool object nahi mila
  throw new Error(
    "No valid tool export (with 'name' and 'execute') found in module.",
  );
}
