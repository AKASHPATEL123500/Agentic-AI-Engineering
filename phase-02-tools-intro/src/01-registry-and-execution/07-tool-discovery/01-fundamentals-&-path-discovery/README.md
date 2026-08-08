## 01. What is Tool Discovery & Architecture (Mental Model & Pipeline Scope)

```bsah
this is tool discovery that work is
File System scan karke SIRF File Paths dhoondhna
```

> Discovery ka sole purpose SIRF File Paths Array return karna hai, aur kyun hum file ko yahan import nahi kar rahe?

---

**Notes:**

> Tool Discovery ka kaam hai project ke andar jitne bhi tools pade hain unhe automatically dhoondhna aur unki list banana.

> Discovery ka matlab: File system (disk) me se kaam ke tools ko dhoondhna aur unki location (file path) pata lagana

---

**Problem kya thi?**

> Abhi tum ye kar rahe ho:

```ts
import { weatherTool } from "./tools/weather";
import { fileTool } from "./tools/file";
import { shellTool } from "./tools/shell";

registry.register(weatherTool);
registry.register(fileTool);
registry.register(shellTool);
```

**Note:**

> Aie hi 100 tool ho jauye to humne 100 bar import karna poadega and regsityr ko 100 times regitser karn padega yahi sabse main problem hai

**Tool Discovery kya karta hai?**

> Wo bolta hai:
> "Main khud folder scan karta hu."

```ts
tools / weather.tool.ts;
shell.tool.ts;
read.tool.ts;
write.tool.ts;
git.tool.ts;
docker.tool.ts;
```

Discover:

```ts
Scanning...

✔ weather.tool.ts
✔ shell.tool.ts
✔ read.tool.ts
✔ write.tool.ts
✔ git.tool.ts
✔ docker.tool.ts
```

Ab uske paas sirf list of files hai.

```ts
[weather.tool.ts, shell.tool.ts, read.tool.ts];
```

> Abhi tool load nahi hua.
> Sirf mila hai.

**Discovery kya return karta hai?**

> Discovery Tool nahi return karta.
> Discovery return karta hai `File Path` ko return karta hai

Example:

```
[
 "/tools/weather.tool.ts",
 "/tools/read.tool.ts",
 "/tools/git.tool.ts"
]
```

> Bas yahi iska kaam katam
> mtlb yaha tools ko find karega and ek array list baneyga sabko and uske baat yaha file path ko retrun karta hai dicorvery

### 02 Discovery Mechanism Kya-Kya Solve Karta Hai? (The 3 Core Architectures)

1. File Path Resolution Architecture
   Jab Agent start hota hai, toh Discovery Engine jaata hai /tools directory mein. - Wo Recursive Directory Walking karta hai (yani /tools/finance/pay.tool.ts jaise sub-folders ke andar bhi jaata hai).
