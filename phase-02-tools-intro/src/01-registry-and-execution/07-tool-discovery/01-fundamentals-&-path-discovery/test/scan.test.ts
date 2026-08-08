import { scanToolsDirectory } from "../02-codes/scann.file.ts";

async function testScanner() {
  const discoveredPaths = await scanToolsDirectory("../src/tools");
  console.log("Discovered File Paths:", discoveredPaths);
}

testScanner();
