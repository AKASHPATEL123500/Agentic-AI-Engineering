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
