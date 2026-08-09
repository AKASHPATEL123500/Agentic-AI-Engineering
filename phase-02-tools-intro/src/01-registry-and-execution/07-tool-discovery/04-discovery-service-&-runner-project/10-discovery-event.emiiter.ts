import EventEmitter from "node:events";

export class DiscoveryToolsEvents extends EventEmitter {
  emitStart(dirPath: string) {
    this.emit("discovery:start", dirPath);
  }

  emitFileFound(filePath: string) {
    this.emit("discovery:fileFound", filePath);
  }
  emitFileIgnored(filePath: string, resion: string) {
    this.emit("discovery:fileIgnored", { filePath, resion });
  }
  emitComplete(count: number, duartionMs: number) {
    this.emit("discovery:complete", { count, duartionMs });
  }
}
