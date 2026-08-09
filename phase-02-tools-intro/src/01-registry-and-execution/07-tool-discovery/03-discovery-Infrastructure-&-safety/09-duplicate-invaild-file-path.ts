// 09. Duplicate & Invalid File Path Detection.
// Pehle iski zaroorat ko ek simple line mein samajhte hain:

// Agar do alag - alag folders mein galti se ek hi naam ka tool(tax.tool.ts) bana diya,
// toh LLM confuse ho jayega ki kaun sa chalana hai,
// isliye scanner ko use yahin block karna hoga.

// Is safety system ko check karne ke liye hum ek
// helper function banayenge jo do cheezein check karega: Duplicate
// Check: Kya is file ka naam list mein pehle se aa chuka hai ?
// Invalid Check: Kya yeh file sach mein disk par exist karti hai ya sirf tute hue
// path ki tarah list mein aa gayi hai ?

// Importent mthods
// path.basename(filePath) ye name niklata hai file ka
// fs.access(fileapth) check karta hai ki file sach mein disk par hai ya nahi
import path from "node:path";
import fs from "node:fs/promises";
/**
 * Saare discovered paths ko validate karne wala engine
 *
 */

export async function validateDiscoveredPaths(
  paths: string[],
): Promise<string[]> {
  const seenToolName = new Set<string>();
  const verifiedPath: string[] = [];

  for (const filePath of paths) {
    // 1. File ka sirf naam nikalo (e.g., "D:/tools/tax.tool.ts" -> "tax.tool.ts")
    const fileName = path.basename(filePath);

    // -- Duplicate tools name check ---
    if (seenToolName.has(fileName)) {
      throw new Error(
        `🚨 DUPLICATE TOOL DETECTED: File "${fileName}" duplicate payi gayi hai! Paths alag hain par naam same hai.`,
      );
    }

    // agr nahi hai to add kar leneg
    seenToolName.add(fileName);

    // --- Check kya yaha file sach mein exixt karti hai ki nahi
    try {
      await fs.access(filePath);
      verifiedPath.push(filePath);
    } catch (error) {
      console.warn(
        `⚠️ INVALID PATH DETECTED: File "${filePath}" disk par nahi mili. Skipping...`,
      );
    }
  }
  return verifiedPath;
}

async function run() {
  console.log("🏃‍♂️ Starting Duplicate Detection Test...\n");

  // Case 1: Maan lijiye hamare paas do alag folders me SAME NAAM ki file aa gayi
  const dummyPathsWithDuplicate = [
    "D:\\project\\src\\tools\\finance\\tax.tool.ts",
    "D:\\project\\src\\tools\\hr\\tax.tool.ts", // <-- Same name! Duplicate!
  ];

  try {
    // Isko check karne ke liye bhejte hain
    await validateDiscoveredPaths(dummyPathsWithDuplicate);
  } catch (error: any) {
    console.log("🔥 Test Result Success!");
    console.log(error.message); // Yeh hamara banaya hua error print karega
  }
}

run();
