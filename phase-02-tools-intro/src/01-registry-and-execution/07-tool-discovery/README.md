# 07 - Tool Discovery

Goal: Tool discovery module ke topics ko folder-structure style mein list kiya gaya hai. Har topic ke saath ek short Hinglish description hai — taaki pata chale kya padhna hai aur kis file/feature se related hoga.

Suggested folder structure (topics to study / implement):

- `00-overview/`
  - `README.md` : Tool discovery ka high-level overview — purpose, problems solved.

- `01-discovery-contract/`
  - `interfaces.ts` : Discovery API interfaces (search, list, getMetadata, suggest).
  - `README.md` : Contract aur expected behaviors.

- `02-indexing-and-metadata/`
  - `indexer.ts` : Tool metadata indexer (ingest metadata into search index).
  - `schema.md` : Metadata schema (what fields, types, required).
  - `README.md` : Indexing strategy, freshness, TTL.

- `03-search-and-filter/`
  - `search.ts` : Keyword search + filter functions.
  - `ranking.md` : Ranking heuristics (priority, recency, tags, usage).
  - `README.md` : Query parsing, filters, faceting.

- `04-tagging-and-categories/`
  - `tags.ts` : Tagging utilities, normalization.
  - `taxonomy.md` : Category & tag design guidance.

- `05-semantic-search/`
  - `semantic.md` : How to add semantic embeddings + vector search.
  - `embeddings.ts` : embedding helpers/integration points.

- `06-discovery-apis/`
  - `http/` : REST endpoints for discovery (GET /tools, GET /tools/:id, POST /search).
  - `graphql/` : Optional GraphQL schema example.

- `07-permissions-and-access/`
  - `auth.md` : How discovery respects permissions, visibility.
  - `guards.ts` : Example guard middleware.

- `08-cache-freshness-and-sync/`
  - `cache.md` : Caching strategies for discovery results.
  - `sync.ts` : Index sync / incremental updates.

- `09-tool-suggestions-and-recommendations/`
  - `recommender.md` : Basic suggesters (based on tags, usage, context).

- `10-testing-and-examples/`
  - `fixtures/` : sample tool metadata JSON for tests.
  - `test/` : unit/integration tests for search and indexer.

- `11-observability/`
  - `metrics.md` : what metrics to collect (search latency, hit-rate, index size).
  - `tracing.md` : tracing points.

- `12-security-and-sandboxing/`
  - `security.md` : how discovery integrates with sandbox/security rules.

- `13-performance-and-scaling/`
  - `scale.md` : sharding/index partitioning, pagination strategies.

- `14-migration-and-backfill/`
  - `migration.md` : instructions to import/export discovery index from registry JSON.

- `15-roadmap.md` : future experiments (LLM-driven search, personalized ranking, A/B testing)

Quick notes (what to prioritize):

- Start with `01-discovery-contract` + `02-indexing-and-metadata` — discovery needs a stable metadata schema.
- Add `03-search-and-filter` basic implementation (keyword + tags) and tests in `10-testing-and-examples`.
- If you want LLM features, then `05-semantic-search` + `15-roadmap` next.

If chaho, main ek initial `interfaces.ts` and `indexer.ts` scaffold bhi bana ke de sakta hoon. Batado agar chahiye.

```text
07-tool-discovery/
│
├── 🧱 MODULE A: Discovery Fundamentals & Path Resolution
│   ├── 01. Architecture & Mental Model (Discovery vs Loader vs Registry)
│   ├── 02. Node.js Path & FS Primitives (`fs.promises`, `path.resolve`, `path.extname`)
│   └── 03. Single-Level Directory Scanner (Basic file path listing)
│
├── 🌲 MODULE B: Advanced Scanning & Filtering Rules
│   ├── 04. Recursive Folder Walker (Deep sub-folder scanning)
│   ├── 05. Extension & Naming Pattern Matcher (`*.tool.ts` strict rules)
│   └── 06. `.toolignore` Parser Engine (Ignoring broken/draft tools)
│
├── 🛡️ MODULE C: Discovery Infrastructure & Safety
│   ├── 07. Discovery Interface (`IToolDiscoverer` contract)
│   ├── 08. Discovery Cache Engine (Avoid re-scanning disk on every request)
│   └── 09. Duplicate & Invalid File Path Detection
│
└── 🚀 MODULE D: Discovery Service & Runner Project
    ├── 10. Discovery Event Emitter & Report Generator
    └── 11. Discovery Runner Engine (Outputting clean File Paths to Loader)
```

