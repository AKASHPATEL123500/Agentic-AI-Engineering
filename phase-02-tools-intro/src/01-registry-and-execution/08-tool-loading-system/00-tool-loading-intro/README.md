# ⚡ Tool Loading System (In 1 Minute)

## 💡 Simple Reality

- **Discovery** ne hume bas address diya tha: `"D:/project/tools/weather.tool.ts"` (Sirf String).
- Lekin **Registry** string ko nahi pehchanti! Registry ko chahiye real JS Object: `{ name: "get_weather", execute: fn }`.
- **Tool Loader** wahi worker hai jo address par jata hai, file kholta hai (`await import`), aur usme se Tool Object nikal kar deta hai.

---

## 🔄 Core Flow

```text
Discovery (File Path String)
       │
       ▼
Loader Engine (await import(path))
       │
       ▼
Extract Tool ({ name, execute })
       │
       ▼
Shape Check (Is it a real tool?)
       │
       ▼
Registry.register(tool)
```

**🎯 3 Rules of Tool Loading**

1. `Dynamic Import Onl`y: Hum `import` tool from '...' nahi likhte. Path runtime par milta hai, isliye` await import(filePath)` use hota hai.

2. `Export Handling`: File chahe `export const myTool` kare ya `export default myTool`, Loader dono ko dhoondh nikalta hai.

3. `Crash Protection`: Agar koi `.tool.ts` file corrupt hai ya usme error hai, toh Loader sirf USI file ko drop karega — baaki poora system nahi phatega.
