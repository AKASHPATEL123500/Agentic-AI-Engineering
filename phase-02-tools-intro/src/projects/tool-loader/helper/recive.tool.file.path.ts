import path from "node:path";
import { pathToFileURL } from "node:url";

export async function exportToolFromTooldiscovery(
  filePath: string,
): Promise<unknown> {
  const absolutePath = path.resolve(filePath);

  const fileUrl = pathToFileURL(absolutePath).href;

  try {
    const tools = await import(fileUrl);
    return tools;
  } catch (error) {
    console.log(error);
  }
}

// console.log(await load("../tools/weather/weather.tool.ts"));
