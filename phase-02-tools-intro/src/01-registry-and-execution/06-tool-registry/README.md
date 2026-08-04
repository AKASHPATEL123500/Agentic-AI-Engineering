```bash
chapter-08-tool-registry/
│
├── README.md
│
├── 01-registry-fundamentals/
│   ├── 01-what-is-tool-registry/
│   ├── 02-why-agent-needs-registry/
│   ├── 03-registry-vs-array/
│   ├── 04-map-vs-object-vs-array/
│   ├── 05-real-world-architecture/
│   └── README.md
│
├── 02-registry-contract/
│   ├── 01-registry-interface/
│   ├── 02-registry-types/
│   ├── 03-registry-errors/
│   ├── 04-registry-options/
│   └── README.md
│
├── 03-core-registry/
│   ├── 01-create-registry/
│   ├── 02-register-tool/
│   ├── 03-unregister-tool/
│   ├── 04-get-tool/
│   ├── 05-has-tool/
│   ├── 06-list-tools/
│   ├── 07-clear-registry/
│   └── README.md
│
├── 04-validation/
│   ├── 01-duplicate-tool-name/
│   ├── 02-invalid-tool/
│   ├── 03-missing-metadata/
│   ├── 04-name-normalization/
│   ├── 05-version-validation/
│   └── README.md
│
├── 05-registry-metadata/
│   ├── 01-tags/
│   ├── 02-categories/
│   ├── 03-capabilities/
│   ├── 04-tool-version/
│   ├── 05-author/
│   ├── 06-priority/
│   └── README.md
│
├── 06-registry-search/
│   ├── 01-search-by-name/
│   ├── 02-search-by-tag/
│   ├── 03-search-by-category/
│   ├── 04-filter-tools/
│   ├── 05-sort-tools/
│   └── README.md
│
├── 07-registry-events/
│   ├── 01-on-register/
│   ├── 02-on-remove/
│   ├── 03-on-update/
│   ├── 04-event-emitter/
│   └── README.md
│
├── 08-registry-hooks/
│   ├── 01-before-register/
│   ├── 02-after-register/
│   ├── 03-before-remove/
│   ├── 04-after-remove/
│   └── README.md
│
├── 09-registry-persistence/
│   ├── 01-export-registry/
│   ├── 02-import-registry/
│   ├── 03-json-storage/
│   └── README.md
│
├── 10-registry-testing/
│   ├── 01-unit-test/
│   ├── 02-edge-cases/
│   ├── 03-performance/
│   └── README.md
│
├── 11-mini-project/
│   ├── ToolRegistry.ts
│   ├── register.ts
│   ├── runner.ts
│   └── README.md
│
└── 12-production-notes/
    ├── Claude-Code/
    ├── Codex-CLI/
    ├── Cursor/
    ├── Cline/
    └── README.md
```

```text
06-tool-registry/
│
├── 01-registry-fundamentals/               [COMPLETED ✅]
│   ├── Concept: Map vs Object vs Array
│   ├── Concept: O(1) Lookup & Registry Purpose
│   └── Concept: Basic Map operations (.set, .get, .has)
│
├── 02-registry-contract-and-errors/        [ABHI HUM YAHAN HAIN 🎯]
│   ├── 1. Registry Interfaces & Contracts  (Registry Class ke paas kya methods hone chahiye)
│   ├── 2. Custom Registry Errors           (Standard vs Custom Error: Duplicate & NotFound)
│   ├── 3. Registry Options & Configuration (Allow Overwrite, Strict Flags)
│   └── 4. Metadata Structure               (Tags, Categories, Versions, Priority)
│
├── 03-core-operations-and-validation/      [NEXT STEP ⏭️]
│   ├── 1. CRUD Methods Logic               (Register, Unregister, Get, Has, List, Clear)
│   ├── 2. Strict Input Validations         (Missing metadata, Invalid Tool shape checks)
│   ├── 3. Name Normalization               ("get-weather" vs "get_weather" formatting)
│   └── 4. Version Conflict Handling        (Tool v1 vs Tool v2 handling)
│
└── 04-advanced-registry-features/          [FINAL STEP 🚀]
    ├── 1. Search & Filtering System        (Search tools by tag, category, priority)
    ├── 2. Registry Event Lifecycle         (Events: onRegister, onRemove, onUpdate)
    ├── 3. Registry Hooks & Middleware      (Hooks: beforeRegister, afterRegister)
    ├── 4. Persistence (Import/Export)      (Registry snapshot ko JSON me save/load karna)
    └── 5. Safe LLM Schema Export           (Base schema ko OpenAPI JSON format me dena)
```
