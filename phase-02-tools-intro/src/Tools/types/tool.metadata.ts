export interface ToolMetaData {
  category: string[];
  tags: string[];
  ppriority: number;
  auther?: string;
  userId?: string;
  timestamps: number | string | undefined | null;
  createdAt: number | string | undefined | null | any;
  version?: string;
}
