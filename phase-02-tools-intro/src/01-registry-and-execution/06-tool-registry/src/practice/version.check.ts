export function isNewVersion(currVersion: string, newVersion: string): boolean {
  const parse = (v: string) => v.split(".").map(Number);
  const [currMjaor = 0, currMinor = 0, currPatch = 0] = parse(
    currVersion || "1.0.0",
  );
  const [newMajor = 0, newMinor = 0, newPatch = 0] = parse(
    newVersion || "1.0.0",
  );

  if (newMajor > currMjaor) return true;
  if (newMajor === currMjaor || newMinor > currMinor) return true;
  if (newMajor === currMjaor || newMinor === currMinor || newPatch > currPatch)
    return true;
  return false;
}
