## MODULE 02: Tool Validation & Sanitization

- issme hum check kareneg ki jo `Extract` data hai waha object hai ki nahi waha ek valid tool hai ki nhai ya bass aise test liye daal diya hai
- All in All mujhe uss clean tool ko validate karna hai

**Kise validate karna hai:**
logic

- check tool is object or not
- check name is exist and name is string or not and trim karne per kahi empty to nahi hai
- check kya discription hai aur waha ek string hai ki nahi
- check params
- check execute function
- finaly retun response

> Note 1:
>
> 1.  01 Shape checker kaa kaam hai ki jo 02 module exporter ne tool ko extract kar ke diya hai usko validate karna,
> 2.  check karna ki kya yuske ander jo properties hai waha valid hai ki nahi

> Note 2:
>
> 1.  Maan lo kisi devloper ne /tool mein aisi file daal di jo corrupted ho
> 2.  Example:
>
> - File mein JavaScript syntax error hai (const x = ;).
> - File import hote hi direct crash/throw kar deti hai.
> - File ke andar required properties gayab hain.
>
> 3.  Agar hum bina Isolation Guard ke import chalayenge, toh ek broken file poori Agentic AI Application ko crash kar degi!
> 4.  Goal: Koi file phate toh sirf USI file ko SKIP karo, ERROR LOG karo, aur next tool par badh jao. Poora app kabhi crash nahi hona chahiye.

## **Bass yahi mtlb hai inn dono ka file ka bass**

Wah bhai, ekdum spot on! Sahi catch kiya, `parameters` aur `params` ke name mismatch ki wajah se hi Guard ne rok diya tha. Fix hone ke baad shape validation aag ki tarah chal rahi hai!

Ab chalte hain **Module 02 ke aakhri aur sabse zaroori safety topic par**:

---

## 🛡️ 04. Corrupted Module Isolation (`04-corrupted-module-isolation.ts`)

### 💡 Problem (Need for Isolation)

Maan lo kisi developer ne `/tools` folder mein ek aisi file daal di jo **corrupted** hai:

- File mein JavaScript syntax error hai (`const x = ;`).
- File import hote hi direct crash/throw kar deti hai.
- File ke andar required properties gayab hain.

Agar hum bina **Isolation Guard** ke import chalayenge, toh ek broken file poori Agentic AI Application ko crash kar degi!

**Goal:** Koi file phate toh sirf **USI file ko SKIP karo, ERROR LOG karo, aur next tool par badh jao**. Poora app kabhi crash nahi hona chahiye.

---

### 💻 Isolation Guard Implementation

`04-corrupted-module-isolation.ts` file banao aur ye clean safe wrapper function likho:

```typescript
import { extractToolFromModule } from "../01-dynamic-module-importing/02-module-exporter-extractor";
import { validateToolShape } from "./03-shape-checker-guard";

export interface SafeLoadResult {
  success: boolean;
  tool?: any;
  filePath: string;
  error?: string;
}

/**
 * Kisi bhi dynamic tool file ko 100% Sandboxed/Isolated environment mein load karta hai.
 * Crucial Rule: Ye function KABHI BHI throw nahi karega (Fail-Safe Architecture).
 */
export async function safeLoadToolModule(
  filePath: string,
): Promise<SafeLoadResult> {
  try {
    // 1. Dynamic Import (Agar file syntax error se corrupted hai, toh 'catch' block pakad lega)
    const rawModule = await import(filePath);

    // 2. Extract Tool Object
    const cleanTool = await extractToolFromModule(rawModule);

    // 3. Shape Validation Guard Check
    const validation = validateToolShape(cleanTool);

    if (!validation.isValid) {
      return {
        success: false,
        filePath,
        error: `Shape Validation Failed: ${validation.errors.join(", ")}`,
      };
    }

    // Everything is 100% Valid & Safe!
    return {
      success: true,
      filePath,
      tool: cleanTool,
    };
  } catch (error: any) {
    // 🛡️ CRASH PROTECTION: Error catch karke quietly error result return kar do
    return {
      success: false,
      filePath,
      error: `Module Import/Crash Error: ${error?.message || "Unknown error"}`,
    };
  }
}
```

---

### 🧪 Practical Test Run (Same Runner File Mein)

Apne `index.ts` mein `safeLoadToolModule` ko pass karke test kar lo:

```typescript
import path from "node:path";
import { pathToFileURL } from "node:url";
import { safeLoadToolModule } from "../02-tool-validation-and-sanitization/04-corrupted-module-isolation";

async function testIsolation() {
  const filePath = "../tools/weather.tool.ts";
  const absolutePath = path.resolve(filePath);
  const fileUrl = pathToFileURL(absolutePath).href;

  console.log("🔍 Loading tool via Safe Isolation Guard...\n");

  const result = await safeLoadToolModule(fileUrl);

  if (result.success) {
    console.log("✅ [SAFE LOAD SUCCESS]: Tool is ready to use!");
    console.log("Tool Loaded:", result.tool.name);
  } else {
    console.error(
      "❌ [ISOLATED ERROR HANDLED]: File failed safely without crashing system!",
    );
    console.error("Reason:", result.error);
  }
}

testIsolation();
```

---

### 🎯 Terminal Output Look

- **Valid File Par Output:**

```text
✅ [SAFE LOAD SUCCESS]: Tool is ready to use!
Tool Loaded: wather_tool

```

- **Corrupted/Broken File Par Output:**

```text
❌ [ISOLATED ERROR HANDLED]: File failed safely without crashing system!
Reason: Module Import/Crash Error: Cannot find module... / SyntaxError

```

Isko same runner script mein include karke chala kar dekho!

Batao, kya Module 02 (**Shape Validation + Crash Isolation**) ka safety logic ekdam dimaag mein fit ho gaya?
