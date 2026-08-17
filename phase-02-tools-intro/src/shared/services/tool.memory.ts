// import type { ToolMemory } from "./types.ts";

// export class ToolMemorys implements ToolMemory {
//   // 💡 STATIC MAP: Ab ye poore application mein sirf EK hi rahega, data kabhi lose nahi hoga!
//   private static store = new Map<string, Record<string, any>>();

//   set(sessionId: string, data: Record<string, any>): void {
//     ToolMemorys.store.set(sessionId, data);
//   }

//   get(sessionId: string): Record<string, any> {
//     // Agar is session ka data nahi hai, to pehle ek khali object initialize karo
//     if (!ToolMemorys.store.has(sessionId)) {
//       ToolMemorys.store.set(sessionId, {});
//     }
//     // 🔥 FIX: Real stored data return karo, na ki nakli { sessionId }!
//     return ToolMemorys.store.get(sessionId)!;
//   }

//   clear(sessionId: string): void {
//     ToolMemorys.store.delete(sessionId);
//   }
// }
