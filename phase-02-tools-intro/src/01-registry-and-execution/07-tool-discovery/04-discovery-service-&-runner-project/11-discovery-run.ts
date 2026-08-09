import path from "node:path";
import { CachedToolDiscoverer } from "../03-discovery-Infrastructure-&-safety/08-discovery-cache-engine.ts";

export async function runDiscovery() {
  const discoverer = new CachedToolDiscoverer();

  // Listeners
  discoverer.events.on("discovery:start", (dir) => {
    console.log(`📡 [START]: Scanning ${dir}`);
  });

  discoverer.events.on("discovery:fileFound", (filePath) => {
    console.log(`🟢 [FOUND]: ${path.basename(filePath)}`);
  });

  discoverer.events.on("discovery:fileIgnored", (data) => {
    console.log(`🔴 [IGNORED]: ${path.basename(data.filePath)}`);
  });

  discoverer.events.on("discovery:complete", (data) => {
    console.log(`🎉 [DONE]: Found ${data.count} tools in ${data.durationMs}ms`);
  });
  // Run 1: Disk Scan Hoga + Events Fire Honge
  await discoverer.discover("../01-fundamentals-&-path-discovery/src/tools");

  // Run 2: Cache Hit Hoga (Events Fire nahi honge, direct memory se dega)
  await discoverer.discover("../01-fundamentals-&-path-discovery/src/tools");

  console.log("Data: ", discoverer.seeData());

  // saved in file
  // discoverer.savedInFile();
  // file saved ho gayi hai isliye isko commit kar diya
}

runDiscovery();
