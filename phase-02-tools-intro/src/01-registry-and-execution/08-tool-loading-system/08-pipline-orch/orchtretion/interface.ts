export interface IToolAutoRegistrationPipline {
  registerFromDirectory(dirPath: string): Promise<ToolRegistrationResult>;
}

export interface ToolRegistrationResult {
  discoverd: number;
  loaded: number;
  registered: number;
  faild: number;
  failuers: Array<{
    filePath: string;
    stage: "discoverd" | "loading" | "registertion";
    error: string | null;
  }>;
}
