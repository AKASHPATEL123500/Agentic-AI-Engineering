// Top par apna ToolType import kiya

import type { ToolType } from "../02-registry-contract-and-errors/src/types.ts";

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
  query: { category?: string; tags?: string },
): ToolType[] {
  if (!query.category && !query.tags) return tools;
  return tools.filter((tool) => {
    // 1. Agar query me category maangi hai, toh check karo match ho rahi hai ya nahi
    if (query.category) {
      if (
        !tool.metadata?.category ||
        tool.metadata?.category.toLowerCase() === query?.category.toLowerCase()
      )
        return false;
    }

    // 2. Agar query me tag maanga hai, toh check karo wo array me hai ya nahi
    if (query.tags) {
      if (!tool.metadata?.category) return false;
      const targetTag = query?.category?.toLowerCase();
      const HasTag = tool.metadata.tags.some(
        (t) => t.toLowerCase() === targetTag,
      );
      if (!HasTag) return false;
    }
    // Agar dono checks pass ho gaye (ya jo maanga tha wo pass ho gaya), toh true return karo
    return true;
  });
}

// Bhai, aapne ekdam sahi samjha! Yeh teeno functions ka kaam bas itna hi hai. Aaiye ek-ek line mein in teeno functions ka matlab aur unke parameters ko ekdam easy tarike se samajhte hain:
// ## 1. searchByCategory

// * Ek Line Mein Matlab: Yeh function saare tools ke dher (array) mein se sirf ek specific department/category (jaise: math) ke tools ko chhaant kar alag karta hai.
// * Params Ka Matlab:
// * tools: Aapki poori tools ki list (Array).
//    * category: Wo category ka naam jise aap dhoond rahe hain (String).

// ## 2. searchByTag

// * Ek Line Mein Matlab: Yeh function saare tools mein se sirf ek specific label/tag (jaise: v2 ya helper) wale tools ko chhaant kar bahar nikalta hai.
// * Params Ka Matlab:
// * tools: Aapki poori tools ki list (Array).
//    * tag: Wo tag ka naam jo tool par laga hona chahiye (String).

// ## 3. filterTools

// * Ek Line Mein Matlab: Yeh ek Smart Advanced Search hai jo category aur tag dono ko ek sath dekh kar double filter lagata hai (jaise Amazon par filter lagate hain).
// * Params Ka Matlab:
// * tools: Aapki poori tools ki list (Array).
//    * query: Ek box/object jisme aap category, tag, ya dono ek sath bhej sakte hain { category: "...", tag: "..." }.

// ------------------------------
// ## 💡 ToolType[] (Array) Kyu Bana Rahe Hain?
// Aapne poochha ki ToolType ko array kyu bana rahe hain? Iska simple matlab yeh hai ki jab hum search karenge, toh hume sirf ek tool nahi milega,
//  balki us category ya tag ke bohot saare tools mil sakte hain. Isliye hum results ko ek List (Array) ke roop mein return karte hain.
// Bhai, kya ab in teeno functions ka maqsad ekdam achhe se clear ho gaya?
// Agar aapko agle part 02-registry-events ke baare mein jaanna hai, toh batayein ki aapke paas uski kya details hain!
