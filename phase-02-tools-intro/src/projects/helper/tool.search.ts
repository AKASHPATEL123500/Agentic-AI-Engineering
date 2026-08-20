import type { IToolType } from "../types/types";

export function IToolSearchByCategory(
  tool: IToolType[],
  category: string,
): IToolType[] {
  const targetCategory = category.toLowerCase();

  const data = tool.filter((tool) => {
    if (!tool.metadata.category || !Array.from(tool.metadata.category))
      return false;

    return tool.metadata.category.some(
      (cat) => cat.toLowerCase() === targetCategory,
    );
  });
  return data;
}

export function IToolSearchByTag(tool: IToolType[], tag: string): IToolType[] {
  const targetTags = tag.toLowerCase();

  const data = tool.filter((tool) => {
    if (!tool.metadata.tags || !Array.from(tool.metadata.tags)) return false;

    return tool.metadata.tags.some((cat) => cat.toLowerCase() === targetTags);
  });
  return data;
}
