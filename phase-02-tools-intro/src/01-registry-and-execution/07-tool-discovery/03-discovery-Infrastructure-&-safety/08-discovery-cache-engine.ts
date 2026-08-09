// 🗃️ 08. Discovery Cache EngineJaise humne baat ki,
// baar-baar hard disk scan karna slow hota hai. Isliye hum ek aisi class
// banayenge jo Interface (IToolDiscoverer) ko follow karegi,
// lekin uske paas apna ek personal memory box (Cache) hoga.

import { scanToolsWithIgnore } from "../02-advanced-scanning-&-filtering-rules/toolignore-engine/google/ignore.code.ts";
import type { IToolDiscoverer } from "./07-discovery-interface.ts";
import fs from "node:fs";
import { DiscoveryToolsEvents } from "../04-discovery-service-&-runner-project/10-discovery-event.emiiter.ts";

// 1. Ek private memory box jahan paths save honge
// 2. Agar memory me pehle se data hai, toh disk par mat jao! Turant wahin se return karo.
// 3. Agar cache khali hai (Pehli baar chal raha hai), toh disk scan karo
// 4. Agli baar ke liye memory me save kar lo
// Extra Method: Agar kabhi cache clear karna ho (Force Refresh)

// Cache Engine pehli baar chalne par disk ka data variable(this.cache) me save kar leta hai,
// aur uske baad har request par bina disk chhue instant result return karta hai.

export class CachedToolDiscoverer implements IToolDiscoverer {
  public events = new DiscoveryToolsEvents();
  private memory: string[] | null = null;

  async discover(dirPath: string): Promise<string[]> {
    if (this.memory !== null) {
      console.log("[ Cache Hit ] Returning paths directly from Memory!");
      return this.memory;
    }

    console.log("💿 [Cache Miss] Scanning hard disk for the first time...");

    const startTime = Date.now();
    this.events.emitStart(dirPath);

    // helper function ko event pass kar de parametere mein
    const freshPaths = await scanToolsWithIgnore(dirPath, [], this.events);

    this.memory = freshPaths;

    this.events.emitComplete(freshPaths.length, Date.now() - startTime);
    return freshPaths;
  }

  seeData() {
    return this.memory;
  }
  clearMemory(): void {
    this.memory = null;
    console.log("Memory cleared successfully");
  }

  savedInFile(): void {
    const data = JSON.stringify(this.memory ?? []);
    // Intentionally do not perform I/O here; return/Log data for caller to handle

    const file = "discover.tool.json";
    fs.writeFileSync(file, data);
    console.log(`All tools save in file successfully and file name is ${file}`);
  }
}
