// FIX: Correct semantic-version comparison (major -> minor -> patch)
export function isNewVersion(currVersion: string, newVersion: string): boolean {
  const parse = (v: string) => (v || "").split(".").map((s) => Number(s) || 0);
  const [currMajor = 0, currMinor = 0, currPatch = 0] = parse(
    currVersion || "0.0.0",
  );
  const [newMajor = 0, newMinor = 0, newPatch = 0] = parse(
    newVersion || "0.0.0",
  );

  if (newMajor > currMajor) return true;
  if (newMajor < currMajor) return false;

  // majors equal
  if (newMinor > currMinor) return true;
  if (newMinor < currMinor) return false;

  // minors equal
  if (newPatch > currPatch) return true;
  return false;
}
