# ⚡ Phase 09: Tool Execution Engine

Bhai, is folder mein koi load lene wali baat nahi hai. Iska simple kaam hai tool ko ghadhi (Timeout) dekh kar chalana aur agar tool crash ho jaye to use safe rasta dena.

## 🛠️ Hamare 5 Pieces (No Overload Breakdown)

1. **01-contract-and-types.ts** ➔ **Rules:** Bas yeh batana ki tool ko chalanay ke liye max time (timeoutMs) kitna milega.
2. **02-timeout-and-cancellation.ts** ➔ **The Time Bomb:** Agar tool 5 second se zyada fasa raha, to use beech mein hi "Stop" (Abort) kar dena.
3. **03-error-boundary-and-isolation.ts** ➔ **The Puncture Kit:** Agar tool ke andar ka code crash ho jaye, to error ko catch karke sunder sa message banana taaki system chalta rahe.
4. **04-result-standardizer.ts** ➔ **The Timer:** Tool chalne ke baad clock check karna aur batana ki kitne Milliseconds (ms) lage.
5. **05-tool-execution-engine.ts** ➔ **The Orchestrator:** In upar ke chaaro dosto ko ek sath milakar ek `execute()` function ke andar run kar dena.

---

💡 **Elite Dev Tip:** Tool Calling dimaag hai, par Execution asli body hai. Hum yahan body ko disciplined bana rahe hain!

**Notes:**
05 tak mein to hamara tool execute ho raha hai lekin yaha `Stateless hai` yani issme memory nahi hai isko har baar regsitry mein jana padh raha hai

- to abb memroy add karege

#### 🧠 Question: Kya Tool Ka Bhi Memory Hota Hai?

`Jawab: Haan, bilkul hota hai! Aur isi ko hum "Stateful Tool Execution" bolte hain.`
Abhi tak tumne jo weather tool chalaya, wo kya tha? Stateless (Bina memory ka).
Tum use 10 baar bhi bolo ki "Delhi ka weather batao", wo har baar fresh check karega. Use pichli baar se koi matlab nahi hai.

```bash
Lekin socho agar tum ek Shopping Cart AI Agent bana rahe ho. User bolta hai:

"My Cart tool mein Apple add karo."
"Ab usme Milk add karo."
"Ab checkout karo."


Agar tool ke paas memory (State) nahi hogi,
to jab tum dusri baar Milk add karoge,
to tool purana Apple bhool jayega!
Isiliye tool ke paas apni ek memory database hoti hai jahan wo pichla data yaad rakhta hai.
```
