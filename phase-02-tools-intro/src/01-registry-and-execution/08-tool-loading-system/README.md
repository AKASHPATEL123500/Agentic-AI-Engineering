08-tool-loading-system/
│
├── 01-dynamic-module-importing/
│ ├── 01-static-vs-dynamic-imports.ts # import() primitive & path execution
│ └── 02-module-exporter-extractor.ts # Targetting default vs named exports
│
├── 02-tool-validation-and-sanitization/
│ ├── 03-shape-checker-guard.ts # Validating ToolType contract & Zod schemas
│ └── 04-corrupted-module-isolation.ts # Graceful handling of broken/non-tool files
│
├── 03-loader-infrastructure-and-events/
│ ├── 05-loader-contract-interface.ts # IToolLoader interface definition
│ └── 06-loader-event-lifecycle.ts # EventEmitter for loading status & errors
│
└── 04-loader-service-and-registry-bridge/
├── 07-batch-tool-loader.ts # Processing multiple paths in parallel
└── 08-auto-registration-pipeline.ts # Direct integration with ToolRegistry
