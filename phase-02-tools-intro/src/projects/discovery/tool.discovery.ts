import { toolScan } from "./helper/tool.scan";

export class ToolDiscovery {
  private memeory: string[] | null = null;

  async discover(dirPath: string): Promise<string[]> {
    if (this.memeory !== null) {
      console.log("[ Cache Hit ] Returning paths directly from Memory!");
      return this.memeory;
    }

    console.log("💿 [Cache Miss] Scanning hard disk for the first time...");

    const freshData = await toolScan(dirPath, []);
    this.memeory = freshData;
    return freshData;
  }
}
