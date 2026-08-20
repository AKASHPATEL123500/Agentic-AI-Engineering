export interface writeFileResult {
  filepath: string;
  absolutePath: string;
  folderPath: string;
  fileFlag: string;
  createdAt: string | number;
  createdBy: string;
  fileMode?: string;
}
