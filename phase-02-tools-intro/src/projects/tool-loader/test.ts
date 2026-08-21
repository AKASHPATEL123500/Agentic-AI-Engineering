import { IToolLoaderSystem } from "./index.ts";

const loader = new IToolLoaderSystem();

const data = await loader.load("../tools/weather/weather.tool.ts");

console.log(data);
