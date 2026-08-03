Bhai **bahut mast question pucha hai**. 👍 Ye wahi concept hai jo hum Generic Tool me padh rahe the. Bas yahan thoda enterprise level code likha hua hai isliye confusing lag raha hai.

Main ise **ekdum story ki tarah** samjhata hoon.

---

# Sabse pehle pura flow dekh

```text
main()

   │
   │ execute()
   ▼

WeatherTool
   │
   │
   ├── args
   ├── context
   │
   ▼

Weather API (Mock)

   │
   ▼

Standard Response

   │
   ▼

main()
```

Bas itna hi flow hai.

---

# Step 1

Tumne likha

```ts
WeatherTool.execute(args, context);
```

Yani execute function ko **2 cheeze bhej rahe ho.**

```
1. args
2. context
```

Ab sawal

## args kya hai?

Simple language me

> **Tool ko kaam karne ke liye jo information chahiye usko args bolte hain.**

Weather Tool ko weather nikalna hai.

Usko kya chahiye?

City

Aur Unit

Bas.

```
args

{
   city:"Delhi",
   unit:"celsius"
}
```

Ye args hai.

---

# Context kya hai?

Context tool ka kaam nahi hai.

Context user ki information hai.

Jaise

```
Kaun user hai?

Admin hai?

Guest hai?

Session kya hai?

Working directory kya hai?
```

Isliye

```ts
context;
```

alag rakha gaya hai.

```
{
   userId:"101",
   role:"admin"
}
```

Ye weather nahi hai.

Ye user ki identity hai.

---

# Isliye execute me 2 parameter hain

```ts
execute(args, context);
```

Socho restaurant me gaye.

Tum waiter ko bolte ho

```
Ek Pizza dedo
```

Ye kya hua?

```
args
```

Fir waiter poochta hai

```
Table Number?
```

Ye kya hua?

```
context
```

Pizza aur Table Number alag cheez hai.

Bilkul waise hi.

---

# Ab Generic dekho

```ts
ToolType<TParams, TOutput>;
```

Ye wahi Generic hai jo humne padha.

Ab isme

```
TParams
```

matlab

Input

Aur

```
TOutput
```

matlab

Output

---

Ab dekho

```ts
ToolType<typeof weatherSchema, WeatherData>;
```

Yahan

```
TParams

=

weatherSchema
```

Aur

```
TOutput

=

WeatherData
```

Ho gaya.

---

# WeatherSchema kya hai?

Ye

```ts
const weatherSchema =
z.object({

 city

 unit

})
```

Compiler ke liye ye bol raha hai

```
Input me

city

unit

hona hi chahiye.
```

---

Fir ye line

```ts
args: z.infer<TParams>;
```

Sabse important hai.

Isko bahut easy samjho.

---

## Socho

Ye schema hai

```ts
z.object({

city:String

unit:String

})
```

Ab TypeScript bolta hai

```
Main khud hi iska type bana deta hu.
```

Aur bana deta hai

```ts
{
  city: string;

  unit: string;
}
```

Is process ko bolte hain

```
z.infer
```

Matlab

```
Schema de do

Main type bana dunga.
```

Isliye

```ts
args;
```

ka type automatically ban gaya.

Tumhe manually interface nahi likhna pada.

---

# Fir

```ts
Promise<StandardToolResponse<TOutput>>;
```

Ye dekhkar log dar jaate hain 😂

Lekin todte hain.

Sabse andar

```
TOutput

=

WeatherData
```

To ye ban gaya

```
StandardToolResponse<
WeatherData
>
```

Fir

StandardToolResponse

ke andar

```ts
data: TData;
```

Tha.

Ab

```
TData

=

WeatherData
```

Ho gaya.

To final ban gaya

```ts
data: WeatherData;
```

Bas.

---

# Matlab execute ka final form kya bana?

Compiler ke dimaag me

Ye

```ts
execute(args, context);
```

Actually ban gaya

```ts
execute(

args:{

city:string

unit:"celsius"|"fahrenheit"

},

context:ToolContext

)

:

Promise<{

success:boolean

data:WeatherData|null

error:...

meta:...

}>
```

Ye hai actual function.

Generic gayab ho gaya.

Sab replace ho gaya.

---

# Ab main()

Jab tumne likha

```ts
WeatherTool.execute(
{
city:"Delhi",

unit:"celsius"

},
...
)
```

Compiler check karta hai

```
City hai?

✔

Unit hai?

✔
```

Pass.

---

Agar likho

```ts
WeatherTool.execute({

name:"Delhi"

},...)
```

Compiler

❌

```
city missing
```

---

Agar likho

```ts
unit: "abc";
```

Compiler

❌

```
Allowed only

celsius

fahrenheit
```

---

# Output

Tumne return kiya

```ts
return{

success:true,

data:mockData,

error:null,

meta:...
}
```

Compiler check karta hai

```
success hai?

✔

data WeatherData hai?

✔

meta hai?

✔

error hai?

✔
```

Sab sahi hai.

---

# Pura Architecture

```text
                    WeatherTool

            ToolType<TParams,TOutput>

                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼

TParams                 TOutput

weatherSchema           WeatherData

        │                         │
        ▼                         ▼

args               StandardResponse<WeatherData>

        │
        ▼

execute(args,context)

        │
        ▼

Weather Logic

        │
        ▼

Return Response

        │
        ▼

main()

console.log(result)
```

## Ye sab dekhkar ek line yaad rakhna:

- **`TParams` batata hai tool ko kya input milega.**
- **`z.infer<TParams>` us input ka TypeScript type automatically bana deta hai.**
- **`TOutput` batata hai tool kya data return karega.**
- **`StandardToolResponse<TOutput>` us returned data ko ek standard format (success, data, error, meta) me wrap kar deta hai.**

Ye wahi Generic Input/Output concept hai jo hum padh rahe the, bas is code me usko enterprise level par apply kiya gaya hai.
