import EventEmitter from "node:events";

export class ToolLoaderEvents extends EventEmitter {
  emitLoading(filePath: string) {
    this.emit("tool:loading", { filePath });
  }

  emitLoaded(filePath: string, toolName: string) {
    this.emit("tool:loaded", { filePath, toolName });
  }

  emitLoadFaild(filePath: string, resion: string) {
    this.emit("tool:load_faild", { filePath, resion });
  }
}
