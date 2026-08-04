```ts
// Jab registry mein koi dikkat aaye (jaise duplicate tool aana ya missing tool search hona),
//  toh generic Error throw na ho,
// balki Registry-Specific Error throw ho jisme Error Code aur Clear Message ho.

// 1. DuplicateToolError ne Error ki saari powers copy kar li (extends Error)

class Car {
  constructor(brandName: string) {
    console.log(`Nayi car ban rahi hai: ${brandName}`);
  }
}

const myCar = new Car("BMW");
console.log(myCar);

// class Student {
//   name: string;
//   constructor(studentNAme: string) {
//     this.name = studentNAme;
//   }
// }

// const stduent = new Student("Aaksh");
// console.log(stduent);

class Student {
  // "public" likhne se 'name' automatic class ki property ban gaya!
  constructor(public name: string) {}
}

const s1 = new Student("Akash");
console.log(s1.name); // "Akash"

// 'extends Error' ka matlab hai: Normal Error ki saari qualities mere 'ToolRegistryError' mein aa jayein!
class ToolRegistryError extends Error {
  // CONSTRUCTOR: Message aur ErrorCode lene ke liye
  constructor(
    message: string,
    public errorCode: string,
  ) {
    super(message);
    this.name = "ToolRegistryError";
  }
}

const err = new ToolRegistryError("Tool Missing hai!", "TOOL_NOT_FOUND");
console.log(err.message);
console.log(err.errorCode);
console.log(err.name);
```

---

Bilkul tension mat lo! Constructor, classes, aur `public` keywords JavaScript aur TypeScript ke core OOP (Object-Oriented Programming) concepts hain. Unhe ek minute mein zero-level se samajhte hain.

---

## 1. Class Aur Constructor Kya Hote Hain?

### 💡 Simple Analogy: Blueprint vs Car

- **Class = Blueprint (Design)**: Imagine karo tumne ek gadi ka design paper par banaya hai. Paper par likhi hui car chal nahi sakti, wo sirf ek _Design/Recipe_ hai.
- **Constructor = Factory Machine**: Jab tum us design se actual real car banate ho, toh pehle factory machine chalti hai jo gadi mein rang (color), engine, aur model number set karti hai.
- **Object / Instance = Real Car**: Jo gadi factory se ban kar nikli.

### Code Mein Dekho:

```typescript
class Car {
  // CONSTRUCTOR: Ye wo special function hai jo NAYI gadi banate waqt sabse pehle automatically chalta hai.
  constructor(brandName: string) {
    console.log(`Nayi car ban rahi hai: ${brandName}`);
  }
}

// Jab hum "new" keyword likhte hain, tab 'constructor()' chalta hai!
const myCar = new Car("BMW"); // Output: Nayi car ban rahi hai: BMW
```

---

## 2. `public` Aur Property Declaration Ka Kya Matlab Hai?

Normally, Class ke andar variables ko store karne ke liye do tareeqe hote hain:

### Tareeqa A (Lamba aur Boring Tareeqa):

```typescript
class Student {
  name: string; // Variable declare kiya

  constructor(studentName: string) {
    this.name = studentName; // Constructor me value assign ki
  }
}
```

### Tareeqa B (TypeScript Ka Short-cut using `public`):

Jab tum constructor ke parameter ke aage **`public`** likh dete ho, toh TypeScript background mein do kaam ek saath kar deta hai:

1. Variable ko class ka part bana deta hai.
2. Parameter ki value us variable mein store kar deta hai.

```typescript
class Student {
  // "public" likhne se 'name' automatic class ki property ban gaya!
  constructor(public name: string) {}
}

const s1 = new Student("Akash");
console.log(s1.name); // "Akash"
```

> **`public` ka matlab:** _"Iss property ko class ke bahar se koi bhi read ya access kar sakta hai."_

---

## 3. Custom Error Kya Hai Aur `extends Error` Kyun Karte Hain?

JavaScript ke paas pehle se ek built-in `Error` class hoti hai jo batati hai ki code crash ho gaya.

```typescript
throw new Error("Kuch gadbad ho gayi");
```

Lekin hum apna **Custom Error** banate hain taaki hum standard error ko "Superpower" de sakein—jaise ki ek extra **`errorCode`** property add karna!

```typescript
// 'extends Error' ka matlab hai: Normal Error ki saari qualities mere 'ToolRegistryError' mein aa jayein!
export class ToolRegistryError extends Error {
  // CONSTRUCTOR: Message aur ErrorCode lene ke liye
  constructor(
    message: string,
    public errorCode: string,
  ) {
    // super(message) -> Parent (Error) Class ke constructor ko 'message' bhejta hai
    super(message);

    // Is error ka specific naam set karte hain
    this.name = "ToolRegistryError";
  }
}
```

### Magic Dekho Iska:

```typescript
// Jab hum ye error throw karenge:
const err = new ToolRegistryError("Tool missing hai!", "TOOL_NOT_FOUND");

console.log(err.message); // Output: "Tool missing hai!" (Standard Error se mila)
console.log(err.errorCode); // Output: "TOOL_NOT_FOUND" (Hamare 'public errorCode' se mila)
console.log(err.name); // Output: "ToolRegistryError"
```

---

## 🛠️ Complete `02-custom-registry-errors.ts` Code

