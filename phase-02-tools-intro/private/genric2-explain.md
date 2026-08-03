Bhai ye sunkar mujhe bhi accha laga. 😄

Aur sach bataun, **Generic ka sabse bada problem yehi hai** ki log usko `T`, `U`, `K`, `V` se padhana shuru kar dete hain. Phir dimaag me bas syntax reh jaata hai, **data ka flow kabhi samajh hi nahi aata**.

Ab se hum ek rule follow karenge.

> **Har concept ko pehle Data Flow se samjhenge.**
>
> Phir TypeScript dekhenge.
>
> Phir AI Agent me uska use dekhenge.

Kyunki AI Engineering me asli cheez **data ka safar (journey)** hai.

---

# Chalo ab Chapter-07 continue karte hain.

## Part-3 : Generic Constraints (`extends`)

Ab tak humne dekha:

```ts
interface Tool<Input, Output> {
  execute(input: Input): Output;
}
```

Yahan `Input` kuch bhi ho sakta hai.

Ye bhi valid hai:

```ts
Tool<number, string>;
```

Ye bhi:

```ts
Tool<boolean, number>;
```

Ye bhi:

```ts
Tool<Date, string>;
```

Lekin ek AI Agent me har tool ka input lagbhag **object** hi hota hai.

Jaise:

```ts
{
  city: "Delhi";
}
```

Ya

```ts
{
  path: "/home/file.txt";
}
```

Ya

```ts
{
  query: "What is AI?";
}
```

Koi bhi tool aisa nahi hota:

```ts
execute(10);
```

ya

```ts
execute(true);
```

To hum TypeScript ko bolte hain:

> **"Input kuch bhi mat hone dena. Sirf Object hi allow karna."**

Isi ka naam hai **Generic Constraint**.

---

## Data Flow

Without Constraint

```text
Generic Input

        │

        ▼

Number ✅

String ✅

Boolean ✅

Object ✅

Date ✅
```

Matlab sab allowed.

---

With Constraint

```text
Generic Input

        │

        ▼

Object ✅

Number ❌

Boolean ❌

String ❌
```

Ab sirf Object allowed.

---

## Syntax

```ts
interface Tool<Input extends object, Output> {}
```

Yahan

```ts
Input extends object
```

ka matlab inheritance nahi hai.

Yahan iska matlab hai:

> **Input ko object family ka member hona chahiye.**

---

### Example

Ye chalega:

```ts
type WeatherInput = {
  city: string;
};
```

Kyuki ye object hai.

---

Ye bhi chalega:

```ts
type ReadFileInput = {
  path: string;
};
```

---

Lekin ye nahi chalega:

```ts
Tool<number, string>;
```

Compiler bolega:

❌ Number object nahi hai.

---

# Ab tumhare Weather Tool me ye dekho

```ts
TParams extends z.ZodObject<z.ZodRawShape>
```

Isko todte hain.

Pehle `extends` samjho:

```
TParams

        │

        ▼

Sirf ZodObject allowed
```

Matlab

Agar koi likhe:

```ts
ToolType<string, WeatherData>;
```

Compiler bolega:

❌ Allowed nahi.

---

Lekin ye chalega:

```ts
const weatherSchema = z.object({
  city: z.string(),
});
```

Kyunki `weatherSchema` ek **ZodObject** hai.

Isliye tumhare code me constraint laga hua hai ki:

> "Har tool ka input schema Zod Object hi hona chahiye."

Ye bahut smart design hai. Isse koi galti se string, number ya random type pass nahi kar sakta.

---

# AI Agent me iska fayda

Socho kal tumhare paas 100 tools hain.

Agar kisi ne galti se likh diya:

```ts
ToolType<number, string>;
```

To poora architecture toot sakta hai.

Lekin constraint ki wajah se compiler wahi rok dega.

Isliye production code me **constraints bahut common hain**.

---

# Aaj ka takeaway

Ek line yaad rakhna:

- **Generic** = "Baad me type batana."
- **Generic Constraint (`extends`)** = "Baad me type batana, lekin meri conditions ke andar."

Ye dono alag concepts hain, aur enterprise TypeScript me dono lagbhag hamesha saath use hote hain.

---

## Agla Part

Ab hum **`z.infer`** start karenge.

Mujhe lagta hai ye tumhare liye bahut interesting hoga, kyunki tumne apne Weather Tool me use kiya hai. Main usko bhi **data flow** ke through samjhaunga ki schema se type kaise "janam leta hai" aur TypeScript usko automatically kaise infer karta hai. Ye concept samajh gaya, to tum future me apne AI Agent ke saare tools bina duplicate type likhe bana paoge.
