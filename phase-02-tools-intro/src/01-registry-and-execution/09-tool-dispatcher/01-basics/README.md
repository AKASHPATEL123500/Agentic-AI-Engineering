## Tool Dispatcer

**WithOut Dispatcer**

LLL JSON ----> Direct Execution
`Problem`:

- Ager LLM ne galat JSON format send kar diya to , tool nahi milgea and isse pura pplication carsh ho jayega to issi problem ko dispatcer solve karta hai

- Tool diptacher jo hai uska kaam hai tool ko kise execute karwaye

**With Dispatcer**
LLM JSON --> Dispatcer( validate, context ,permission check, and etc) --> execution

```ts
1. Simple sa mtlb hai ki Tool Dispatcer pura ek kernal hai
2. Jab LLM Sochta hai ki usko koi kaam karne ke liye tool chiye to
3. Tab Dispatcer active hota hai
4. Yaha LLM ke JSON ya TEXT data ko real execution mein badlat hai
================================================================
Exmaple:
1. LLM ek req karta hai ki usko weather check karna hai
2. LLM Data deta hai city: "Dheli"
3. Abb dispatcer ek postman ki tarh hai waha check karta hai ki
4. kya aisa koi tool hai jo city name le and whather nikal ke de
5. Dispater uss tool ko call karta hai and DATA nikalta hai
6. uske baad LLM ko wapas de deta hai
7. mtlb disptacre ek bridge ki trah kaam kar raha hai
8. mtlb LLM ke har ek QEUERY ka response ye khud find kar ke le ata hai
```

### 2. Tool Call Lifecycle (Step-by-Step Flow)

Ek single tool call shuru se khatam hone tak in 5 phases se guzarti hai:

```ts
[LLM Request] ➔ [1. Resolve & Find] ➔ [2. Validate Inputs] ➔ [3. Inject Context] ➔ [4. Safe Execute] ➔ [5. Format Response]
```

```ts
1. `Resolution Phase:` Find karo ki jo tool managa gaya hai waha hamare system ya `Tool Registry` mein hai ki nahi to ye first pahse hai iska kaam yahi tool ko check karna
2. `Validation Phase:` Iss Phase mein hum LLM jo input send karta hai hum usko validate karte hai ki sahi format mein hai ki nahi
3. `Context Injection:` Background information (jaise User ID ya API Key) chupke se tool ko dena, jo LLM ko nahi dikhni chahiye.
4. `Execution Phase:` Tool ke actual code ko ek safe environment mein chalana (with a stopwatch/timeout taaki system hang na ho).
5. `Standardized Return:` Tool jo bhi output de (error ya success), use ek clean format mein convert karke LLM ko wapas dena.
```

---

### ⚔️ 3. Registry vs Loader vs Dispatcher (Kaun Kya Karta Hai?)

In teeno components ke roles bilkul alag hain, inme confuse nahi hona hai:

1. `Tool Registry (The Phonebook):` Yeh sirf ek list ya database hai. Isme likha hota hai ki kaun-kaun se tools hamare paas hain aur unka kya kaam hai. Iske paas apna koi dimag nahi hota.
2. `Tool Loader (The Delivery Boy):` Jab dispatcher bolta hai ki "Mujhe Tool X chalana hai", tab Loader us tool ki file ya code ko hard disk/network se utha kar server ki active memory (Bun Runtime) mein load karta hai.
3. `Tool Dispatcher (The Boss/Kernel):` Yeh poori process ko control karta hai. Yeh Registry se check karta hai, Loader se code mangwata hai, aur use safely execute karta hai.

---

### Kyu Hum Tool Dispatcher Ko Itna Detail (8 Topics) Mein Padh Rahe Hain?

Agar hum ek basic dispatcher banayein to wo 10 line ke code mein ban jayega. Lekin hum ek Production-Grade Agent bana rahe hain jo real-world mein crash na ho. Isliye humne ise 8 details mein divide kiya hai. Niche iska bird's-eye view (Overview) hai:

**1. Fundamentals (Jo hum abhi padh rahe hain)**
`Kyu zaroori hai?:`
System ka sahi mental model aur architecture dimaag mein clear karne ke liye.
**2. Tool Call Contract**
`Kyu zaroori hai?:`
LLM alag-alag format mein data bhej sakta hai (kabhi string, kabhi object). Yeh phase LLM ke raw data ko ek strict standardized format (Contract) mein badalta hai.

**3. Tool Resolution**
`Kyu zaroori hai?:` Agar LLM ne kisi aise tool ka naam le diya jo exist hi nahi karta, ya spelling mistake kar di, to hamara agent crash nahi hona chahiye. Yeh us '404 Not Found' error ko gracefully handle karta hai.
**4. Input Validation**
`Kyu zaroori hai?:` Security aur reliability ke liye. Agar tool ko email address chahiye aur LLM ne random text bhej diya, to Zod Schema use execution se pehle hi rok dega taaki backend database ya API crash na ho.

**5. Execution Context**
`Kyu zaroori hai?: `Har tool ko chalne ke liye background data chahiye hota hai (jaise kis user ne request ki, current folder konsa hai). Yeh phase bina LLM ko pareshan kiye automatic system data inject karta hai.
**6. Permission and Safety**
`Kyu zaroori hai?:` Taaki agent aapke computer ki saari files delete na kar de! Kuch dangerous tools (like delete_database) chalne se pehle user ka Human-in-the-loop (Approval) maangenge.
**7. Execution Engine**
`Kyu zaroori hai?:` Agar koi tool kisi heavy loop mein fass gaya ya third-party API down hai, to agent infinite loop mein fass jayega. Yeh engine Timeout aur Cancellation handles provide karta hai.

**8. Dispatcher Service**
`Kyu zaroori hai?:` Sab chizo ko ek single TypeScript Class mein assemble karna, Events emit karna (taaki UI par dikhe ki dispatcher abhi kya kar raha hai), aur production logs maintain karna.

**Note:**

> Aapne jo Guard aur Room ka analogy diya hai, wo 100% accurate aur ekdam perfect hai! Tool Dispatcher sach mein us rigid guard ki tarah hi hai jo har input ko check karta hai, format thik karta hai, aur phir hi room ke andar (execution environment mein) jaane deta hai. Is mental model se aapko aage ka architecture samajhna aur bhi aasan ho jayega.
