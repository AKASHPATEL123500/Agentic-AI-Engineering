## Tools

```bash
1. Tool ek Worker (Majdoor/Employee) hai.
2. Lekin wo bina kisi Rules/Identity Card ke
3. company mein nahi aa sakta.
4. Uska pehle poora Blueprint (Identity Card + Job Description) banta hai,
5. taaki Boss (AI Agent) ko pata rahe ki:
6. "Ye banda kya kaam karta hai,
7. isse kaam karwane ke liye kya dena padega,
8. aur iska kaam lene ke liye kaun si button dabani padegi."
```

### 1. Tool Anatomy & Contract Protocol

```bash
1. Issame hum worker ka interface banate hai.
2. Ki ek worker ka naam kya hi,
3. description kya hai
4. aur kaam karnae ke liye kise kaam dena hai
5. All in All hum worker ki pura blueprint yani interface banate hai issme

Context:
1. Issme hum ye bhi batate hai ki
2. Ye kaam kiss user ID ke liye ho raha hai,
3. Basic info dete hai user ka
4. worker ko extra batein pata honi chiye
6. issi ko context bolte hai tools ka
```

### 2. Strict Schema Validation & Type Safety

`Easy lang:`

- Yaha ek gaurd ki trah kaam karta hai
- jise user ne number ki 2 jaagh string de diya "2"
- to iss case mein yaha strictly usko rok deta hai
- ander nahi ane deta hai bina correct input ke

### 3. Dynamic Tool Registry Engine

`Easy lang:`

- Issme sare tool ki list hoti hai
- jise agent ko pata chalta hai ki ye-ye tool avilable hai mere pass
- exapmle tools:
  - read-file
  - write-file
  - web-search
  - calculator
  - And more....

### 4. Tool Dispatcher & Multi-Call Execution

- Yaha ek manager ya supervoisr hota hai.
- jab agent bolta hai 2 num ka multiply karo to
- Dispacther uss specfic tool ko find kar ke kam karwata hai
- agr agnrt ek sath two kaam de. de jise "weather batao and usko 2 se add kar do"
- To dispatcher tool ko find karta hai and dono tool ko ek sath
- Parallel mein kaam karwane lagta hai
- To all in all yaha ek manager hai jo manage karta hai kaam karnwane ke liye

### 5. Production Safety, Sandboxing & Resilience

`Aasan Bhasha Mein: Emergency Brakes & Safety Helmet.`

- **Timeout**: Agar koi Worker kaam karte-karte phans gaya, toh 10 second baad use zabardasti rok do.
- **Approval Gate**: Agar Worker koi Khatarnak kaam karne ja raha hai (jaise file delete karna), toh pehle Owner (Aap) se puchhega: "Bhai, kar du delete? (Yes/No)".

### 🔍 Deep-Dive: Execute Ka Syntax Kyun Aur Kya Hai?

```bash
Ab aate hain tere us doubt par: "Execute ka syntax kya hai aur samajh nahi aaya."

Ise TypeScript ke complex logic se hatakar, apni aam bhasha mein dekhte hain.

Real Life Analogy:
Ek Machine ki baal ki khaal nikalo. Machine mein kya hota hai?

Model Name: "Juicer Mixer"

Usage Instructions: "Phal dalo aur juice nikalo"

Power Button (Execute): Jab tak tum Button nahi dabaoge, machine chalege nahi!

TypeScript mein Function bhi ek variable/property ki tarah kisi object ke andar baith sakta hai. Usi Function (Power Button) ka naam humne execute rakha hai!

Syntax Ko Tod Kar Dekho:
TypeScript
// Ek Tool Ka Object (Machine)
const myTool = {
  name: "add_numbers",
  description: "Do numbers ko jodta hai",

  // YE HAE EXECUTE! Ye basically ek Function hai jo actual kaam karta hai
  execute: async (args) => {
    // args = jo data LLM bhejega (e.g. { a: 10, b: 20 })
    return args.a + args.b;
  }
};
Iska Matlab Kya Hua?
execute: 👈 Ye Object ki ek Chabi (Key) hai.

async (args) => { ... } 👈 Ye actual Function hai jo execute hoga jab Agent is tool ko chalayega.

Jab Agent bolega:
myTool.execute({ a: 5, b: 5 })
Toh basically wo us tool ka Power Button daba raha hai aur result le raha hai (10).

Batao, kya 0.0 Tool Basics aur execute ka real matlab/syntax dimaag mein baith gaya?
```

Ekdum solid! 1.1 par jaane se pehle pure `0.0 Tool Basics` ka quick **Summary Brief** revise kar lete hain, taaki aage code likhte waqt dimaag mein zero confusion rahe.

---

### 📌 Summary Brief: `0.0 Tool Basics`

1. **Tool Kya Hai?**

- Tool AI Agent ka ek **Worker / Employee** hai.
- LLM khud sirf baatein (text) bana sakta hai, lekin actual kaam (file padhna, math karna, API call karna) ye Worker karta hai.

2. **Blueprint (Interface) Kyun Chahiye?**

- Tool bina Identity Card ke nahi ban sakta.
- Agent ko samajhne ke liye har Tool ke paas **3 Main Attributes** hote hain:
- **`name`**: Identity / Naam (Search karne ke liye).
- **`description`**: Kaam ki detail (LLM ko batane ke liye ki kab use karna hai).
- **`execute`**: Power Button (Actual TypeScript function jo trigger hota hai).

3. **`execute` Function Ka Simple Meaning:**

- `execute` bas tool ke andar chhupa hua wo **Start Button** hai jisme hum `args` (LLM ka input) bhejte hain, aur wo real logic run karke result wapas return karta hai.

4. **Pure Subsystem Ka Flow:**

- `LLM (JSON command bhejta hai)` ➔ `Dispatcher (Tool dhundta hai)` ➔ `Execute (Button dabata hai)` ➔ `Result (LLM ko wapas milta hai)`.

---

Summary ekdum clear hai! Ab batao, `README.md` mein **1.1 Standard Interface Design** ka folder aur code apni local bhasha mein ek-ek line samajhte hue shuru karein?
