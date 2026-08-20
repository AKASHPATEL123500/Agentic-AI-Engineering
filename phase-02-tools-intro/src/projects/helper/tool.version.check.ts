export function INewerVersionCheck(
  currentVersion: string,
  newVersion: string,
): boolean {
  const parse = (v: string) => v.split(".").map(Number);

  const [currMajor = 0, currMinor = 0, currPatch = 0] = parse(
    currentVersion || "1.0.0",
  );
  const [newMajor = 0, newMinor = 0, newPatch = 0] = parse(
    newVersion || "1.0.0",
  );

  // 1. Agar major version bada hai
  if (newMajor > currMajor) return true;
  if (newMajor < currMajor) return false;

  // 2. Agar major barabar hai, toh minor check karo
  if (newMinor > currMinor) return true;
  if (newMinor < currMinor) return false;

  // 3. Agar major aur minor barabar hain, toh patch check karo
  if (newPatch > currPatch) return true;

  // Agar versions bilkul barabar (same) hain ya naya version purane se chota hai
  return false;
}
