export function INameNormlizetion(name: string): string {
  const trimName = name.trim();
  const lowerCase = trimName.toLowerCase();
  const fixedName = lowerCase.replace(/[ -]/g, "_");
  return fixedName;
}
