**📁 05-execution-context**

- Pichle phase (Phase 04) mein humne LLM se aaye hue data ko filter aur validate kar liya.
- Hamare paas ekdam saaf `city` aur `unit` aa chuka hai.
- Lekin ab hume ek aur sabse bada architectural problem thik karna hai.
- Tumne jo apna weather tool likha tha, usme ek strict check lagaya hua hai

```ts
if (!context.sessionId || !context.userId) {
  // Return UNAUTHORIZED ACCESS error
}
```

> Ab sochne wali baat yeh hai ki LLM ko kaise pata hoga ki current user ki userId kya hai? Ya fir server ki workingDir kya hai? LLM yeh data kabhi nahi bhej sakta, aur security ke liye hume use batana bhi nahi chahiye!

**Is phase ka asli maqsad yahi hai:**

> LM se sirf tool chalane ka data (args) lena, aur system ke andar se chupke se secure data (ToolContext) banana, aur dono ko jodkar tool ko dena."

```txt
[Phase 04 (Validation)] ──► Validated Args Ready: { city: "delhi", unit: "celsius" }
                                                  │
                                                  ▼
[Phase 05 (Context Engine)] ──► Auto-injects system data:
                                { userId: "user_99", sessionId: "sess_123", role: "admin", workingDir: "D:/app" }
                                                  │
                                                  ▼
[The Grand Execution]   ──► tool.execute(cleanArgs, toolContext) ✅ PERFECT MATCH!
```

**Note**

> Phase 05 ka 100% maqsad sirf aur sirf system se security data (Context) utha kar tool ke andar automatic inject karna hi tha. Koi extra load nahi!
