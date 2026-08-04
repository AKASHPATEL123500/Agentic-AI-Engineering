// Top par apna ToolType import kiya

import type { ToolType } from "../02-registry-contract-and-errors/src/types";

/**
 * Function 1: Category ke basis par tools filter karta hai (Case-Insensitive)
 */
export function searchByCategory(
  tools: ToolType[],
  category: string,
): ToolType[] {
  const targetCategory = category.toLowerCase();

  return tools.filter((tool) => {
    // Agar metadata ya category missing hai toh skip karo
    if (!tool.metadata?.category) return false;

    return tool.metadata.category.toLowerCase() === targetCategory;
  });
}

/**
 * Function 2: Tag ke basis par tools filter karta hai (Case-Insensitive)
 */
export function searchByTag(tools: ToolType[], tag: string): ToolType[] {
  const targetTag = tag.toLowerCase();

  return tools.filter((tool) => {
    // Agar metadata ya tags array missing hai toh skip karo
    if (!tool.metadata?.tags || !Array.from(tool.metadata.tags)) return false;

    // Har tag ko lowerCase karke check karenge taaki case-sensitivity ka lafda na ho
    return tool.metadata.tags.some((t) => t.toLowerCase() === targetTag);
  });
}

/**
 * Function 3: Category aur Tag dono conditions ek saath apply karke tools return karta hai
 */
export function filterTools(
  tools: ToolType[],
  query: { category?: string; tag?: string },
): ToolType[] {
  // Agar query object khali hai, toh saare tools waise hi bhej do
  if (!query.category && !query.tag) return tools;

  return tools.filter((tool) => {
    // 1. Agar query me category maangi hai, toh check karo match ho rahi hai ya nahi
    if (query.category) {
      if (
        !tool.metadata?.category ||
        tool.metadata.category.toLowerCase() !== query.category.toLowerCase()
      ) {
        return false;
      }
    }

    // 2. Agar query me tag maanga hai, toh check karo wo array me hai ya nahi
    if (query.tag) {
      if (!tool.metadata?.tags) return false;
      const targetTag = query.tag.toLowerCase();
      const hasTag = tool.metadata.tags.some(
        (t) => t.toLowerCase() === targetTag,
      );
      if (!hasTag) return false;
    }

    // Agar dono checks pass ho gaye (ya jo maanga tha wo pass ho gaya), toh true return karo
    return true;
  });
}
