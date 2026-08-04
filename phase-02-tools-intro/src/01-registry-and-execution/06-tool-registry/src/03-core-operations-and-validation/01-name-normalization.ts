// 1. Name Normalization (Kyun zaroori hai?)
// LLMs ya developers tools ko alag-alag casing aur spacing ke sath call kar dete hain (e.g., "Get-Weather", "get_weather ", "GET_WEATHER").
// Agar hum direct string store kar denge, toh Map mein lookups fail ho jayenge ("get_weather" vs "Get_Weather" ko Map alag keys manta hai).
// Solution: Clean Helper function jo string ko lowercase karke,
// extra space trim kare aur consistent format (e.g., snake_case ya lowercase) mein convert kare.

// ek function bana hai
// jo ek name lega and usko
// 1. trim karega
// 2. lowwercae mein convert karna hai and uske baad
// 3. Spaces aur hyphens (-) ko underscores (_) se replace karo.

export function NameNormalization(name: string): string {
  const trimName = name.trim();
  const convertLowerCase = trimName.toLowerCase();
  const convertHypensToUnderScore = convertLowerCase.replace(/[ -]/g, "_");
  return convertHypensToUnderScore;
}

console.log(NameNormalization("Get-Weather"));
