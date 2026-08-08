### 🔗 Teeno Components Ka Ek-Ek Line Mein Connection

```ts
`Discovery to Loader`: Discovery disk se File Paths (string[]) dhoondh kar Loader ko deti hai.
`Loader to Registry`: Loader un paths ko open karke JS Objects banata hai aur unhe Registry me insert/register kar deta hai.
`Registry to LLM`: Registry un saare registered tools ka JSON Schema LLM Agent ko pakda deti hai taaki Agent unhe use kar sake.
```

### 🔄 User Query Aane Par Poora System Kaise Kaam Karta Hai? (End-to-End Flow)

> Ab dekhte hain ki jab koi user query karta hai, toh piche background me yeh teeno aur LLM milkar kaise kaam karte hain. Isko hum 2 Phases (Hisson) me samajhte hain: Startup Phase (App shuru hote waqt) aur Runtime Phase (User ke message aane par).

```ts
1. Phase 1: Startup Phase (Jab System On Hota Hai)
`Discovery Ka Kaam`: System start hote hi Discovery Engine poore project folder me ghoomta hai. Wo fs.promises ka use karke weather.tool.ts aur calculator.tool.ts dhoondhta hai aur ek list banata hai: ["/path/weather.tool.ts", "/path/calculator.tool.ts"].
`Loader Ka Kaam`: Loader is list ke har ek path par jata hai, dynamic import() chalata hai, aur unke andar se JSON Schema aur executable function nikaal kar live JavaScript objects taiyar karta hai.
`Registry Ka Kaam`: Loader in objects ko Registry ko deta hai. Registry apne memory Map (database) me likh leti hai: {"get_weather": weatherObject, "calculate": calcObject}.Ab hamara system poori tarah ready hai aur user ke query ka wait kar raha hai.
```

```ts
Phase 2: Runtime Phase (Jab User Query Karta Hai)

[User Query] ──> "Delhi ka mausam kaisa hai?"
                        │
                        ▼
            ┌──────────────────────┐
            │    1. LLM AGENT      │ <─── (Registry ne pehle hi saare Schemas bhej diye hain)
            └──────────────────────┘
                        │
       (LLM bolta hai: "Mujhe 'get_weather' tool chalana hai, city='Delhi' ke liye")
                        │
                        ▼
            ┌──────────────────────┐
            │   2. TOOL REGISTRY   │ ───> (Apne Map me 'get_weather' dhoondhti hai)
            └──────────────────────┘
                        │
           (Registry tool ka actual execute() function run karti hai)
                        │
                        ▼
            ┌──────────────────────┐
            │ 3. TOOL EXECUTION    │ ───> (Weather API se data lekar aata hai: "25°C, Sunny")
            └──────────────────────┘
                        │
                        ▼
 [User Response] <── "Delhi me dhoop nikli hai aur temperature 25°C hai."
```

Notes: Discovery ka simple matlab hai: "Disk scan karo, paths ki array banao, Loader ko pakdao."
