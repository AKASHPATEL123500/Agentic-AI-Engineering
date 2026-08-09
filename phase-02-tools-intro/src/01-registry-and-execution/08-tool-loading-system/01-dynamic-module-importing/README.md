# 01. Dynamic Module Importing

## 💡 Real-world Metaphor

- **Static Import (`import ... from '...'`)**: Jaise hotel mein room book karne se pehle menu order lock kar dena. Pehle se fixed hota hai, runtime par badal nahi sakte.
- **Dynamic Import (`await import(path)`)**: Jaise hotel mein baith kar Zomato se online khana order karna. Tumhe path/address runtime par milta hai aur tum tabhi file ko memory mein bulate ho.

---

## 🎯 Primary Objective

Discovery Engine se hume dynamic string paths mil rahe hain (e.g., `"D:/project/tools/weather.tool.ts"`).
Hum top par `import { weatherTool } from "..."` nahi likh sakte kyunki hume pehle se pata hi nahi ki user ne kaun-kaun si files daali hain.

Isiliye hum **`await import(filePath)`** ka use karte hain.

---

## ⚙️ Key Technical Challenges

1. **Windows vs POSIX Path Issues**: Windows ke backslashes (`\`) Node.js ES Modules import mein kabhi-kabhi issue karte hain. Path ko `file://` URL format ya POSIX slashes (`/`) mein badalna padta hai.
2. **Default vs Named Export Handling**:
   - Direct export: `export const weatherTool = { ... }` ➔ `importedModule.weatherTool`
   - Default export: `export default weatherTool` ➔ `importedModule.default`

---

## 1. Static Import Kya Hai? (The Hardcoded Way)

Jab aap apne code ke sabse upar likhte hain:

```ts
import { weatherTool } from "./tools/weather.tool.ts";
```

sko bolte hain Static Import

- `Compile-Time Bound:` Jab aapka application start hone waala hota hai, Node.js sabse pehle upar se lekar neeche tak saari imported files ko padhta hai. Agar unme se ek bhi file ka path galat hua ya file missing hui, toh aapka poora project start hone se pehle hi crash ho jayega.
- `No Variables Allowed:`ap static import me variable path nahi daal sakte. Aap aisa nahi likh sakte: `import tool from myVariablePath;` — TypeScript turant error de dega.

- `Problem for Agents:` Hamare Agent ko nahi pata ki user kaun sa tool maangega ya disk par kitne naye tools pade hain. Agar hume 100 tools add karne hain, toh kya hum baithkar upar 100 static import lines likhenge? Bilkul nahi!

## ⚡ 2. Dynamic Import Kya Hai? (The Runtime Magic)

Node.js (ES Modules) hume ek special primitive deta hai jo ek function ki tarah dikhta hai: `import(filePathString)`.

Jab hum iska use karte hain, toh game bilkul badal jata hai:

- `Runtime Execution:` Yeh code chalte waqt `(runtime par)` load hota hai. Jab aapka project chal raha hai, user ne query daali, tab jaakar yeh file ko read karega.
- `Strings & Variables Allowed:` Iske andar aap koi bhi string variable daal sakte hain

```ts
const meraPath = "D:/agentic-ai/tools/calculator.tool.ts";
const importedModule = await import(meraPath);
```

- `Asynchronous Nature:` Kyunki yeh disk se file uthata hai, isliye yeh hamesha ek `Promise` return karta hai jise hum `await` lagakar handle karte hain.

```ts
# 🧩 01-static-vs-dynamic-imports.ts

---

### 🕒 1. Kab load hota hai?
*   **Static Import (`import x from 'y'`)**
    *   Application start hone se **PEHLE**.
*   **Dynamic Import (`import('y')`)**
    *   Application chalne ke **BAAD** (Runtime par).

---

### 🛣️ 2. Path kaisa chahiye?
*   **Static Import (`import x from 'y'`)**
    *   Ekdam **Fixed / Hardcoded** String.
*   **Dynamic Import (`import('y')`)**
    *   Koi bhi **Variable** ya Dynamic String Path.

---

### ⚠️ 3. Fail hone par kya hoga?
*   **Static Import (`import x from 'y'`)**
    *   Poora app start hone se pehle hi **crash**.
*   **Dynamic Import (`import('y')`)**
    *   Sirf wo specific file ka code crash hoga (**Try-catch safe**).

---

### 📦 4. Return Type
*   **Static Import (`import x from 'y'`)**
    *   **Direct Object / Function**.
*   **Dynamic Import (`import('y')`)**
    *   Ek JavaScript **Promise** Object.

---

```

## 🛠️ Hum Iska Code Kaise Likhenge? (The Conceptual Blueprint)

Jab hum dynamic import chalate hain, toh Node.js hume poori file ek Module object ke roop me pakda deta hai:

```ts
// Ek variable path jo hume Discovery Engine se mila hai
const toolFilePath =
  "D:\\agentic-ai-engineering\\src\\tools\\delete-file.tool.ts";

// Dynamic Import ka use
const moduleData = await import(toolFilePath);

console.log(moduleData);
// Output ek aisa object hoga: { default: [Object], myTool: [Object] }
```

```ts
📦 Raw Loaded Module Object: Module {
  WeatherTool: {
    name: "wather_tool",
    description: "This is weather tool that fatch real time weather based on city and unit and more...",
    params: _ {
      _zod: [Object ...],
      "~standard": [Getter/Setter],
      toJSONSchema: [Function],
      def: [Object ...],
      type: "object",
      _def: [Object ...],
      parse: [Function],
      safeParse: [Function],
      parseAsync: [AsyncFunction],
      safeParseAsync: [AsyncFunction],
      spa: [AsyncFunction],
      encode: [Function],
      decode: [Function],
      encodeAsync: [AsyncFunction],
      decodeAsync: [AsyncFunction],
      safeEncode: [Function],
      safeDecode: [Function],
      safeEncodeAsync: [AsyncFunction],
      safeDecodeAsync: [AsyncFunction],
      description: [Getter],
      shape: [Getter/Setter],
      check: [Getter/Setter],
      with: [Getter/Setter],
      clone: [Getter/Setter],
      brand: [Getter/Setter],
      register: [Getter/Setter],
      refine: [Getter/Setter],
      superRefine: [Getter/Setter],
      overwrite: [Getter/Setter],
      optional: [Getter/Setter],
      exactOptional: [Getter/Setter],
      nullable: [Getter/Setter],
      nullish: [Getter/Setter],
      nonoptional: [Getter/Setter],
      array: [Getter/Setter],
      or: [Getter/Setter],
      and: [Getter/Setter],
      transform: [Getter/Setter],
      default: [Getter/Setter],
      prefault: [Getter/Setter],
      catch: [Getter/Setter],
      pipe: [Getter/Setter],
      readonly: [Getter/Setter],
      describe: [Getter/Setter],
      meta: [Getter/Setter],
      isOptional: [Getter/Setter],
      isNullable: [Getter/Setter],
      apply: [Getter/Setter],
      keyof: [Getter/Setter],
      catchall: [Getter/Setter],
      passthrough: [Getter/Setter],
      loose: [Getter/Setter],
      strict: [Getter/Setter],
      strip: [Getter/Setter],
      extend: [Getter/Setter],
      safeExtend: [Getter/Setter],
      merge: [Getter/Setter],
      pick: [Getter/Setter],
      omit: [Getter/Setter],
      partial: [Getter/Setter],
      required: [Getter/Setter],
    },
    version: "0.0.1",
    execute: [AsyncFunction: execute],
  },
}
```
