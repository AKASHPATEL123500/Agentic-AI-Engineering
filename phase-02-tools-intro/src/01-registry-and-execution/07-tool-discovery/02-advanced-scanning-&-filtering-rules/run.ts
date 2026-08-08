import { scanToolsDirectoryRecursive } from "./recerive.scanning.file.ts";

async function runRecursionFileScaing() {
  const data = await scanToolsDirectoryRecursive(
    "../01-fundamentals-&-path-discovery/src/tools",
  );
  console.log("Discover tools list: ", data);
}

runRecursionFileScaing();
