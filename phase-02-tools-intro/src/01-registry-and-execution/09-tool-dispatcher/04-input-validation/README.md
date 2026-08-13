**Phase 04 (Input Validation) ka main maqsad sirf itna hai:**

> Tool ke `.execute() `function ke andar ghusne se PEHLE hi, LLM ke arguments ko Zod Schema ke X-Ray machine se guzarna.Agar X-Ray machine mein dikha ki saaman ekdam sahi hai, to hi tool chalega.Agar dikha ki saaman galat hai (jaise number ki jagah text hai), to dispatcher wahin par brake laga dega, tool ko chalne hi nahi dega, aur LLM ko daant kar bolega: "Bhai, tumne amount galat bhara hai, sahi karke do!"

**🎯 Ek Line Mein Teeno Ka ConnectionPhase**

```ts
02. Tede-mede data ko ek saaf Payload mein badla.Phase
03. Us payload ke naam se asli Tool Object dhoondh kar nikaala.Phase
04. Tool ke andar baithne se pehle, us payload ke arguments ko tool ke
    Zod Schema se cross-verify (validate) kiya taaki code kabhi crash na ho.
```
