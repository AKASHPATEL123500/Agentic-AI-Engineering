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
