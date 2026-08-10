export interface LoderResult {
  sussess: boolean;
  status: "success" | "faild" | "denied";
  filePath: string;
  tool?: any;
  error?: string | null;
}

export interface ILooderToolContract {
  load(filePath: string): Promise<LoderResult>;
  loadMany(filesPath: string[]): Promise<LoderResult[]>;
}
