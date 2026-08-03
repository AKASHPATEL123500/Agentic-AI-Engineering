```bash
├── 01-registry-fundamentals/
│   ├── 01-what-is-tool-registry/
│   ├── 02-why-agent-needs-registry/
│   ├── 03-registry-vs-array/
│   ├── 04-map-vs-object-vs-array/
│   ├── 05-real-world-architecture/
│   └── README.md

```

---

> **Example:**
>
> 1. assume hum ek hospiyal jate hai. aur waha per
> 2. reception per ek dircetrty board laga hota hai
> 3. Cardiologist ----> Room 101
> 4. Neurologist -> Room 102
> 5. Dermatologist -> Room 103
> 6. hame wahi se pata chal jata hai ki konsa docter kya kaam karta hai and kise karat ahai and kya waha avilable hai ye chizen
> 7. All in All Regsitry ek register hai jaha sare docter ki info likhi hai aur
> 8. aur hume jab need pati jiss chiz ko hum jaan jate hai easliy

---

> **1.what is regsitry:**
>
> 1. Tool regsitry ek centerl board hai ya index hai ya databse hai jaha sare tools register hote hai` ( search_tool, read_file_tool, write_file_tool)` and more... and ye signle source of truth hai jo bata hai ji agent ke pass kitne avilable tool hai unka `naam` kya hai and `description` kya hai and uhne kise run karna hai.
> 2. All in All Registry ek ek regsiter ha jaha sare tool ko register kar ke rakhti hai

---

> **2. Why agents need registry:**
>
> 1. Bina registry ke problem kya hai:
> 1. Imagine karo tumhare paas 20 tools hain. Bina registry ke, tumhe har jagah manual `if-else` ya `switch-case` likhna padega:

```ts
// ❌ Registry ke bina (Messy & Hardcoded Code)
if (llmChoice === "weather") {
  runWeatherTool(args);
} else if (llmChoice === "email") {
  runEmailTool(args);
} else if (llmChoice === "calculator") {
  runCalculatorTool(args);
} ... // 20 bar if-else!
```

> 3. Jab naya tool banega, tumhe poora main server code modify karna padega (Solid principles violate honge)

**4. Registry Aane Se Kya Hota Hai?**

- `Dynamic Lookup:` LM jis tool ka naam bheje `("weather")`, Registry bina `if-else` ke use turant dhoondh ke `execute` kar deti hai
- `Pluggable Architecture`: Naya tool banao -> `Registry` me `.register(newTool)` karo -> Agent use `automatically` use karne lagega!

---

**03. Registry vs Array:**
Difference Dekho:
**1. Array:**

- `Lookup speed`: Slow `O(N)` bhaut slow hota hai pure array mein find karna padta hai
- `Duplicate check:` Array mein buplicates allow hote hai
- `LLM Schema export:` Manual – Har bar map karke array banana padega

- `Safe Execution Gate:` Na ke barabar – Try/Catch har jagah khud likho

**2. Registry:**

- `Lookup speed`: instant ($O(1)$) – Naam dala aur tool mil gaya
- `Duplicate check:` Strict – Duplicate tool name aate hi error throw karta hai
- `LLM Schema export:` Built-in – registry.getLLMSchemas() ek line mein ho jata hai
- `Safe Execution Gate:`Centralized – Validation + Error handling + Metrics ek jagah

---

**04. Map vs Object vs Array:**
_Under the hood Tool Registry banane ke liye Data Structure kaunsa choose karein?_

1. `Array ([]) ❌:` Search slow hota hai ($O(N)$ complexity). 100 tools hue toh har tool call par loop chalega.

2. `Plain Object ({}) ⚠️:` Key-value store toh hai, lekin JS Object me `prototype pollution` ka darr rehta hai aur `methods` like `.size `ya iteration complex hote hain.

3. `JavaScript Map (new Map<string, ToolType>()) ✅ (BEST):`
   `Note:` JavaSceript mein ek Map hota hai jiski madad se hum fast lookup kar sakte hai duplication prevention check kar sakte hai and LLM schema ko export kar sakte hai
   - `Exact Key Lookup ($O(1)$):` map.get("weather_tool") millisecond ke fraction mein tool deta hai.
   - `Built-in Duplicate Prevention: `map.has("tool_name") check karna super easy hai.
   - `Direct Iteration:` Saare tools par loop chala kar LLM Schema export karna map.values() se sabse fast hota hai.

   ### Sumrize notes

   ##### Module 06.01 - Registry Fundamentals

##### Key Concepts

1. **What is a Registry?**
   - A central dictionary/store managing all agent-executable tools.

2. **Why do we need it?**
   - Decouples tool execution from hardcoded `if-else` conditionals.
   - Enables plug-and-play tool management.

3. **Registry vs Plain Array:**
   - Array requires $O(N)$ linear scans.
   - Registry provides $O(1)$ fast lookups, strict duplicate checks, and dynamic execution gates.

4. **Data Structure Choice:**
   - Standard JavaScript `Map<string, Tool>` is preferred over Plain Objects/Arrays for performance, safety, and native API iteration.

5. **Lifecycle:**
   - `Register` -> `Export LLM Schemas` -> `Safe Execute`.

**05. Real-World Architecture:**

```txt
[ Developer ] ──────►  1. Register Tools (.register(weatherTool))
                                  │
                                  ▼
                         ┌─────────────────┐
                         │  ToolRegistry   │  ◄── Stores in Map<string, Tool>
                         └────────┬────────┘
                                  │
      ┌───────────────────────────┴───────────────────────────┐
      │                                                       │
      ▼                                                       ▼
2. LLM Prompt Stage                                  3. Execution Stage
registry.getLLMSchemas()                             registry.executeTool("weather", args)
      │                                                       │
      ▼                                                       ▼
Export Schema to OpenAI/Gemini                       Validates Args -> Runs Tool -> Returns Result
```
