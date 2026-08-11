# 01 - Registry, Discovery, and Loader Overview

Ye README teen folders ka complete summary hai: `06-tool-registry`, `07-tool-discovery`, aur `08-tool-loading-system`.

Goal: har file ka purpose simple language me batana, kaun use karta hai, kyu bana hai, aur ye teeno module kaise ek saath kaam karte hain.

---

## 1. Overall Architecture

Ye teen modules ek tool-agent pipeline banate hain:

1. `07-tool-discovery` -> Disk se valid tool file paths dhoondhta hai.
2. `08-tool-loading-system` -> path ko runtime me import karke tool object banata hai.
3. `06-tool-registry` -> tool object ko store, validate, version-check aur export karta hai.

### Simple pipeline

```text
[ File System ]
    |
    v
[ 07-tool-discovery ]  --finds--> [ file paths ]
    |
    v
[ 08-tool-loading-system ] --imports--> [ runnable tool objects ]
    |
    v
[ 06-tool-registry ] --registers/validates--> [ final tool registry ]
```

---

## 2. Module 06 - TOOL REGISTRY

Ye module actual tool registration aur validation ka engine hai.

### 06-tool-registry/README.md

- Purpose: phase 02 ka summary aur module goal batata hai.
- Use: project ka top-level indicator hai ki registry architecture complete hai.
- Problem solve: internal goals aur roadmap explain karta hai.

### 06-tool-registry/src/01-tool-registry-fundamentals

- `forEach.ts`: Map aur collection ke basic iteration example.
- `MAP.md`: JavaScript `Map` ka concept aur registry me kyu useful hai, explain karta hai.
- `map.ts`: Map basics demonstration.
- `practice2.ts`: Map-based registry practice code.
- `README.md`: fundamentals module ka short explanation.
- `registry.ts`: shayad registry fundamentals ka code example.

Ye folder basic data structure aur registry concept ko build karta hai.

### 06-tool-registry/src/02-registry-contract-and-errors

- `README.md`: contract, errors aur configuration ka overview.
- `src/01-registry-Interfaces-&-contracts.ts`: registry class ka interface, contract aur method signature define karta hai.
- `src/02-custom-registry-errors.ts`: `ToolRegistryError`, `DuplicateToolError`, `ToolNotFoundError`, `InvalidToolError` banata hai.
- `src/03-registry-options-&-configuration.ts`: registry options jaise `allowOverwrite`, `strictValidation`, `strictMetadataCheck` define karta hai.
- `src/04-metadata-structer-searchability-and-routing.ts`: tool metadata structure aur searchable metadata show karta hai.
- `src/types.ts`: shared type definitions.

Ye folder batata hai ki registry ka interface aur errors ka contract kaisa hona chahiye.

### 06-tool-registry/src/03-core-operations-and-validation

- `01-name-normalization.ts`: tool names ko normalize karta hai, jaise `get-weather` ya `weatherTool` ko ek consistent form me badalta hai.
- `02-crud-method-logic.ts`: registry ke CRUD operations likhne ka example (register, unregister, get, list, clear).
- `03-strict-input-validations.ts`: tool data ki strict validation dikhata hai.
- `04-version-conflict-handling.ts`: semantic version compare ka logic deta hai.
- `curd.bug.md`: shayad registry CRUD bug notes.
- `README.md`: core operations module ka summary.

Ye module actual tool registration logic aur validation rules banata hai.

### 06-tool-registry/src/04-advanced-registry-features

- `01-search-and-filter-system.ts`: registry me search aur filter support ka example.
- `02-registry-events-lifecycle.ts`: registry events jaise `onRegister`, `onRemove`, `onUpdate` dikhata hai.
- `04-presistence-import-export.ts`: registry snapshot ko JSON file me save/load karne ka code.
- `05-safe-llm.schema-export.ts`: LLM schema export karne wala utility.
- `06-mini-project-runner/index.ts`: mini runner entrypoint jo registry se tools chalayega.
- `06-mini-project-runner/src/meta/response.meta.ts`: response metadata builder.
- `06-mini-project-runner/src/registry/regsiter.ts`: registry implementation.
- `06-mini-project-runner/src/registry/resgitry-2.ts`: alternate/second registry implementation.
- `06-mini-project-runner/src/test/register-tool.ts`: sample tool register script.
- `06-mini-project-runner/src/test/test/duplicate-test.ts`: duplicate registration test.
- `06-mini-project-runner/src/test/test/regiter.ts`: registry register test.
- `06-mini-project-runner/src/test/test/version.check.ts`: version check tests.
- `06-mini-project-runner/src/tools/get-weather-tool.ts`: example tool object for weather.
- `README.md`: advanced registry feature overview.

Ye folder final registry features banata hai: search, persistence, event lifecycle, schema export.