---

# 🔍 Chapter 07: Production-Grade Tool Discovery Engine

An automated, recursive, and performant **File System Tool Discovery Architecture** designed for agentic AI applications. This module scans project folders, resolves file paths, applies ignore rules (`.toolignore`), manages memory caches, emits lifecycle events, and hands clean `string[]` file paths to downstream layers (e.g., `ToolLoader`).

---

## 📐 High-Level Architecture & Separation of Concerns

```text
 💻 HARD DISK (FileSystem)
   └── /tools folder (/tools/weather.tool.ts, /tools/file.tool.ts)
       │
       │  [ 🛑 LAYER 1: TOOL DISCOVERY ENGINE ]
       │  (Role: Scan filesystem & resolve clean file paths)
       ▼
 📄 File Paths Array ["/abs/path/weather.tool.ts", "/abs/path/file.tool.ts"]
       │
       │  [ ⚙️ LAYER 2: TOOL LOADER ] (Next Stage)
       │  (Role: Dynamic import() into Runnable JS Objects)
       ▼
 📦 Loaded Tool Objects
       │
       │  [ 🗄️ LAYER 3: TOOL REGISTRY ]
       │  (Role: $O(1)$ Storage, SemVer Guards, LLM Schemas)

```

> **Core Principle (Separation of Concerns):**
> The Tool Discovery module **does NOT execute or dynamically import (`import()`) tool files**. Its sole responsibility is finding valid file paths and producing clean, validated output arrays.

---

## 📂 Module Directory Structure

```text
07-tool-discovery/
├── 01-fundamentals-&-path-discovery/
│   ├── src/tools/                  # Concrete tool files (*.tool.ts)
│   └── scan-primitives.ts          # Single-level & Recursive directory scanners
├── 02-advanced-scanning-&-filtering-rules/
│   ├── .toolignore                 # Ignore patterns file
│   └── scan-with-ignore.ts         # Prefix & Wildcard ignore engine
├── 03-infrastructure-and-safety/
│   ├── discovery.interface.ts      # IToolDiscoverer contract
│   └── cache-discoverer.ts         # Memory cache & Deduplication guard
└── 04-discovery-service-&-runner-project/
    ├── discovery-events.ts         # EventEmitter for observability
    └── discovery-runner.ts         # Final Orchestrator & Runner Test

```

---

## 🛠️ Key Architectural Features & Modules

### 1. File System Path Resolution & Recursive Scanner

- Resolves relative paths into absolute system paths via `path.resolve()`.
- Recursively navigates nested subdirectories (`fs.readdir` with `withFileTypes` / `fs.stat`).
- Filters files matching the `.tool.ts` naming convention.

### 2. `.toolignore` Pattern Engine

- Supports prefix matching (e.g., `draft-`), exact file matches, and wildcard path exclusions.
- Parses comments (`#`) and empty lines seamlessly.
- Uses `Array.prototype.some()` to match filename prefixes without requiring strict full-path entries.

### 3. In-Memory Caching & Safety

- Implements the `IToolDiscoverer` contract interface.
- Caches discovered paths in memory to avoid repeated, costly Disk I/O scans.
- Deduplicates path entries to prevent duplicate downstream registration.

### 4. Lifecycle Event System

