// Agla Step: 02 - module - exporter - extractor.ts
// Ab problem ye hai ki Loader ko exact tool object chahiye.
// Usse is baat se farak nahi padna chahiye ki developer ne:

//export const WeatherTool (Named export) likha hai, ya

// export default WeatherTool (Default export) likha hai, ya

// export const tool likha hai.

// Note:
// Isiliye hum banayenge Module Exporter Extractor
// jo is raw Module object mein se kahi se bhi real Tool Object nikaal ke le aayega.
/**
 * Raw imported module object me se actual Tool Object extract karta hai.
 *
 * @param rawModule - Dynamic import() se mila hua raw module object.
 * @returns Ek valid Tool object jisme name aur execute function ho.
 *
 * @example
 * ```ts
 * // CASE 1: Default Export check karo (`export default weatherTool`)
 * if (rawModule && rawModule.default && typeof rawModule.default === "object") {
 *   // Check karo ki default export ke paas tool properties (name, execute) hain
 *   if (rawModule.default.name && typeof rawModule.default.execute === "function") {
 *     return rawModule.default;
 *   }
 * }
 * ```
 */
export async function extractToolFromModule(rawModule: any): any {
  if (!rawModule || typeof rawModule !== "object") {
    throw new Error("Invalid module: Imported file is empty or not an object.");
  }

  // CASE 1: Default Export check karo (`export default weatherTool`)
  if (rawModule.default && typeof rawModule.default === "object") {
    //  Check karo ki default export ke paas tool properties (name, execute) hain
    if (
      rawModule.default.name &&
      typeof rawModule.default.execute === "function"
    ) {
      return rawModule.default;
    }
  }

  // CASE 2: Named Export check karo (`export const WeatherTool = ...`)
  // Raw module ki saari keys (export names) par loop chalao
  for (const key of Object.keys(rawModule)) {
    const exportedItem = rawModule[key];
    // Check karo ki kya is exported item ke paas 'name' aur 'execute' function hai
    if (
      exportedItem &&
      typeof exportedItem === "object" &&
      typeof exportedItem.name === "string" &&
      typeof exportedItem.execute === "function"
    ) {
      return exportedItem;
    }
  }

  // CASE 3: Agar pure module me koi valid tool object nahi mila
  throw new Error(
    "No valid tool export (with 'name' and 'execute') found in module.",
  );
}
