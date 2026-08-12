## Tool Dispacter

```ts
Discovery → "Tool kahan hai?"
Loader → "Tool file se object kaise lao?"
Registry → "Tool ko store/manage kaise karo?"
Dispatcher→ "Tool ko execute kaise karvao?"
```

09-tool-dispatcher/
│
├── 01-dispatcher-fundamentals/
│   ├── 01-dispatcher-mental-model
│   ├── 02-tool-call-lifecycle
│   └── 03-dispatcher-vs-registry-vs-loader
│
├── 02-tool-call-contract/
│   ├── 04-tool-call-structure
│   ├── 05-tool-name-and-arguments
│   └── 06-tool-call-normalization
│
├── 03-tool-resolution/
│   ├── 07-registry-tool-resolution
│   ├── 08-tool-not-found-handling
│   └── 09-tool-resolution-errors
│
├── 04-input-validation/
│   ├── 10-argument-validation
│   ├── 11-zod-schema-validation
│   └── 12-invalid-input-handling
│
├── 05-execution-context/
│   ├── 13-context-construction
│   ├── 14-user-session-context
│   └── 15-working-directory-and-runtime-context
│
├── 06-permission-and-safety/
│   ├── 16-tool-permission-check
│   ├── 17-role-based-tool-access
│   ├── 18-dangerous-tool-protection
│   └── 19-approval-required-tools
│
├── 07-execution-engine/
│   ├── 20-tool-execution
│   ├── 21-timeout
│   ├── 22-cancellation
│   ├── 23-error-isolation
│   └── 24-standardized-result
│
└── 08-dispatcher-service/
    ├── 25-dispatcher-interface
    ├── 26-dispatcher-class
    ├── 27-dispatcher-events
    ├── 28-dispatcher-logging
    └── 29-end-to-end-dispatch-test