Ab jab tumhe Constructor, `public`, aur `extends` samajh aa gaya, toh saare errors aise dikhenge:

```typescript
// 1. Base Class (Parent)
export class ToolRegistryError extends Error {
  constructor(
    message: string,
    public errorCode: string,
  ) {
    super(message);
    this.name = "ToolRegistryError";
  }
}

// 2. Duplicate Tool Error
export class DuplicateToolError extends ToolRegistryError {
  constructor(toolName: string) {
    // Parent Class (ToolRegistryError) ko message aur code bhej rahe hain using super()
    super(`Tool '${toolName}' is already registered.`, "DUPLICATE_TOOL");
    this.name = "DuplicateToolError";
  }
}

// 3. Tool Not Found Error
export class ToolNotFoundError extends ToolRegistryError {
  constructor(toolName: string) {
    super(`Tool '${toolName}' was not found in registry.`, "TOOL_NOT_FOUND");
    this.name = "ToolNotFoundError";
  }
}

// 4. Invalid Tool Error
export class InvalidToolError extends ToolRegistryError {
  constructor(toolName: string, reason: string) {
    super(`Tool '${toolName}' is invalid: ${reason}`, "INVALID_TOOL");
    this.name = "InvalidToolError";
  }
}
```

---

Ab batao, Constructor, `public`, aur `super()` ka doubt clear hua ya koi chota sa confusuion abhi bhi bacha hai?

Ekdum badhiya! Ab hum **Stage 03** ka pehla aur sabse important step shuru karte hain.

Pehle hum bilkul relaxed hokar in do concepts ko samajhte hain, fir tum iska code khud likhoge.

---

## 1. Name Normalization Kya Hai? (`01-name-normalization.ts`)

### 💡 Problem (Real-World Issue):

Jab koi developer ya LLM tool ka naam bhejta hai, toh inconsistent casing ya spaces aa sakte hain:

- `" Get_Weather "` (Extra spaces)
- `"get-weather"` (Hyphens)
- `"GET_WEATHER"` (Uppercase)

Agar hum inhe bina saaf kiye `Map` mein key bana denge, toh `map.get("get_weather")` fail ho jayega kyunki Map exact case-sensitive string matching karta hai.

### 🛠️ Solution (Normalization Function):

Hum ek clean utility function banate hain jo har tool name ko ek **Standard Canonical Format** (jaise `lowercase` aur `snake_case`) mein convert kar deta hai:

1. Extra spaces trim karo (`.trim()`).
2. Saare characters ko lowercase karo (`.toLowerCase()`).
3. Spaces aur hyphens (`-`) ko underscores (`_`) se replace karo.

**Example Transformation:**
`" Get-Weather "` ➔ `"get_weather"`

---

## 2. Core CRUD Logic & Class Architecture (`02-core-registry.ts`)

Ab hum apni main `ToolRegistry` class ka skeleton aur uske internal Map layer ko setup karte hain.

### 🏗️ Class Ka Layout Structure:

```typescript
export class ToolRegistry implements IToolRegistry {
  // 1. Internal Storage: Key-Value map jahan keys normalized tool names honge
  private tools: Map<string, ToolType> = new Map();

  // 2. Options Configuration (Default values ke sath)
  private options: RegistryOptions;

  constructor(options: RegistryOptions = {}) {
    this.options = {
      allowOverwrite: false,
      strictValidation: true,
      ...options,
    };
  }

  // Helper method: Private name normalizer
  private normalizeName(name: string): string {
    return name
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_");
  }

  // ... Baki saare CRUD methods yahan aayenge
}
```

---

## 🛠️ Un 6 Core CRUD Methods Ka Logic (Jo tum implement karoge):

### 1. `register(tool: ToolType): void`

- Tool ke name ko normalize karo: `const normalizedName = this.normalizeName(tool.name)`.
- Check karo ki tool pehle se Map mein hai ya nahi (`this.tools.has(normalizedName)`).
- **If exists AND `!this.options.allowOverwrite**`: `throw new DuplicateToolError(tool.name)`.
- Map mein store kar do: `this.tools.set(normalizedName, tool)`.

### 2. `get(toolName: string): ToolType`

- Tool name ko normalize karo.
- Map se tool nikalo: `const tool = this.tools.get(normalizedName)`.
- **If not found**: `throw new ToolNotFoundError(toolName)`.
- Return tool object.

### 3. `has(toolName: string): boolean`

- Tool name normalize karo aur return karo: `this.tools.has(normalizedName)`.

### 4. `unregister(toolName: string): boolean`

- Tool name normalize karo.
- Check karo agar tool missing hai -> return `false`.
- Delete karo: `this.tools.delete(normalizedName)` -> return `true`.

### 5. `list(): ToolType[]`

- Map ki saari values ko Array mein convert karo: `Array.from(this.tools.values())`.

### 6. `clear(): void`

- Map ko poora khali kar do: `this.tools.clear()`.

---

Batao Akash, kya `normalizeName` ka logic aur in 6 CRUD methods ka internal working tumhe ekdum saaf samajh aa gaya?

Ab tum bina kisi jaldbaazi ke pehle `01-name-normalization.ts` utility function likho, aur fir `ToolRegistry` class ke andar in CRUD methods ko implementation dena shuru karo! Jab code likh lo, toh mujhe dikhana.
