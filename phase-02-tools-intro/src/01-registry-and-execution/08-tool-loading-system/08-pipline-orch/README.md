# ⚙️ Chapter 08: Dynamic Tool Loading System

The **Tool Loading Engine** bridges the gap between **Tool Discovery (Layer 01)** and the **Tool Registry (Layer 03)**. It receives file path strings from Discovery, dynamically imports them at runtime, extracts valid tool contracts, isolates corrupted modules, and prepares tools for seamless registry injection.

---

## 🏗️ Architecture & Pipeline View

```text
 📄 Discovery Paths ["/abs/path/weather.tool.ts"]  (Layer 01)
       │
       ▼
 ⚙️ Dynamic Import Engine (await import(pathToFileURL))
       │
       ▼
 🔍 Module Exporter Extractor (Named & Default Exports)
       │
       ▼
 🛡️ Tool Shape Guard (Validates name, description, params & execute)
       │
       ▼
 📦 Batch Tool Loader (Parallel execution via Promise.all)
       │
       ▼
 🗄️ Tool Registry (`registry.register(tool)`)       (Layer 03)
```