### 06-tool-registry/src/practice

- `.bug.md`: practice bugs ya notes.
- `.tool.bug.md`: tool-related bug notes.
- `connection.md`: connection notes (ho sakta tool-runner ya registry connection issues explain kare).
- `meta.respone.ts`: metadata response building helper.
- `normalize.tool.ts`: tool name normalization utility.
- `presistence.ts`: save/load JSON helpers.
- `registry.error.ts`: custom registry error classes.
- `registry.tools.ts`: main practice registry implementation.
- `registry.type.ts`: registry-related shared types.
- `runtool/index.ts`: run-tool helper.
- `safe.llm.schema.ts`: safe LLM schema export helper.
- `sandbox/tool.json`: exported registry example JSON.
- `strict.validation.ts`: strict validation helper.
- `test/test.ts`: registry test runner.
- `test/test2.ts`: second test file.
- `test/test3.ts`: third test file.
- `tool.metadata.ts`: metadata structure and helpers.
- `tools.ts`: example tool definitions.
- `types.ts`: shared types used by practice files.
- `version.check.ts`: semantic version comparison helper.

Ye `practice` folder actual working code ka centre hai jahan registry logic execute hota hai, validation hoti hai, aur test cases run karte hain.

---

## 3. Module 07 - TOOL DISCOVERY

Ye module disk se valid tool files dhoondhne ka engine hai. Iska kaam tool objects nahi banata, sirf file paths dhoondhta hai.

### 07-tool-discovery/README.md

- Purpose: tool discovery module ke topics list karta hai.
- Use: guide, roadmap, structure description.
- Problem solve: bata deta hai ki discovery ka scope kya hai.

### 07-tool-discovery/01-fundamentals-&-path-discovery

- `01-architecture-&-mental-model.md`: discovery pipeline aur mental model explain karta hai.
- `02-code.ts`: basic `fs.readdir` aur path scanning example.
- `02-codes/scann.file.ts`: single-level scanner example.
- `02-node.js-path-&-FS-primitives.md`: Node.js `path` aur `fs` primitives introduction.
- `03-code/index.ts`: sample single-level discovery implementation (`discoverTools`).
- `03-single-level-directory-scanner.md`: single-level scanner concept explain karta hai.
- `README.md`: fundamentals module overview.
- `src/index.ts`: essential scanner code.
- `src/tools/.toolignore`: ignore rules file for sample tools.
- `src/tools/data.json`: demo data file.
- `src/tools/delete-file.tool.ts`: sample tool file.
- `src/tools/deprecated-v1.tool.ts`: deprecated tool sample.
- `src/tools/draft-payment.tool.ts`: draft tool sample.
- `src/tools/fetch-api.tool.ts`: sample fetch API tool.
- `src/tools/format-date.tool.ts`: sample date formatting tool.
- `src/tools/generate-id.tool.ts`: sample ID generation tool.
- `src/tools/hash-password.tool.ts`: sample password hashing tool.
- `src/tools/index.c`: non-TS file to show discovery ignores wrong type.
- `src/tools/index.txt`: non-TS file to show discovery ignores wrong type.
- `src/tools/parse-json.tool.ts`: sample JSON parsing tool.
- `src/tools/read-file.tool.ts`: sample file read tool.
- `src/tools/resize-image.tool.ts`: sample image resize tool.
- `src/tools/test/test-calculator.tool.ts`: sample tool inside nested `test` folder.
- `src/tools/validate-email.tool.ts`: sample email validation tool.
- `src/tools/write-file.tool.ts`: sample write file tool.
- `test/scan.test.ts`: discovery test file.

Ye folder start se end tak dikhata hai ki kaise simple directory scanning hota hai aur sample tools kaun se ho sakte hain.

### 07-tool-discovery/02-advanced-scanning-&-filtering-rules

- `extension-naming-pattren matcher.ts`: filename pattern match rules probably `.tool.ts` validation.
- `README.md`: advanced discovery rules overview.
- `recerive.scanning.file.ts`: scanning helper code.
- `run.ts`: runner for scanning with rules.
- `toolignore-engine/.toolignore`: ignore patterns file example.
- `toolignore-engine/06-toolignore-discovery.ts`: `.toolignore` aware recursive discovery implementation.
- `toolignore-engine/GOOGLE.md`: notes or reference for ignore system.
- `toolignore-engine/google/explain.md`: explain `.toolignore` logic or Google-style ignore.
- `toolignore-engine/google/ignore.code.ts`: ignore engine sample code.
- `toolignore-engine/google/README.md`: Google ignore reference.
- `toolignore-engine/README.md`: ignore engine overview.
- `toolignore-engine/toolignore.ts`: actual `.toolignore` parsing and filtering logic.

