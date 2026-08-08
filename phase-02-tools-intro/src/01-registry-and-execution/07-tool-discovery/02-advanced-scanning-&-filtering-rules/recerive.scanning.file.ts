// Recursion/recursive = ka mtlb hai ki age file ke ander sub-folder hai to usko bhi scan karo
// yahi per ek advance tool ata hai
// fs.stat(dirName)

import path from "node:path";
import fs from "node:fs/promises";

// abhi tak fs.readdir tha waha keval file ko hi read kar raha tha agr sub foldeer ho to nahi read
// kar apyega to yahi per recive ata hai

export async function scanToolsDirectoryRecursive(
  dirPath: string,
): Promise<string[]> {
  const absolutePath = path.resolve(dirPath);
  let discoveredTools: string[] = [];

  // 1. Folder ke andar ka sara maal-paani read karo
  const items = await fs.readdir(absolutePath, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(absolutePath, item.name);
    console.log("this is fullpath :", fullPath);

    // 2. Pata karo ki item file hai ya folder
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      // ⭐ RECURSION: Agar sub-folder hai, toh is function ko fir se call karo!
      const subFolderTools = await scanToolsDirectoryRecursive(fullPath);
      // Andar se mile saare tools ko main list me merge kar do
      discoveredTools = discoveredTools.concat(subFolderTools);
    } else if (stat.isFile() && item.name.endsWith(".tool.ts")) {
      // Agar file hai aur .tool.ts hai, toh store kar lo
      discoveredTools.push(fullPath);
    }
  }

  return discoveredTools;
}

/**
 * tools/
├── weather.tool.ts        <-- Basic scanner isko dhoondh lega
└── finance/
    └── invoice.tool.ts   <-- Basic scanner isko MISS kar dega!
 * Toh basic scanner invoice.tool.ts ko chhod dega. Isliye humein Recursive Folder Walker chahiye jo sub-folder ke andar bhi jaa sake.
 */

/// Pehle wala fs.readdir sirf upar-upar ke files ka naam batata tha,
//  jabki Recursive aur fs.stat milkar har sub-folder ke andar ghuskar
// aakhri file tak ko dhoondh nikaalte hain.
