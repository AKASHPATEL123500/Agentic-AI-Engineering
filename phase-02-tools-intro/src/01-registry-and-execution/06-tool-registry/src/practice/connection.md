Connection and purpose map — easy Hinglish

Goal: Iss file ka maksad hai `practice` folder ke files ka relation aur kaam simple language mein batana, taaki samajh aaye ki kaunsa file kya karta hai.

Top-level overview (one-line each):

- `registry.tools.ts`: Main tool registry class — tools ko register, get, has, list, unregister, export/import handle karta hai.
- `tools.ts`: Example tools (jaise `getWatherTool`) — actual tool definitions and `execute` functions.
- `meta.respone.ts`: Tool execution metadata generator — ek chhota helper jo execution details banata hai (executionTime, timestamps, tool info).
- `types.ts`: Shared TypeScript types/interfaces (ToolType, ToolContext, response shapes).
- `strict.validation.ts`: Tool input & metadata validation rules (zod schema presence, metadata fields).
- `version.check.ts`: Compare karne ka logic — newer version check for overwrite.
- `presistence.ts`: Export/import helper — registry ko JSON mein save/load karta hai.
- `registry.error.ts`: Custom errors (DuplicateToolError, ToolNotFoundError, InvalidToolError).
- `normalize.tool.ts`: Tool name normalizer (lowercase + underscores) — consistent keys in map.
- `safe.llm.schema.ts`: LLM-safe export helper — tool params ko LLM-friendly JSON schema mein convert karta hai.
- `test/`: Small test runners and quick manual tests. `test.ts` ab comprehensive registry test run karta hai.
- `runtool/index.ts`: Programmatic runner that registers tools and executes them with mock context.

Kaise ye files milke kaam karti hain (flow):

1. Aap `tools.ts` mein ek tool banate ho (name, params, execute, metadata).
2. `ToolRegistry` (`registry.tools.ts`) ko instance banao.
3. `registry.register(myTool)` se tool `Map` mein `normalizedToolName(tool.name)` key pe save hota hai.
4. Jab tool execute karna ho: `const t = registry.get("get_weather")` → fir `t.execute(args, ctx)`.
5. `meta.respone.ts` ko tools call karte hain jab wo metadata banana chahte (tool info + timing).
6. `strict.validation.ts` ensure karta hai ki tool ka shape sahi hai (name, execute, params, metadata).
7. `version.check.ts` control karta hai ki agar overwrite allow ho to new version sach mein bada ho.
8. `presistence.ts` se registry export/import kiya ja sakta hai (JSON file) — import se rehydrated tools fallback `execute` laga ke register hote hain.

Quick FAQs (one-line answers):

- Q: `list()` kya return karta hai? — A: `ToolType[]`, use `registry.list().length` to get count.
- Q: `has(name)` kya check karta hai? — A: normalized name ke basis par `Map.has(key)`.
- Q: Duplicate register kab throw karega? — A: jab `allowOverWrite=false` aur same normalized name exists.
- Q: Overwrite kab allow hai? — A: jab `allowOverWrite=true` AND `version.check` returns true (new version > current).

Tips for testing:

- Use `runtool/index.ts` for programmatic sanity checks (register → get → execute).
- Use `test/test.ts` to run the comprehensive registry tests (register, duplicate, overwrite, unregister, clear).

If a particular file ka detailed flow chaiye (step-by-step code reference), batao; main us file ke liye aur simplified examples bana dunga.

---

File list (quick):

- `registry.tools.ts` — registry class (CRUD + export/import)
- `tools.ts` — example tools
- `meta.respone.ts` — metadata generator
- `types.ts` — shared types
- `strict.validation.ts` — validations
- `version.check.ts` — semver compare
- `presistence.ts` — JSON read/write helpers
- `registry.error.ts` — custom errors
- `normalize.tool.ts` — name normalizer
- `safe.llm.schema.ts` — export schema helper
- `test/` and `runtool/` — test runners

Ab agar tum chaho, main har file ka 2-line example bhi add kar doon (function signature + ek simple use-case). Batao kaunsa file pehle karun.
