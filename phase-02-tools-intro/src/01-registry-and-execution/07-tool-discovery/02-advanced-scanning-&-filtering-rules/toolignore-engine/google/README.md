Bhai, pakda gaya bug! Ek choti si line ki wajah se ye gadbad ho rahi hai.

Aapke code mein dekho:

```typescript
if (ignoreList.includes(item))

```

`Array.prototype.includes()` **EXACT match** dhoondhta hai!

- Iska matlab agar `item` = `"draft-file-tool.ts"` hai aur ignore list mein `"draft-file-tool.ts"` hai, tabhi `true` hota hai.
- Jab `item` = `"delete-file.tool.ts"` aur ignore list mein sirf `"delete-"` hai, toh `includes("delete-file.tool.ts")` `false` de deta hai kyunki `"delete-file.tool.ts"` bilkul barabar `"delete-"` nahi hai!

---

### 🛠️ Fix (1-Line Code Change)

`ignoreList.includes(item)` ki jagah `Array.prototype.some()` aur `.startsWith()` / `.includes()` ka check lagao:

```typescript
// ❌ PURANA CODE (Jo EXACT Match dhoondh raha tha)
// if (ignoreList.includes(item)) { ... }

// ✅ NAYA CODE (Jo Prefix / Partial Match check karega)
const isIgnored = ignoreList.some((rule) => {
  // Rule se wildcard '*' hata do agar daala ho
  const cleanRule = rule.replace(/\*/g, "").trim();
  return item.startsWith(cleanRule) || item.includes(cleanRule);
});

if (isIgnored) {
  // event trigger
  events?.emitFileIgnored(fullPath, "Matched .toolignore rule");
  console.log(`🚫 Ignored by .toolignore: ${item}`);
  continue;
}
```

---

### 🎯 Full Fixed Code (`scanToolsWithIgnore`):

Ye lo poora updated function. Direct replace karo aur chala kar dekho:

```typescript
import fs from "node:fs/promises";
import path from "node:path";
import type { DiscoveryToolsEvents } from "../Path/To/Your/EventFile";

async function getIgnoreList(dirPath: string): Promise<string[]> {
  try {
    const ignoreFilePath = path.join(dirPath, ".toolignore");
    const rawContent = await fs.readFile(ignoreFilePath, "utf-8");

    return rawContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
  } catch {
    return [];
  }
}

export async function scanToolsWithIgnore(
  dirPath: string,
  ignoreList: string[] = [],
  events?: DiscoveryToolsEvents,
): Promise<string[]> {
  const absolutePath = path.resolve(dirPath);

  if (ignoreList.length === 0) {
    ignoreList = await getIgnoreList(absolutePath);
  }

  let discoveredTools: string[] = [];
  const items = await fs.readdir(absolutePath);

  for (const item of items) {
    const fullPath = path.join(absolutePath, item);

    // 🛡️ FIX: 'includes' ki jagah 'some' use karo taaki prefix match ho sake!
    const isIgnored = ignoreList.some((rule) => {
      const cleanRule = rule.replace(/\*/g, "").trim();
      return item.startsWith(cleanRule) || item.includes(cleanRule);
    });

    if (isIgnored) {
      events?.emitFileIgnored(fullPath, "Matched .toolignore rule");
      console.log(`🚫 Ignored by .toolignore: ${item}`);
      continue;
    }

    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      const subFolderTools = await scanToolsWithIgnore(
        fullPath,
        ignoreList,
        events,
      );
      discoveredTools = discoveredTools.concat(subFolderTools);
    } else if (stat.isFile() && item.endsWith(".tool.ts")) {
      discoveredTools.push(fullPath);
      events?.emitFileFound(fullPath);
    }
  }

  return discoveredTools;
}
```

Ab `delete-`, `test-`, `fetch-` jaise partial names likhte hi saari matching files aaram se ignore ho jayengi! Isko run karke dekho aur batao output.
