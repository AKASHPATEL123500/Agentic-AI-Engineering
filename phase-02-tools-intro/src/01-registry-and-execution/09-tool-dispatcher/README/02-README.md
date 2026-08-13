**02-tool-call-contract par.**
Is phase ka main maqsad yahi hai ki LLM jo bhi tedi-medi ya unformatted request bhejta hai, hum use apne system ke mutabik ekdum strict aur clean contract mein fix kar dein.

**04-tool-call-structure**
`Problem:`

- Alag-alag LLM providers `(jaise OpenAI, Anthropic, ya Local Ollama)`
- tool call ka data alag-alag tarike se bhejte hain. Koi use `function_call` bolta hai,
- koi `tool_calls` ke andar array bhejta hai.

`Solution:`

- Hamare dispatcher ke andar enter hote hi,
- hum us request ko ek standard TypeScript Interface (Structure) mein fit kar dete hain.

Hamare system ke liye standard structure sirf itna hoga:

```ts
interface ToolCallRequest {
  id: string; // Har call ki ek unique ID (OpenAI/Anthropic ke response track karne liye)
  name: string; // Tool ka exact naam (e.g., "fetch_user_data")
  arguments: any; // Wo inputs jo LLM ne bheje hain (JSON object)
}
```

**05-tool-name-and-arguments**
`Core Concept:`
Ek valid tool contract ke liye two vital things hoti hai jise

1. Name = hum name ko ek proper string banate hai
2. Argumnets = ek valid args mein convert karte hai taki tool ke hisab se sahi ho
   bass.

`argumnets note:` jab bhi llm input deta hai ek stringfy mein hota hai to usko humne `JS Object` mein convert karna oadta hai jise `JSON.parse(data)`

**06-tool-call-normalization**
Normalization = ka mtlb hai ki sabko ek baraber karna
jise = LLM Input`(Weather-tool)` to isko normalize karke `(weather_tool)` mein badlna hi normalization hai

##### 📝 Summary of Phase 02

> Simple sa mtlb hai ki LLM chche jisa input de hamara ye grud usko ek dam standard format mein badal dega

---

## Bhai, ekdam solid tarika hai! Agle phase par jaane se pehle pure Phase 02 (Tool Call Contract) ka ek single page par quick summary aur file blueprint dekh lete hain taaki poora concept dimaag mein hamesha ke liye lock ho jaye.

## 📦 Phase 02 Summary: Tool Call Contract (The Guard Machine)## 🎯 Main Objective (Asli Maksad)

## LLM (OpenAI, Claude, Gemini) se aane wale tedi-medi, gandi ya alag-alag format ki requests ko ek strict TypeScript Contract (ToolCallPayload) mein badalna, taaki hamara dispatcher hamesha clean aur predictable data par kaam kare.

## 🗂️ File Layout (Aapke project mein yeh 3 files hain)

Aapne is phase ko jin 3 files mein divide kiya hai, unka exact kaam yeh hai:

## 📁 04-tool-call-structure.ts (The Blueprint File)

- Isme kya hai?: Isme sirf do main TypeScript Interfaces hain (RawLLMToolCall aur ToolCallPayload).
- Kaam: Yeh system ke rules set karti hai. RawLLMToolCall batata hai ki LLM se kaisa bhi data aa sakta hai, aur ToolCallPayload batata hai ki saaf hone ke baad data kaisa dikhna chahiye.

## 📁 05-tool-name-and-arguments.ts (The Extraction File)

- Isme kya hai?: Isme extractNameAndArgs() function hai.
- Kaam: Yeh LLM ke raw data ka bag kholti hai. OpenAI ke .function.name ya Claude ke .input ke andar se chun-chun kar Call ID, Name, aur Arguments ko bahar nikalti hai. Agar arguments string mein hain, to unhe JSON.parse karke JavaScript object banati hai.

## 📁 06-tool-call-normalization.ts (The Polishing File)

- Isme kya hai?: Isme normalizeToolCall() function hai.
- Kaam: Yeh final finishing touch deti hai. Naam ke aage-piche se spaces hatati hai (trim()), use lowercase karti hai, aur agar LLM ne tool ka koi nickname bhej diya hai, to use Alias Map (Dictionary) ki madad se badal kar hamare system ka Asli Naam de deti hai.

---

## 🔄 Data Ka Transformation Flow

[RawLLMToolCall (Teda-Meda Kachra)]
│
▼ (05: extractNameAndArgs) -> IDs, Strings parsed to Objects
[Extracted Name & Args]
│
▼ (06: normalizeToolCall) -> trim(), lowercase(), Alias resolution
[ToolCallPayload (VVIP Cleaned Sona)] ✅

---
