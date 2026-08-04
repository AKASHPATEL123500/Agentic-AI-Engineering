// Duplicate vs Overwrite Logic (RegistryOptions ka real magic)
// Agar options.allowOverwrite === false hai aur duplicate tool aaye -> Throw DuplicateToolError.

// Agar options.allowOverwrite === true hai -> Purane tool ko update (overwrite) kar do bina error throw kiye.

/*
1. Pehle Samajhte Hain Version Number Kya Hota Hai?
Koi bhi standard version number teen hisson se banta hai, jaise: 1.2.5
1 (Major): Jab app mein bohot bada change ya naya feature aaye.
2 (Minor): Jab chhote-mote naye features bina purane features ko kharab kiye jode jayein.
5 (Patch): Jab sirf koi bug (galti) sahi ki jaye.
 */

export function isNewerVersion(
  currentVersion: string,
  newVersion: string,
): boolean {
  const parse = (v: string) => v.split(".").map(Number);
  const [currMajor = 0, currMinior = 0, currPatch = 0] = parse(
    currentVersion || "1.0.0",
  );
  const [newMajor = 0, newMinior = 0, newPatch = 0] = parse(
    newVersion || "1.0.0",
  );

  if (newMajor > currMajor) return true;
  if (newMajor === currMajor || newMinior > currMinior) return true;
  if (
    newMajor === currMajor ||
    newMinior === currMinior ||
    newPatch > currPatch
  )
    return true;

  return false;
}
