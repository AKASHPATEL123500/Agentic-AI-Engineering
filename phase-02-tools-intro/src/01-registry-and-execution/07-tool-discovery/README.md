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