Ye folder dikhata hai ki discovery me kaise file pattern aur ignore rules add karte hain. Ye discovery ko realistic banata hai, kyunki real projects me kuch tools temporary draft ya broken hote hain.

### 07-tool-discovery/03-discovery-Infrastructure-&-safety

- `07-discovery-interface.ts`: `IToolDiscoverer` contract define karta hai.
- `08-discovery-cache-engine.ts`: cache engine, scan result memory me save karta hai.
- `09-duplicate-invaild-file-path.ts`: duplicate aur invalid path detection logic.
- `README.md`: infrastructure and safety overview.

Ye folder discovery ko production-ready banata hai: contract, cache, duplicates, safety.

### 07-tool-discovery/04-discovery-service-&-runner-project

- `10-discovery-event.emiiter.ts`: event emitter for discovery lifecycle events.
- `11-discovery-run.ts`: final runner that uses `CachedToolDiscoverer` and logs start/found/ignored/complete events.
- `discover.tool.json`: sample output or runner config.
- `README.md`: service runner overview.

Ye final folder bata raha hai ki discovery engine ko service me kaise run karo, aur live events kaise emit karoge.

---

## 4. Module 08 - TOOL LOADING SYSTEM

Ye module `07-tool-discovery` se aaye file paths ko dynamic runtime modules me convert karta hai.

### 08-tool-loading-system/README.md

- Purpose: top-level loader module summary.
- Use: load engine ka high-level objective batata hai.

### 08-tool-loading-system/00-tool-loading-intro

- `README.md`: loader introduction.

Ye folder loader ki introduction deta hai.

### 08-tool-loading-system/01-dynamic-module-importing

- `01-static-vs-dynamic-imports.ts`: static vs dynamic import ka comparison aur runtime import method explain karta hai.
- `02-module-exporter-extractor.ts`: module exports ko extract karne ka code, default vs named export handling.
- `02-run/extract.from.module.json`: sample extracted export structure JSON.
- `02-run/index.ts`: runner for dynamic import tests.
- `practice/index.ts`: practice dynamic import example.
- `tools/meta.data.ts`: sample meta data for tools.
- `tools/tool.meta.data.ts`: alternate tool metadata example.
- `tools/types.ts`: shared loader type definitions.
- `tools/weather.tool.ts`: sample tool file for dynamic import demo.

Ye folder real dynamic import method aur module export parsing batata hai.

### 08-tool-loading-system/02-tool-validation-and-sanitization

- `03-shape-checker-guard.ts`: tool object shape validation helper, ensure tool has correct props.
- `04-corrupted-module-isolation.ts`: broken module isolation logic, error handling agar imported file tool nahi hai.
- `README.md`: validation/sanitization overview.

Ye folder safe loader banaata hai. Agar koi file corrupt ho ya export wrong ho, toh system crash na kare.

### 08-tool-loading-system/03-loader-infrastructure-and-events

- `05-loader-contract-interface.ts`: `IToolLoader` interface contract.
- `06-loader-event-lifecycle.ts`: loader event lifecycle with emitters.

Ye folder loader ke interface aur observable event system define karta hai.

### 08-tool-loading-system/04-loader-service-and-registry-bridge

- `07-batch-tool-loader.ts`: batch mode me multiple tool paths parallel load karta hai.
- `08-auto-registration-pipeline.ts`: loader se tools registry me automatically register karne ka pipeline.

Ye folder end-to-end integration dikhata hai: discovery path se leke registry registration tak.

### 08-tool-loading-system/test

- `index.ts`: test runner for loader module.

Ye folder loader tests ke liye hai.

---

## 5. Kaise Teeno Folder Connected Hain

### Visual Connection

```text
[ 07-tool-discovery ]
   -> scan disks, file paths return karta hai
      (example: /src/tools/weather.tool.ts )
        |
        v
[ 08-tool-loading-system ]
   -> import(filePath), tool object banata hai
      (example: { name, description, execute })
        |
        v
[ 06-tool-registry ]
   -> validate, version check, register, search, persist
```

### Data Flow

1. `07-tool-discovery` finds: `src/tools/weather.tool.ts`
2. `08-tool-loading-system` loads: `await import(path)`
3. `08-tool-loading-system` validates shape with `03-shape-checker-guard.ts`
4. `08-tool-loading-system` isolates broken files with `04-corrupted-module-isolation.ts`
5. `08-tool-loading-system` passes clean tool object to `06-tool-registry`
6. `06-tool-registry` registers tool and uses `version.check.ts`, `strict.validation.ts`, `normalize.tool.ts`
7. `06-tool-registry` can export registry snapshot to `sandbox/tool.json` and generate LLM schemas.

---

## 6. Practical Example: Kya Hotega Jab Ye Teen Saath Kaam Karein