- Built on top of Node.js `EventEmitter`.
- Emits decoupled observability events: `discovery:start`, `discovery:fileFound`, `discovery:fileIgnored`, and `discovery:complete`.

---

## 💻 Code Reference & Implementation

### 1. Recursive Scanner with `.toolignore` Engine

```typescript
import fs from "node:fs/promises";
import path from "node:path";
import type { DiscoveryToolsEvents } from "./discovery-events";

async function getIgnoreList(dirPath: string): Promise<string[]> {
  try {
    const ignoreFilePath = path.join(dirPath, ".toolignore");
    const rawContent = await fs.readFile(ignoreFilePath, "utf-8");

    return rawContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
  } catch {
    return [];
  }
}

export async function scanToolsWithIgnore(
  dirPath: string,
  ignoreList: string[] = [],
  events?: DiscoveryToolsEvents,
): Promise<string[]> {
  const absolutePath = path.resolve(dirPath);

  if (ignoreList.length === 0) {
    ignoreList = await getIgnoreList(absolutePath);
  }

  let discoveredTools: string[] = [];
  const items = await fs.readdir(absolutePath);

  for (const item of items) {
    const fullPath = path.join(absolutePath, item);

    // Prefix & Substring Matcher
    const isIgnored = ignoreList.some((rule) => {
      const cleanRule = rule.replace(/\*/g, "").trim();
      return item.startsWith(cleanRule) || item.includes(cleanRule);
    });

    if (isIgnored) {
      events?.emitFileIgnored(fullPath, "Matched .toolignore rule");
      continue;
    }

    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      const subFolderTools = await scanToolsWithIgnore(
        fullPath,
        ignoreList,
        events,
      );
      discoveredTools = discoveredTools.concat(subFolderTools);
    } else if (stat.isFile() && item.endsWith(".tool.ts")) {
      discoveredTools.push(fullPath);
      events?.emitFileFound(fullPath);
    }
  }

  return discoveredTools;
}
```

### 2. Cached Production Discoverer Class

```typescript
import type { IToolDiscoverer } from "./discovery.interface";
import { DiscoveryToolsEvents } from "./discovery-events";
import { scanToolsWithIgnore } from "./scan-with-ignore";

export class CachedToolDiscoverer implements IToolDiscoverer {
  private memory: string[] | null = null;
  public events = new DiscoveryToolsEvents();

  async discover(dirPath: string): Promise<string[]> {
    // Cache Hit Optimization
    if (this.memory !== null) {
      return this.memory;
    }

    const startTime = Date.now();
    this.events.emitStart(dirPath);

    const freshPaths = await scanToolsWithIgnore(dirPath, [], this.events);

    // Memory Storage & Cache Hit Preparation
    this.memory = Array.from(new Set(freshPaths));

    this.events.emitComplete(this.memory.length, Date.now() - startTime);
    return this.memory;
  }

  clearMemory(): void {
    this.memory = null;
  }
}
```

---

## 🧪 Sample Execution Log

```text
==================================================
🚀 STARTING TOOL DISCOVERY ENGINE
==================================================

💿 [Cache Miss] Scanning hard disk...
📡 [EVENT]: Discovery started in -> D:\project\src\tools
🟢 [FOUND]: weather.tool.ts
🔴 [IGNORED]: draft-payment.tool.ts (Matched .toolignore rule)
🟢 [FOUND]: calculate-tax.tool.ts

🎉 [COMPLETE]: Found 2 tools in 3ms.

Discovered File Paths Output:
[
  "D:\\project\\src\\tools\\weather.tool.ts",
  "D:\\project\\src\\tools\\finance\\calculate-tax.tool.ts"
]

⚡ [Cache Hit] Returning paths directly from Memory!

```

---

## ⏭️ Next Step

With **Chapter 07 (Tool Discovery)** complete, the system outputs clean file paths ready for **Chapter 08 (Tool Loading System)**, which handles dynamic imports (`await import(path)`) to instantiate executable Tool Objects.
