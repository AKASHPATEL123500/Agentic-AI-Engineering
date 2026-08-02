Bhai chal bilkul zero se shuru karte hain. Generics samajhna hai to pehle **bina generic** wala problem dekhte hain, phir generic se solve karenge.

## Step 1: Problem — bina generic

Maan le tu ek function banata hai jo koi bhi value le kar wahi return kare (identity function):

```ts
function identity(value: any) {
  return value;
}

const a = identity(5); // TypeScript ko pata nahi ye number hai
const b = identity("hello"); // TypeScript ko pata nahi ye string hai
```

Yaha `any` use kiya to type-safety gayi. `a.toUpperCase()` likhega to TypeScript error nahi dega (kyunki `any` hai), lekin runtime pe crash karega kyunki `a` number hai.

## Step 2: Generic se fix karo

```ts
function identity<T>(value: T): T {
  return value;
}

const a = identity(5); // TypeScript samajhta hai: T = number, toh 'a' ka type = number
const b = identity("hello"); // T = string, 'b' ka type = string
```

Yaha `<T>` ek **placeholder** hai. Jab tu function **call** karta hai, TypeScript dekhta hai tune kya value diya, aur `T` ko usi se **fill** kar deta hai. Isko bolte hain **type inference**.

- `identity(5)` → TypeScript bolta hai "ohh, `T` yaha `number` hai" → return type bhi `number` ban gaya
- `identity("hello")` → `T = string` → return type `string`

Ab agar tu `a.toUpperCase()` likhega, TypeScript turant error dega: _"number pe toUpperCase nahi chalta"_ — kyunki usko pata hai `a` number hai.

## Step 3: Do generic values connect karna (yehi tera asli confusion hai)

Ab thoda tera use-case ke paas chalte hain. Maan le function hai jo ek "schema" leta hai aur us schema ke hisaab se data return karta hai:

```ts
function checkData<T>(schema: SomeSchema<T>, data: unknown): T {
  return schema.parse(data);
}
```

Yaha dekh — `T` sirf ek jagah define nahi hota, balki **do jagah use** hota hai:

1. Pehle argument (`schema`) ke andar
2. Return type mein

Matlab: **jo schema doge, wahi T decide karega, aur return type bhi wahi T hoga.** Ye "connection" hi generics ki asli taqat hai — ek jagah type decide hota hai, aur wo type pura function mein carry hota hai.

## Step 4: Ab tera `ToolType` interface

```ts
export interface ToolType<
  TParams extends z.ZodObject<z.ZodRawShape> = z.ZodObject<z.ZodRawShape>,
> {
  name: string;
  description: string;
  parameters: TParams;
  execute: (args: z.infer<TParams>, context?: ToolContext) => Promise<unknown>;
}
```

Isko function jaisa hi socho, bas ye ek **shape/blueprint** hai (interface), function nahi.

- `TParams` — placeholder, jo "tool banane waala" khud decide karega
- `parameters: TParams` — jo bhi schema `TParams` mein aayega, wahi `parameters` field ka type hoga
- `execute: (args: z.infer<TParams>, ...)` — `args` ka type automatically **`TParams` schema se nikala** jayega (`z.infer` ka kaam hi ye hai — schema se real TypeScript type nikalna)

**Yehi connection hai jo pehle wale `checkData` example mein bhi tha** — jo schema tu doge, uska effect interface ke andar **do jagah** dikhega: `parameters` field mein, aur `execute` ke `args` mein.

## Step 5: Ab `writeFileTool` wali line

```ts
export const writeFileTool: ToolType<typeof writeFileSchema> = { ... }
```

Yaha `typeof writeFileSchema` ka matlab hai: "us schema ka **type** nikalo jo maine `writeFileSchema` variable mein banaya tha" (na ki uski value, uska type).

Toh ye jo tu likh raha hai:

```ts
ToolType<typeof writeFileSchema>;
```

Iska matlab hai: **"TParams = writeFileSchema ka type"**. Bas — jaise `identity(5)` mein `T = number` fill hua tha, waise hi yaha tu manually `TParams` ko fill kar raha hai `writeFileSchema` ke type se.

Uske baad TypeScript automatically:

```ts
parameters: writeFileSchema; // TypeScript check karega ye shape match kare
execute: (
  args: {
    path: string;
    content: string;
    mode: "overwrite" | "append";
    encoding: "utf-8" | "ascii" | "base64";
  },
  context?,
) => Promise<unknown>;
```

— `args` ka type khud-ba-khud tere schema ke fields (`path`, `content`, `mode`, `encoding`) ban jayega, kyunki `z.infer<TParams>` ne `TParams` (= `writeFileSchema` ka type) se real object type nikal liya.

## Ek line mein pura sirr

> Generic ek **khali dabba** hai jo function/interface define karte waqt khaali rehta hai, aur jab koi usko **use** karta hai (call karta hai ya extend karta hai), tab wo dabba **fill** hota hai — aur jaha jaha bhi wo dabba (`T` / `TParams`) use hua tha, sab jagah wahi filled type apply ho jata hai.

Tere case mein: `writeFileSchema` ne dabba fill kiya → `parameters` aur `args` dono ko wahi shape mil gayi, automatically, bina tujhe manually type likhe.

## Samajh aaya bhai? Koi part dobara clear karna ho batana.

### Aaj ka 02 wrap-up

Tune cover kar liya:

✅ Context kya hota hai aur kyu chahiye (safety + info)
✅ Real tool banaya (deleteFileTool) jisme context use hota hai
✅ Role-based permission check (guest block)
✅ Path traversal vulnerability practically discover ki
✅ Fix bhi samjha (resolve + startsWith)
✅ Ek extra field (dryRun) explore kiya, uska future use-case bhi pata chal gaya