1. Agent start hota hai.
2. Discovery ko bolte hain `discover("src/tools")`.
3. Discovery returns list of `.tool.ts` files.
4. Loader un paths ko runtime import karta hai.
5. Loader checks karta hai ki file actual tool object return kare.
6. Agar valid ho toh tool registry me register ho jata hai.
7. Ab agent kisi tool ko `toolRegistry.get("weather")` se use kar sakta hai.

Ye pattern production friendly hai kyunki:

- Naye tool ko add karne ke liye `registry` code ko change nahi karna.
- Sirf new tool file dal ke discovery + loader + registry automatically kaam karega.
- Broken tool file discovery stage ya loader stage par isolate ho jayegi, poora system crash nahi karega.

---

## 7. Notes for Har File Use Case

### 06-tool-registry detailed notes

- `registry.tools.ts`: main registry implementation. Isme tool `Map` rakha gaya, register, unregister, get, has, list, clear, exportFromJson, importFromJSON methods hain.
- `presistence.ts`: file path se JSON save/load logic. `exportRegistryToJSON` aur `importFromJSON` helpers ho sakte hain.
- `strict.validation.ts`: agar strict validation on ho, tool properties validate karta hai.
- `normalize.tool.ts`: tool name ko canonical format me convert karta hai.
- `version.check.ts`: semver compare logics, older/ newer version decide karta hai.
- `runtool/index.ts`: registry se tool run karna ya example runner.
- `tools.ts`: sample tool definitions used for registry practice.
- `types.ts` aur `registry.type.ts`: shared data type definitions.
- `.bug.md`, `.tool.bug.md`, `connection.md`: notes aur bug comments, practice record.
- `test/test.ts`, `test/test2.ts`, `test/test3.ts`: practice tests jo registry behavior verify karte.
- `tool.metadata.ts`, `meta.respone.ts`, `safe.llm.schema.ts`: LLM schema aur metadata builders.

### 07-tool-discovery detailed notes

- `02-code.ts`: basic `fs.readdir` usage and path extension check.
- `03-code/index.ts`: file discovery with absolute path resolution.
- `extension-naming-pattren matcher.ts`: advanced file name rules.
- `toolignore-engine/toolignore.ts`: ignore file parser.
- `06-toolignore-discovery.ts`: complete discovery function with ignore logic and recursive scanning.
- `07-discovery-interface.ts`: discovery contract interface.
- `08-discovery-cache-engine.ts`: memory cache and duplicate detection.
- `09-duplicate-invaild-file-path.ts`: invalid path detection.
- `10-discovery-event.emiiter.ts`: event emitter defining discovery lifecycle.
- `11-discovery-run.ts`: orchestrator that logs events and runs discovery twice to demonstrate caching.

### 08-tool-loading-system detailed notes

- `01-static-vs-dynamic-imports.ts`: explains why dynamic `import()` chahiye and shows how Windows paths must become `file://` URLs.
- `02-module-exporter-extractor.ts`: extracts named/default exports from loaded modules.
- `03-shape-checker-guard.ts`: validates tool contract shape so registry receives correct tool.
- `04-corrupted-module-isolation.ts`: prevents broken imports from stopping the loader.
- `05-loader-contract-interface.ts`: loader interface contract.
- `06-loader-event-lifecycle.ts`: loader events for observability.
- `07-batch-tool-loader.ts`: batch import loader that can take many file paths.
- `08-auto-registration-pipeline.ts`: bridge from loaded tools directly into registry.

---

## 8. Final Simple Diagram

```text
                 +-----------------------------+
                 | 07-tool-discovery           |
                 | - find .tool.ts paths       |
                 | - ignore .toolignore rules  |
                 | - cache and events          |
                 +-------------+---------------+
                               |
                  file paths   v
                 +-------------+---------------+
                 | 08-tool-loading-system       |
                 | - dynamic import(path)       |
                 | - validate tool shape        |
                 | - isolate broken exports     |
                 | - batch load + events        |
                 +-------------+---------------+
                               |
                  tool objects v
                 +-------------+---------------+
                 | 06-tool-registry             |
                 | - normalize name             |
                 | - strict validation          |
                 | - version conflict handling   |
                 | - search/filter/export       |
                 +-----------------------------+
```

---

## 9. Extra Summary

- `07-tool-discovery` = _find file paths_.
- `08-tool-loading-system` = _load those files into JS objects safely_.
- `06-tool-registry` = _store and manage those tool objects like a real agent toolkit_.

Agar tum chaho, ab main isi README ko thoda aur short kar sakta ho ya har section ke liye ek chhota visual flow chart bhi add kar deta hoon. Buhta dhyan rakha hai ki abhi sab file mention ho.
